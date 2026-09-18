'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'

import { FESTIVAL_DAYS, matchesName, namesIn, type Entry } from '@/lib/sheets'

// The readable view of one of the crew's Google Sheets.
//
// Everything time-related is computed in the browser, not on the server, for
// one reason: the page is cached and the reader is not. A "in 53 minutes"
// baked in at build time is a lie within the minute. So the server renders the
// facts (what, who, when in clock time) and the client adds the countdown once
// it has mounted, ticking every 30 seconds.
//
// That means the first paint has no relative times. That is deliberate and
// better than the alternative — a hydration mismatch on every row, and a
// wrong answer shown confidently to someone deciding whether to run.

type Props = {
  entries: Entry[]
  /** ISO instant of the last successful pull from Google. */
  fetchedAt: string
  /** ISO instant of the last pull where the content actually differed. */
  changedAt: string
  sourceUrl: string
}

const NAME_STORAGE_KEY = 'wpf-crew-name'

// Two external stores, read with useSyncExternalStore.
//
// Both the remembered name and the current time are state that lives outside
// React and outside the server render, which is exactly the case
// useSyncExternalStore exists for. Doing it this way (rather than setState in
// an effect) gives React a correct server snapshot to render — an empty name
// and no clock — so hydration matches, and the values arrive in the same tick
// the component mounts.

/** Cached so getSnapshot returns a stable reference between real changes. */
let cachedName: string | null = null
const nameListeners = new Set<() => void>()

function readStoredName(): string {
  try {
    return localStorage.getItem(NAME_STORAGE_KEY) ?? ''
  } catch {
    // Private browsing, or site data blocked. The filter still works, it just
    // is not remembered — no reason to break the page over it.
    return ''
  }
}

