'use client'

import { useNow } from '@/components/useNow'

// A day heading on the public programme that knows whether its day has been.
//
// Jon, 19 Sep 2026 (the Saturday): "Friday happened. So just have it say
// Friday with a strike through and a little item that says the opening event
// happened. The same thing should happen tonight at midnight, Saturday gets a
// strike through and says it was a great time."
//
// So the flip is on a clock, not on a deploy: the day strikes itself through
// the moment its date ends, and the note underneath appears with it. Nobody
// has to be awake at midnight for the site to be truthful.
//
// The check runs in the browser. These pages are cached, so a "has Friday
// been?" decided at render time would be answered by whenever the page was
// last built rather than by when it is being read. Until hydration — and for
// anyone with JavaScript off — the heading renders plainly, which is the safe
// direction to be wrong in: a festival that hasn't struck a day through yet
// reads as normal, where one that struck through the wrong day reads as broken.

export default function DayHeading({
  day,
  date,
  /** ISO instant the day is over: midnight at the end of it, NZ time. */
  endsAt,
  /** Shown once the day has been. Blank means nothing is shown. */
  pastNote,
}: {
  day: string
  date: string
  endsAt: string
  pastNote?: string
}) {
  const now = useNow()
  const past = now !== null && now >= Date.parse(endsAt)

  return (
    <>
      <div className="flex items-baseline gap-3 mb-2">
        <h2
          className="text-3xl font-extrabold"
          style={{
            color: past ? 'rgba(59,42,23,0.45)' : 'var(--wpf-ink)',
            textDecoration: past ? 'line-through' : undefined,
            // Keep the rule visibly a strike and not a stray underline at
            // small sizes, where a 1px line through bold type disappears.
            textDecorationThickness: past ? '3px' : undefined,
          }}
        >
          {day}
        </h2>
        <span
          className="text-sm font-bold uppercase tracking-widest wpf-text-muted"
          style={past ? { textDecoration: 'line-through' } : undefined}
        >
          {date}
        </span>
      </div>

      {past && pastNote?.trim() && (
        <p
          className="mb-6 inline-block rounded-full px-4 py-1.5 text-sm font-bold"
          style={{ backgroundColor: 'var(--wpf-blue-soft)', color: 'var(--wpf-ink)' }}
        >
          {pastNote}
        </p>
      )}
      {!(past && pastNote?.trim()) && <div className="mb-6" />}
    </>
  )
}
