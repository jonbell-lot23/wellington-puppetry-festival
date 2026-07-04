// Central registry of every editable page + its text fields.
// Page React components read content by key with these defaults as fallback,
// so the whole site renders correctly even with no database configured.
// The /admin editor renders a form from this registry for each page.

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
    slug: 'wellington-puppetry-festival',
    path: '/',
    title: 'Wellington Puppetry Festival',
    fields: [
      F('line1', 'Heading line 1', 'Thanks for your submissions'),
      F('line2', 'Heading line 2', 'Full programme announced June 2026'),
      F('line3', 'Heading line 3', 'Sign up to our mailing list to stay updated'),
      F('buttonText', 'Button text', 'Sign up for Festival News'),
      F('buttonLink', 'Button link', '#footer-signup'),
      F(
        'caption',
        'Turtle image caption',
        'Image: Amy Adams - Giant Turtle Puppet - Image courtesy of Thomas Kay',
      ),
    ],
  },
  {
    slug: 'homepage',
    path: '/',
    title: 'Home page',
    fields: [
      F('heroKicker', 'Hero kicker', 'Pōneke Wellington'),
      F('heroTitle', 'Hero title', 'Wellington Puppetry Festival'),
      F('heroDates', 'Hero dates', '12 to 20 September 2026'),
      F(
        'heroTagline',
        'Hero tagline',
        'A brand new celebration of puppetry, storytelling and live performance, bringing local and touring artists to stages across the city.',
        true,
      ),
      F('ticketsUrl', 'Tickets URL', '#'),
      F('kidsHeading', 'Community day heading', 'Free activities for kids and families'),
      F(
        'kidsBody',
        'Community day body',
        'Saturday is our free community day: drop-in puppet making, short shows and street performance for all ages, no ticket required.',
        true,
      ),
      F('newsletterHeading', 'Newsletter heading', 'Stay in the loop'),
      F(
        'newsletterSubtext',
        'Newsletter subtext',
        'Sign up for programme announcements, ticket releases and festival news as the first Wellington Puppetry Festival takes shape.',
        true,
      ),
      F('sponsorsCaption', 'Sponsors caption', 'Made possible with support from'),
      F('galleryHeading', 'Gallery heading', 'Gallery'),
    ],
  },
  {
    slug: 'about',
    path: '/about',
    title: 'About page',
    fields: [
      F('heading', 'Heading', 'About the festival'),
      F(
        'intro',
        'Intro',
        'The Wellington Puppetry Festival is a new event bringing puppetry, one of the oldest and most joyful art forms, to audiences across Pōneke.',
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
