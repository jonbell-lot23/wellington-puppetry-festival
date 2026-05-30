'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type SiteContent = {
  heroSubheading: string
  heroHeading: string
  badgeTitle: string
  badgeSubtext: string
  dateLocation: string
  heroCta: string
  formHeading: string
  formSubtext: string
  signupButton: string
  successHeading: string
  successSubtext: string
  footerName: string
  footerDate: string
  footerEmail: string
}

export type ContentVersion = {
  id: number
  data: SiteContent
  saved_at: string
}

const defaults: SiteContent = {
  heroSubheading: 'Wellington Puppetry Festival 2026',
  heroHeading: 'Thanks for your submissions',
  badgeTitle: 'Programme Coming Soon',
  badgeSubtext: 'Full lineup announced June 2026',
  dateLocation: '18–20 September 2026 · Wellington, NZ',
  heroCta: 'Sign up to be the first to know when the programme drops.',
  formHeading: 'Stay in the loop',
  formSubtext: 'Get news and announcements direct to your inbox.',
  signupButton: 'Sign up for Festival News',
  successHeading: "You're on the list!",
  successSubtext: "We'll be in touch when the programme is announced.",
  footerName: 'Wellington Puppetry Festival',
  footerDate: '18–20 September 2026 · Wellington, NZ',
  footerEmail: 'wellingtonpuppetryfestival@gmail.com',
}

export async function getSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 1)
    .single()

  if (error || !data) return defaults
  return { ...defaults, ...(data.data as Partial<SiteContent>) }
}

export async function saveSiteContent(content: SiteContent) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 1, data: content, updated_at: new Date().toISOString() })

  if (error) throw error

  await supabase
    .from('site_content_history')
    .insert({ data: content, saved_at: new Date().toISOString() })

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function getContentHistory(): Promise<ContentVersion[]> {
  const { data, error } = await supabase
    .from('site_content_history')
    .select('id, data, saved_at')
    .order('saved_at', { ascending: false })
    .limit(20)

  if (error) return []
  return (data ?? []) as ContentVersion[]
}

export async function historyTableExists(): Promise<boolean> {
  const { error } = await supabase
    .from('site_content_history')
    .select('id')
    .limit(1)
  return !error
}

export async function revertToVersion(versionId: number) {
  const { data, error } = await supabase
    .from('site_content_history')
    .select('data')
    .eq('id', versionId)
    .single()

  if (error || !data) throw new Error('Version not found')

  const content = { ...defaults, ...(data.data as Partial<SiteContent>) }

  const { error: upsertError } = await supabase
    .from('site_content')
    .upsert({ id: 1, data: content, updated_at: new Date().toISOString() })

  if (upsertError) throw upsertError

  await supabase
    .from('site_content_history')
    .insert({ data: content, saved_at: new Date().toISOString() })

  revalidatePath('/')
  revalidatePath('/admin')
}
