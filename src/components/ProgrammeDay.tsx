'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import { teReo } from '@/lib/tereo'
import NewTabHint from '@/components/NewTabHint'
import { useNow } from '@/components/useNow'
import { timingFor, type Timing } from '@/lib/crew-time'
import {
  ACCESS_STYLE,
  VENUES,
  eventSlug,
  eventTimeRange,
  eventsForDay,
  festivalInstant,
  hasMoreInfo,
  venueMapUrl,
  type Strand,
} from '@/lib/strands'

// One day of the public programme, as a single flat list that knows what time
// it is.
//
// Jon, 19 Sep 2026: "When I click Saturday take me to a page with nothing on
// it. Just an obvious list that's easy to scroll." Then: "lets use relative
// times so when you go to the Saturday page it shows what is on now. Like the
// crews page."
//
// So /programme groups the weekend into strands — the Carnival, Shows,
// Workshops, the Cabaret — which is the right shape when you are planning a
// visit, and the wrong shape when you are standing in Brooklyn at 11am
// wondering what is on. This is that second shape: one column, in time order,
// with whatever is happening right now in pink and impossible to miss.
//
// The countdowns are computed in the browser and re-tick every 30 seconds. The
// page is cached and the reader is not, so a "in 20 minutes" fixed at render
// time would be wrong by the time anyone saw it. Before hydration, and with
// JavaScript off, every row still shows its real clock time — the countdown is
// an addition, never the only way to read the page.

/**
 * Timing pill styling.
 *
 * `later` and `past` are deliberately unfilled — only the thing happening now,
 * and the thing about to, earn a coloured pill. Which means they must not
 * carry the pill's horizontal padding either: with no background behind it,
 * that padding reads as an accidental indent.
 */
const TIMING_STYLE: Record<Timing['status'], { bg: string; fg: string }> = {
  now: { bg: 'var(--wpf-pink)', fg: '#ffffff' },
  soon: { bg: 'var(--wpf-yellow)', fg: 'var(--wpf-ink)' },
  later: { bg: 'transparent', fg: 'var(--wpf-blue)' },
  past: { bg: 'transparent', fg: 'rgba(59,42,23,0.55)' },
}

export default function ProgrammeDay({
  strands,
  day,
}: {
  strands: Strand[]
  day: Strand['day']
}) {
  const now = useNow()

  const listings = useMemo(() => {
    return eventsForDay(strands, day).map(({ strand, event }, i) => {
      const { start, end } = eventTimeRange(event.time)
      return {
        strand,
        event,
        // The position is part of the id because a slug is not unique: the
        // Carnival runs "Junk Puppet Workshop" twice, at 10:30 and at 12:00,
        // and both slugify identically. Without the index React sees two
        // children with the same key — which it may quietly drop or duplicate
        // — and the page emits the same HTML id twice, breaking the
        // jump-to-now anchor.
        id: `${strand.id}-${i}-${eventSlug(strand, event)}`,
        startsAt: start !== null ? festivalInstant(day, start) : null,
        endsAt: end !== null ? festivalInstant(day, end) : null,
      }
    })
  }, [strands, day])

  // The first thing that has not finished — where someone arriving mid-morning
  // actually wants to be on the page.
  const nextUpId = useMemo(() => {
    if (now === null) return null
    const upcoming = listings.find((l) => {
      if (!l.startsAt) return false
      const end = l.endsAt ? Date.parse(l.endsAt) : Date.parse(l.startsAt) + 30 * 60_000
      return end > now
    })
    return upcoming?.id ?? null
  }, [listings, now])

  if (listings.length === 0) {
    return (
      <p className="leading-relaxed text-lg" style={{ color: 'var(--wpf-ink)' }}>
        Nothing is listed for {day}.{' '}
        <Link href="/programme" className="underline underline-offset-4 font-semibold">
          See the whole programme
        </Link>
        .
      </p>
    )
  }

  return (
    <>
      {nextUpId && (
        <p className="mb-6">
          <a
            href={`#${nextUpId}`}
            className="wpf-btn-primary wpf-btn-focus px-6 py-3 inline-block"
            style={{ backgroundColor: 'var(--wpf-pink)', color: '#ffffff' }}
          >
            Jump to what’s on now ↓
          </a>
        </p>
      )}

      <ol className="space-y-4">
        {listings.map(({ strand, event, id, startsAt, endsAt }) => {
          const venue = VENUES[event.venue] ?? VENUES.hall
          const access = ACCESS_STYLE[strand.access]
          const more = hasMoreInfo(event) ? `/programme/${eventSlug(strand, event)}` : null
          const timing =
            now === null || !startsAt
              ? null
              : timingFor(
                  { id, day, group: strand.title, what: event.title, startsAt, endsAt: endsAt ?? undefined },
                  now,
                )
          const isNow = timing?.status === 'now'
          const isPast = timing?.status === 'past'

          return (
            <li
              key={id}
              id={id}
              className="scroll-mt-24 rounded-2xl p-6 border"
              style={{
                backgroundColor: isNow ? 'var(--wpf-pink-soft)' : 'var(--wpf-yellow-soft)',
                borderColor: isNow ? 'var(--wpf-pink)' : 'rgba(0,0,0,0.05)',
                borderWidth: isNow ? 2 : 1,
                opacity: isPast ? 0.55 : 1,
                color: 'var(--wpf-ink)',
              }}
            >
              {/* Time first and big: on the day it is the thing you are
                  scanning for, ahead of even the name of the show. */}
              <p className="font-extrabold text-xl tabular-nums">{event.time}</p>

              {timing && (
                <p className="mt-1.5">
                  <span
                    className={`inline-block rounded-full py-1 text-sm font-extrabold ${
                      TIMING_STYLE[timing.status].bg === 'transparent' ? '' : 'px-3'
                    }`}
                    style={{
                      backgroundColor: TIMING_STYLE[timing.status].bg,
                      color: TIMING_STYLE[timing.status].fg,
                    }}
                  >
                    ({timing.label})
                  </span>
                </p>
              )}

              <h2 className="mt-2 font-extrabold text-2xl leading-snug">
                {more ? (
                  <Link href={more} className="wpf-btn-focus hover:underline underline-offset-4">
                    {teReo(event.title)}
                  </Link>
                ) : (
                  teReo(event.title)
                )}
              </h2>

              {event.by && <p className="mt-1 text-lg wpf-text-muted">{event.by}</p>}

              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <a
                  href={venueMapUrl(event.venue)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold underline decoration-dotted decoration-from-font underline-offset-4 hover:decoration-solid"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 no-underline"
                    style={{
                      backgroundColor: venue.bg,
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
                    }}
                    aria-hidden="true"
                  />
                  {venue.label}
                  <NewTabHint />
                </a>
                {event.age && <span className="wpf-text-muted">Ages {event.age}</span>}
                {event.duration && <span className="wpf-text-muted">{event.duration}</span>}
                {access && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: access.bg, color: access.fg }}
                  >
                    {access.label}
                  </span>
                )}
                {event.note && (
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border border-black/15">
                    {event.note}
                  </span>
                )}
              </p>

              {event.detail && <p className="mt-3 leading-relaxed">{teReo(event.detail)}</p>}

              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                {more && (
                  <Link
                    href={more}
                    className="font-bold underline underline-offset-4"
                    style={{ color: 'var(--wpf-pink-deep)' }}
                  >
                    More about {teReo(event.title)} →
                  </Link>
                )}
                <span className="text-xs uppercase tracking-widest wpf-text-muted">
                  {teReo(strand.title)}
                </span>
              </p>
            </li>
          )
        })}
      </ol>
    </>
  )
}
