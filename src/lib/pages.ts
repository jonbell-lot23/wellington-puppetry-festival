// Central registry of every editable page + its text fields.
// Page React components read content by key with these defaults as fallback,
// so the whole site renders correctly even with no database configured.
// The /admin editor renders a form from this registry for each page.
//
// Keep fields to headline/intro/link-style text that owners plausibly want
// to tweak themselves. Layout, imagery and structure stay in the component
// code — that's still a developer job per the "image updates" workflow.

export type Field = {
  key: string
  label: string
  multiline?: boolean
  default: string
}

export type PageDef = {
  slug: string // Supabase key + last URL segment
  path: string // route to revalidate / link to
  title: string // shown in /admin page list
  fields: Field[]
}

const F = (key: string, label: string, def: string, multiline = false): Field => ({
  key,
  label,
  default: def,
  multiline,
})

export const PAGES: PageDef[] = [
  {
    slug: 'homepage',
    path: '/',
    title: 'Homepage',
    fields: [
      F('heroKicker', 'Hero kicker (small line above title)', 'A community festival made in Pōneke'),
      F('heroTitle', 'Hero title', 'Three days of strings, shadows & wonder'),
      F('heroDates', 'Hero dates line', '18–20 SEP 2026 · PŌNEKE WELLINGTON'),
      F(
        'heroTagline',
        'Hero tagline',
        'WPF returns this spring to fill the city with strings, shadows and wonder — a free, family-first celebration brought to life by our own community of puppeteers, storytellers and makers.',
        true,
      ),
      F('ticketsUrl', 'Tickets URL (Humanitix)', 'https://events.humanitix.com/'),
      F('kidsHeading', 'Saturday kids section heading', 'Saturday is FREE for kids & whānau'),
      F(
        'kidsBody',
        'Saturday kids section body',
        'Drop in any time on Saturday for free hands-on puppet-making workshops, street performances and shows made just for little ones — no ticket required, just turn up.',
        true,
      ),
      F('newsletterHeading', 'Newsletter section heading', 'WPF Newsletter'),
      F(
        'newsletterSubtext',
        'Newsletter section subtext',
        'Sign up to our newsletter for programme announcements, Saturday free-activity updates and festival news.',
      ),
      F('cabaretSectionHeading', 'Cabaret section heading', 'An after-dark evening of puppetry'),
      F(
        'cabaretSectionBody',
        'Cabaret section body',
        'When the kids have gone to bed, the festival gets a little wilder. An adults-only evening of bold, funny and surprising puppetry cabaret — one of the highlights of the Wellington Puppetry Festival.',
        true,
      ),
      F('galleryHeading', 'Gallery section heading', 'Moments from past festivals'),
      F('sponsorsCaption', 'Sponsors heading', 'Thanks to our sponsors and supporters'),
    ],
  },
  {
    slug: 'program',
    path: '/program',
    title: 'Program',
    fields: [
      F('heading', 'Page heading', 'Programme'),
      F(
        'intro',
        'Intro paragraph',
        'Three days of marionettes, shadow play, giant puppets and street performance across Pōneke Wellington. The full 2026 programme is being finalised — check back soon, or sign up to our newsletter to hear first.',
        true,
      ),

      // Three day cards. The day name (Friday/Saturday/Sunday) and colour are
      // fixed in the page; these fields fill each card's date, title and text.
      F('day1Date', 'Friday card — date', '18 Sep 2026'),
      F('day1Title', 'Friday card — title', 'Opening Night'),
      F('day1Body', 'Friday card — description', 'Festival kick-off with an evening showcase of visiting and local puppetry companies.', true),
      F('day2Date', 'Saturday card — date', '19 Sep 2026'),
      F('day2Title', 'Saturday card — title', 'Free Family Day'),
      F('day2Body', 'Saturday card — description', 'A full day of FREE drop-in puppet-making, street performances and shows for kids and whānau. No ticket required.', true),
      F('day3Date', 'Sunday card — date', '20 Sep 2026'),
      F('day3Title', 'Sunday card — title', 'Festival Shows + Cabaret'),
      F('day3Body', 'Sunday card — description', 'Daytime programme continues, closing with WPF Cabaret in the evening — see the Cabaret page for details.', true),

      // Show-by-show list. Leave a show's title blank to hide that row. While
      // every title is blank the page shows its "coming soon" placeholder.
      F('showsHeading', 'Show-by-show — section heading', 'Saturday 19 Sep — Show by Show'),
      F('show1Time', 'Show 1 — time', ''),
      F('show1Title', 'Show 1 — title', ''),
      F('show1Info', 'Show 1 — venue / info', ''),
      F('show2Time', 'Show 2 — time', ''),
      F('show2Title', 'Show 2 — title', ''),
      F('show2Info', 'Show 2 — venue / info', ''),
      F('show3Time', 'Show 3 — time', ''),
      F('show3Title', 'Show 3 — title', ''),
      F('show3Info', 'Show 3 — venue / info', ''),
      F('show4Time', 'Show 4 — time', ''),
      F('show4Title', 'Show 4 — title', ''),
      F('show4Info', 'Show 4 — venue / info', ''),
      F('show5Time', 'Show 5 — time', ''),
      F('show5Title', 'Show 5 — title', ''),
      F('show5Info', 'Show 5 — venue / info', ''),
      F('show6Time', 'Show 6 — time', ''),
      F('show6Title', 'Show 6 — title', ''),
      F('show6Info', 'Show 6 — venue / info', ''),
    ],
  },
  {
    slug: 'artists',
    path: '/artists',
    title: 'Artists',
    fields: [
      F('heading', 'Page heading', 'Artists'),
      F(
        'intro',
        'Intro paragraph',
        'From first-time makers to internationally touring companies, WPF brings together a community of puppeteers, designers and performers from across Aotearoa and beyond.',
        true,
      ),
    ],
  },
  {
    slug: 'volunteers',
    path: '/volunteers',
    title: 'Volunteers',
    fields: [
      F('heading', 'Page heading', 'Volunteer with us'),
      F(
        'intro',
        'Intro paragraph',
        'WPF is powered by community. Volunteers help with everything from front-of-house and bump-in to running our free Saturday kids\' activities — no puppetry experience required, just enthusiasm.',
        true,
      ),
    ],
  },
  {
    slug: 'about',
    path: '/about',
    title: 'About',
    fields: [
      F('heading', 'Page heading', 'About the Festival'),
      F(
        'intro',
        'Intro paragraph',
        'Wellington Puppetry Festival is a community-led celebration of puppetry in all its forms — traditional and contemporary, tiny and giant, for toddlers and adults alike. We\'re proud to bring the city together for a free, welcoming, imagination-filled long weekend.',
        true,
      ),

      // Rose Beauchamp tribute section.
      F('roseHeading', 'Rose section — heading', 'In the footsteps of Rose Beauchamp'),
      F(
        'roseBody1',
        'Rose section — first paragraph',
        'Wellington\'s love of puppetry owes an enormous amount to Rose Beauchamp. A pianist who never set out to become a puppeteer, Rose fell for the art form and went on to help organise the very first national puppet festival, the NZ Puppet Parade that filled Lambton Quay in 1986.',
        true,
      ),
      F(
        'roseBody2',
        'Rose section — second paragraph',
        'She turned shadows into art, and art into activism: her internationally renowned shadow puppetry made audiences laugh and cry, but also educated and spoke out against the injustice she saw in the world. The Wellington Puppetry Festival carries that spirit forward, puppetry for everyone, in the city she helped fall in love with the art.',
        true,
      ),
      F(
        'roseQuote',
        'Rose section — pull quote',
        'Puppets are exciting, they make us laugh, and understand other cultures as well as enriching our own lives.',
        true,
      ),
      F('roseQuoteBy', 'Rose section — quote attribution', 'Rose Beauchamp'),
    ],
  },
  {
    slug: 'contact',
    path: '/contact',
    title: 'Contact',
    fields: [
      F('heading', 'Page heading', 'Get in touch'),
      F(
        'intro',
        'Intro paragraph',
        'Questions about the programme, volunteering, accessibility or anything else? We\'d love to hear from you.',
        true,
      ),
      F('email', 'Contact email', 'hello@wellingtonpuppetryfestival.nz'),
    ],
  },
  {
    slug: 'cabaret',
    path: '/cabaret',
    title: 'Cabaret (special page)',
    fields: [
      F('heading', 'Page heading', 'WPF Cabaret'),
      F(
        'intro',
        'Intro paragraph',
        'An after-dark, adults-only night of puppetry cabaret — bold, funny, a little bit wild. The signature evening event of the festival, featuring a curated line-up of local and visiting performers.',
        true,
      ),
    ],
  },
  {
    slug: 'team',
    path: '/team',
    title: 'Team',
    fields: [
      F('heading', 'Page heading', 'Our Team'),
      F(
        'intro',
        'Intro paragraph',
        'Wellington Puppetry Festival is organised by a small team of puppeteers, producers and community volunteers who believe Wellington deserves a festival dedicated to the art of animation.',
        true,
      ),
    ],
  },
  {
    slug: 'accessibility',
    path: '/accessibility',
    title: 'Accessibility',
    fields: [
      F('heading', 'Page heading', 'Accessibility'),
      F(
        'intro',
        'Intro paragraph',
        'We want everyone to be able to enjoy WPF. We\'re working to make our venues, programme and free Saturday activities as accessible as possible — get in touch if you have questions or specific access needs.',
        true,
      ),
    ],
  },
]

export function getPageDef(slug: string): PageDef | undefined {
  return PAGES.find((p) => p.slug === slug)
}

export function defaultsFor(slug: string): Record<string, string> {
  const def = getPageDef(slug)
  if (!def) return {}
  return Object.fromEntries(def.fields.map((f) => [f.key, f.default]))
}
