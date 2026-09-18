'use client'

import Link from 'next/link'

import { useNow } from '@/components/useNow'

// A day heading on the public programme that knows whether its day has been.
//
// Jon, 19 Sep 2026 (the Saturday): "Friday happened. So just have it say
// Friday with a strike through... The same thing should happen tonight at
// midnight." Then, once he saw it: drop the explanatory note, strike only the
// day name, and lose the date.
//
// So a day that has been is exactly one thing: its name, struck through and
// greyed. No date, no blurb. A finished day should take up less room than a
// day that is still to come, not the same amount with an apology attached.
//
// The flip is on a clock, not a deploy: the day strikes itself through the
// moment its date ends. Nobody has to be awake at midnight for the site to be
// truthful.
//
// The check runs in the browser. These pages are cached, so a "has Friday
// been?" decided at render time would be answered by whenever the page was
// last built rather than by when it is being read. Until hydration — and for
// anyone with JavaScript off — the heading renders plainly, which is the safe
// direction to be wrong in: a festival that hasn't struck a day through yet
// reads as normal, where one that struck the wrong day reads as broken.

export default function DayHeading({
  day,
  date,
  /** ISO instant the day is over: midnight at the end of it, NZ time. */
  endsAt,
}: {
  day: string
  date: string
  endsAt: string
}) {
  const now = useNow()
  const past = now !== null && now >= Date.parse(endsAt)

  if (past) {
    return (
      <h2
        className="text-3xl font-extrabold mb-6"
        style={{
          color: 'rgba(59,42,23,0.4)',
          textDecoration: 'line-through',
          // A 1px rule through bold display type all but disappears.
          textDecorationThickness: '3px',
        }}
      >
        {day}
      </h2>
    )
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
      <h2 className="text-3xl font-extrabold" style={{ color: 'var(--wpf-ink)' }}>
        {/* The heading is the way into the day's own page — one flat list of
            everything on, which is what you want on the day itself.
            Underlined at rest, not only on hover: a bare heading does not look
            like a link, and on a phone there is no hover to discover it
            with. */}
        <Link
          href={`/programme/${day.toLowerCase()}`}
          className="wpf-btn-focus underline underline-offset-8 hover:decoration-[var(--wpf-pink)]"
          style={{ textDecorationThickness: '4px', textDecorationColor: 'var(--wpf-yellow-deep)' }}
        >
          {day}
        </Link>
      </h2>
      <span className="text-sm font-bold uppercase tracking-widest wpf-text-muted">{date}</span>
    </div>
  )
}
