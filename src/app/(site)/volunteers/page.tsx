import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

const ROLES = [
  { title: 'Front of house', body: 'Welcome visitors, help with tickets and answer questions at venues.' },
  { title: 'Saturday kids\' activities', body: 'Support our free family day — hands-on puppet-making, games and shows.' },
  { title: 'Bump-in / bump-out', body: 'Help set up and pack down venues before and after the festival.' },
  { title: 'General festival support', body: 'Runners, ushers, and extra hands wherever they\'re needed most.' },
]

export default async function VolunteersPage() {
  const c = await getPageContent('volunteers')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="wpf-section-heading text-2xl md:text-3xl mb-6">Ways to help</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ROLES.map((r) => (
              <div key={r.title} className="rounded-xl bg-[var(--wpf-yellow-soft)] p-6 border border-black/5">
                <h3 className="font-bold mb-2" style={{ color: 'var(--wpf-ink)' }}>{r.title}</h3>
                <p className="wpf-text-muted text-sm leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-10 rounded-2xl p-8 md:p-10 text-center"
            style={{ backgroundColor: 'var(--wpf-blue-deep)', color: '#ffffff' }}
          >
            <h3 className="font-extrabold text-xl md:text-2xl mb-2">Keen to get involved?</h3>
            <p className="mb-5">Get in touch and we&apos;ll let you know how to sign up.</p>
            <a
              href="/contact"
              className="wpf-btn-primary wpf-btn-focus px-7 py-3.5"
            >
              Contact the team
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
