// Programme schedule: types, venues and the default (code-fallback) data.
//
// The live schedule is edited in /admin (Programme: Schedule) and stored as
// JSON in the pages table under the 'program-schedule' slug, one 'scheduleJson'
// key. This default — from Bridget's "WPF Weekend Itinerary 2026" spreadsheet
// (Jul 2026), is what renders when no DB row exists yet, and what parsing
// falls back to if the stored JSON is ever malformed.

// Vogelmorn Hall, Upstairs and the Green are all rooms at one address — the
// Vogelmorn Bowling Club.
//
// Jon, 13 Aug: the hall used to be labelled just "The Hall". With Ridgway in
// the programme that was two buildings both called Hall, and on Sunday the
// listing alternates between them — so "The Hall" read as "the hall you are
// already standing in" when it actually meant a walk back down Mornington
// Road with 30 minutes to do it. Both labels now name their building.
//
// `address` is what gets handed to the maps app when someone taps
// a venue on their phone, so it needs to be a string a map can actually find:
// name first, then street, suburb, city.
//
// Ridgway, no 'e' — confirmed by Bridget (Jul 2026) and by the school's own
// logo, Te Kura o Tawatawa / Ridgway School, 120 Mornington Rd. The object key
// stays 'ridgeway' because stored programme JSON references it; only the label
// visitors see was ever misspelled.
//
// Venues used to carry an `access` paragraph each — Sarah's venue-by-venue
// notes on steps and toilets — which every event page printed under its Where
// block.
//
// Bridget, 18 Aug: "when you open up any programme item, you get a fabulous
// description of the toilet situation". Twelve listings share these four rooms,
// so the same three sentences about the toilets were on every show and every
// workshop page, above the blurb of the show itself.
//
// It's said once now, in the place that exists to say it: the four cards on
// /accessibility (Getting to Vogelmorn, Getting to Ridgway, Steps and surfaces,
// Toilets — see lib/pages.ts), with the venue note above the programme listing
// carrying the short version. Event pages link there instead of repeating it.
export const VENUES = {
  hall: {
    label: 'Vogelmorn Hall',
    bg: 'var(--wpf-yellow)',
    address: 'Vogelmorn Bowling Club, 93 Mornington Road, Brooklyn, Wellington 6021',
  },
  upstairs: {
    label: 'Upstairs',
    bg: 'var(--wpf-pink-soft)',
    address: 'Vogelmorn Bowling Club, 93 Mornington Road, Brooklyn, Wellington 6021',
  },
  green: {
    label: 'The Green',
    bg: 'var(--wpf-blue-soft)',
    address: 'Vogelmorn Bowling Club, 93 Mornington Road, Brooklyn, Wellington 6021',
  },
  ridgeway: {
    label: 'Ridgway School Hall',
    bg: 'var(--wpf-cream)',
    address: 'Ridgway School, 120 Mornington Road, Brooklyn, Wellington 6021',
  },
} as const

export type VenueKey = keyof typeof VENUES

export type ScheduleEvent = {
  time: string
  title: string
  venue: VenueKey
  by?: string
  duration?: string
  age?: string
  note?: string
  detail?: string
  image?: string
}

export type SchedulePart = { label?: string; events: ScheduleEvent[] }

export type DaySchedule = {
  id: string
  day: string
  date: string
  parts: SchedulePart[]
}

