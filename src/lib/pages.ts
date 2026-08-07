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
  /** Path to the image this field is alt text for — shown as a thumbnail in /admin. */
  image?: string
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

/** An alt-text field paired with a thumbnail preview of the image it describes. */
const ALT = (key: string, image: string, def: string): Field => ({
  key,
  label: image,
  default: def,
  image,
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
        'Everything happens at 93 Mornington Road, Brooklyn, at the Vogelmorn Bowling Club — “the Hall”, “Upstairs” and “the Green” are all part of the same place. Ridgway School Hall is a short walk further up the same road. It is wheelchair accessible, and is also our wet weather venue.',
        true,
      ),
      // Sarah, 7 Aug: access information shouldn't be quarantined on its own
      // page. The separate /accessibility page stays as a shortcut, but the
      // same information is repeated here, in the ordinary flow, so it reaches
      // everyone rather than only the people who go looking for it.
      F('accessHeading', 'Access note — heading', 'Access at the festival'),
      F(
        'accessBody',
        'Access note — text',
        'Volunteers will be on hand across the weekend to help with wayfinding and getting you where you need to go. Two of our shows are audio described and offer an optional touch tour. If you would like help planning your visit, or you have an access need we have not listed, please get in touch — we are very glad to help.',
        true,
      ),
      F('accessLinkLabel', 'Access note — link label', 'See our shows for blind and low vision audiences'),

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
      F('ctaHeading', 'Sign-up box — heading', 'Keen to get involved?'),
      F(
        'ctaBody',
        'Sign-up box — text',
        'Fill in the volunteer form and we’ll be in touch about what’s needed and when.',
        true,
      ),
      F('ctaLabel', 'Sign-up button label', 'Sign up to volunteer'),
      // Empty falls back to the contact page, so the button is never a dead
      // end if the form is ever taken down.
      F(
        'formUrl',
        'Volunteer form URL (blank = link to Contact page)',
        'https://docs.google.com/forms/d/e/1FAIpQLSeeO_ZKBfviZmuX663DkH86I1x7Ve1z52gbjTiw5QeFZkIAng/viewform',
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

      // "Made by the community" block. Was hardcoded until Aug 2026 — Bridget
      // wants to rewrite it to describe the festival as a Trust, and that
      // shouldn't need a developer.
      F('communityHeading', 'Community section — heading', 'Made by the community, for the community'),
      F(
        'communityBody1',
        'Community section — first paragraph',
        'WPF is run by Birdlife Productions with the help of local volunteers, artists and venues across Pōneke Wellington. It exists to make puppetry — one of the oldest, strangest and most joyful art forms — accessible to everyone, especially families who might not otherwise get to a theatre show.',
        true,
      ),
      F(
        'communityBody2',
        'Community section — second paragraph',
        'That’s why Saturday is free: no ticket, no barrier, just turn up and join in.',
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

      // The four access cards. These say what a disabled festival-goer can
      // actually expect, so they need to be editable as venues and provisions
      // firm up — they were hardcoded until Aug 2026.
      F('card1Label', 'Card 1 — title', 'Venue access'),
      F(
        'card1Body',
        'Card 1 — text',
        'We work with venues across Wellington to ensure wheelchair access, accessible seating and accessible toilets wherever possible. Specific venue access details will be listed alongside each show in the programme.',
        true,
      ),
      F('card2Label', 'Card 2 — title', 'Sensory-friendly'),
      F(
        'card2Body',
        'Card 2 — text',
        'Our free Saturday activities are designed to be welcoming for neurodivergent kids and families, with space to move around and no obligation to stay for a full show.',
        true,
      ),
      F('card3Label', 'Card 3 — title', 'Companion tickets'),
      F(
        'card3Body',
        'Card 3 — text',
        'Support person / companion tickets are available on request for ticketed shows — contact us ahead of time and we\'ll sort it out.',
        true,
      ),
      F('card4Label', 'Card 4 — title', 'Let us know'),
      F(
        'card4Body',
        'Card 4 — text',
        'If you have a specific access need we haven\'t covered here, get in touch — we\'d rather know in advance so we can make it work.',
        true,
      ),

      F('ctaLabel', 'Contact button label', 'Contact us about access needs'),

      // Blind / low vision provision, from Bridget's "WPF BLENNZ shows" doc
      // (Aug 2026). Lives here rather than only in the programme so it reads
      // as ordinary festival information, which is what the access advice
      // asked for. A show with an empty title is dropped, so the list can grow
      // — Ngā Maunga Rū may add a touch tour and has slot 3 waiting.
      F('accessShowsHeading', 'Accessible shows — heading', 'Shows for blind and low vision audiences'),
      F(
        'accessShowsIntro',
        'Accessible shows — intro',
        'Audio description is provided through headphones and should be pre-booked with your ticket. Touch tours are optional and free to anyone holding a ticket to that show.',
        true,
      ),
      F('accessShow1Label', 'Accessible show 1 — title', 'Box of Birds — Birdlife Productions'),
      F(
        'accessShow1Body',
        'Accessible show 1 — details',
        'Ages 3–8, 30 minutes. Audio description and touch tour.\nSaturday 19 September — touch tour 9:30am, show 10:00am, Vogelmorn Hall. $12.\nSunday 20 September — touch tour 9:30am, show 10:00am, Ridgway School Hall (wheelchair accessible). $12.',
        true,
      ),
      F('accessShow2Label', 'Accessible show 2 — title', 'Little Landscapes — Amy Grace Laura'),
      F(
        'accessShow2Body',
        'Accessible show 2 — details',
        'Ages 5–7 and their grown-ups, 25 minutes. Touch tour 15 minutes before each show.\nSaturday 19 September — 10:30am, 11:30am and 12:30pm on the Vogelmorn Green. Free, part of the Junk Puppet Carnival. Wet weather venue: Ridgway School Hall.',
        true,
      ),
      F('accessShow3Label', 'Accessible show 3 — title', ''),
      F('accessShow3Body', 'Accessible show 3 — details', '', true),

      // Pointer to the public testing report at /accessibility/report.
      F('reportHeading', 'Website report section — heading', 'How accessible is this website?'),
      F(
        'reportBody',
        'Website report section — text',
        'We test this site with a keyboard, with automated checkers and at high zoom, and we publish what we find — including what we haven\'t fixed yet.',
        true,
      ),
      F('reportLinkLabel', 'Website report section — link label', 'Read our accessibility report'),
    ],
  },
  {
    // Alt text for every meaningful image on the site — one field per image,
    // shown with a thumbnail in /admin (see ALT() above). Purely decorative
    // images (the hero photo collage, marked aria-hidden) are deliberately
    // left out — an empty alt is the correct, accessible choice for those.
    // Per-show/workshop photos live with the programme instead (imageAlt /
    // imagesAlt on each event in program-schedule), since they're per-event.
    slug: 'image-alt-text',
    path: '/',
    title: 'Image alt text',
    fields: [
      ALT('logo', '/images/wpf-logo.png', 'Wellington Puppetry Festival logo'),
      ALT(
        'homeCommunityDay',
        '/images/2024-puppetry-gala.jpg',
        'Community day — kids activities',
      ),
      ALT(
        'homeCabaretHero',
        '/images/cabaret-hero.jpeg',
        'Evening Cabaret — WPF after-dark puppetry performance',
      ),
      ALT('homeGallery1', '/images/gallery/wpf-gallery-01.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('homeGallery2', '/images/gallery/wpf-gallery-tom-01.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('homeGallery3', '/images/gallery/wpf-gallery-045.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('homeGallery4', '/images/gallery/wpf-gallery-064.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('homeGallery5', '/images/gallery/wpf-gallery-077.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('homeGallery6', '/images/gallery/wpf-gallery-086.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('homeGallery7', '/images/gallery/wpf-gallery-tom-02.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('homeGallery8', '/images/gallery/wpf-gallery-tom-03.jpg', 'Photo from Wellington Puppetry Festival 2024'),
      ALT('aboutPhoto', '/images/gallery/wpf-gallery-077.jpg', 'Wellington Puppetry Festival'),
      ALT('roseImage', '/images/rose.png', "Rose Beauchamp, founder of Wellington's puppet festivals"),
      ALT('archiveFlyer', '/images/original-flyer.png', 'Original Wellington puppet festival flyer'),
      ALT('archiveParade', '/images/first-parade.png', 'The first NZ Puppet Parade, Lambton Quay 1986'),
      ALT('archiveStilts', '/images/stilts.png', 'Stilt performers at an early puppet festival'),
      ALT('archiveBeach', '/images/beach.png', 'Puppetry on the beach'),
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
