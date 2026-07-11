import Link from 'next/link'
import Image from 'next/image'
import { getPageContent } from '@/app/actions'
import SignupForm from '@/components/SignupForm'
import WaveDivider from '@/components/WaveDivider'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const revalidate = 60

const CREAM = 'var(--wpf-cream)'
const MINT = 'var(--wpf-mint)'
const ORANGE_BRIGHT = 'var(--wpf-orange-bright)'
const PINK = 'var(--wpf-pink)'
const INK = 'var(--wpf-ink)'

// Placeholder sponsor slots — swap logos in as they're confirmed.
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
      {/* Warm sunburst intro band — continues the hero artwork's radiating
          rays as a subtle repeating-conic-gradient texture instead of a
          flat colour block, angled top edge cloned from the reference
          site's shape language. */}
      <section
        className="wpf-sunburst relative px-6 pt-16 pb-20 md:pt-24 md:pb-28"
      >
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center" style={{ color: INK }}>
          <p className="wpf-pink-kicker uppercase tracking-widest text-xs md:text-sm font-bold mb-4">
            {c.heroKicker}
          </p>
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight text-balance">
            {c.heroTitle}
          </h1>
          <p className="mt-4 text-lg md:text-xl font-bold tracking-wide" style={{ color: 'var(--wpf-orange-deep)' }}>
            {c.heroDates}
          </p>
          <p className="mt-6 opacity-80 leading-relaxed max-w-2xl text-balance">{c.heroTagline}</p>

          {/* PLACEHOLDER hero image — swap this framed box for the real
              festival logo / hero artwork once supplied. The client is drawn
              in by imagery more than words, so this anchors the hero visually.
              Uses the shared ImagePlaceholder with a warm cream/translucent
              frame to fit the circus-poster aesthetic. */}
          <figure className="mt-9 w-full max-w-md">
            <div
              className="relative aspect-[16/9] w-full rounded-2xl border-2 border-t-[3px] bg-white/60 backdrop-blur-sm flex items-center justify-center overflow-hidden"
              style={{ borderColor: INK, borderTopColor: 'var(--wpf-pink)' }}
            >
              <ImagePlaceholder className="w-14 h-14" style={{ color: INK }} />
            </div>
            <figcaption className="mt-2 text-xs font-bold uppercase tracking-widest opacity-60">
              Festival logo — placeholder
            </figcaption>
          </figure>

          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://events.humanitix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="wpf-btn-focus inline-block rounded-full text-white font-bold text-base px-8 py-4 hover:brightness-110 transition"
              style={{ backgroundColor: PINK }}
            >
              Get Tickets
            </a>
            <Link
              href="/program"
              className="wpf-btn-focus inline-block rounded-full border-2 font-bold text-base px-8 py-4 hover:bg-black/5 transition hover:border-[var(--wpf-pink)]"
              style={{ borderColor: INK, color: INK }}
            >
              See the Programme
            </Link>
          </div>
        </div>
      </section>

      {/* Saturday free kids activities — the front-and-centre message from
          the meeting notes, treated like the reference site's big central
          media moment ("ONE POWERFUL CELEBRATION" video block). */}
      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: MINT }}>
        <div className="mx-auto max-w-4xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl" style={{ backgroundColor: ORANGE_BRIGHT }}>
            <Image
              src="/images/gallery/wpf-gallery-047.jpg"
              alt="Community day — kids activities"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="text-white/80 uppercase tracking-widest text-xs md:text-sm font-bold mb-2">
                Community day
              </p>
              <h2 className="text-white font-extrabold text-3xl md:text-5xl leading-tight text-balance">
                {c.kidsHeading}
              </h2>
            </div>
          </div>
          <p className="mt-6 text-center max-w-2xl mx-auto leading-relaxed" style={{ color: INK, opacity: 0.75 }}>
            {c.kidsBody}
          </p>
        </div>
      </section>

      <WaveDivider fromColor="var(--wpf-mint)" toColor="var(--wpf-orange-bright)" />

      {/* Newsletter + sponsors — vibrant pumpkin-orange block (was deep
          green). Bright orange is too light for white text at AA, so this
          section runs on dark ink text instead (ink on orange ≈ 4.51:1). */}
      <section className="px-6 py-16 md:py-20" style={{ backgroundColor: ORANGE_BRIGHT, color: INK }}>
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="font-extrabold text-2xl md:text-4xl mb-3">{c.newsletterHeading}</h2>
          <p className="opacity-80 mb-8 max-w-xl mx-auto">{c.newsletterSubtext}</p>
          <div className="flex justify-center">
            <SignupForm />
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <p className="text-center opacity-70 text-xs uppercase tracking-widest font-semibold mb-8">
            {c.sponsorsCaption}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center">
            {SPONSORS.map((name) => (
              <div
                key={name}
                className="h-16 rounded-lg border border-dashed border-black/25 flex flex-col items-center justify-center gap-1 px-3 text-center"
                title="Placeholder — swap in real sponsor logo"
              >
                <ImagePlaceholder className="w-4 h-4 text-black/40" />
                <span className="text-black/60 text-[10px] font-medium leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fromColor="var(--wpf-orange-bright)" toColor="var(--wpf-cream)" />

      {/* Gallery — carried over from the previous site's brief ("the gallery
          at the bottom is good, keep it"); rebuilt here as a photo grid using
          existing festival imagery. */}
      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-extrabold text-2xl md:text-4xl mb-10" style={{ color: PINK }}>
            {c.galleryHeading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {['wpf-gallery-01.jpg', 'wpf-gallery-09.jpg', 'wpf-gallery-045.jpg', 'wpf-gallery-064.jpg', 'wpf-gallery-077.jpg', 'wpf-gallery-086.jpg', 'wpf-gallery-102.jpg', 'wpf-gallery-106.jpg'].map((img) => (
              <div
                key={img}
                className="relative aspect-square rounded-lg overflow-hidden"
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
