'use client'

import Link from 'next/link'

import { useNow } from '@/components/useNow'

// One day on the public programme, which knows whether its day has been.
//
// Jon, 19 Sep 2026 (the Saturday): "Friday happened. So just have it say
// Friday with a strike through." Then, that evening: "Saturday is over. The
// program should tuck it away and just keep the link to saturday on the page."
// Then, looking at it: "No, remove Saturday now, it's over."
//
// So a finished day is not a struck heading, and not a heading with a link
// hung off it either. It is nothing at all. The festival is down to Sunday,
// and the programme should look like a festival with one day left rather than
// a festival with one day left and two epitaphs above it.
//
// The day's own page is untouched — /programme/saturday still works for anyone
// holding the link. It just isn't advertised here any more.
//
// The listings are dropped here rather than upstream because this is the only
// place that knows the time. The cards are still rendered on the server and
// handed in as children: that keeps this page a mostly-server page, and it
// means a reader with JavaScript off sees the whole programme rather than a
// blank space.
//
// The flip is on a clock, not a deploy: the day removes itself the moment its
// last listing ends. Nobody has to be awake to make the site truthful.
//
// Until hydration — and with JavaScript off — the day renders in full. That is
// the safe direction to be wrong in: a festival that hasn't dropped a day yet
// reads as normal, where one that dropped the wrong day reads as broken.

export default function ProgrammeDaySection({
  day,
  date,
  /** ISO instant the day's programme is over — see dayFinishesAt. */
  endsAt,
  children,
}: {
  day: string
  date: string
  endsAt: string
  children: React.ReactNode
}) {
  const now = useNow()
  const past = now !== null && now >= Date.parse(endsAt)

  // The whole section, wrapper included: an empty <div> left behind in the
  // day list would still carry its share of the spacing between days, which
  // reads as a hole where Saturday used to be.
  if (past) return null

  return (
    <div id={day.toLowerCase()} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
        <h2 className="text-3xl font-extrabold" style={{ color: 'var(--wpf-ink)' }}>
          {/* The heading is the way into the day's own page — one flat list of
              everything on, which is what you want on the day itself.
              Underlined at rest, not only on hover: a bare heading does not look
              like a link, and on a phone there is no hover to discover it
              with. */}
          <Link
            href={`/programme/${day.toLowerCase()}`}
            className="wpf-btn-focus underline underline-offset-8"
            style={{
              // Pink, not gold: pink is the site's action colour, and a gold
              // rule on the cream background was too quiet to read as a link at
              // all. Thick enough to survive under bold 3xl type.
              textDecorationThickness: '5px',
              textDecorationColor: 'var(--wpf-pink)',
            }}
          >
            {day}
          </Link>
        </h2>
        <span className="text-sm font-bold uppercase tracking-widest wpf-text-muted">{date}</span>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}
