// PROTOTYPE — Bridget's "one card per strand" structure (Jul 2026 email).
//
// This is the proposed replacement for the day-card + one-big-list model on
// /program. Nothing here is wired to /admin yet; the data is hardcoded so the
// shape can be reviewed on a real page first.
//
// The idea: today the *cards* live in pages.ts (day1Title, day2Body…) and the
// *schedule* lives in lib/schedule.ts, so Bridget edits the same weekend in two
// unrelated places. A Strand is both at once — a card with its own programme.

import type { ScheduleEvent } from '@/lib/schedule'

/** How you get in. Drives the chip on the card. */
export type Access = 'invite' | 'attendees' | 'free' | 'ticketed'

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
  /** Non-public strands (Opening Event, Closing Circle) don't open. */
  events: ScheduleEvent[]
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

export const STRANDS: Strand[] = [
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
    blurb:
      'A morning of FREE junk puppet making, roaming puppets and outdoor games.',
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
    blurb:
      'A morning of glorious puppet shows designed for different ages to enjoy!',
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
    blurb:
      'A morning of captivating hands-on puppet workshops for ages 14+.',
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
    events: [
      { time: '9:00–11:00am', title: 'Shadow Puppetry Workshop', by: 'Rowena', duration: '2.5 hrs', venue: 'hall' },
      { time: 'All morning', title: 'Ad-hoc workshops & sharings', venue: 'upstairs' },
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
