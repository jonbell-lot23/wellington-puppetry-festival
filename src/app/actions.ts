'use server'

import { supabase, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { defaultsFor, getPageDef } from '@/lib/pages'
import { ADMIN_COOKIE, verifyToken } from '@/lib/adminAuth'

/**
 * Second lock on every admin action.
 *
 * proxy.ts already redirects an unauthenticated browser away from /admin, but
 * a server action is a POST endpoint addressed by id, not a page — so a route
 * guard is not by itself an authorisation check. Verified against the built
 * app: posting each action id to a *public* page with no cookie reached them
 * all, and getPageHistory happily returned the edit history. These functions
 * do the work, so these functions verify.
 *
 * getPageContent is deliberately left open — every public page renders from it.
 */
async function requireAdmin() {
  const jar = await cookies()
  if (!verifyToken(jar.get(ADMIN_COOKIE)?.value)) {
    throw new Error('Not signed in.')
  }
}

export type PageContent = Record<string, string>

export type ContentVersion = {
  id: number
  slug: string
  data: PageContent
  saved_at: string
}

/** Read a page's content, DB overrides merged over code defaults. */
export async function getPageContent(slug: string): Promise<PageContent> {
  const defaults = defaultsFor(slug)
  if (!supabase) return defaults
  const { data, error } = await supabase
    .from('pages')
    .select('data')
    .eq('slug', slug)
    .single()

  if (error || !data) return defaults
  return { ...defaults, ...(data.data as PageContent) }
}

/** True when the service role key is set — required for admin writes and history. */
export async function isAdminWritable(): Promise<boolean> {
  await requireAdmin()
  return getSupabaseAdmin() !== null
}

/** Persist a page's content and snapshot history. */
export async function savePageContent(slug: string, content: PageContent) {
  await requireAdmin()
  const db = getSupabaseAdmin()
  if (!db) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to .env.local to enable admin saves.',
    )
  }
  const def = getPageDef(slug)
  const path = def?.path ?? '/'

  const { error } = await db
    .from('pages')
    .upsert({ slug, data: content, updated_at: new Date().toISOString() })
  if (error) throw error

  await db
    .from('page_history')
    .insert({ slug, data: content, saved_at: new Date().toISOString() })

  revalidatePath(path)
  revalidatePath('/admin')
}

export async function getPageHistory(slug: string): Promise<ContentVersion[]> {
  await requireAdmin()
  const db = getSupabaseAdmin()
  if (!db) return []
  const { data, error } = await db
    .from('page_history')
    .select('id, slug, data, saved_at')
    .eq('slug', slug)
    .order('saved_at', { ascending: false })
    .limit(20)

  if (error) return []
  return (data ?? []) as ContentVersion[]
}

export async function pagesTableExists(): Promise<boolean> {
  await requireAdmin()
  if (!supabase) return false
  const { error } = await supabase.from('pages').select('slug').limit(1)
  return !error
}

export async function revertToVersion(slug: string, versionId: number) {
  await requireAdmin()
  const db = getSupabaseAdmin()
  if (!db) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to .env.local to enable revert.',
    )
  }

  const { data, error } = await db
    .from('page_history')
    .select('data')
    .eq('id', versionId)
    .single()

  if (error || !data) throw new Error('Version not found')

  const content = { ...defaultsFor(slug), ...(data.data as PageContent) }
  await savePageContent(slug, content)
}

/* ── Newsletter sign-ups ────────────────────────────────────────────────── */

export type Signup = {
  id: number
  email: string
  first_name: string
  last_name: string
  source: string
  created_at: string
}

export type SignupResult =
  | { ok: true; already: boolean }
  | { ok: false; error: string }

/** Same shape the form checks in the browser. Repeated here because the
 *  browser's copy is a courtesy, not a guard — this function is a POST
 *  endpoint addressed by id and anyone can call it with anything. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Record a newsletter sign-up. Public on purpose — this is the one write on
 * the site a visitor is meant to make, so it does NOT call requireAdmin.
 *
 * It goes through the service role rather than giving `anon` an insert policy
 * on the table. An insert-only anon policy is the usual shape for a mailing
 * list box and it would have worked, but it means a public, unthrottled
 * INSERT endpoint addressable with a key that ships in the page source. Doing
 * it here keeps validation in one place and leaves nothing to point a script
 * at. See supabase/migrations/004_signups.sql.
 */
export async function submitSignup(input: {
  firstName?: string
  lastName?: string
  email: string
  source?: string
  /** Honeypot. A real person never sees this field, so anything in it is a bot. */
  company?: string
}): Promise<SignupResult> {
  // Answer a bot the way we answer a person. Telling it that it was caught
  // just tells whoever wrote it which field to leave alone next time.
  if (input.company?.trim()) return { ok: true, already: false }

  const email = input.email?.trim() ?? ''
  if (!email) return { ok: false, error: 'Enter your email address.' }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'Enter an email address that includes an @, like name@example.com.' }
  }

  const db = getSupabaseAdmin()
  if (!db) {
    // Never silently swallow it. The whole point of this change is that an
    // address typed into the form is not thrown away, so if it cannot be
    // stored the person needs to be told rather than thanked.
    return {
      ok: false,
      error: 'Sorry — sign-ups are not working right now. Please email wellingtonpuppetryfestival@gmail.com instead.',
    }
  }

  const { error } = await db.from('signups').insert({
    email,
    // Trimmed and capped. Both are optional on the form, and a name is not
    // worth rejecting a sign-up over.
    first_name: (input.firstName ?? '').trim().slice(0, 120),
    last_name: (input.lastName ?? '').trim().slice(0, 120),
    source: (input.source ?? 'website').slice(0, 40),
  })

  // 23505 is the unique index on lower(email). Signing up twice is a normal
  // thing a person does, not an error to show them — they are on the list,
  // which is what they wanted, so say so kindly and keep the first row.
  if (error?.code === '23505') return { ok: true, already: true }

  if (error) {
    // PostgREST answers a write to a table it has no schema entry for with a
    // bare 404 and an empty body, so supabase-js hands back an error object
    // with no code and no message at all — verified against this project.
    // A read of the same table does report 42P01 properly, so when there is
    // nothing to go on, ask. It is one extra round trip on a path that has
    // already gone wrong, and it is the difference between telling someone
    // the form is broken and telling them it was never finished.
    let missing = error.code === '42P01'
    if (!missing && !error.code) {
      const probe = await db.from('signups').select('id').limit(1)
      missing = probe.error?.code === '42P01'
    }
    return {
      ok: false,
      error: missing
        ? 'Sorry — sign-ups are not set up yet. Please email wellingtonpuppetryfestival@gmail.com instead.'
        : 'Sorry — something went wrong saving that. Please try again, or email wellingtonpuppetryfestival@gmail.com.',
    }
  }

  return { ok: true, already: false }
}

/** Every sign-up, newest first. /admin only. */
export async function getSignups(): Promise<Signup[]> {
  await requireAdmin()
  const db = getSupabaseAdmin()
  if (!db) return []
  const { data, error } = await db
    .from('signups')
    .select('id, email, first_name, last_name, source, created_at')
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []) as Signup[]
}

/** True once the signups table exists — /admin shows the migration if not. */
export async function signupsTableExists(): Promise<boolean> {
  await requireAdmin()
  const db = getSupabaseAdmin()
  if (!db) return false
  const { error } = await db.from('signups').select('id').limit(1)
  return !error
}
