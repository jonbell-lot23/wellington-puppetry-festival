'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import { FESTIVAL_DAYS, matchesName, namesIn, type Entry } from '@/lib/sheets'
import { byStartTime, describeAge } from '@/lib/crew-time'
import { EntryCard, NameFilter, useCrewName, useNow } from '@/components/crew-ui'

// A whole spreadsheet, rendered readably and grouped by day.
//
// The per-day pages (/volunteers/crew/saturday and friends) are the ones to
// send people to on the day itself; this is the view for when you want a whole
// sheet end to end. Shared machinery — the remembered name, the ticking clock,
// the entry card — lives in crew-ui.tsx so the two views cannot drift apart.

type Props = {
  entries: Entry[]
  /** ISO instant of the last successful pull from Google. */
  fetchedAt: string
  /** ISO instant of the last pull where the content actually differed. */
  changedAt: string
  sourceUrl: string
}

export default function CrewSheet({ entries, fetchedAt, changedAt, sourceUrl }: Props) {
  const name = useCrewName()
  const now = useNow()
  const trimmed = name.trim()

  const suggestions = useMemo(() => namesIn(entries), [entries])
  const filtered = useMemo(() => entries.filter((e) => matchesName(e, name)), [entries, name])

  const byDay = useMemo(
    () =>
      FESTIVAL_DAYS.map((day) => ({
        ...day,
        entries: filtered.filter((e) => e.day === day.key).sort(byStartTime),
      })).filter((d) => d.entries.length > 0),
    [filtered],
  )

  return (
    <>
      <FreshnessBanner
        fetchedAt={fetchedAt}
        changedAt={changedAt}
        now={now}
        sourceUrl={sourceUrl}
      />

      <NameFilter
        suggestions={suggestions}
        resultCount={filtered.length}
        totalCount={entries.length}
      />

      {byDay.length === 0 && !trimmed && (
        <p className="leading-relaxed" style={{ color: 'var(--wpf-ink)' }}>
          Nothing has come through from the spreadsheet yet.{' '}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 font-semibold"
          >
            Open it in Google Sheets
          </a>
          .
        </p>
      )}

      {byDay.map((day) => (
        <section key={day.key} className="mb-10" aria-labelledby={`day-${day.key}`}>
          {/* The day heading links to that day's own page, which is where most
              people actually want to be on the day itself. */}
          <h2
            id={`day-${day.key}`}
            className="font-extrabold text-2xl mb-4 pb-2 border-b-2"
            style={{ color: 'var(--wpf-ink)', borderColor: 'var(--wpf-yellow-deep)' }}
          >
            <Link
              href={`/volunteers/crew/${day.key.toLowerCase()}`}
              className="wpf-btn-focus hover:underline underline-offset-4"
            >
              {day.label}
              <span className="ml-2 text-base font-bold" style={{ color: 'var(--wpf-pink-deep)' }}>
                open this day →
              </span>
            </Link>
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

/**
 * The full-width freshness box, used on the whole-sheet pages.
 *
 * The day pages use the one-line FreshnessLine instead — those are meant to be
 * scrolled, and a four-line box at the top is four lines of scrolling before
 * the first job.
 */
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
  const ageMin =
    now === null ? null : Math.max(0, Math.round((now - Date.parse(fetchedAt)) / 60_000))
  // The sync runs every 30 minutes, so past about 70 a run has been missed and
  // the page should stop sounding confident.
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
        {now !== null &&
          `The sheet itself last changed ${describeAge(
            Math.max(0, Math.round((now - Date.parse(changedAt)) / 60_000)),
          )}. `}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 font-semibold"
        >
          Open the live spreadsheet
        </a>
        <span className="wpf-visually-hidden"> (opens in a new tab)</span> if you need the very
        latest.
      </p>
    </div>
  )
}

/** Shared nav between the crew sheet pages. */
export function CrewSheetNav({ current }: { current: 'schedule' | 'jobs' }) {
  const tabs = [
    { key: 'schedule', href: '/volunteers/crew/schedule', label: 'Weekend schedule' },
    { key: 'jobs', href: '/volunteers/crew/jobs', label: 'Job assignments' },
  ] as const

  return (
    <nav aria-label="Crew sheets" className="flex flex-wrap gap-2 mb-6">
      {FESTIVAL_DAYS.map((d) => (
        <Link
          key={d.key}
          href={`/volunteers/crew/${d.key.toLowerCase()}`}
          className="wpf-btn-focus rounded-full px-5 py-2.5 font-bold border"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--wpf-ink)',
            borderColor: 'rgba(0,0,0,0.18)',
          }}
        >
          {d.key}
        </Link>
      ))}
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={t.key === current ? 'page' : undefined}
          className="wpf-btn-focus rounded-full px-5 py-2.5 font-bold border"
          style={
            t.key === current
              ? {
                  backgroundColor: 'var(--wpf-pink)',
                  color: '#ffffff',
                  borderColor: 'var(--wpf-pink)',
                }
              : {
                  backgroundColor: 'transparent',
                  color: 'var(--wpf-ink)',
                  borderColor: 'rgba(0,0,0,0.18)',
                }
          }
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
