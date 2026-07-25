// The programme, as Bridget asked for it (Jul 2026): one card per *strand* —
// "Saturday — Workshops", "Saturday — Shows for Children and whānau" — rather
// than one card per day with shows and workshops muddled together inside.
//
// A Strand is a card *and* its programme at once. Before this, the cards lived
// in pages.ts (day1Title, day2Body…) and the schedule lived in lib/schedule.ts,
// so the same weekend was edited in two unrelated places. Now it's one blob,
// stored as JSON under the 'program-schedule' slug (key: strandsJson) and
// edited with StrandsEditor in /admin.
//
// lib/schedule.ts is still the home of VENUES and the older DaySchedule shape,
// which /archives/v1 and the previous stored content still refer to.

import { VENUES, type VenueKey } from './schedule'

export type { VenueKey }
export { VENUES }

/** How you get in. Drives the chip on the card. */
export type Access = 'invite' | 'attendees' | 'free' | 'ticketed'

export type StrandEvent = {
  time: string
  title: string
  venue: VenueKey
  by?: string
  duration?: string
  age?: string
  /** Small tag beside the row — "BLENNZ". */
  note?: string
  /** One-line detail shown inline on the listing. Keep it short. */
  detail?: string
  image?: string
  /** Longer blurb — only shown on the event's own More info page. */
  blurb?: string
  /** Artist bio — only shown on the More info page. */
  bio?: string
  /** Humanitix (or other) link. The Buy tickets button appears once this is set. */
  ticketUrl?: string
}

export type Strand = {
  id: string
  day: 'Friday' | 'Saturday' | 'Sunday'
  title: string
  blurb: string
  /** Practical line under the blurb — "Pack a picnic", "Email us to come along". */
  note?: string
  access: Access
  /** Blank until tickets go live; Bridget pastes the Humanitix link herself. */
  ctaLabel?: string
  ctaUrl?: string
  /** Non-public strands (Opening Event, Closing Circle) have none, and don't open. */
  events: StrandEvent[]
}

export const DAYS = [
  { day: 'Friday', date: '18 September 2026' },
  { day: 'Saturday', date: '19 September 2026' },
  { day: 'Sunday', date: '20 September 2026' },
] as const

export const ACCESS_STYLE: Record<Access, { label: string; bg: string; fg: string }> = {
  invite: { label: 'By invitation', bg: 'var(--wpf-cream)', fg: 'var(--wpf-ink)' },
  // Bridget: "its not a public event" — so no green "come along" chip here.
  attendees: { label: 'Festival attendees', bg: 'var(--wpf-cream)', fg: 'var(--wpf-ink)' },
  free: { label: 'Free — no ticket needed', bg: 'var(--wpf-blue-soft)', fg: 'var(--wpf-ink)' },
  ticketed: { label: 'Ticketed', bg: 'var(--wpf-pink-soft)', fg: 'var(--wpf-pink-deep)' },
}

