// Parsing for the two Google Sheets the crew actually work from: Izzy's
// weekend schedule and Bridget's volunteer job assignments. Both are shared
// "anyone with the link", which means their CSV export endpoint is readable
// without credentials — that's how scripts/sync-sheets.ts gets at them.
//
// Everything here is pure: CSV text in, plain data out. No Supabase and no
// React, so it can be used by the cron route, the pages and the tests alike.
//
// The golden rule for this file: these are human spreadsheets that people edit
// on a phone during a festival. Parse defensively, never throw on a weird row,
// and when something can't be understood, keep the raw text and show it rather
// than dropping it. A row that renders oddly is recoverable; a row that
// silently vanishes is how someone misses their shift.

/** A Google Sheet published by link, addressed by its document id. */
export type SheetSource = { id: string; url: string; csvUrl: string }

const sheet = (id: string): SheetSource => ({
  id,
  url: `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing`,
  csvUrl: `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`,
})

export const SHEETS = {
  jobs: sheet('1fvC8A0W_g9YSfm6Kx5fs-Fhzngd1JSuOqjB2HKgVww4'),
  schedule: sheet('1qor54hKPbTDgGePcRipx6VTdHcqCNQam8vX7796dAqc'),
} as const

export type SheetKey = keyof typeof SHEETS

/**
 * NZST offset for the festival weekend.
 *
 * 18–20 September 2026 sits before daylight saving begins (27 September 2026),
 * so the whole festival is UTC+12 with no transition inside it. Hard-coding it
 * keeps a timezone database out of both the script and the browser bundle. If
 * this page is ever reused for a festival that straddles the DST switch, this
 * is the line that has to become a real timezone lookup.
 */
const NZ_OFFSET = '+12:00'

/** The festival days, in order, with the calendar date each one falls on. */
export const FESTIVAL_DAYS = [
  { key: 'Friday', date: '2026-09-18', label: 'Friday 18 September' },
  { key: 'Saturday', date: '2026-09-19', label: 'Saturday 19 September' },
  { key: 'Sunday', date: '2026-09-20', label: 'Sunday 20 September' },
] as const

export type DayKey = (typeof FESTIVAL_DAYS)[number]['key']

function dateFor(day: DayKey): string {
  return FESTIVAL_DAYS.find((d) => d.key === day)!.date
}

/**
 * Minimal RFC 4180 CSV reader.
 *
 * Google's export quotes any cell containing a comma, quote or newline, and
 * doubles embedded quotes. That's the whole grammar, so a 30-line parser is
 * more honest here than a dependency — and it means the sync script has no
 * install step beyond what the app already has.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  // Strip a BOM and normalise line endings before scanning.
  const s = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n')

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (quoted) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += ch
    } else if (ch === '"') {
      quoted = true
    } else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  row.push(cell)
  rows.push(row)

  // Trailing blank line from the export shows up as one empty cell.
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

/**
 * Tidy a spreadsheet cell.
 *
 * Google Sheets writes narrow no-break spaces (U+202F) inside times typed as
 * "2:00 PM" — invisible, and they break every time regex you write until you
 * find them. Same for non-breaking spaces in pasted text.
 */
function clean(v: string | undefined): string {
  return (v ?? '').replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Parse a clock time as minutes past midnight.
 *
 * Handles everything these two sheets actually contain: "9:00 AM", "2:00PM",
 * "8.30", "10", "1:15 pm". Bare numbers are the ambiguous case — "10 - 1" for
 * a carnival shift means 10am to 1pm — so `preferAfternoon` lets the caller
 * apply festival-day common sense: nothing here starts at 1am.
 */
export function parseTime(raw: string, preferAfternoon = false): number | null {
  const s = clean(raw).toLowerCase()
  const m = s.match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/)
  if (!m) return null

  let hour = Number(m[1])
  const min = m[2] ? Number(m[2]) : 0
  const mer = m[3]
  if (hour > 23 || min > 59) return null

  if (mer === 'pm' && hour < 12) hour += 12
  else if (mer === 'am' && hour === 12) hour = 0
  else if (!mer) {
    // No am/pm. Festival days run 6am to 11pm, so 1–5 without a meridiem is
    // the afternoon, and 6–11 is the morning unless the context says later.
    if (hour >= 1 && hour <= 5) hour += 12
    else if (preferAfternoon && hour >= 6 && hour <= 11) hour += 12
  }
  return hour * 60 + min
}

