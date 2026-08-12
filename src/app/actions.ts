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
