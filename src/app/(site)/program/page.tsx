import Link from 'next/link'
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
                  : 'bg-[var(--wpf-yellow-soft)] text-gray-900 border border-black/5'
              }`}
              style={d.highlight ? { backgroundColor: 'var(--wpf-blue-deep)' } : undefined}
            >
              {d.highlight && (
                <span className="self-start text-[11px] font-bold uppercase tracking-widest bg-white/20 rounded-full px-3 py-1 mb-4">
                  Free entry
                </span>
              )}
              <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">{d.date}</p>
              <h3 className="text-2xl font-extrabold mb-3">{d.day} — {d.title}</h3>
              <p className={`leading-relaxed ${d.highlight ? 'text-white/90' : 'text-gray-600'}`}>{d.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-5xl mt-10 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500 text-sm">
            Full show-by-show line-up, times and venues coming soon — this page will be updated as the
            2026 programme is confirmed.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-semibold text-[var(--wpf-ink)] underline underline-offset-2"
          >
            Sign up on the homepage for programme announcements
          </Link>
        </div>
      </section>
    </main>
  )
}