/** Minutes past midnight on a festival day → an absolute ISO instant. */
export function instantFor(day: DayKey, minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0')
  const m = String(minutes % 60).padStart(2, '0')
  return `${dateFor(day)}T${h}:${m}:00${NZ_OFFSET}`
}

/** "8:00 AM" → "8:00am"; the festival talks in lowercase. */
export function formatTime(minutes: number): string {
  const h24 = Math.floor(minutes / 60)
  const m = minutes % 60
  const mer = h24 >= 12 ? 'pm' : 'am'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${String(m).padStart(2, '0')}${mer}`
}

/** One thing happening, from either sheet. */
export type Entry = {
  /** Stable within a snapshot; used as a React key. */
  id: string
  day: DayKey
  /** Section within the day — a venue for the schedule, an area for jobs. */
  group: string
  what: string
  /** Extra detail: the schedule's Notes, or a job's specific duties. */
  detail?: string
  venue?: string
  /** Raw "who" text, exactly as typed in the sheet. Never re-spelled. */
  who?: string
  /** How many people the job needs, when the sheet says. */
  needed?: string
  /** ISO instants. Absent when the sheet gives no time for the row. */
  startsAt?: string
  endsAt?: string
  /** Pre-formatted clock label, e.g. "8:00am – 9:00am". */
  timeLabel?: string
}

export type Snapshot = {
  key: SheetKey
  title: string
  /** When the sync script last pulled this from Google. */
  fetchedAt: string
  /** When the content last actually differed from the previous pull. */
  changedAt: string
  entries: Entry[]
  /** Rows that carry standing information rather than a timed job. */
  notes: string[]
}

/** Every distinct name mentioned, for the filter's suggestions. */
export function namesIn(entries: Entry[]): string[] {
  const seen = new Map<string, string>()
  for (const e of entries) {
    for (const name of splitNames(e.who)) {
      const k = name.toLowerCase()
      if (!seen.has(k)) seen.set(k, name)
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b))
}

/**
 * Pull individual names out of a "who" cell.
 *
 * These cells are free text written at speed: "Roger, Jacob, Alex", "Sarah
 * Beka", "Kodi + friends", "Isaac (tech 8.30 - 11am)", "Bridget Hall" (which
 * means Bridget, in the Hall). There is no format to rely on, so this splits
 * on the separators people actually used and strips parenthetical asides.
 * It is used for the *suggestions* list only — matching a typed name goes
 * through `matchesName`, which searches the raw text and so can't be defeated
 * by a spelling this splitter didn't anticipate.
 */
function splitNames(who: string | undefined): string[] {
  if (!who) return []
  return clean(who)
    .replace(/\([^)]*\)/g, ' ')
    .split(/[,/&+]|\band\b/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 1 && !/^\?+$/.test(p))
    // "Bridget Hall" and "Roger Ken Sarah" are several people, or a person and
    // a place. Take the first word: it's the name in every case in this sheet,
    // and a first name is what someone types into the filter anyway.
    .map((p) => p.split(/\s+/)[0])
    .filter((p) => /^[A-Za-zĀ-ſ'’-]{2,}$/.test(p) && !STOP_WORDS.has(p.toLowerCase()))
}

// Words that appear in the "who" column but are not people.
const STOP_WORDS = new Set([
  'all', 'crew', 'and', 'vols', 'volunteers', 'everyone', 'friends', 'person',
  'the', 'tech', 'other', 'remaining', 'personnel', 'cast', 'artists', 'still',
  'ensemble', 'performers', 'musicians', 'upstairs', 'hall', 'ridgeway',
])

/**
 * Does this entry belong to the person who typed `query`?
 *
 * Substring, case-insensitive, against the raw cell — deliberately generous.
 * Someone typing "beka" should find "Sarah Beka", "Rebeka" and "Beka, Ken,"
 * alike. Over-matching shows you a job that isn't yours, which you can see is
 * wrong; under-matching hides one that is.
 */
export function matchesName(entry: Entry, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (entry.who ?? '').toLowerCase().includes(q)
}

// ---------------------------------------------------------------------------
// The weekend schedule
// ---------------------------------------------------------------------------

/**
 * Izzy's schedule, one row per thing that happens.
 *
 * Shape: a header block, then a `Date | Start | End | Dur | Venue | Task | Who
 * | Notes | Arrivals` table with a one-cell day banner ("Saturday") before each
 * day's rows. Times and dates only appear on the first row of a run — the rest
 * inherit, the way merged cells read to a human.
 */
export function parseSchedule(csv: string): { entries: Entry[]; notes: string[] } {
  const rows = parseCsv(csv)
  const entries: Entry[] = []
  const notes: string[] = []

  let day: DayKey | null = null
  let lastStart: number | null = null
  let lastEnd: number | null = null
  let i = 0

  for (const raw of rows) {
    const cells = raw.map(clean)
    const [date, start, end, , venue, task, who, note, arrivals] = cells

    // Day banner: the day name in the first column, nothing else of substance.
    const banner = FESTIVAL_DAYS.find((d) => d.key.toLowerCase() === date.toLowerCase())
    if (banner && !task.match(/\d/)) {
      day = banner.key
      lastStart = null
      lastEnd = null
      continue
    }

    if (!day || !task) continue
    if (task.toLowerCase() === 'task') continue // the header row

    // Blank time means "still in the block above", exactly as it reads on
    // paper. A new start time resets the run.
    const startMin = start ? parseTime(start) : null
    const endMin = end ? parseTime(end) : null
    if (startMin !== null) {
      lastStart = startMin
      lastEnd = endMin
    } else if (endMin !== null) {
      lastEnd = endMin
    }
    const useStart = startMin ?? lastStart
    const useEnd = endMin ?? (startMin !== null ? null : lastEnd)

    entries.push({
      id: `s${i++}`,
      day,
      group: venue || 'Everywhere',
      venue: venue || undefined,
      what: task,
      detail: [note, arrivals && `Arrivals: ${arrivals}`].filter(Boolean).join(' · ') || undefined,
      who: who || undefined,
      startsAt: useStart !== null ? instantFor(day, useStart) : undefined,
      endsAt: useEnd !== null && useEnd > (useStart ?? -1) ? instantFor(day, useEnd) : undefined,
      timeLabel:
        useStart !== null
          ? useEnd !== null && useEnd > useStart
            ? `${formatTime(useStart)} – ${formatTime(useEnd)}`
            : formatTime(useStart)
          : undefined,
    })
  }

  return { entries, notes }
}

// ---------------------------------------------------------------------------
// The volunteer job assignments
// ---------------------------------------------------------------------------

/**
 * Which festival day each area of the jobs sheet belongs to.
 *
 * The sheet groups by area, not by date, and two of the areas don't say their
 * day out loud: the Cabaret is Saturday evening, and the Access Workshop is
 * the Saturday 2pm BLENNZ session. Both are pinned here rather than guessed,
 * because a shift shown on the wrong day is worse than one shown with no day.
 */
const JOB_AREA_DAYS: { match: RegExp; day: DayKey; afternoon?: boolean }[] = [
  { match: /^friday/i, day: 'Friday', afternoon: true },
  { match: /^saturday/i, day: 'Saturday' },
  { match: /^access workshop/i, day: 'Saturday', afternoon: true },
  { match: /^cabaret/i, day: 'Saturday', afternoon: true },
  { match: /^sunday/i, day: 'Sunday' },
]

/**
 * Pull a time range out of a task label.
 *
 * The jobs sheet has no time columns — the hours live inside the task text:
 * "Packing In 6:30am - 9am", "Ushering, split 10 - 2", "SM 8:00 - 2:30pm",
 * "Pack up Upstairs 2:00 - 3:00". This finds that range and hands back both
 * the minutes and the label with the range removed, so the task reads as a
 * task and the time is shown as a time.
 */
export function extractRange(
  label: string,
  afternoon = false,
): { start: number | null; end: number | null; rest: string } {
  const re = /(\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm)?)\s*(?:-|–|—|to)\s*(\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm)?)/i
  const m = label.match(re)
  if (!m) {
    const single = label.match(/(\d{1,2}[:.]\d{2}\s*(?:am|pm)?)/i)
    if (single) {
      const t = parseTime(single[1], afternoon)
      if (t !== null) return { start: t, end: null, rest: clean(label.replace(single[0], '')) }
    }
    return { start: null, end: null, rest: clean(label) }
  }

  let start = parseTime(m[1], afternoon)
  let end = parseTime(m[2], afternoon)

  // "8.30 - 2.30" — the end reads as 2:30am until you notice it follows a
  // morning start. A shift never runs backwards, so push the end into the
  // afternoon when it lands before the start.
  if (start !== null && end !== null && end < start && !/pm/i.test(m[2]) && end + 720 > start) {
    end += 720
  }
  // Same trick for a start that's clearly after the end, e.g. "10 - 1" parsed
  // as 10pm–1pm because of a stray meridiem.
  if (start !== null && end !== null && end < start && !/am|pm/i.test(m[1]) && start >= 720) {
    start -= 720
  }

  return { start, end, rest: clean(label.replace(m[0], '')).replace(/[,\-–—]\s*$/, '').trim() }
}

/**
 * Bridget's assignments sheet.
 *
 * Shape: `Date/Area | Tasks | Specific duties | Numbers | Volunteers | Notes`,
 * where the area and the task are written once and left blank on every row
 * beneath them. That's merged cells to a reader and blank strings to a parser,
 * so both carry forward.
 */
export function parseJobs(csv: string): { entries: Entry[]; notes: string[] } {
  const rows = parseCsv(csv)
  const entries: Entry[] = []
  const notes: string[] = []

  let area = ''
  let areaDay: DayKey = 'Saturday'
  let afternoon = false
  let task = ''
  let range: { start: number | null; end: number | null; rest: string } = {
    start: null,
    end: null,
    rest: '',
  }
  let started = false
  let i = 0

  for (const raw of rows) {
    const cells = raw.map(clean)
    const [areaCell, taskCell, duty, needed, who, note] = cells

    // Everything above the header row is standing information — the
    // remuneration note and the "still to fill" flag.
    if (!started) {
      if (areaCell.toLowerCase() === 'date/area') {
        started = true
        continue
      }
      if (areaCell && areaCell !== 'WPF Volunteer Jobs List') notes.push(areaCell)
      continue
    }

    if (areaCell) {
      area = areaCell
      const found = JOB_AREA_DAYS.find((d) => d.match.test(areaCell))
      // No match means an area with no day of its own ("General" — the poster
      // run and airport pickups). Those keep the previous area's day but have
      // no times, so they sort to the end of the day rather than mis-placing.
      if (found) {
        areaDay = found.day
        afternoon = found.afternoon ?? false
      }
    }
    if (taskCell) {
      task = taskCell
      range = extractRange(taskCell, afternoon)
    }
    if (!task && !duty) continue

    // The duty is the specific thing; the task is the shift it belongs to.
    // Show the duty as the headline when there is one, with the shift as
    // context, because "put up 4 marquees" is what you actually do.
    const what = duty || range.rest || task
    const context = duty && range.rest && range.rest !== duty ? range.rest : undefined

    entries.push({
      id: `j${i++}`,
      day: areaDay,
      group: area || 'General',
      what,
      detail: [context, note].filter(Boolean).join(' · ') || undefined,
      who: who || undefined,
      needed: needed || undefined,
      startsAt: range.start !== null ? instantFor(areaDay, range.start) : undefined,
      endsAt:
        range.end !== null && range.start !== null && range.end > range.start
          ? instantFor(areaDay, range.end)
          : undefined,
      timeLabel:
        range.start !== null
          ? range.end !== null && range.end > range.start
            ? `${formatTime(range.start)} – ${formatTime(range.end)}`
            : formatTime(range.start)
          : undefined,
    })
  }

  return { entries, notes }
}

export function parseSheet(key: SheetKey, csv: string): { entries: Entry[]; notes: string[] } {
  return key === 'jobs' ? parseJobs(csv) : parseSchedule(csv)
}

/**
 * Where a parsed snapshot is stored. See src/lib/crew-snapshots.ts for why the
 * rows sit in `pages` rather than a table of their own.
 */
export const SNAPSHOT_SLUG_PREFIX = 'crew-sheet:'

export const snapshotSlug = (key: SheetKey) => `${SNAPSHOT_SLUG_PREFIX}${key}`

export const SHEET_TITLES: Record<SheetKey, string> = {
  jobs: 'Volunteer job assignments',
  schedule: 'Weekend schedule',
}
