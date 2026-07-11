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
    </main>
  )
}
