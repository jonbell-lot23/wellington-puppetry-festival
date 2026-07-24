import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import { parseSchedule, VENUES, type VenueKey } from '@/lib/schedule'

export const revalidate = 60

// The schedule itself is edited in /admin ("Programme — Schedule") and stored
// as JSON under the 'program-schedule' slug; defaults live in lib/schedule.ts.
//
// Each day is a single time-sorted list (not grouped by venue) so visitors
// can scan "what's on next"; the venue is a coloured chip on each row.

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 shrink-0"
      style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: 'var(--wpf-ink)' }}
    >
      {children}
    </span>
  )
}

function VenueChip({ venue }: { venue: VenueKey }) {
  const v = VENUES[venue] ?? VENUES.hall
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 shrink-0 border border-black/10"
      style={{ backgroundColor: v.bg, color: 'var(--wpf-ink)' }}
    >
      {v.label}
    </span>
  )
}

export default async function ProgramPage() {
  const [c, sched] = await Promise.all([
    getPageContent('program'),
    getPageContent('program-schedule'),
  ])
  const schedule = parseSchedule(sched.scheduleJson)

  // Day cards — names/colours fixed here; date/title/body come from /admin.
  const DAYS = [
    { day: 'Friday', date: c.day1Date, title: c.day1Title, body: c.day1Body, highlight: false, href: '#friday' },
    { day: 'Saturday', date: c.day2Date, title: c.day2Title, body: c.day2Body, highlight: true, href: '#saturday' },
    { day: 'Sunday', date: c.day3Date, title: c.day3Title, body: c.day3Body, highlight: false, href: '#sunday' },
  ]

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {DAYS.map((d) => (
            <a
              key={d.day}
              href={d.href}
              className={`rounded-2xl p-7 flex flex-col transition-transform hover:-translate-y-1 ${
                d.highlight
                  ? 'text-white'
                  : 'bg-[var(--wpf-yellow-soft)] border border-black/5'
              }`}
              style={d.highlight ? { backgroundColor: 'var(--wpf-pink)' } : { color: 'var(--wpf-ink)' }}
            >
              {d.highlight && (
                <span className="self-start text-[11px] font-bold uppercase tracking-widest bg-white/20 rounded-full px-3 py-1 mb-4">
                  Free entry
                </span>
              )}
              <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">{d.date}</p>
              <h3 className="text-2xl font-extrabold mb-3">{d.day} — {d.title}</h3>
              <p className={`leading-relaxed ${d.highlight ? 'text-white/90' : 'wpf-text-muted'}`}>{d.body}</p>
            </a>
          ))}
        </div>

        {/* Full weekend schedule — one time-sorted list per day */}
        <div className="mx-auto max-w-5xl mt-20 space-y-16">
          {schedule.map((day) => (
            <div key={day.id} id={day.id} className="scroll-mt-24">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-3xl font-extrabold" style={{ color: 'var(--wpf-ink)' }}>
                  {day.day}
                </h2>
                <span className="text-sm font-bold uppercase tracking-widest wpf-text-muted">
                  {day.date}
                </span>
              </div>

              <div className="space-y-6">
                {day.parts.map((part, pi) => (
                  <div key={pi}>
                    {part.label && (
                      <h3 className="text-sm font-bold uppercase tracking-widest wpf-text-muted mb-3">
                        {part.label}
                      </h3>
                    )}
                    <ul
                      className="rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden"
                      style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}
                    >
                      {part.events
                        .filter((ev) => ev.title?.trim())
                        .map((ev, i) => (
                          <li key={i} className="px-5 py-3.5 flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2">
                            <div className="shrink-0 w-32">
                              <p className="text-sm font-bold" style={{ color: 'var(--wpf-ink)' }}>
                                {ev.time}
                              </p>
                              {ev.age && (
                                <p className="text-xs font-bold wpf-text-muted">Ages: {ev.age}</p>
                              )}
                            </div>
                            {ev.image?.trim() && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={ev.image}
                                alt={ev.title}
                                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-black/10"
                              />
                            )}
                            <div className="flex-1 min-w-0 basis-full sm:basis-auto order-last sm:order-none">
                              <p className="font-bold" style={{ color: 'var(--wpf-ink)' }}>
                                {ev.title}
                                {ev.by && <span className="font-semibold wpf-text-muted"> · {ev.by}</span>}
                              </p>
                              {ev.duration && <p className="text-sm wpf-text-muted">{ev.duration}</p>}
                              {ev.detail && <p className="text-sm wpf-text-muted">{ev.detail}</p>}
                            </div>
                            <div className="flex items-center gap-1.5 ml-auto">
                              {ev.note && <Chip>{ev.note}</Chip>}
                              <VenueChip venue={ev.venue} />
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className="text-center text-sm wpf-text-muted">
            Programme details may shift a little as the festival comes together — check back closer to the weekend.
          </p>
        </div>
      </section>
    </main>
  )
}
