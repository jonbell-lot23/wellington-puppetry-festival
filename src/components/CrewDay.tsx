'use client'

import { useMemo } from 'react'

import { matchesName, namesIn, type Entry } from '@/lib/sheets'
import { byStartTime } from '@/lib/crew-time'
import { EntryCard, FreshnessLine, NameFilter, useCrewName, useNow } from '@/components/crew-ui'

// One day, one list, top to bottom.
//
// The schedule and the job assignments are two different spreadsheets, but on
// the day nobody cares which document a thing was typed into — they care what
// is happening and whether they are on it. So both are merged into a single
// chronological list here, with a small tag saying which sheet each row came
// from for anyone who needs to go back to the source.
//
// Deliberately flat: no accordions, no tabs, no per-venue grouping. The whole
// point of this page is that you can scroll it with a thumb and read it while
// walking.

type Props = {
  entries: (Entry & { source: 'Schedule' | 'Job' })[]
  fetchedAt: string
  sourceUrl: string
}

export default function CrewDay({ entries, fetchedAt, sourceUrl }: Props) {
  const name = useCrewName()
  const now = useNow()
  const trimmed = name.trim()

  const suggestions = useMemo(() => namesIn(entries), [entries])
  const ordered = useMemo(
    () => [...entries].sort(byStartTime),
    [entries],
  )
  const filtered = useMemo(
    () => ordered.filter((e) => matchesName(e, name)),
    [ordered, name],
  )

  // Where "now" sits in the day, so the page can scroll you to it rather than
  // making you hunt. Only meaningful once the clock exists.
  const nextUpId = useMemo(() => {
    if (now === null) return null
    const upcoming = filtered.find((e) => {
      if (!e.startsAt) return false
      const end = e.endsAt ? Date.parse(e.endsAt) : Date.parse(e.startsAt) + 10 * 60_000
      return end > now
    })
    return upcoming?.id ?? null
  }, [filtered, now])

  return (
    <>
      <FreshnessLine fetchedAt={fetchedAt} sourceUrl={sourceUrl} now={now} />

      {nextUpId && (
        <p className="mb-6">
          <a
            href={`#entry-${nextUpId}`}
            className="wpf-btn-primary wpf-btn-focus px-6 py-3 inline-block"
            style={{ backgroundColor: 'var(--wpf-pink)', color: '#ffffff' }}
          >
            Jump to what’s on now ↓
          </a>
        </p>
      )}

      <NameFilter
        suggestions={suggestions}
        resultCount={filtered.length}
        totalCount={ordered.length}
      />

      {filtered.length === 0 ? (
        <p className="leading-relaxed text-lg" style={{ color: 'var(--wpf-ink)' }}>
          {trimmed
            ? `Nothing on this day mentions “${trimmed}”.`
            : 'Nothing has come through from the spreadsheets for this day yet.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((entry) => (
            <EntryCard
              key={entry.id}
              id={`entry-${entry.id}`}
              entry={entry}
              now={now}
              highlightName={trimmed}
              sourceLabel={entry.source}
              large
            />
          ))}
        </ul>
      )}
    </>
  )
}
