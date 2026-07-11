import Link from 'next/link'
import Image from 'next/image'
import { getPageContent } from '@/app/actions'
import SignupForm from '@/components/SignupForm'
import WaveDivider from '@/components/WaveDivider'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const revalidate = 60

const CREAM = 'var(--wpf-cream)'
const BLUE_SOFT = 'var(--wpf-blue-soft)'
const BLUE_DEEP = 'var(--wpf-blue-deep)'
const INK = 'var(--wpf-ink)'

const SPONSORS = [
  'Creative NZ',
  'Wellington City Council',
  'BATS Theatre',
  'Toi Poneke',
  'Circa Theatre',
  'Absolutely Positively Wellington',
]

export default async function HomePage() {
  const c = await getPageContent('homepage')

  return (
    <main style={{ backgroundColor: CREAM }}>
      <section className="wpf-sunburst relative px-6 pt-14 pb-16 md:pt-20 md:pb-20" style={{ color: INK }}>
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <p className="wpf-section-kicker mb-3">{c.heroKicker}</p>
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-balance tracking-tight">
            {c.heroTitle}
          </h1>
          <p className="mt-3 text-lg md:text-xl font-extrabold tracking-wide" style={{ color: 'var(--wpf-blue)' }}>
            {c.heroDates}
          </p>
          <p className="mt-5 wpf-text-muted leading-relaxed max-w-2xl text-balance text-base md:text-lg">
            {c.heroTagline}
          </p>

          <figure className="mt-8 w-full max-w-md">
            <div
              className="relative aspect-[16/9] w-full rounded-2xl border-2 border-t-[3px] bg-white/55 flex items-center justify-center overflow-hidden shadow-sm"
              style={{ borderColor: INK, borderTopColor: 'var(--wpf-pink)' }}
            >
              <ImagePlaceholder className="w-14 h-14" style={{ color: INK }} />
            </div>
            <figcaption className="mt-2.5 wpf-section-kicker text-[10px] md:text-xs opacity-70">
              Festival logo — placeholder
            </figcaption>
          </figure>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <a
              href="https://events.humanitix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="wpf-btn-primary wpf-btn-focus text-base px-8 py-3.5"
            >
              Get Tickets
            </a>
            <Link
              href="/program"
              className="wpf-btn-secondary wpf-btn-focus text-base px-8 py-3.5"
            >
              See the Programme
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: BLUE_SOFT }}>
        <div className="mx-auto max-w-4xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-md" style={{ backgroundColor: BLUE_DEEP }}>
            <Image
              src="/images/gallery/wpf-gallery-047.jpg"
              alt="Community day — kids activities"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--wpf-blue-deep)]/85 via-[var(--wpf-blue-deep)]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="wpf-section-kicker mb-2" style={{ color: 'var(--wpf-yellow)' }}>Community day</p>
              <h2 className="wpf-section-heading text-3xl md:text-5xl" style={{ color: 'var(--wpf-yellow)' }}>
                {c.kidsHeading}
              </h2>
            </div>
          </div>
          <p className="mt-7 text-center max-w-2xl mx-auto leading-relaxed wpf-text-muted text-base md:text-lg">
            {c.kidsBody}
          </p>
        </div>
      </section>

      <WaveDivider fromColor={BLUE_SOFT} toColor={BLUE_DEEP} />

      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: BLUE_DEEP, color: '#ffffff' }}>
        <div className="mx-auto max-w-3xl text-center mb-14 md:mb-16">
          <h2 className="wpf-section-heading wpf-section-heading--on-dark text-2xl md:text-4xl mb-3">
            {c.newsletterHeading}
          </h2>
          <p className="wpf-text-muted-on-dark mb-8 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {c.newsletterSubtext}
          </p>
          <SignupForm />
        </div>

        <div className="mx-auto max-w-5xl pt-2 border-t border-white/12">
          <p className="text-center wpf-text-muted-on-dark text-xs uppercase tracking-widest font-semibold mb-8">
            {c.sponsorsCaption}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 md:gap-6 items-center">
            {SPONSORS.map((name) => (
              <div
                key={name}
                className="h-16 rounded-lg border border-dashed border-white/25 flex flex-col items-center justify-center gap-1 px-3 text-center bg-white/5"
                title="Placeholder — swap in real sponsor logo"
              >
                <ImagePlaceholder className="w-4 h-4 text-white/50" />
                <span className="text-white/70 text-[10px] font-medium leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fromColor={BLUE_DEEP} toColor={CREAM} />

      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="wpf-section-heading wpf-section-heading--pink text-center text-2xl md:text-4xl mb-10 md:mb-12">
            {c.galleryHeading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {['wpf-gallery-01.jpg', 'wpf-gallery-09.jpg', 'wpf-gallery-045.jpg', 'wpf-gallery-064.jpg', 'wpf-gallery-077.jpg', 'wpf-gallery-086.jpg', 'wpf-gallery-102.jpg', 'wpf-gallery-106.jpg'].map((img) => (
              <div
                key={img}
                className="wpf-gallery-tile relative aspect-square rounded-lg overflow-hidden shadow-sm"
              >
                <Image
                  src={`/images/gallery/${img}`}
                  alt="Wellington Puppetry Festival 2024"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
