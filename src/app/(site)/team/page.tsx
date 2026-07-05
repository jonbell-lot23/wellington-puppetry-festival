import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

export default async function TeamPage() {
  const c = await getPageContent('team')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="rounded-2xl px-8 py-12 md:py-16"
            style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}
          >
            <p className="text-5xl mb-6">🪆</p>
            <h2 className="font-extrabold text-2xl md:text-3xl mb-4" style={{ color: 'var(--wpf-ink)' }}>
              Team bios coming soon
            </h2>
            <p className="leading-relaxed max-w-md mx-auto" style={{ color: 'var(--wpf-ink)', opacity: 0.7 }}>
              Wellington Puppetry Festival is organised by a small, dedicated team. Full bios and credits
              will be listed here as the festival approaches.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
