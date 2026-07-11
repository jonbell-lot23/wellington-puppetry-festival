import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Public read client (anon key). Null when env vars are missing — site falls back to code defaults. */
export const supabase = url && key ? createClient(url, key) : null

/** Server-only write client (service role). Bypasses RLS; use only in server actions. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

/** Prefer service role for writes; fall back to anon when service key is not configured. */
export function getSupabaseWriter(): SupabaseClient | null {
  return getSupabaseAdmin() ?? supabase
}
