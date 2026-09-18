// Storage for the parsed Google Sheet snapshots that /volunteers/crew/schedule
// and /volunteers/crew/jobs render.
//
// Why these live in `pages` rather than a table of their own:
//
// `pages` is already exactly the right shape — a text primary key, a jsonb
// blob, public read under RLS, writes restricted to the service role — and it
// is already deployed. A dedicated `sheet_snapshots` table would be tidier,
// but creating it needs DDL against the Supabase project, and shipping a
// migration nobody has run is how you get code that works locally and renders
// an empty page in production. If that table ever gets created, this file is
// the only thing that has to change; nothing above it knows where the rows
// live.
//
// The slug prefix keeps them clearly separate from editable page content, and
// /admin renders from the PAGES registry rather than from whatever rows exist,
// so these never show up there as mystery pages.

import { supabase, getSupabaseAdmin } from './supabase'
import { SHEETS, SHEET_TITLES, snapshotSlug, type Entry, type SheetKey } from './sheets'

/** What the sync script stores and the pages read back. */
export type StoredSnapshot = {
  key: SheetKey
  title: string
  sourceUrl: string
  /** Every successful pull from Google, whether or not anything differed. */
  fetchedAt: string
  /** Only moves when the content actually changed. */
  changedAt: string
  hash: string
  entries: Entry[]
  notes: string[]
}

/**
 * Read one snapshot. Returns null when the sync has never run, when Supabase
 * isn't configured, or when the stored blob is unreadable — the pages treat
 * all three the same way, by saying so rather than rendering a blank screen.
 */
export async function readSnapshot(key: SheetKey): Promise<StoredSnapshot | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('pages')
    .select('data')
    .eq('slug', snapshotSlug(key))
    .maybeSingle()

  if (error || !data?.data) return null
  const stored = data.data as Partial<StoredSnapshot>
  if (!Array.isArray(stored.entries) || !stored.fetchedAt) return null

  return {
    key,
    title: stored.title ?? SHEET_TITLES[key],
    sourceUrl: stored.sourceUrl ?? SHEETS[key].url,
    fetchedAt: stored.fetchedAt,
    changedAt: stored.changedAt ?? stored.fetchedAt,
    hash: stored.hash ?? '',
    entries: stored.entries,
    notes: Array.isArray(stored.notes) ? stored.notes : [],
  }
}

/** Write a snapshot. Service role only — the sync script is the sole writer. */
export async function writeSnapshot(snapshot: StoredSnapshot): Promise<void> {
  const db = getSupabaseAdmin()
  if (!db) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.')

  const { error } = await db.from('pages').upsert({
    slug: snapshotSlug(snapshot.key),
    data: snapshot,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}
