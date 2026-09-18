'use client'

import { useSyncExternalStore } from 'react'

import { type Entry } from '@/lib/sheets'
import { timingFor, describeAge, type Timing } from '@/lib/crew-time'
import { useNow } from '@/components/useNow'

// Shared client-side machinery for every crew page: the remembered name, the
// ticking clock, and the card an entry is drawn as.
//
// Everything time-related is computed in the browser, never on the server. The
// pages are cached and the reader is not, so a countdown rendered at build
// time is a lie within the minute. The server renders the facts — what, who,
// what o'clock — and the countdown appears on hydration and re-ticks every 30
// seconds.

const NAME_STORAGE_KEY = 'wpf-crew-name'

// --- the remembered name -----------------------------------------------------
//
// An external store rather than state-in-an-effect: it is genuinely outside
// React, it has to be shared by every crew page, and useSyncExternalStore gives
// React a correct server snapshot (an empty name) so hydration matches.

/** Cached so getSnapshot returns a stable value between real changes. */
let cachedName: string | null = null
const nameListeners = new Set<() => void>()

function readStoredName(): string {
  try {
    return localStorage.getItem(NAME_STORAGE_KEY) ?? ''
  } catch {
    // Private browsing, or site data blocked. The filter still works, it is
    // just not remembered — no reason to break the page over it.
    return ''
  }
}

function emitName() {
  nameListeners.forEach((l) => l())
}

export const nameStore = {
  subscribe(listener: () => void) {
    nameListeners.add(listener)
    // Another tab changing the name should update this one too.
    const onStorage = (e: StorageEvent) => {
      if (e.key === NAME_STORAGE_KEY) {
        cachedName = null
        emitName()
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
    emitName()
  },
}

export function useCrewName() {
  return useSyncExternalStore(
    nameStore.subscribe,
    nameStore.getSnapshot,
    nameStore.getServerSnapshot,
  )
}

// --- the clock ---------------------------------------------------------------
//
// Shared with the public programme's day headings; see useNow.ts.

export { useNow }

// --- shared pieces -----------------------------------------------------------

/** "Last updated from the spreadsheet 4 minutes ago", in one compact line. */
export function FreshnessLine({
  fetchedAt,
  sourceUrl,
  now,
}: {
  fetchedAt: string
  sourceUrl: string
  now: number | null
}) {
  const ageMin =
    now === null ? null : Math.max(0, Math.round((now - Date.parse(fetchedAt)) / 60_000))
  // The sync runs every 30 minutes, so past about 70 a run has been missed and
  // the page should stop sounding confident.
  const stale = ageMin !== null && ageMin > 70

  return (
    <p
      className="text-sm font-bold uppercase tracking-widest mb-6"
      style={{ color: stale ? 'var(--wpf-pink-deep)' : 'rgba(59,42,23,0.6)' }}
    >
      {ageMin === null
        ? 'Last updated from the spreadsheet —'
        : `Last updated from the spreadsheet ${describeAge(ageMin)}`}
      {stale && ' · sync may have stopped'}
      {' · '}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4"
      >
        open the sheet
      </a>
      <span className="wpf-visually-hidden"> (opens in a new tab)</span>
    </p>
  )
}

/** The "just show me mine" box. Same store everywhere, so it follows you. */
export function NameFilter({
  suggestions,
  resultCount,
  totalCount,
  compact = false,
}: {
  suggestions: string[]
  resultCount: number
  totalCount: number
  compact?: boolean
}) {
  const name = useCrewName()
  const trimmed = name.trim()

  return (
    <div
      className={`rounded-2xl border border-black/5 bg-[var(--wpf-blue-soft)] mb-8 ${compact ? 'p-5' : 'p-6'}`}
    >
      <label
        htmlFor="crew-name"
        className="block font-extrabold text-lg mb-1"
        style={{ color: 'var(--wpf-ink)' }}
      >
        Just show me my jobs
      </label>
      <p className="text-sm wpf-text-muted mb-3">
        Type your first name. It is remembered on this device and follows you to every crew page.
      </p>
      <div className="flex flex-wrap gap-3">
        <input
          id="crew-name"
          type="text"
          value={name}
          onChange={(e) => nameStore.set(e.target.value)}
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
            onClick={() => nameStore.set('')}
            className="wpf-btn-focus rounded-xl px-5 py-3 font-semibold border border-black/15"
            style={{ color: 'var(--wpf-ink)' }}
          >
            Show everything
          </button>
        )}
      </div>
      <p className="mt-3 text-sm" style={{ color: 'var(--wpf-ink)' }} aria-live="polite">
        {trimmed
          ? resultCount > 0
            ? `Showing ${resultCount} ${resultCount === 1 ? 'thing' : 'things'} with “${trimmed}” in them.`
            : `Nothing here mentions “${trimmed}”. Try a different spelling, or show everything — the sheet is hand-typed.`
          : `Showing all ${totalCount}.`}
      </p>
    </div>
  )
}

