import Image from 'next/image'
import { getPageContent } from '@/app/actions'
import SponsorInvite from '@/components/SponsorInvite'
import SignupForm from '@/components/SignupForm'
import WaveDivider from '@/components/WaveDivider'
import { MAIN_HEADING_ID } from '@/lib/site'
import { teReo } from '@/lib/tereo'

export const revalidate = 60

const CREAM = 'var(--wpf-cream)'
const GREEN_DEEP = 'var(--wpf-blue-deep)'  // #2d6c0a — deep forest green
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
  { name: 'Creative NZ — Creative Communities Scheme', logo: '/images/logos/creative-nz-communities-scheme.png' },
  { name: 'Yip Real Estate', logo: '/images/logos/yip-real-estate.png' },
  // Not a sponsor — an invitation. Rendered as a call to action, not a logo.
  { name: 'You!', logo: null, cta: true },
]

const GALLERY_IMAGES = [
  { file: 'wpf-gallery-01.jpg', key: 'homeGallery1' },
  { file: 'wpf-gallery-tom-01.jpg', key: 'homeGallery2' },
  { file: 'wpf-gallery-045.jpg', key: 'homeGallery3' },
  { file: 'wpf-gallery-064.jpg', key: 'homeGallery4' },
  { file: 'wpf-gallery-077.jpg', key: 'homeGallery5' },
  { file: 'wpf-gallery-086.jpg', key: 'homeGallery6' },
  { file: 'wpf-gallery-tom-02.jpg', key: 'homeGallery7' },
  { file: 'wpf-gallery-tom-03.jpg', key: 'homeGallery8' },
]

