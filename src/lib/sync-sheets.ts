// Pulls the crew's two Google Sheets and stores a parsed snapshot.
//
// This is the only implementation. It is called by the cron route
// (src/app/api/cron/sync-sheets/route.ts, every 30 minutes) and by
// scripts/sync-sheets.ts, which just pokes that route — so there is one copy
// of this logic and one way for it to behave.
//
// Two timestamps, and the difference matters. `fetchedAt` moves on every
// successful pull and is what the page's "last updated from the spreadsheet"
// line counts from: it answers "is this stale?". `changedAt` moves only when
// the content actually differs, which answers "has Bridget changed the roster
// since I looked?". Hashing rather than writing blindly also stops a
// half-hourly job from rewriting identical rows forever.

import { parseSheet, SHEETS, SHEET_TITLES, type SheetKey } from './sheets'
import { readSnapshot, writeSnapshot } from './crew-snapshots'

export type SyncResult = {
  key: SheetKey
  ok: boolean
  changed: boolean
  entries: number
  error?: string
}

/** Stable digest of the parsed content, so formatting-only edits don't count. */
async function digest(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Fetch one sheet's CSV export, with a couple of retries.
 *
 * Google occasionally answers a burst of exports with a 429 or a redirect
 * loop. A failed run is not a crisis — the previous snapshot stays up and the
 * page says how old it is — but it is cheap to try again before giving up.
 */
async function fetchCsv(csvUrl: string): Promise<string> {
  let lastError: unknown
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(csvUrl, { redirect: 'follow', cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      // A sheet that has lost its link sharing returns Google's sign-in page
      // with a 200. Treat that as a failure rather than parsing HTML as CSV
      // and quietly publishing an empty schedule over a good one.
      if (/^\s*<(!doctype|html)/i.test(text)) {
        throw new Error('got HTML, not CSV — has link sharing been turned off?')
      }
      if (text.trim().length === 0) throw new Error('empty response')
      return text
    } catch (err) {
      lastError = err
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1500))
    }
  }
  throw lastError
}

/** Sync every sheet. One bad sheet never stops the other. */
export async function syncAllSheets(): Promise<SyncResult[]> {
  const keys = Object.keys(SHEETS) as SheetKey[]
  return Promise.all(keys.map(syncSheet))
}

export async function syncSheet(key: SheetKey): Promise<SyncResult> {
  const source = SHEETS[key]
  try {
    const csv = await fetchCsv(source.csvUrl)
    const parsed = parseSheet(key, csv)

    // A parse that yields nothing means the sheet's shape changed under us
    // (a renamed header row, a new tab order). Keeping the last good snapshot
    // is strictly better than replacing a working page with an empty one.
    if (parsed.entries.length === 0) {
      throw new Error('parsed 0 entries — sheet layout may have changed')
    }

    const hash = await digest(parsed)
    const now = new Date().toISOString()
    const previous = await readSnapshot(key)
    const changed = previous?.hash !== hash

    await writeSnapshot({
      key,
      title: SHEET_TITLES[key],
      sourceUrl: source.url,
      hash,
      fetchedAt: now,
      changedAt: changed ? now : (previous?.changedAt ?? now),
      entries: parsed.entries,
      notes: parsed.notes,
    })

    return { key, ok: true, changed, entries: parsed.entries.length }
  } catch (err) {
    return {
      key,
      ok: false,
      changed: false,
      entries: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}