const TIMING_STYLE: Record<Timing['status'], { bg: string; fg: string }> = {
  now: { bg: 'var(--wpf-pink)', fg: '#ffffff' },
  soon: { bg: 'var(--wpf-yellow)', fg: 'var(--wpf-ink)' },
  later: { bg: 'transparent', fg: 'var(--wpf-blue)' },
  past: { bg: 'transparent', fg: 'rgba(59,42,23,0.55)' },
}

export function EntryCard({
  entry,
  now,
  highlightName,
  id,
  /** Shown as a small tag — which sheet this came from, on the day pages. */
  sourceLabel,
  /** Bigger type and more air, for the one-day-at-a-glance pages. */
  large = false,
}: {
  entry: Entry
  now: number | null
  highlightName: string
  /** Anchor target, so a page can link straight to one row. */
  id?: string
  sourceLabel?: string
  large?: boolean
}) {
  const timing = now === null ? null : timingFor(entry, now)
  const isNow = timing?.status === 'now'
  const isPast = timing?.status === 'past'

  return (
    <li
      id={id}
      className={`scroll-mt-24 rounded-2xl border transition-colors ${large ? 'p-6' : 'p-5'}`}
      style={{
        backgroundColor: isNow ? 'var(--wpf-pink-soft)' : 'var(--wpf-yellow-soft)',
        borderColor: isNow ? 'var(--wpf-pink)' : 'rgba(0,0,0,0.05)',
        borderWidth: isNow ? 2 : 1,
        opacity: isPast ? 0.55 : 1,
        color: 'var(--wpf-ink)',
      }}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`font-extrabold tabular-nums ${large ? 'text-xl' : ''}`}>
          {entry.timeLabel ?? 'No time given'}
        </span>
        {entry.venue && <span className="text-sm wpf-text-muted">{entry.venue}</span>}
        {entry.needed && (
          <span className="text-sm wpf-text-muted">
            {entry.needed} {entry.needed === '1' ? 'person' : 'people'} needed
          </span>
        )}
        {sourceLabel && (
          <span className="text-xs uppercase tracking-widest wpf-text-muted">{sourceLabel}</span>
        )}
      </div>

      <p className={`mt-1 font-bold leading-snug ${large ? 'text-2xl' : 'text-lg'}`}>{entry.what}</p>

      {timing && (
        <p className="mt-2">
          <span
            className={`inline-block rounded-full px-3 py-1 font-extrabold ${large ? 'text-base' : 'text-sm'}`}
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
        <p className={`mt-2 leading-relaxed ${large ? 'text-lg' : ''}`}>
          <span className="wpf-text-muted">Who: </span>
          <Highlight text={entry.who} needle={highlightName} />
        </p>
      )}

      {entry.detail && (
        <p className="mt-1.5 text-sm wpf-text-muted leading-relaxed">{entry.detail}</p>
      )}

      {entry.group && !sourceLabel && (
        <p className="mt-2 text-xs uppercase tracking-widest wpf-text-muted">{entry.group}</p>
      )}
    </li>
  )
}

/** Marks the reader's own name inside the raw "who" text. */
export function Highlight({ text, needle }: { text: string; needle: string }) {
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

export type { Entry }
