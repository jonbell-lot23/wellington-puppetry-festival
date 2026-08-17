import Image from 'next/image'
import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import { teReo } from '@/lib/tereo'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = { title: 'Support us' }

// Reached from the "You!" tile on the sponsor wall. Deliberately honest that
// the donation paperwork isn't ready yet — an empty "donate" form or a dead
// button would be worse than saying so and giving people an address.

export default async function SupportPage() {
  const [c, contact, alt] = await Promise.all([
    getPageContent('support'),
    getPageContent('contact'),
    getPageContent('image-alt-text'),
  ])

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/gallery/wpf-gallery-064.jpg"
              alt={alt.supportPhoto}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="wpf-section-heading text-2xl md:text-3xl mb-4">{c.bodyHeading}</h2>
            <p className="wpf-text-muted leading-relaxed mb-4">{teReo(c.body1)}</p>
            {c.body2 && <p className="wpf-text-muted leading-relaxed">{teReo(c.body2)}</p>}

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="wpf-btn-primary wpf-btn-focus inline-block mt-7 px-7 py-3.5"
              >
                {c.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
