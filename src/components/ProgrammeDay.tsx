import Link from 'next/link'

import { teReo } from '@/lib/tereo'
import NewTabHint from '@/components/NewTabHint'
import {
  ACCESS_STYLE,
  VENUES,
  eventSlug,
  eventsForDay,
  hasMoreInfo,
  venueMapUrl,
  type Strand,
} from '@/lib/strands'

// One day of the public programme, as a single flat list.
//
// Jon, 19 Sep 2026: "When I click Saturday take me to a page with nothing on
// it. Just an obvious list that's easy to scroll."
//
// So this is deliberately the plainest page on the site. /programme groups the
// weekend into strands — the Carnival, Saturday Shows, Workshops, the Cabaret
// — which is the right shape when you are planning a visit. It is the wrong
// shape when you are standing in Brooklyn at 11am wondering what is on: then
// you want one column, in time order, and nothing else to read. The strand is
// still named on each row, small, for anyone who wants it.
//
// No countdown and no "on now" highlighting here, unlike the crew pages. This
// is for the public, it is cached hard, and a visitor wants the times, not a
// clock that needs JavaScript to be right.

export default function ProgrammeDay({
  strands,
  day,
}: {
  strands: Strand[]
  day: Strand['day']
}) {
  const listings = eventsForDay(strands, day)

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
    <ol className="space-y-4">
      {listings.map(({ strand, event }) => {
        const venue = VENUES[event.venue] ?? VENUES.hall
        const access = ACCESS_STYLE[strand.access]
        const more = hasMoreInfo(event) ? `/programme/${eventSlug(strand, event)}` : null

        return (
          <li
            key={`${strand.id}-${event.title}-${event.time}`}
            className="rounded-2xl p-6 border border-black/5"
            style={{ backgroundColor: 'var(--wpf-yellow-soft)', color: 'var(--wpf-ink)' }}
          >
            {/* Time first and big: on the day it is the thing you are
                scanning for, ahead of even the name of the show. */}
            <p className="font-extrabold text-xl tabular-nums">{event.time}</p>

            <h2 className="mt-1 font-extrabold text-2xl leading-snug">
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
                  style={{ backgroundColor: venue.bg, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)' }}
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
  )
}
