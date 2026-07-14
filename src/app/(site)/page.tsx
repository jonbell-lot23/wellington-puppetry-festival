import Link from 'next/link'
import Image from 'next/image'
import { getPageContent } from '@/app/actions'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const revalidate = 60

const CREAM = 'var(--wpf-cream)'
const GREEN_VIVID = 'var(--wpf-blue)'      // #5ec20f — vivid brand green
const GREEN_DEEP = 'var(--wpf-blue-deep)'  // #2d6c0a — deep forest green
const CABARET_BG = 'var(--wpf-maroon)'     // #271620 — same moody dark as cabaret page
const INK = 'var(--wpf-ink)'

const SPONSORS = [
  { name: 'Creative NZ', logo: '/images/sponsor-creativenz.png' },
  { name: 'Wellington City Council', logo: '/images/sponsor-wcc.svg' },
  { name: 'BATS Theatre', logo: '/images/sponsor-bats.png' },
  { name: 'Toi Poneke', logo: null },
  { name: 'Circa Theatre', logo: '/images/sponsor-circa.png' },
]

export default async function HomePage() {
  const c = await getPageContent('homepage')

  return (
    <main style={{ backgroundColor: CREAM }}>

      {/* Hero — logo sits at top, overlapping upward into the white header */}
      <section className="wpf-sunburst relative px-6 pt-14 pb-16 md:pt-20 md:pb-20 overflow-x-clip" style={{ color: INK }}>

        {/* Left photo collage — xl+: full 3-photo spread in the gutter */}
        <div aria-hidden className="hidden xl:block pointer-events-none select-none">
          <div className="absolute left-[5%] top-14 w-40 rotate-[-11deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-01.jpg" alt="" fill className="object-cover" sizes="160px" /></div>
          </div>
          <div className="absolute left-[13%] top-56 w-40 rotate-[8deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-086.jpg" alt="" fill className="object-cover" sizes="160px" /></div>
          </div>
          <div className="absolute left-[4%] top-[24rem] w-40 rotate-[-5deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-045.jpg" alt="" fill className="object-cover" sizes="160px" /></div>
          </div>
        </div>

        {/* Left photo collage — lg only: 2 photos peeking from the edge */}
        <div aria-hidden className="hidden lg:block xl:hidden pointer-events-none select-none">
          <div className="absolute left-0 top-14 w-28 rotate-[-11deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-01.jpg" alt="" fill className="object-cover" sizes="112px" /></div>
          </div>
          <div className="absolute left-3 top-52 w-28 rotate-[8deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-086.jpg" alt="" fill className="object-cover" sizes="112px" /></div>
          </div>
        </div>

        {/* Left photo collage — mobile: 2 photos barely hanging off left edge */}
        <div aria-hidden className="block lg:hidden pointer-events-none select-none">
          <div className="absolute left-0 -translate-x-[62%] top-10 w-20 rotate-[-13deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-01.jpg" alt="" fill className="object-cover" sizes="80px" /></div>
          </div>
          <div className="absolute left-0 -translate-x-[58%] top-44 w-20 rotate-[11deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-086.jpg" alt="" fill className="object-cover" sizes="80px" /></div>
          </div>
        </div>

        {/* Right photo collage — xl+: full 3-photo spread */}
        <div aria-hidden className="hidden xl:block pointer-events-none select-none">
          <div className="absolute right-[5%] top-14 w-40 rotate-[10deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-064.jpg" alt="" fill className="object-cover" sizes="160px" /></div>
          </div>
          <div className="absolute right-[13%] top-56 w-40 rotate-[-9deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-077.jpg" alt="" fill className="object-cover" sizes="160px" /></div>
          </div>
          <div className="absolute right-[4%] top-[24rem] w-40 rotate-[4deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-102.jpg" alt="" fill className="object-cover" sizes="160px" /></div>
          </div>
        </div>

        {/* Right photo collage — lg only: 2 photos peeking from the edge */}
        <div aria-hidden className="hidden lg:block xl:hidden pointer-events-none select-none">
          <div className="absolute right-0 top-14 w-28 rotate-[10deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-064.jpg" alt="" fill className="object-cover" sizes="112px" /></div>
          </div>
          <div className="absolute right-3 top-52 w-28 rotate-[-9deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-077.jpg" alt="" fill className="object-cover" sizes="112px" /></div>
          </div>
        </div>

        {/* Right photo collage — mobile: 1 photo barely hanging off right edge */}
        <div aria-hidden className="block lg:hidden pointer-events-none select-none">
          <div className="absolute right-0 translate-x-[62%] top-28 w-20 rotate-[12deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-064.jpg" alt="" fill className="object-cover" sizes="80px" /></div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">

          <p className="wpf-section-kicker mb-3">{c.heroKicker}</p>
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-balance tracking-tight">
            {c.heroTitle}
          </h1>
          <p className="mt-3 text-lg md:text-xl font-extrabold tracking-wide" style={{ color: 'var(--wpf-pink)' }}>
            {c.heroDates}
          </p>
          <p className="mt-5 wpf-text-muted leading-relaxed max-w-2xl text-balance text-base md:text-lg">
            {c.heroTagline}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link
              href="/program"
              className="wpf-btn-primary wpf-btn-focus text-base px-8 py-3.5"
            >
              See the Programme
            </Link>
            <span
              className="wpf-btn-secondary text-base px-8 py-3.5 opacity-40 cursor-not-allowed"
              aria-disabled="true"
            >
              Tix on sale soon
            </span>
          </div>
        </div>
      </section>

      {/* Community Day — vivid brand green */}
      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: GREEN_VIVID }}>
        <div className="mx-auto max-w-4xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-md" style={{ backgroundColor: GREEN_DEEP }}>
            <Image
              src="/images/gallery/wpf-gallery-047.jpg"
              alt="Community day — kids activities"
              fill
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="wpf-section-kicker mb-2" style={{ color: '#ffffff' }}>Community day</p>
              <h2 className="wpf-section-heading text-3xl md:text-5xl" style={{ color: '#ffffff' }}>
                {c.kidsHeading}
              </h2>
            </div>
          </div>
          <p className="mt-7 text-center max-w-2xl mx-auto leading-relaxed text-base md:text-lg" style={{ color: '#0d2600' }}>
            {c.kidsBody}
          </p>
        </div>
      </section>

      {/* Wave: green → cabaret maroon */}
      <div aria-hidden className="relative w-full overflow-hidden leading-[0]" style={{ backgroundColor: GREEN_VIVID }}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[100px]">
          <path d="M0,55 C360,100 720,10 1080,45 C1260,65 1360,80 1440,50 L1440,100 L0,100 Z" fill={CABARET_BG} opacity="0.5" />
          <path d="M0,68 C240,108 480,8 720,42 C960,76 1200,102 1440,62 L1440,100 L0,100 Z" fill={CABARET_BG} />
        </svg>
      </div>

      {/* Evening Cabaret */}
      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: CABARET_BG }}>
        <div className="mx-auto max-w-4xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-md" style={{ backgroundColor: INK }}>
            <Image
              src="/images/cabaret-hero.jpeg"
              alt="Evening Cabaret — WPF after-dark puppetry performance"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="wpf-section-kicker mb-2" style={{ color: 'var(--wpf-pink-soft)' }}>Evening Cabaret</p>
              <h2 className="wpf-section-heading text-3xl md:text-5xl" style={{ color: '#ffffff' }}>
                {c.cabaretSectionHeading}
              </h2>
            </div>
          </div>
          <p className="mt-7 text-center max-w-2xl mx-auto leading-relaxed text-base md:text-lg" style={{ color: 'rgba(255,255,255,0.82)' }}>
            {c.cabaretSectionBody}
          </p>
        </div>
      </section>

      {/* Wave: cabaret maroon → cream */}
      <div aria-hidden className="relative w-full overflow-hidden leading-[0]" style={{ backgroundColor: CABARET_BG }}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[100px]">
          <path d="M0,55 C360,100 720,10 1080,45 C1260,65 1360,80 1440,50 L1440,100 L0,100 Z" fill={CREAM} opacity="0.4" />
          <path d="M0,65 C240,105 480,5 720,40 C960,75 1200,100 1440,60 L1440,100 L0,100 Z" fill={CREAM} />
        </svg>
      </div>

      {/* Sponsors */}
      <section className="px-6 py-14 md:py-20" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm uppercase tracking-widest font-bold mb-8" style={{ color: 'var(--wpf-pink)' }}>
            {c.sponsorsCaption}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-6 items-center">
            {SPONSORS.map((s) => (
              <div
                key={s.name}
                className="h-20 flex items-center justify-center px-3"
              >
                {s.logo ? (
                  <Image src={s.logo} alt={s.name} width={180} height={72} className="max-h-14 w-auto object-contain" />
                ) : (
                  <span className="text-xs font-medium text-center leading-tight" style={{ color: '#000000' }}>{s.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 py-16 md:py-24" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="wpf-section-heading text-center text-2xl md:text-4xl mb-10 md:mb-12" style={{ color: 'var(--wpf-blue)' }}>
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
