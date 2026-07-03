import Link from 'next/link'
import { getPageContent } from '@/app/actions'
import SignupForm from '@/components/SignupForm'
import WaveDivider from '@/components/WaveDivider'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const revalidate = 60

const CREAM = 'var(--wpf-cream)'
const GREEN_DEEP = 'var(--wpf-green-deep)'
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
        style={{
          clipPath: 'polygon(0 24px, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center" style={{ color: INK }}>
          <p className="uppercase tracking-widest text-xs md:text-sm font-bold opacity-70 mb-4">
            {c.heroKicker}
          </p>
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight text-balance">
            {c.heroTitle}
          </h1>
          <p className="mt-4 text-lg md:text-xl font-bold tracking-wide" style={{ color: 'var(--wpf-orange-deep)' }}>
            {c.heroDates}
          </p>
          <p className="mt-6 opacity-80 leading-relaxed max-w-2xl text-balance">{c.heroTagline}</p>

          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={c.ticketsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full text-white font-bold text-base px-8 py-4 hover:brightness-110 transition"
              style={{ backgroundColor: GREEN_DEEP }}
            >
              Get Tickets
            </a>
            <Link
              href="/program"
              className="inline-block rounded-full border-2 font-bold text-base px-8 py-4 hover:bg-black/5 transition"
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
      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-4xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl" style={{ backgroundColor: 'var(--wpf-green-deep)' }}>
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <ImagePlaceholder className="w-24 h-24 text-white" />
            </div>
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

      <WaveDivider fromColor="var(--wpf-cream)" toColor="var(--wpf-green-deep)" />

      {/* Newsletter + sponsors — same green section carrying straight on,
          matching the reference site's combined footer-ish block. Deep
          green here (rather than yellow) keeps a warm colour rhythm down
          the page instead of an all-yellow wash. */}
      <section className="px-6 py-16 md:py-20" style={{ backgroundColor: GREEN_DEEP }}>
        <div className="mx-auto max-w-3xl text-center text-white mb-16">
          <h2 className="font-extrabold text-2xl md:text-4xl mb-3">{c.newsletterHeading}</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">{c.newsletterSubtext}</p>
          <div className="flex justify-center">
            <SignupForm />
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <p className="text-center text-white/70 text-xs uppercase tracking-widest font-semibold mb-8">
            {c.sponsorsCaption}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center">
            {SPONSORS.map((name) => (
              <div
                key={name}
                className="h-16 rounded-lg border border-dashed border-white/40 flex flex-col items-center justify-center gap-1 px-3 text-center"
                title="Placeholder — swap in real sponsor logo"
              >
                <ImagePlaceholder className="w-4 h-4 text-white/60" />
                <span className="text-white/70 text-[10px] font-medium leading-tight">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/50 text-[11px] mt-4">
            Placeholder sponsor slots — logos to be supplied.
          </p>
        </div>
      </section>

      {/* Gallery — carried over from the previous site's brief ("the gallery
          at the bottom is good, keep it"); rebuilt here as a photo grid using
          existing festival imagery. */}
      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-extrabold text-2xl md:text-4xl mb-10" style={{ color: 'var(--wpf-green-deep)' }}>
            {c.galleryHeading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg flex flex-col items-center justify-center gap-2 border border-dashed"
                style={{ borderColor: 'var(--wpf-green-deep)', opacity: 0.6 }}
              >
                <ImagePlaceholder className="w-8 h-8" style={{ color: 'var(--wpf-green-deep)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--wpf-green-deep)' }}>
                  Photos coming soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