const nameStore = {
  subscribe(listener: () => void) {
    nameListeners.add(listener)
    // Another tab changing the name should update this one.
    const onStorage = (e: StorageEvent) => {
      if (e.key === NAME_STORAGE_KEY) {
        cachedName = null
        nameListeners.forEach((l) => l())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      nameListeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  },
  getSnapshot() {
    if (cachedName === null) cachedName = readStoredName()
    return cachedName
  },
  getServerSnapshot() {
    return ''
  },
  set(value: string) {
    cachedName = value
    try {
      if (value.trim()) localStorage.setItem(NAME_STORAGE_KEY, value)
      else localStorage.removeItem(NAME_STORAGE_KEY)
    } catch {
      /* see readStoredName */
    }
    nameListeners.forEach((l) => l())
  },
}

/**
 * The clock, ticking every 30 seconds.
 *
 * getSnapshot has to return the same value until something actually changes,
 * so the timestamp is cached and only replaced on a tick — returning
 * Date.now() directly would tell React the store changed on every render.
 */
let cachedNow: number | null = null

const clockStore = {
  subscribe(listener: () => void) {
    cachedNow = Date.now()
    listener()
    const id = setInterval(() => {
      cachedNow = Date.now()
      listener()
    }, 30_000)
    return () => clearInterval(id)
  },
  getSnapshot() {
    return cachedNow
  },
  getServerSnapshot() {
    return null
  },
}

export default function CrewSheet({ entries, fetchedAt, changedAt, sourceUrl }: Props) {
  const name = useSyncExternalStore(
    nameStore.subscribe,
    nameStore.getSnapshot,
    nameStore.getServerSnapshot,
  )
  // null until mounted — the server has no business guessing what time it is
  // where the reader is standing.
  const now = useSyncExternalStore(
    clockStore.subscribe,
    clockStore.getSnapshot,
    clockStore.getServerSnapshot,
  )

  const updateName = (value: string) => nameStore.set(value)

  const suggestions = useMemo(() => namesIn(entries), [entries])
  const filtered = useMemo(
    () => entries.filter((e) => matchesName(e, name)),
    [entries, name],
  )

  const byDay = useMemo(() => {
    return FESTIVAL_DAYS.map((day) => ({
      ...day,
      entries: filtered
        .filter((e) => e.day === day.key)
        // Timed things in clock order; untimed ones after them, in sheet order,
        // because "no time given" is not "at midnight".
        .sort((a, b) => {
          if (a.startsAt && b.startsAt) return a.startsAt.localeCompare(b.startsAt)
          if (a.startsAt) return -1
          if (b.startsAt) return 1
          return 0
        }),
    })).filter((d) => d.entries.length > 0)
  }, [filtered])

  const trimmed = name.trim()

  return (
    <>
      <FreshnessBanner fetchedAt={fetchedAt} changedAt={changedAt} now={now} sourceUrl={sourceUrl} />

      <div className="rounded-2xl p-6 mb-8 border border-black/5 bg-[var(--wpf-blue-soft)]">
        <label
          htmlFor="crew-name"
          className="block font-extrabold text-lg mb-1"
          style={{ color: 'var(--wpf-ink)' }}
        >
          Just show me my jobs
        </label>
        <p className="text-sm wpf-text-muted mb-3">
          Type your first name. It is remembered on this device, and it applies to the schedule and
          the job list both.
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            id="crew-name"
            type="text"
            value={name}
            onChange={(e) => updateName(e.target.value)}
            list="crew-names"
            autoComplete="off"
            placeholder="e.g. Beka"
            className="wpf-btn-focus flex-1 min-w-[12rem] rounded-xl px-4 py-3 border border-black/15 bg-white"
            style={{ color: 'var(--wpf-ink)' }}
          />
          <datalist id="crew-names">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {trimmed && (
            <button
              type="button"
              onClick={() => updateName('')}
              className="wpf-btn-focus rounded-xl px-5 py-3 font-semibold border border-black/15"
              style={{ color: 'var(--wpf-ink)' }}
            >
              Show everything
            </button>
          )}
        </div>
        <p className="mt-3 text-sm" style={{ color: 'var(--wpf-ink)' }} aria-live="polite">
          {trimmed
            ? filtered.length > 0
              ? `Showing ${filtered.length} ${filtered.length === 1 ? 'thing' : 'things'} with “${trimmed}” in them.`
              : `Nothing here mentions “${trimmed}”. Try a different spelling, or show everything — the sheet is hand-typed.`
            : `Showing all ${entries.length} rows.`}
        </p>
      </div>

      {byDay.length === 0 && !trimmed && (
        <p className="leading-relaxed" style={{ color: 'var(--wpf-ink)' }}>
          Nothing has come through from the spreadsheet yet.{' '}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-semibold">
            Open it in Google Sheets
          </a>
          .
        </p>
      )}

      {byDay.map((day) => (
        <section key={day.key} className="mb-10" aria-labelledby={`day-${day.key}`}>
          <h2
            id={`day-${day.key}`}
            className="font-extrabold text-2xl mb-4 pb-2 border-b-2"
            style={{ color: 'var(--wpf-ink)', borderColor: 'var(--wpf-yellow-deep)' }}
          >
            {day.label}
          </h2>
          <ul className="space-y-3">
            {day.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} now={now} highlightName={trimmed} />
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

/** "LAST UPDATED FROM THE SPREADSHEET 4 MINUTES AGO", as asked for, up top. */
function FreshnessBanner({
  fetchedAt,
  changedAt,
  now,
  sourceUrl,
}: {
  fetchedAt: string
  changedAt: string
  now: number | null
  sourceUrl: string
}) {
  const ageMin = now === null ? null : Math.max(0, Math.round((now - Date.parse(fetchedAt)) / 60_000))
  // The sync runs every 30 minutes, so anything past about 70 minutes means a
  // run has been missed and the page should stop sounding confident.
  const stale = ageMin !== null && ageMin > 70

  return (
    <div
      className="rounded-2xl px-6 py-4 mb-6 border"
      style={{
        backgroundColor: stale ? 'var(--wpf-pink-soft)' : 'var(--wpf-yellow-soft)',
        borderColor: stale ? 'var(--wpf-pink)' : 'rgba(0,0,0,0.06)',
      }}
    >
      <p
        className="font-extrabold text-sm uppercase tracking-widest"
        style={{ color: stale ? 'var(--wpf-pink-deep)' : 'var(--wpf-ink)' }}
      >
        {ageMin === null
          ? 'Last updated from the spreadsheet —'
          : `Last updated from the spreadsheet ${describeAge(ageMin)}`}
      </p>
      <p className="mt-1 text-sm wpf-text-muted">
        {stale && 'The half-hourly sync looks like it has stopped. '}
        Changes are pulled in every 30 minutes.{' '}
        {now !== null && `The sheet itself last changed ${describeAge(Math.max(0, Math.round((now - Date.parse(changedAt)) / 60_000)))}`}
        {now !== null && '. '}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 font-semibold"
        >
          Open the live spreadsheet
        </a>
        <span className="wpf-visually-hidden"> (opens in a new tab)</span>{' '}
        if you need the very latest.
      </p>
    </div>
  )
}

function describeAge(minutes: number): string {
  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.round(minutes / 60)
  if (hours === 1) return 'about an hour ago'
  if (hours < 24) return `about ${hours} hours ago`
  const days = Math.round(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

/**
 * The countdown under each row: "(Now!)", "(In 53 minutes)", "(Finished)".
 *
 * `status` drives the colour as well as the words, so the thing happening now
 * is findable by glance and not only by reading.
 */
type Timing = { label: string; status: 'now' | 'soon' | 'later' | 'past' }

function timingFor(entry: Entry, now: number): Timing | null {
  if (!entry.startsAt) return null
  const start = Date.parse(entry.startsAt)
  const end = entry.endsAt ? Date.parse(entry.endsAt) : null
  if (Number.isNaN(start)) return null

  if (now >= start && end !== null && now < end) {
    const left = Math.round((end - now) / 60_000)
    return { label: left <= 1 ? 'Now! Finishing up' : `Now! ${describeGap(left)} left`, status: 'now' }
  }
  // No end time: treat it as a moment, and call it "now" for a generous ten
  // minutes either side rather than flipping to "finished" the instant it
  // starts. A 10:00am showtime is still "now" at 10:04.
  if (end === null && now >= start && now - start < 10 * 60_000) {
    return { label: 'Now!', status: 'now' }
  }

  if (now < start) {
    const until = Math.round((start - now) / 60_000)
    if (until <= 90) return { label: `In ${describeGap(until)}`, status: until <= 30 ? 'soon' : 'later' }
    return { label: `In ${describeGap(until)}`, status: 'later' }
  }

  return { label: end !== null ? 'Finished' : 'Started earlier', status: 'past' }
}

/** Minutes → "53 minutes", "2 hours 5 minutes", "3 hours". */
function describeGap(minutes: number): string {
  if (minutes < 1) return 'less than a minute'
  if (minutes === 1) return '1 minute'
  if (minutes < 60) return `${minutes} minutes`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const hh = h === 1 ? '1 hour' : `${h} hours`
  if (m === 0) return hh
  return `${hh} ${m === 1 ? '1 minute' : `${m} minutes`}`
}

const TIMING_STYLE: Record<Timing['status'], { bg: string; fg: string }> = {
  now: { bg: 'var(--wpf-pink)', fg: '#ffffff' },
  soon: { bg: 'var(--wpf-yellow)', fg: 'var(--wpf-ink)' },
  later: { bg: 'transparent', fg: 'var(--wpf-blue)' },
  past: { bg: 'transparent', fg: 'rgba(59,42,23,0.55)' },
}

function EntryCard({
  entry,
  now,
  highlightName,
}: {
  entry: Entry
  now: number | null
  highlightName: string
}) {
  const timing = now === null ? null : timingFor(entry, now)
  const isNow = timing?.status === 'now'
  const isPast = timing?.status === 'past'

  return (
    <li
      className="rounded-2xl p-5 border transition-colors"
      style={{
        backgroundColor: isNow ? 'var(--wpf-pink-soft)' : 'var(--wpf-yellow-soft)',
        borderColor: isNow ? 'var(--wpf-pink)' : 'rgba(0,0,0,0.05)',
        opacity: isPast ? 0.62 : 1,
        color: 'var(--wpf-ink)',
      }}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-extrabold tabular-nums">{entry.timeLabel ?? 'No time given'}</span>
        {entry.venue && <span className="text-sm wpf-text-muted">{entry.venue}</span>}
        {entry.needed && (
          <span className="text-sm wpf-text-muted">
            {entry.needed} {entry.needed === '1' ? 'person' : 'people'} needed
          </span>
        )}
      </div>

      <p className="mt-1 text-lg font-bold leading-snug">{entry.what}</p>

      {timing && (
        <p className="mt-1.5">
          <span
            className="inline-block rounded-full px-3 py-1 text-sm font-extrabold"
            style={{
              backgroundColor: TIMING_STYLE[timing.status].bg,
              color: TIMING_STYLE[timing.status].fg,
            }}
          >
            ({timing.label})
          </span>
        </p>
      )}

      {entry.who && (
        <p className="mt-2 leading-relaxed">
          <span className="wpf-text-muted">Who: </span>
          <Highlight text={entry.who} needle={highlightName} />
        </p>
      )}

      {entry.detail && <p className="mt-1.5 text-sm wpf-text-muted leading-relaxed">{entry.detail}</p>}

      {entry.group && (
        <p className="mt-2 text-xs uppercase tracking-widest wpf-text-muted">{entry.group}</p>
      )}
    </li>
  )
}

/** Marks the reader's own name inside the raw "who" text. */
function Highlight({ text, needle }: { text: string; needle: string }) {
  const q = needle.trim()
  if (!q) return <>{text}</>

  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, i)}
      <mark
        className="px-1 rounded font-bold"
        style={{ backgroundColor: 'var(--wpf-yellow)', color: 'var(--wpf-ink)' }}
      >
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  )
}

/** Shared nav between the two crew sheet pages. */
export function CrewSheetNav({ current }: { current: 'schedule' | 'jobs' }) {
  const tabs = [
    { key: 'schedule', href: '/volunteers/crew/schedule', label: 'Weekend schedule' },
    { key: 'jobs', href: '/volunteers/crew/jobs', label: 'Job assignments' },
  ] as const

  return (
    <nav aria-label="Crew sheets" className="flex flex-wrap gap-2 mb-6">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={t.key === current ? 'page' : undefined}
          className="wpf-btn-focus rounded-full px-5 py-2.5 font-bold border"
          style={
            t.key === current
              ? { backgroundColor: 'var(--wpf-pink)', color: '#ffffff', borderColor: 'var(--wpf-pink)' }
              : { backgroundColor: 'transparent', color: 'var(--wpf-ink)', borderColor: 'rgba(0,0,0,0.18)' }
          }
        >
          {t.label}
        </Link>
      ))}
      <Link
        href="/volunteers/crew"
        className="wpf-btn-focus rounded-full px-5 py-2.5 font-bold border"
        style={{ backgroundColor: 'transparent', color: 'var(--wpf-ink)', borderColor: 'rgba(0,0,0,0.18)' }}
      >
        Crew info
      </Link>
    </nav>
  )
}
