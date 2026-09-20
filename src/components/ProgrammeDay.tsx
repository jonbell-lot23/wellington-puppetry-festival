import Link from 'next/link'

import { teReo } from '@/lib/tereo'
import NewTabHint from '@/components/NewTabHint'
import Notice from '@/components/Notice'
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
// it. Just an obvious list that's easy to scroll." Then: "lets use relative
// times so when you go to the Saturday page it shows what is on now. Like the
// crews page."
//
// So /programme groups the weekend into strands — the Carnival, Shows,
// Workshops, the Cabaret — which is the right shape when you are planning a
// visit, and the wrong shape when you are standing in Brooklyn at 11am
// wondering what is on. This is that second shape: one column, in time order.
//
// The "what is on now" half of it has been taken out again, now that the
// festival has been. It was a live clock: a pink NOW pill, a "Jump to what's
// on now" button, and every finished row faded to 55%. Run after the weekend,
// all it can say is that everything is over — three pages of grey rows under a
// button that has nowhere to jump to. Jon, 20 Sep: "nothing dimmed."
//
// So every listing now renders the same as every other, at its real clock
// time, which is what a record of the weekend should look like. No client
// clock, no countdowns, no hydration — this is a plain server component again.

export default function ProgrammeDay({
  strands,
  day,
}: {
  strands: Strand[]
  day: Strand['day']
}) {
  const listings = eventsForDay(strands, day).map(({ strand, event }, i) => ({
    strand,
    event,
    // The position is part of the id because a slug is not unique: the
    // Carnival runs "Junk Puppet Workshop" twice, at 10:30 and at 12:00, and
    // both slugify identically. Without the index React sees two children with
    // the same key — which it may quietly drop or duplicate — and the page
    // emits the same HTML id twice.
    id: `${strand.id}-${i}-${eventSlug(strand, event)}`,
  }))

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
      <ol className="space-y-4">
        {listings.map(({ strand, event, id }) => {
          const venue = VENUES[event.venue] ?? VENUES.hall
          const access = ACCESS_STYLE[strand.access]
          const more = hasMoreInfo(event) ? `/programme/${eventSlug(strand, event)}` : null

          return (
            <li
              key={id}
              id={id}
              className="scroll-mt-24 rounded-2xl p-6 border"
              style={{
                backgroundColor: 'var(--wpf-yellow-soft)',
                borderColor: 'rgba(0,0,0,0.05)',
                color: 'var(--wpf-ink)',
              }}
            >
              {/* Time first and big: it is the thing you scan a day by, ahead
                  of even the name of the show. */}
              <p className="font-extrabold text-xl tabular-nums">{event.time}</p>

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

              {event.notice && <Notice>{event.notice}</Notice>}

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
                {/* The strand name — which carnival, which set of shows this
                    row belongs to. It used to be the faintest thing on the
                    card, grey on cream, which made a card hard to place at a
                    glance. Jon, on the Saturday: "JUNK PUPPET CARNIVAL --
                    highlight it". A filled chip, so it reads as a label rather
                    than as an afterthought. */}
                <span
                  className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest"
                  style={{ backgroundColor: 'var(--wpf-yellow)', color: 'var(--wpf-ink)' }}
                >
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
