import Link from 'next/link'
import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

export default async function ArtistsPage() {
  const c = await getPageContent('artists')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="rounded-2xl px-8 py-12 md:py-16"
            style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}
          >
            <p className="text-5xl mb-6">🎭</p>
            <h2 className="font-extrabold text-2xl md:text-3xl mb-4" style={{ color: 'var(--wpf-ink)' }}>
              Artists to be announced
            </h2>
            <p className="leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'var(--wpf-ink)', opacity: 0.7 }}>
              The 2026 line-up is being confirmed now. Sign up to our newsletter to hear about artists
              and shows as they're announced.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full font-bold px-7 py-3.5 text-white hover:brightness-110 transition"
              style={{ backgroundColor: 'var(--wpf-green-deep)' }}
            >
              Sign up for updates
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
