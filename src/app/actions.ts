'use server'

import { supabase, getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { defaultsFor, getPageDef } from '@/lib/pages'

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
  return getSupabaseAdmin() !== null
}

/** Persist a page's content and snapshot history. */
export async function savePageContent(slug: string, content: PageContent) {
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
  if (!supabase) return false
  const { error } = await supabase.from('pages').select('slug').limit(1)
  return !error
}

export async function revertToVersion(slug: string, versionId: number) {
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