export default async function HomePage() {
  const c = await getPageContent('homepage')
  const alt = await getPageContent('image-alt-text')

  return (
    <main style={{ backgroundColor: CREAM }}>

      {/* Hero — logo sits at top, overlapping upward into the white header */}
      <section className="wpf-sunburst wpf-hero-scallop-mask relative z-10 px-6 pt-14 pb-16 md:pt-20 md:pb-24 overflow-x-clip" style={{ color: INK }}>

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

          {/* Heading first, then the dates. An accessibility consultant
              testing with JAWS (Aug 2026) pointed out that the kicker line —
              which currently carries the festival dates — sat above the <h1>,
              so anyone moving through the page by headings jumped straight
              past the one line that says when the festival is. The h1 leads
              now and both small lines follow it, in the DOM and on screen. */}
          <h1
            id={MAIN_HEADING_ID}
            tabIndex={-1}
            className="wpf-skip-target font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-balance tracking-tight"
          >
            {teReo(c.heroTitle)}
          </h1>
          {/* Kicker, in three parts so the festival can announce itself while
              it is actually running. `heroStatus` is the live badge — filled
              pink rather than merely coloured, because the kicker text is
              already magenta and a colour change alone would not read as
              "this is happening right now". Clearing the field in /admin on
              Monday removes the badge and the line closes back up, so nobody
              has to touch code to stop the site shouting. */}
          <p className="wpf-section-kicker mt-4">
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span>{teReo(c.heroKicker)}</span>
              {c.heroStatus?.trim() && (
                <>
                  <span aria-hidden="true">•</span>
                  <span
                    className="inline-block rounded-full px-2.5 py-1"
                    style={{ backgroundColor: 'var(--wpf-pink)', color: '#ffffff' }}
                  >
                    {c.heroStatus}
                  </span>
                </>
              )}
            </span>
            {c.heroPlace?.trim() && <span className="block mt-1.5">{teReo(c.heroPlace)}</span>}
          </p>
          <p className="mt-2 text-lg md:text-xl font-extrabold tracking-wide" style={{ color: 'var(--wpf-pink)' }}>
            {teReo(c.heroDates)}
          </p>
          <p className="mt-5 wpf-text-muted leading-relaxed max-w-2xl text-balance text-base md:text-lg">
            {teReo(c.heroTagline)}
          </p>

        </div>
      </section>

      {/* Newsletter splash — Bridget, 13 Nov 2026. The festival is over, so
          the one live ask left on this page is the mailing list: the events
          and workshops through 2027, and the next festival in 2028.

          A full-width band rather than a card inside the hero, which is
          where this started and where it could not stay — the hero carries
          `wpf-hero-scallop-mask`, and the mask clipped the bottom off the
          card, Sign up button and all. It is the Community Day band's old
          slot and its old trick: pulled up 22px so the green shows through
          the scallop notches instead of the cream behind them.

          Deep forest green, not the vivid brand green that band used. Deep
          green is the site's newsletter colour — the /contact card and the
          footer are both this green with white text — so the two sign-ups
          read as one thing in two places. White on it is 6.44:1; the yellow
          Sign up button carries the accent.

          New field keys on purpose. 'newsletterHeading' and
          'newsletterSubtext' already exist on this slug in the database,
          holding 2026 festival wording left behind when the v1 homepage
          newsletter section was removed. Reusing either key would have let
          that stale text silently win over anything written here.

          Both fields blank in /admin removes the band entirely — the same
          escape hatch as the hero badge, no deploy needed. */}
      {(c.signupHeading?.trim() || c.signupBody?.trim()) && (
        <section
          aria-labelledby="home-signup-heading"
          className="px-6 pt-16 pb-16 md:pt-24 md:pb-24 -mt-[22px]"
          style={{ backgroundColor: GREEN_DEEP }}
        >
          <div className="mx-auto max-w-2xl">
            {c.signupHeading?.trim() && (
              <h2
                id="home-signup-heading"
                className="wpf-section-heading text-center text-3xl md:text-4xl"
                style={{ color: '#ffffff' }}
              >
                {teReo(c.signupHeading)}
              </h2>
            )}
            {c.signupBody?.trim() && (
              <p
                className="mt-4 mb-8 text-center leading-relaxed text-base md:text-lg text-balance"
                style={{ color: '#ffffff' }}
              >
                {teReo(c.signupBody)}
              </p>
            )}
            <SignupForm panel={false} source="homepage" />
          </div>
        </section>
      )}

      {/* Wave: newsletter green → cream, so the band lands on the gallery the
          way the cabaret section used to. */}
      <WaveDivider fromColor={GREEN_DEEP} toColor={CREAM} />

      {/* Jon, 13 Nov 2026: the Community Day and Evening Cabaret sections
          are gone, with the two wave dividers that separated them, and the
          hero's "See the Programme" button with them.

          Both sections sold a thing that has already happened — a Saturday
          carnival and a Saturday night cabaret, written in the present tense,
          with a photo apiece and nothing to click. The festival finished in
          September. Keeping them meant the homepage spent two full screens
          advertising September to someone arriving in November, and the one
          live ask on the page (the newsletter) sat above the fold being
          scrolled past.

          So the page is: what happened, stay in touch, photos, thank you.
          The programme is still at /programme as a record and the cabaret at
          /cabaret — the header and footer reach both. The homepage just
          stops pushing them.

          For 2028: `git show` this commit. The markup is intact in history,
          and the wording it rendered is still on the 'homepage' row in
          Supabase under kidsHeading / kidsBody / cabaretSectionHeading /
          cabaretSectionBody — the fields are retired from /admin (see
          lib/pages.ts) but nothing deleted the stored values. */}

      {/* Gallery */}
      <section className="px-6 pt-16 pb-10 md:pt-24 md:pb-14" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="wpf-section-heading text-center text-2xl md:text-4xl mb-10 md:mb-12" style={{ color: 'var(--wpf-blue)' }}>
            {teReo(c.galleryHeading)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {GALLERY_IMAGES.map(({ file, key }) => (
              <div
                key={file}
                className="wpf-gallery-tile relative aspect-square rounded-lg overflow-hidden shadow-sm"
              >
                <Image
                  src={`/images/gallery/${file}`}
                  alt={alt[key]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          {/* Photo credit. Solid ink rather than a faded tint — every other
              faded-text case on this site failed contrast and had to be
              fixed, so this one starts solid. */}
          {c.photoCredit?.trim() && (
            <p className="mt-8 text-center text-sm" style={{ color: INK }}>
              {teReo(c.photoCredit)}
            </p>
          )}
        </div>
      </section>

      {/* Sponsors */}
      <section className="px-6 pt-10 pb-16 md:pt-14 md:pb-24" style={{ backgroundColor: CREAM }}>
        {/* Three across. Eight sponsor tiles plus "You!" fill exactly three
            rows of three, landing the invitation bottom-right. */}
        <div className="mx-auto max-w-3xl">
          <h2 className="wpf-section-heading text-center text-2xl md:text-4xl mb-10 md:mb-12 lowercase" style={{ color: 'var(--wpf-ink)' }}>
            {teReo(c.sponsorsCaption)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-8 items-center">
            {SPONSORS.map((s) =>
              s.cta ? (
                <SponsorInvite key={s.name} />
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
