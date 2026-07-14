import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

const DAYS = [
  {
    day: 'Friday',
    date: '18 Sep 2026',
    title: 'Opening Night',
    body: 'Festival kick-off with an evening showcase of visiting and local puppetry companies.',
    highlight: false,
  },
  {
    day: 'Saturday',
    date: '19 Sep 2026',
    title: 'Free Family Day',
    body: 'A full day of FREE drop-in puppet-making, street performances and shows for kids and whānau. No ticket required.',
    highlight: true,
  },
  {
    day: 'Sunday',
    date: '20 Sep 2026',
    title: 'Festival Shows + Cabaret',
    body: 'Daytime programme continues, closing with WPF Cabaret in the evening — see the Cabaret page for details.',
    highlight: false,
  },
]

const SKELETON_SHOWS = [
  { time: '10:00am', venue: 'BATS Theatre' },
  { time: '11:30am', venue: 'Toi Poneke' },
  { time: '1:00pm', venue: 'BATS Theatre' },
  { time: '2:30pm', venue: 'Circa Theatre' },
  { time: '4:00pm', venue: 'Toi Poneke' },
  { time: '7:30pm', venue: 'BATS Theatre' },
]

export default async function ProgramPage() {
  const c = await getPageContent('program')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {DAYS.map((d) => (
            <div
              key={d.day}
              className={`rounded-2xl p-7 flex flex-col ${
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
            </div>
          ))}
        </div>

        {/* Skeleton programme */}
        <div className="mx-auto max-w-5xl mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-xl" style={{ color: 'var(--wpf-ink)' }}>
              Saturday 19 Sep — Show by Show
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1" style={{ backgroundColor: 'var(--wpf-yellow)', color: 'var(--wpf-ink)' }}>
              Coming soon 🎭
            </span>
          </div>

          <div className="space-y-3">
            {SKELETON_SHOWS.map((show, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex items-center gap-4 border border-black/5 animate-pulse"
                style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}
              >
                <span className="text-sm font-bold shrink-0 w-16 opacity-50" style={{ color: 'var(--wpf-ink)' }}>
                  {show.time}
                </span>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 rounded-full w-2/3" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
                  <div className="h-2.5 rounded-full w-1/3" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
                </div>
                <span className="text-xs opacity-40 shrink-0 hidden sm:block" style={{ color: 'var(--wpf-ink)' }}>
                  {show.venue}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-sm wpf-text-muted">
            The puppets are rehearsing. The venues are ready. The programme drops soon — we promise it&apos;ll be worth the wait.
          </p>
        </div>
      </section>
    </main>
  )
}