export const DEFAULT_SCHEDULE: DaySchedule[] = [
  {
    id: 'friday',
    day: 'Friday',
    date: '18 Sep',
    parts: [
      {
        events: [
          { time: '6:00–6:10pm', title: 'Opening Karakia', venue: 'hall' },
          { time: '6:10–6:15pm', title: 'Introduction to Norbert', by: 'Roger', venue: 'hall' },
          { time: '6:15–6:30pm', title: 'Norbert', duration: '15 mins', venue: 'hall' },
          { time: '6:30–7:15pm', title: 'Pizza & Portrait Painter', venue: 'hall' },
          { time: '7:15–9:15pm', title: 'Sharing Circle', venue: 'hall' },
          { time: '9:15–9:30pm', title: 'Closing', venue: 'hall' },
        ],
      },
    ],
  },
  {
    id: 'saturday',
    day: 'Saturday',
    date: '19 Sep',
    parts: [
      {
        label: 'Daytime',
        events: [
          { time: '9:30–11:00am', title: 'Mechanisms', by: 'Jon', duration: '1.5 hrs', age: '14+', venue: 'upstairs' },
          { time: '10:00–10:30am', title: 'Box of Birds', by: 'Birds', duration: '30 mins', age: '3+', note: 'BLENNZ', venue: 'hall' },
          {
            time: '10:00am–2:00pm',
            title: 'Free KidsZone',
            venue: 'green',
            detail: 'Junk games, ice cream van, roaming puppeteers & musicians all day. Wet weather venue: Ridgway School Hall.',
          },
          { time: '10:30–11:30am', title: 'Junk Puppet Workshop', duration: '1 hr', venue: 'green' },
          { time: '11:00–11:30am', title: 'Migit and the Dragon', by: 'Mary', duration: '30 mins', age: '3+', venue: 'hall' },
          { time: '11:50am', title: 'Bespoke Backpacks', by: 'Ally', duration: '45 mins', venue: 'upstairs' },
          { time: '12:00–12:45pm', title: 'Little Top Circus', by: 'Jon', duration: '45 mins', age: '3+', venue: 'hall' },
          { time: '12:00–1:00pm', title: 'Junk Puppet Workshop', duration: '1 hr', venue: 'green' },
          { time: '12:15–1:45pm', title: 'Make a Puppet and Bring It to Life', by: 'Birds', duration: '1.5 hrs', venue: 'upstairs' },
          { time: '1:15–2:00pm', title: 'The Fish: Festival Commission', by: 'Joey', duration: '40 mins', age: '7+', venue: 'hall' },
        ],
      },
      {
        label: 'Evening',
        events: [
          { time: '6:00–6:40pm', title: 'The Fish: Festival Commission', by: 'Joey', duration: '40 mins', venue: 'hall' },
          { time: '6:45–7:30pm', title: 'Pea Soup Dinner + Films', venue: 'hall' },
          { time: '7:30–8:00pm', title: 'Excerpt: Skylight', by: 'Birdlife', duration: '20 mins', venue: 'hall' },
          { time: '8:00–9:30pm', title: 'Cabaret', duration: '60 mins', venue: 'hall' },
        ],
      },
    ],
  },
  {
    id: 'sunday',
    day: 'Sunday',
    date: '20 Sep',
    parts: [
      {
        events: [
          { time: '9:00–11:00am', title: 'Shadow Puppetry Workshop', by: 'Rowena', duration: '2.5 hrs', venue: 'hall' },
          { time: 'All morning', title: 'Ad-hoc workshops & sharings', venue: 'upstairs' },
          { time: '11:15–11:50am', title: 'Puppets in Wartime', by: 'Simone', duration: '40 mins', venue: 'hall' },
          { time: '12:00–12:30pm', title: 'Night Shift', by: 'Steph', duration: '30 mins', age: '10+', venue: 'hall' },
          { time: '12:30–1:30pm', title: 'Closing Circle', venue: 'hall' },
          { time: 'TBC', title: 'Box of Birds', by: 'Birds', duration: '30 mins', age: '3+', note: 'BLENNZ', venue: 'ridgeway' },
          { time: 'TBC', title: 'Little Bad Mood', by: 'Marine', duration: '20 mins', age: '5+', venue: 'ridgeway' },
          { time: 'TBC', title: 'Paper Bag Family', by: 'Marine', duration: '45 mins', age: '5+', venue: 'ridgeway' },
        ],
      },
    ],
  },
]

/** Parse stored schedule JSON; fall back to the code default on any problem. */
export function parseSchedule(json: string | undefined | null): DaySchedule[] {
  if (!json?.trim()) return DEFAULT_SCHEDULE
  try {
    const parsed = JSON.parse(json)
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (d) => d && typeof d.id === 'string' && typeof d.day === 'string' && Array.isArray(d.parts),
      )
    ) {
      return parsed as DaySchedule[]
    }
  } catch {
    // fall through
  }
  return DEFAULT_SCHEDULE
}

export function serializeSchedule(days: DaySchedule[]): string {
  return JSON.stringify(days, null, 2)
}