export const DEFAULT_STRANDS: Strand[] = [
  {
    id: 'fri-opening',
    day: 'Friday',
    title: 'Opening Event',
    blurb: 'For invited guests and our puppetry community.',
    note: 'Please let us know via email if you would like to come along.',
    access: 'invite',
    events: [],
  },

  {
    id: 'sat-carnival',
    day: 'Saturday',
    title: 'Junk Puppet Carnival',
    blurb: 'A morning of FREE junk puppet making, roaming puppets and outdoor games.',
    note: 'No ticket required — pack a picnic and bring the whānau.',
    access: 'free',
    events: [
      {
        time: '10:00am–2:00pm',
        title: 'Free KidsZone',
        venue: 'green',
        detail:
          'Junk games, ice cream van, roaming puppeteers & musicians all day. Wet weather venue: Ridgeway Hall.',
      },
      { time: '10:30–11:30am', title: 'Junk Puppet Workshop', duration: '1 hr', venue: 'green' },
      { time: '12:00–1:00pm', title: 'Junk Puppet Workshop', duration: '1 hr', venue: 'green' },
    ],
  },
  {
    id: 'sat-shows',
    day: 'Saturday',
    title: 'Shows for Children and whānau',
    blurb: 'A morning of glorious puppet shows designed for different ages to enjoy!',
    note: 'Check the programme here and buy your tickets quick.',
    access: 'ticketed',
    events: [
      { time: '10:00–10:30am', title: 'Box of Birds', by: 'Birds', duration: '30 mins', age: '3+', note: 'BLENNZ', venue: 'hall' },
      { time: '11:00–11:30am', title: 'Migit and the Dragon', by: 'Mary', duration: '30 mins', age: '3+', venue: 'hall' },
      { time: '12:00–12:45pm', title: 'Little Top Circus', by: 'Jon', duration: '45 mins', age: '3+', venue: 'hall' },
      { time: '1:15–2:00pm', title: 'The Fish — Commission', by: 'Joey', duration: '40 mins', age: '7+', venue: 'hall' },
    ],
  },
  {
    id: 'sat-workshops',
    day: 'Saturday',
    title: 'Workshops',
    blurb: 'A morning of captivating hands-on puppet workshops for ages 14+.',
    note: 'Check the programme here.',
    access: 'ticketed',
    events: [
      { time: '9:30–11:00am', title: 'Mechanisms', by: 'Jon', duration: '1.5 hrs', age: '14+', venue: 'upstairs' },
      { time: '11:50am', title: 'Bespoke Backpacks', by: 'Ally', duration: '45 mins', venue: 'upstairs' },
      { time: '12:15–1:45pm', title: 'Make a Puppet and Bring It to Life', by: 'Birds', duration: '1.5 hrs', venue: 'upstairs' },
    ],
  },
  {
    id: 'sat-peace',
    day: 'Saturday',
    title: 'Puppets for Peace and Pea Soup Platter',
    blurb:
      'An evening of cutting-edge puppetry entertainment, including our freshly commissioned work by Joey Sheppard, a scintillating puppet cabaret, all rounded off with a gourmet dinner — all included in the price.',
    access: 'ticketed',
    events: [
      { time: '6:00–6:40pm', title: 'The Fish — Commission', by: 'Joey', duration: '40 mins', venue: 'hall' },
      { time: '6:45–7:30pm', title: 'Pea Soup Dinner + Films', venue: 'hall' },
      { time: '7:30–8:00pm', title: 'Excerpt: Skylight', by: 'Birdlife', duration: '20 mins', venue: 'hall' },
      { time: '8:00–9:30pm', title: 'Cabaret', duration: '60 mins', venue: 'hall' },
    ],
  },

  {
    id: 'sun-shows',
    day: 'Sunday',
    title: 'Shows for Children and whānau',
    blurb: 'Another morning of accessible shows.',
    access: 'ticketed',
    events: [
      { time: '12:00–12:30pm', title: 'Night Shift', by: 'Steph', duration: '30 mins', age: '10+', venue: 'hall' },
      { time: 'TBC', title: 'Box of Birds', by: 'Birds', duration: '30 mins', age: '3+', note: 'BLENNZ', venue: 'ridgeway' },
      { time: 'TBC', title: 'Little Bad Mood', by: 'Marine', duration: '20 mins', age: '5+', venue: 'ridgeway' },
    ],
  },
  {
    id: 'sun-workshops',
    day: 'Sunday',
    title: 'Workshops',
    blurb: 'More workshops for adults and children.',
    access: 'ticketed',
    // Bridget, 25 Jul: "ad-hoc workshops & sharings" — CUT.
    events: [
      { time: '9:00–11:00am', title: 'Shadow Puppetry Workshop', by: 'Rowena', duration: '2.5 hrs', venue: 'hall' },
      { time: '11:15–11:50am', title: 'Puppets in Wartime', by: 'Simone', duration: '40 mins', venue: 'hall' },
      { time: 'TBC', title: 'Paper Bag Family', by: 'Marine', duration: '45 mins', age: '5+', venue: 'ridgeway' },
    ],
  },
  {
    id: 'sun-closing',
    day: 'Sunday',
    title: 'Closing Circle',
    blurb:
      'For anyone who wants to acknowledge and celebrate our wonderful weekend together.',
    note: '12:30–1:30pm at the Hall.',
    access: 'attendees',
    events: [],
  },
]

/**
 * A link that opens the venue in whatever maps app the visitor has.
 *
 * google.com/maps/search/?api=1 is the portable choice: on iOS it hands off to
 * the Google Maps app if it's installed and falls back to the web map (which
 * still offers directions) if it isn't, and on Android it opens Maps directly.
 * maps.apple.com would be nicer on iPhone but shows an unsupported-browser page
 * everywhere else, and a geo: URI does nothing on desktop.
 */
export function venueMapUrl(venue: VenueKey): string {
  const v = VENUES[venue] ?? VENUES.hall
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`
}

const ACCESS_KEYS: Access[] = ['invite', 'attendees', 'free', 'ticketed']

/** Parse stored strands JSON; fall back to the code default on any problem. */
export function parseStrands(json: string | undefined | null): Strand[] {
  if (!json?.trim()) return DEFAULT_STRANDS
  try {
    const parsed = JSON.parse(json)
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every(
        (s) =>
          s &&
          typeof s.id === 'string' &&
          typeof s.day === 'string' &&
          typeof s.title === 'string' &&
          ACCESS_KEYS.includes(s.access) &&
          Array.isArray(s.events),
      )
    ) {
      return parsed as Strand[]
    }
  } catch {
    // fall through
  }
  return DEFAULT_STRANDS
}

export function serializeStrands(strands: Strand[]): string {
  return JSON.stringify(strands, null, 2)
}

/** Rows with no title are drafts in /admin — never render them publicly. */
export function publicEvents(strand: Strand): StrandEvent[] {
  return strand.events.filter((ev) => ev.title?.trim())
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * URL for an event's More info page. Derived rather than stored so Bridget
 * never has to think about slugs — the strand id keeps it unique when the same
 * show runs twice (The Fish is in both sat-shows and sat-peace).
 */
export function eventSlug(strand: Strand, ev: StrandEvent): string {
  return `${strand.id}-${slugify(ev.title)}`
}

/** An event earns a More info page once there's something to put on it. */
export function hasMoreInfo(ev: StrandEvent): boolean {
  return Boolean(ev.blurb?.trim() || ev.bio?.trim() || ev.image?.trim())
}

export function findEventBySlug(
  strands: Strand[],
  slug: string,
): { strand: Strand; event: StrandEvent } | undefined {
  for (const strand of strands) {
    for (const event of publicEvents(strand)) {
      if (eventSlug(strand, event) === slug) return { strand, event }
    }
  }
  return undefined
}
