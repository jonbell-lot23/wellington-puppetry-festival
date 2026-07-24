import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

// Full weekend programme, from Bridget's "WPF Weekend Itinerary 2026"
// spreadsheet (Jul 2026). Internal rows (set up / pack down) are omitted —
// this is the public-facing schedule. Structure lives here per the usual
// split: text tweaks in /admin, schedule changes are a code edit.

type Event = {
  time: string
  title: string
  by?: string
  duration?: string
  age?: string
  note?: string
}

type VenueBlock = {
  venue: string
  note?: string
  events: Event[]
}

type DaySchedule = {
  id: string
  day: string
  date: string
  blocks: VenueBlock[]
}

const SCHEDULE: DaySchedule[] = [
  {
    id: 'friday',
    day: 'Friday',
    date: '18 Sep',
    blocks: [
      {
        venue: 'The Hall — Opening Night',
        events: [
          { time: '6:00pm', title: 'Opening Karakia' },
          { time: '6:10pm', title: 'Introduction to Norbert', by: 'Roger' },
          { time: '6:15pm', title: 'Norbert', duration: '15 mins' },
          { time: '6:30pm', title: 'Pizza & Portrait Painter' },
          { time: '7:15pm', title: 'Sharing Circle' },
          { time: '9:15pm', title: 'Closing' },
        ],
      },
    ],
  },
  {
    id: 'saturday',
    day: 'Saturday',
    date: '19 Sep',
    blocks: [
      {
        venue: 'The Hall — Family Shows',
        events: [
          { time: '10:00am', title: 'Box of Birds', by: 'Birds', duration: '30 mins', age: '3+', note: 'BLENNZ' },
          { time: '11:00am', title: 'Migit and the Dragon', by: 'Mary', duration: '30 mins', age: '3+' },
          { time: '12:00pm', title: 'Little Top Circus', by: 'Jon', duration: '45 mins', age: '3+' },
          { time: '1:15pm', title: 'The Fish — Commission', by: 'Joey', duration: '40 mins', age: '7+' },
        ],
      },
      {
        venue: 'Upstairs — Workshops',
        events: [
          { time: '9:30am', title: 'Mechanisms', by: 'Jon', duration: '1.5 hrs', age: '14+' },
          { time: '11:50am', title: 'Bespoke Backpacks', by: 'Ally', duration: '45 mins' },
          { time: '12:15pm', title: 'Make a Puppet and Bring It to Life', by: 'Birds', duration: '1.5 hrs' },
        ],
      },
      {
        venue: 'The Green — Free KidsZone',
        note: '10am–2pm · Wet weather venue: Ridgeway Hall',
        events: [
          { time: '10:30am', title: 'Junk Puppet Workshop' },
          { time: '12:00pm', title: 'Junk Puppet Workshop' },
          { time: 'All day', title: 'Junk games, ice cream van, roaming puppeteers & musicians' },
        ],
      },
      {
        venue: 'The Hall — Saturday Evening',
        events: [
          { time: '6:00pm', title: 'The Fish — Commission', by: 'Joey', duration: '40 mins' },
          { time: '6:45pm', title: 'Pea Soup Dinner + Films' },
          { time: '7:30pm', title: 'Excerpt: Skylight', by: 'Birdlife', duration: '20 mins' },
          { time: '8:00pm', title: 'Cabaret', duration: '60 mins' },
        ],
      },
    ],
  },
  {
    id: 'sunday',
    day: 'Sunday',
    date: '20 Sep',
    blocks: [
      {
        venue: 'The Hall',
        events: [
          { time: '9:00am', title: 'Shadow Puppetry Workshop', by: 'Rowena', duration: '2.5 hrs' },
          { time: '11:15am', title: 'Puppets in Wartime', by: 'Simone', duration: '40 mins' },
          { time: '12:00pm', title: 'Night Shift', by: 'Steph', duration: '30 mins', age: '10+', note: 'PG' },
          { time: '12:30pm', title: 'Closing Circle' },
        ],
      },
      {
        venue: 'Ridgeway Hall',
        note: 'Times to be confirmed',
        events: [
          { time: 'TBC', title: 'Box of Birds', by: 'Birds', duration: '30 mins', age: '3+', note: 'BLENNZ' },
          { time: 'TBC', title: 'Little Bad Mood', by: 'Marine', duration: '20 mins', age: '5+' },
          { time: 'TBC', title: 'Paper Bag Family', by: 'Marine', duration: '45 mins', age: '5+' },
        ],
      },
      {
        venue: 'Upstairs',
        events: [{ time: 'All morning', title: 'Ad-hoc workshops & sharings' }],
      },
    ],
  },
]

function Chip({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 shrink-0"
      style={
        strong
          ? { backgroundColor: 'var(--wpf-yellow)', color: 'var(--wpf-ink)' }
          : { backgroundColor: 'rgba(0,0,0,0.06)', color: 'var(--wpf-ink)' }
      }
    >
      {children}
    </span>
  )
}

export default async function ProgramPage() {
  const c = await getPageContent('program')

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

        {/* Full weekend schedule, day by day */}
        <div className="mx-auto max-w-5xl mt-20 space-y-16">
          {SCHEDULE.map((day) => (
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
                {day.blocks.map((block) => (
                  <div
                    key={block.venue}
                    className="rounded-2xl border border-black/5 overflow-hidden"
                    style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}
                  >
                    <div className="px-5 py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1" style={{ backgroundColor: 'var(--wpf-yellow)' }}>
                      <h3 className="font-extrabold" style={{ color: 'var(--wpf-ink)' }}>
                        {block.venue}
                      </h3>
                      {block.note && (
                        <span className="text-sm font-semibold" style={{ color: 'var(--wpf-ink)', opacity: 0.75 }}>
                          {block.note}
                        </span>
                      )}
                    </div>

                    <ul className="divide-y divide-black/5">
                      {block.events.map((ev, i) => (
                        <li key={i} className="px-5 py-3.5 flex items-center gap-4">
                          <span className="text-sm font-bold shrink-0 w-24" style={{ color: 'var(--wpf-ink)' }}>
                            {ev.time}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold" style={{ color: 'var(--wpf-ink)' }}>
                              {ev.title}
                              {ev.by && <span className="font-semibold wpf-text-muted"> · {ev.by}</span>}
                            </p>
                            {ev.duration && <p className="text-sm wpf-text-muted">{ev.duration}</p>}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {ev.age && <Chip strong>{ev.age}</Chip>}
                            {ev.note && <Chip>{ev.note}</Chip>}
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
