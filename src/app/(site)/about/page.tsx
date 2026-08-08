import Image from 'next/image'
import Link from 'next/link'
import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import { teReo } from '@/lib/tereo'

export const revalidate = 60

export default async function AboutPage() {
  const c = await getPageContent('about')
  const alt = await getPageContent('image-alt-text')

  return (
    <main id="main" tabIndex={-1} style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/gallery/wpf-gallery-077.jpg"
              alt={alt.aboutPhoto}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="wpf-section-heading text-2xl md:text-3xl mb-4">
              {c.communityHeading}
            </h2>
            <p className="wpf-text-muted leading-relaxed mb-4">{teReo(c.communityBody1)}</p>
            {c.communityBody2 && (
              <p className="wpf-text-muted leading-relaxed">{teReo(c.communityBody2)}</p>
            )}
            <Link
              href="/support"
              className="wpf-btn-primary wpf-btn-focus inline-block mt-7 px-7 py-3.5"
            >
              Support the festival
            </Link>
          </div>
        </div>
      </section>

      {/* Rose Beauchamp — full-width text box, archive images in a row beneath */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl p-8 md:p-12 border border-black/5" style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}>
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
              <Image
                src="/images/rose.png"
                alt={alt.roseImage}
                width={454}
                height={688}
                className="w-48 md:w-64 h-auto rounded-xl shadow-sm shrink-0"
              />
              <div>
                <p className="wpf-section-kicker mb-3">{c.roseHeading}</p>
                <p className="wpf-text-muted leading-relaxed mb-4">{teReo(c.roseBody1)}</p>
                <p className="wpf-text-muted leading-relaxed mb-6">{teReo(c.roseBody2)}</p>
                <blockquote className="border-l-4 pl-5 italic leading-relaxed" style={{ borderColor: 'var(--wpf-pink)', color: 'var(--wpf-ink)' }}>
                  &ldquo;{c.roseQuote}&rdquo;
                  <footer className="mt-2 text-sm not-italic wpf-text-muted">{c.roseQuoteBy}</footer>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Archive images at their natural aspect ratios, in a row beneath */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {[
              { src: '/images/original-flyer.png', key: 'archiveFlyer', w: 632, h: 928 },
              { src: '/images/first-parade.png', key: 'archiveParade', w: 644, h: 810 },
              { src: '/images/stilts.png', key: 'archiveStilts', w: 528, h: 778 },
              { src: '/images/beach.png', key: 'archiveBeach', w: 468, h: 748 },
            ].map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={alt[img.key]}
                width={img.w}
                height={img.h}
                className="w-full h-auto rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
