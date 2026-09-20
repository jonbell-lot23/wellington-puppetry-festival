import Link from 'next/link'

// One day on the public programme: its heading, which is also the way into the
// day's own page, and the strand cards for that day.
//
// This component briefly knew the time. Through the festival weekend a day
// removed itself the moment its last listing finished — Friday went on the
// Saturday morning, Saturday went at 9:30pm when the Cabaret ended — so that
// someone looking at the site on the day saw only what they could still get to.
//
// Jon, 20 Sep 2026: "the days should all be there, nothing dimmed." The
// festival is over, and a programme that hides the days it has had is no longer
// helping anyone decide anything; it is just an incomplete record. So the clock
// is gone, every day renders, and a finished day looks exactly like any other —
// no strike-through, no grey, no epitaph. Nothing here needs to know what time
// it is, which makes this a server component again.

export default function ProgrammeDaySection({
  day,
  date,
  children,
}: {
  day: string
  date: string
  children: React.ReactNode
}) {
  return (
    <div id={day.toLowerCase()} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
        <h2 className="text-3xl font-extrabold" style={{ color: 'var(--wpf-ink)' }}>
          {/* The heading is the way into the day's own page — one flat list of
              everything that was on that day. Underlined at rest, not only on
              hover: a bare heading does not look like a link, and on a phone
              there is no hover to discover it with. */}
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
