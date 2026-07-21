import Image from 'next/image'
import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

export default async function AboutPage() {
  const c = await getPageContent('about')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/gallery/wpf-gallery-077.jpg"
              alt="Wellington Puppetry Festival"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="wpf-section-heading text-2xl md:text-3xl mb-4">
              Made by the community, for the community
            </h2>
            <p className="wpf-text-muted leading-relaxed mb-4">
              WPF is run by Birdlife Productions with the help of local volunteers, artists and venues
              across Pōneke Wellington. It exists to make puppetry — one of the oldest, strangest and
              most joyful art forms — accessible to everyone, especially families who might not
              otherwise get to a theatre show.
            </p>
            <p className="wpf-text-muted leading-relaxed">
              That&apos;s why Saturday is free: no ticket, no barrier, just turn up and join in.
            </p>
          </div>
        </div>
      </section>

      {/* Rose Beauchamp — full-width text box, archive images in a row beneath */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl p-8 md:p-12 border border-black/5" style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}>
            <Image
              src="/images/rose.png"
              alt="Rose Beauchamp, founder of Wellington's puppet festivals"
              width={454}
              height={688}
              className="float-left mr-6 mb-4 w-48 md:w-64 h-auto rounded-xl shadow-sm"
            />
            <p className="wpf-section-kicker mb-3">In the footsteps of Rose Beauchamp</p>
            <p className="wpf-text-muted leading-relaxed mb-4">
              Wellington&apos;s love of puppetry owes an enormous amount to Rose Beauchamp. A pianist
              who never set out to become a puppeteer, Rose fell for the art form and went on to help
              organise the very first national puppet festival — the NZ Puppet Parade that filled
              Lambton Quay in 1986.
            </p>
            <p className="wpf-text-muted leading-relaxed mb-6">
              She turned shadows into art, and art into activism: her internationally renowned shadow
              puppetry made audiences laugh and cry, but also educated and spoke out against the
              injustice she saw in the world. The Wellington Puppetry Festival carries that spirit
              forward — puppetry for everyone, in the city she helped fall in love with the art.
            </p>
            <blockquote className="border-l-4 pl-5 italic leading-relaxed" style={{ borderColor: 'var(--wpf-pink)', color: 'var(--wpf-ink)' }}>
              &ldquo;Puppets are exciting, they make us laugh, and understand other cultures as well as
              enriching our own lives.&rdquo;
              <footer className="mt-2 text-sm not-italic wpf-text-muted">— Rose Beauchamp</footer>
            </blockquote>
          </div>

          {/* Archive images at their natural aspect ratios, in a row beneath */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {[
              { src: '/images/original-flyer.png', alt: 'Original Wellington puppet festival flyer', w: 632, h: 928 },
              { src: '/images/first-parade.png', alt: 'The first NZ Puppet Parade, Lambton Quay 1986', w: 644, h: 810 },
              { src: '/images/stilts.png', alt: 'Stilt performers at an early puppet festival', w: 528, h: 778 },
              { src: '/images/beach.png', alt: 'Puppetry on the beach', w: 468, h: 748 },
            ].map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
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
