import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

export default async function VolunteersPage() {
  const c = await getPageContent('volunteers')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-2xl p-8 md:p-10 text-center"
            style={{ backgroundColor: 'var(--wpf-blue-deep)', color: '#ffffff' }}
          >
            <h3 className="font-extrabold text-xl md:text-2xl mb-2">Keen to get involved?</h3>
            <p className="mb-5">Get in touch and we&apos;ll let you know how to sign up.</p>
            <a
              href="/contact"
              className="wpf-btn-primary wpf-btn-focus px-7 py-3.5"
              style={{ backgroundColor: 'var(--wpf-yellow)', color: 'var(--wpf-ink)' }}
            >
              Contact the team
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
