import Link from 'next/link'
import Image from 'next/image'
import { getPageContent } from '@/app/actions'

export const revalidate = 60

const CREAM = 'var(--wpf-cream)'
const GREEN_VIVID = 'var(--wpf-blue)'      // #5ec20f — vivid brand green
const GREEN_DEEP = 'var(--wpf-blue-deep)'  // #2d6c0a — deep forest green
const CABARET_BG = 'var(--wpf-maroon)'     // #271620 — same moody dark as cabaret page
const INK = 'var(--wpf-ink)'

// Sponsor list per Bridget (Jul 2026). Logos live in /public/images/logos,
// named for the organisation. Anyone without a file yet renders as a styled
// text name via the fallback below — drop a file in and add `logo:` to swap.
//
// The school is "Ridgway", no 'e', per its own logo — Te Kura o Tawatawa /
// Ridgway School. Confirmed with Bridget, and the programme venue label now
// matches.
const SPONSORS = [
  { name: 'Wellington City Council', logo: '/images/sponsor-wcc.svg' },
  {
    // "Education Trust", per its own logo — not "Fund".
    name: 'Peace & Disarmament Education Trust',
    logo: '/images/logos/peace-and-disarmament-education-trust.png',
  },
  { name: 'TAHI Festival', logo: '/images/logos/tahi-festival.png' },
  { name: 'Ridgway School', logo: '/images/logos/ridgway-school.png' },
  { name: 'Vogelmorn Bowling Club', logo: '/images/logos/vogelmorn-bowling-club.png' },
  { name: 'BLENNZ', logo: '/images/logos/blennz.png' },
  // Not a sponsor — an invitation. Rendered as a call to action, not a logo.
  { name: 'You!', logo: null, cta: true },
]

export default async function HomePage() {
  const c = await getPageContent('homepage')

  return (
    <main style={{ backgroundColor: CREAM }}>

      {/* Hero — logo sits at top, overlapping upward into the white header */}
      <section className="wpf-sunburst wpf-hero-scallop-mask relative z-10 px-6 pt-14 pb-16 md:pt-20 md:pb-20 lg:pb-40 overflow-x-clip" style={{ color: INK }}>

        {/* Left photo collage — lg+: full 3-photo spread in the gutter */}
        <div aria-hidden className="hidden lg:block pointer-events-none select-none">
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


        {/* Left photo collage — mobile: hidden */}
        <div aria-hidden className="hidden pointer-events-none select-none">
          <div className="absolute left-0 -translate-x-[35%] top-10 w-20 rotate-[-13deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-01.jpg" alt="" fill className="object-cover" sizes="80px" /></div>
          </div>
          <div className="absolute left-0 -translate-x-[30%] top-44 w-20 rotate-[11deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
            <div className="relative aspect-square"><Image src="/images/gallery/wpf-gallery-086.jpg" alt="" fill className="object-cover" sizes="80px" /></div>
          </div>
        </div>

        {/* Right photo collage — lg+: full 3-photo spread */}
        <div aria-hidden className="hidden lg:block pointer-events-none select-none">
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


        {/* Right photo collage — mobile: hidden */}
        <div aria-hidden className="hidden pointer-events-none select-none">
          <div className="absolute right-0 translate-x-[35%] top-28 w-20 rotate-[12deg] border-[3px] border-white rounded shadow-lg overflow-hidden">
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

      {/* Community Day — vivid brand green. Pulled up under the hero's
          scalloped bottom edge so the green shows through the notches. */}
      <section className="px-6 pt-16 pb-16 md:pt-24 md:pb-24 -mt-[22px]" style={{ backgroundColor: GREEN_VIVID }}>
        <div className="mx-auto max-w-4xl">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-md" style={{ backgroundColor: GREEN_DEEP }}>
            <Image
              src="/images/2024-puppetry-gala.jpg"
              alt="Community day — kids activities"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="wpf-section-kicker mb-2" style={{ color: 'var(--wpf-yellow)' }}>Community day</p>
              <h2 className="wpf-section-heading text-3xl md:text-5xl" style={{ color: 'var(--wpf-yellow)' }}>
                {c.kidsHeading}
              </h2>
            </div>
          </div>
          <p className="mt-7 text-center max-w-2xl mx-auto leading-relaxed text-base md:text-lg" style={{ color: '#ffffff' }}>
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

      {/* Gallery */}
      <section className="px-6 pt-16 pb-10 md:pt-24 md:pb-14" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="wpf-section-heading text-center text-2xl md:text-4xl mb-10 md:mb-12" style={{ color: 'var(--wpf-blue)' }}>
            {c.galleryHeading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {['wpf-gallery-01.jpg', 'wpf-gallery-tom-01.jpg', 'wpf-gallery-045.jpg', 'wpf-gallery-064.jpg', 'wpf-gallery-077.jpg', 'wpf-gallery-086.jpg', 'wpf-gallery-tom-02.jpg', 'wpf-gallery-tom-03.jpg'].map((img) => (
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

      {/* Sponsors */}
      <section className="px-6 pt-10 pb-16 md:pt-14 md:pb-24" style={{ backgroundColor: CREAM }}>
        {/* Three across. Seven tiles fills two rows of three and leaves "You!"
            alone on the third — which is the point: it lands as an invitation
            rather than as the runt of a five-wide row. */}
        <div className="mx-auto max-w-3xl">
          <h2 className="wpf-section-heading text-center text-2xl md:text-4xl mb-10 md:mb-12 lowercase" style={{ color: 'var(--wpf-ink)' }}>
            {c.sponsorsCaption}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-8 items-center">
            {SPONSORS.map((s) =>
              s.cta ? (
                <Link
                  key={s.name}
                  href="/contact"
                  // Six logos + this tile = seven, so it lands alone on the last
                  // row. Full width on mobile, centred under the middle column
                  // on wider screens, so it reads as deliberate rather than left
                  // over.
                  className="group col-span-2 sm:col-span-1 sm:col-start-2 h-24 flex flex-col items-center justify-center gap-1 px-3 rounded-2xl border-2 border-dashed transition-all duration-200 hover:-translate-y-1 hover:rotate-[-1.5deg] hover:border-solid"
                  style={{ borderColor: 'var(--wpf-pink)' }}
                >
                  <span
                    className="text-2xl font-extrabold leading-none transition-transform duration-200 group-hover:scale-110"
                    style={{ color: 'var(--wpf-pink-deep)' }}
                  >
                    You!
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest wpf-text-muted">
                    Sponsor us
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1"> →</span>
                  </span>
                </Link>
              ) : (
                <div key={s.name} className="h-24 flex items-center justify-center px-3">
                  {s.logo ? (
                    // max-w-full matters: PADET's wordmark is nearly 5:1, so
                    // height-constrained alone it would overrun its grid cell.
                    <Image src={s.logo} alt={s.name} width={220} height={88} className="max-h-16 max-w-full w-auto object-contain" />
                  ) : (
                    <span className="text-xs font-medium text-center leading-tight" style={{ color: '#000000' }}>{s.name}</span>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
