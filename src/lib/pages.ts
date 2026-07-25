// Central registry of every editable page + its text fields.
// Page React components read content by key with these defaults as fallback,
// so the whole site renders correctly even with no database configured.
// The /admin editor renders a form from this registry for each page.
//
// Keep fields to headline/intro/link-style text that owners plausibly want
// to tweak themselves. Layout, imagery and structure stay in the component
// code — that's still a developer job per the "image updates" workflow.
//
// Exception: the programme ('program-schedule' slug) stores its cards and
// events as one JSON blob and gets a dedicated structured editor in /admin
// instead of the generic field form.

import { DEFAULT_STRANDS, serializeStrands } from './strands'

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
        'Three days of shows, workshops and free family fun across Pōneke Wellington — from opening karakia on Friday night to the closing circle on Sunday afternoon.',
        true,
      ),
      // Bridget, Jul 2026: the Hall / Upstairs / the Green only make sense once
      // you know they're all rooms at one address. Sits above the listings.
      F(
        'venueNote',
        'Venue note (above the programme)',
        'Everything happens at 93 Mornington Road, Brooklyn, at the Vogelmorn Bowling Club — “the Hall”, “Upstairs” and “the Green” are all part of the same place. Ridgeway Hall is a short walk further up the same road, and is also our wet weather venue.',
        true,
      ),
      F(
        'footnote',
        'Footnote below the programme',
        'Programme details may shift a little as the festival comes together — check back closer to the weekend.',
        true,
      ),

      // The cards themselves — their titles, wording and what's listed inside
      // each one — live in the 'program-schedule' entry below, edited with a
      // dedicated structured editor in /admin.
    ],
  },
  {
    // The whole programme: one card per strand, each with its own listings.
    // The single field holds it as JSON; /admin swaps in the structured
    // StrandsEditor for this slug rather than showing a raw textarea.
    slug: 'program-schedule',
    path: '/program',
    title: 'Programme — Cards & listings',
    fields: [F('strandsJson', 'Programme (JSON)', serializeStrands(DEFAULT_STRANDS), true)],
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
      F('kicker', 'Kicker line (small text above title)', '18+ · After dark · Part of WPF'),
      F('heading', 'Page heading', 'WPF Cabaret'),
      F(
        'intro',
        'Intro paragraph',
        'An after-dark, adults-only night of puppetry cabaret — bold, funny, a little bit wild. The signature evening event of the festival, featuring a curated line-up of local and visiting performers.',
        true,
      ),
      F('ticketsLabel', 'Tickets button label', 'Get Cabaret Tickets'),
      F('ticketsUrl', 'Tickets button URL', 'https://events.humanitix.com/'),

      // Three feature cards.
      F('card1Label', 'Card 1 — title', 'Bold'),
      F('card1Body', 'Card 1 — text', 'Puppetry like you\'ve never seen it — sharp, funny, a little unhinged.', true),
      F('card2Label', 'Card 2 — title', 'Curated'),
      F('card2Body', 'Card 2 — text', 'A hand-picked line-up of local and visiting cabaret performers.', true),
      F('card3Label', 'Card 3 — title', 'One night only'),
      F('card3Body', 'Card 3 — text', 'The signature closing-night event of the festival.', true),

      F('footnote', 'Footnote below cards', 'Line-up, venue and exact date to be confirmed alongside the full 2026 programme.', true),
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
