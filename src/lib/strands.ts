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
  /** Content warnings, comma separated. Shown under the blurb on the More info page. */
  warnings?: string
  /** Artist bio — only shown on the More info page. */
  bio?: string
  /** Creative team, one person per line ("Name (pronouns) — role"). */
  credits?: string
  /**
   * Photo strip on the More info page. An empty string is a deliberate slot —
   * it renders a "photo coming soon" box, so a show can be laid out before its
   * photos arrive and the path pasted in later without a code change.
   */
  images?: string[]
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

// Blurbs, bios and credits below are Bridget's "web text" docs (Jul 2026), one
// per show/workshop, transcribed as sent. Several artists appear twice across
// the weekend — the shared text lives here so the two copies can't drift.

// Bridget, 29 Jul: everything at Ridgway is there because the venue is
// wheelchair accessible (and roomier — it's what fits the 3-hour BLENNZ
// workshop). She wants that said on every Ridgway listing, not just the one.
const RIDGWAY_ACCESS = 'Wheelchair accessible venue.'

const BIRDLIFE_BLURB =
  'Peter and his grandma build a nesting box for Ruru — but Peter must learn to be patient and wait to discover who will eventually nest in his ‘Box of Birds’! The story introduces young children to the idea of supporting our precious manu and the different needs they may have. Hailed as “the cutest little show in Aotearoa” by Hamilton Arts Festival, this is an exquisitely produced puppet show with interactive songs and percussion, designed very specifically for young children and their whānau to enjoy.'

const BIRDLIFE_BIO =
  'Birdlife Productions Theatre for Children (aka Bridget and Roger Sanders) are an award-winning professional partnership with a passion for communicating a greater dimension of the world through Puppetry, Masks, Music and Storytelling. Based here in Pōneke, they produce original high-quality theatre using a hand-made low-tech aesthetic and intimate, sophisticated storytelling techniques, and are committed to creating shows for Schools, Kindergartens, Theatres and Festivals touring both nationally and internationally. Current touring shows are ‘The Boy with Wings’, ‘Box of Birds’ and ‘Aya and the Butterfly’. They initiated the re-establishment of the ‘Wellington Puppetry Festival’ in 2024.'

const BIRDLIFE_CREDITS =
  'Roger Sanders — Maker, Writer, Musician and Performer\nBridget Sanders — Director, Writer, Maker and Performer'

const CODDINGTON_BIO =
  'Jon Coddington is a New Zealand-based theatre designer, illustrator, animator, and President of UNIMA Aotearoa NZ, who has worked primarily as a puppeteer and puppet-maker for over 13 years. A graduate of Toi Whakaari: NZ Drama School, his highlights include the hit marionette show Puppet Fiction, creating and performing puppets for Fat Freddy’s Drop music videos, and performing on stage with Coldplay. He has worked in screen puppetry (Custard’s World, Sweet Tooth), with training from Muppeteer Peter Linz, and in theatre has made Taniwhas with Silo Theatre, Vultures with Indian Ink, Trolls with Trick of the Light, and Crocodiles with Auckland Theatre Company, amongst many others.'

const FISH_BLURB =
  'Specially commissioned by the Wellington Puppetry Festival with funding from The Peace and Disarmament Education Trust, ‘The Fish’ is a magical puppetry performance featuring giant fish puppets, shadow play, crankies and physical theatre. A father shares the tale of his mother, who chose to live forever as a sunfish. When his daughter is swallowed by a giant fish, past and reality collide in an unforgettable journey of courage, family and the sea.'

const FISH_BIO =
  'Joey Sheppard is an award-nominated multidisciplinary performer, puppeteer; and a graduate of Toi Whakaari New Zealand Drama School. Now based in Melbourne as part of St Martin’s Youth Arts EMBOLDEN Emerging Artist Program, she creates tactile, imaginative work that challenges expectations and gives voice to untold stories. Community is central to their practice; alongside fellow Toi grads, Joey created a youth arts initiative in the south of Aotearoa, sharing clowning, puppetry and movement with young people to nurture creativity and connection.'

const FISH_CREDITS =
  'Joey Sheppard (she/they) — Creative lead, performer, puppeteer and puppet maker\nThomas Steinmann (he/him) — Performer, head puppeteer'

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
          'Junk games, ice cream van, roaming puppeteers & musicians all day. Wet weather venue: Ridgway Hall.',
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
      {
        time: '10:00–10:30am',
        title: 'Box of Birds',
        image: '/images/shows/box-of-birds-1.jpg',
        images: ['/images/shows/box-of-birds-1.jpg', '/images/shows/box-of-birds-2.jpg'],
        by: 'Birdlife Productions',
        duration: '30 mins',
        age: '3–8',
        note: 'Audio described',
        venue: 'hall',
        blurb: BIRDLIFE_BLURB,
        bio: BIRDLIFE_BIO,
        credits: BIRDLIFE_CREDITS,
      },
      {
        time: '11:00–11:30am',
        title: 'Migit and the Dragon',
        image: '/images/shows/migit-and-the-dragon-1.jpg',
        images: ['/images/shows/migit-and-the-dragon-1.jpg', '/images/shows/migit-and-the-dragon-2.jpg'],
        by: 'Natural Magic',
        duration: '30 mins',
        age: '3–10',
        venue: 'hall',
        blurb:
          'Join Long John Knickers and Nudger as they tell you the tale of Migit and the Dragon — a “mouse moon myth”. This is an original story, told with glove and finger puppets, storytelling, mask and music. A little mouse goes on a quest to overcome the dragon which is threatening Mousetown. Along the way, he meets a Wizard, the Giant in the Sun and the Woman in the Moon, and faces his own fear, with surprising results. A participatory glove puppet show full of magic and fun!',
        bio:
          'Coming to the festival from Ōtautahi Christchurch, Kerry and Mary formed Natural Magic together in 1981 in the UK. They had both previously trained and worked as teachers. Since 1981 they have worked continuously as performers, writing and presenting their original shows and music. For the past 20 odd years (very odd years!) they have become increasingly identified with their pirate characters, Long John Knickers and Nudger. They are pirates for peace and for FUN, as immortalised by Margaret Mahy; loving friendship, community, adventure, curiosity and joy.',
        credits: 'Kerry and Mary McCammon — Joint writers, performers and musicians',
      },
      {
        time: '12:00–12:45pm',
        title: 'Little Top Circus',
        image: '/images/shows/little-top-circus-1.jpg',
        images: ['/images/shows/little-top-circus-1.jpg', '/images/shows/little-top-circus-2.jpg'],
        by: 'Jon Coddington',
        duration: '45 mins',
        age: 'All',
        venue: 'hall',
        blurb:
          'Little Top Circus is a tabletop circus, reminiscent of classic P. T. Barnum revelry, and aims to capture the spectacle of traditional circus on an unfolding and transforming box/table. Featuring acts such as the acrobat ‘The Amazing Piccini’, ‘Miss Baker’ the ‘Squirrel Monkey’ tight rope master, Clowns, Animal feats, and many more to amaze and delight. A fun new puppet show for all ages from a Master Puppeteer!',
        bio: CODDINGTON_BIO,
        credits:
          'Jon Coddington — Solo artist\nNatasha Wilson — Support\nHannah K. Clarke — Support',
      },

      {
        time: '1:15–2:00pm',
        title: 'The Fish — Commission',
        image: '/images/shows/the-fish-1.png',
        by: 'Joey Sheppard',
        duration: '40 mins',
        age: '7+',
        venue: 'hall',
        blurb: FISH_BLURB,
        warnings: 'Flashing lights. Fear of death (being eaten).',
        bio: FISH_BIO,
        credits: FISH_CREDITS,
        images: ['/images/shows/the-fish-1.png', '/images/shows/the-fish-2.png'],
      },
    ],
  },
  {
    id: 'sat-workshops',
    day: 'Saturday',
    title: 'Workshops',
    blurb: 'Captivating hands-on puppet workshops for ages 14+, morning and afternoon.',
    note: 'Check the programme here.',
    access: 'ticketed',
    events: [
      {
        time: '9:30–11:00am',
        title: 'Basic Mechanisms for Puppetry',
        image: '/images/shows/basic-mechanisms-1.jpg',
        images: ['/images/shows/basic-mechanisms-1.jpg', '/images/shows/basic-mechanisms-2.jpg'],
        by: 'Jon Coddington',
        duration: '1.5 hrs',
        age: '14+',
        venue: 'upstairs',
        blurb:
          'In this workshop we’ll look at Puppet mechanisms and how to incorporate them into puppet designs. Participants will get the chance to build prototypes from basic materials, and learn techniques to expand from small prototypes, to large scale work. For Puppetry enthusiasts and anyone interested in puppet design.',
        bio: CODDINGTON_BIO,
      },
      {
        time: '11:50am',
        title: 'Bespoke Backpacks for Giants and Walkabouts',
        image: '/images/shows/bespoke-backpacks-1.jpg',
        images: ['/images/shows/bespoke-backpacks-1.jpg', '/images/shows/bespoke-backpacks-2.jpg'],
        by: 'Ally Rogers',
        duration: '45 mins',
        age: '14+',
        venue: 'upstairs',
        blurb:
          'Ever wanted to build a Giant walkabout or roaming puppet? In this workshop you will get a step by step explanation of how to design and make backpacks to carry large puppets and walkabouts. From very simple, basic structures to heavy duty backpacks which will enable the carrying of heavier, taller structures. Ally will share where resources can be obtained or found and share ideas on how to make these projects more economically and environmentally friendly.',
        bio:
          'Ally Rogers was lucky to learn about lantern making many years ago and fell in love with the craft. Since then she has made many large scale Puppets, taught workshops and organised whole lantern festivals and parades. This love took her to the UK in 2018 where she worked with a team of Artists, and was taught how to make very large lantern puppets and the backpacks needed to carry them. Ally loves working in community and believes that we should share our knowledge and encourage creativity at all times.',
        credits:
          'Ally Rogers — Maker of lanterns, puppets, parade puppets, walkabouts, theatre props and costumes',
      },
      {
        time: '12:15–1:45pm',
        title: 'Make a Puppet and Bring it to Life!',
        image: '/images/shows/make-a-puppet-1.jpg',
        images: ['/images/shows/make-a-puppet-1.jpg', '/images/shows/make-a-puppet-2.jpg'],
        by: 'Bridget Sanders',
        duration: '90 mins',
        age: '14+',
        venue: 'upstairs',
        blurb:
          'A hands-on workshop offering a rare opportunity to build your own Practice Puppet (in the style of a table-top Sandglass training puppet) and explore techniques to breathe life into it. Perfect for anyone curious about puppetry, theatre practitioners wanting to expand their toolbox, Parents and curious teenagers, and lovers of handmade craft. No prior experience needed — just enthusiasm and a generous puppetry heart! All materials provided.',
        bio:
          'Bridget Sanders is Producer & Creative Director at Birdlife Productions and has been making and performing with Puppetry for the last 15 years. For Bridget, puppetry is a direct link from her handcraft to storytelling and performance. She was fortunate to work alongside Akiko Miyamoto, a Master Japanese puppeteer living in Whakatū Nelson, who inspired her to make simple Bunraku style puppets. Most of her puppetry to date is influenced by these rudimentary beginnings, with the addition of shadow puppetry, and the inclusion of scale shift (from very small to very big).\n\nTraining includes: Mask & Clown at the John Bolton Theatre School in Melbourne, Puppetry with Sandglass Puppet Theatre, USA and Puppet making with Judith Hope, UK.',
      },
      // Lauren and Judith's BLENNZ access workshop. The 29 Jul itinerary gives
      // it the Saturday 2–5pm slot at Ridgway — the only afternoon session, and
      // the only one not at the Bowling Club.
      {
        time: '2:00–5:00pm',
        title: 'Building Access from the Start',
        image: '/images/shows/building-access-1.jpg',
        images: ['/images/shows/building-access-1.jpg'],
        by: 'Lauren Hayes and Judith Jones',
        duration: '3 hrs',
        age: '14+',
        note: 'BLENNZ',
        venue: 'ridgeway',
        detail: RIDGWAY_ACCESS,
        blurb:
          'How to engage blind and low vision audiences. Find out how you can develop shows that are more accessible for blind and low vision audiences, and learn how to describe the key visual elements of one of your own puppets. This workshop builds your understanding of blind and low vision experience, and offers practical skills to create more accessible performances. We’ll discuss how you can effectively engage with this audience from booking tickets to making everyone comfortable when they arrive. Bring along a puppet, and learn how to audio describe its visual characteristics. Audio description is central to connecting with this audience. We’ll provide resources so you can keep developing your skills following the workshop.',
        bio:
          'This workshop is led by a blind arts consultant and a sighted audio describer. Lauren and Judith are excited to share their skills and experience with the world of puppetry. As a blind consultant, Lauren brings first hand knowledge, along with technical and practical expertise in the arts and digital sectors. She’s recently worked to build more accessibility into the NZ Festival of the Arts. Lauren is a co-director of Wellington’s DAT Fest, an accessible platform for disabled artists and audiences. Judith has audio described all sorts of performances, and is a huge advocate for how this skill can support more meaningful experiences for blind and low vision audiences. She trains audio describers in the gallery and museums sector, including how to effectively incorporate touch into a guided tour.',
        credits:
          'Lauren Hayes (she/her) — Arts Accessibility Consultant\nJudith Jones (she/her) — Audio Describer',
      },
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
      { time: '5:30–5:45pm', title: 'Doors open', venue: 'hall' },
      { time: '5:45–5:55pm', title: 'Karakia & Opening Circle', venue: 'hall' },
      {
        time: '6:00–6:40pm',
        title: 'The Fish — Commission',
        image: '/images/shows/the-fish-1.png',
        by: 'Joey Sheppard',
        duration: '40 mins',
        age: '7+',
        venue: 'hall',
        blurb: FISH_BLURB,
        warnings: 'Flashing lights. Fear of death (being eaten).',
        bio: FISH_BIO,
        credits: FISH_CREDITS,
        images: ['/images/shows/the-fish-1.png', '/images/shows/the-fish-2.png'],
      },
      { time: '6:50–7:40pm', title: 'Pea Soup Dinner + Films', venue: 'hall' },
      // Bridget, 29 Jul: Birdlife's 'Skylight' excerpt is out, and the cabaret
      // stretches to fill the slot it left.
      { time: '7:50–9:30pm', title: 'Puppet Cabaret', duration: '1 hr 40 mins', venue: 'hall' },
    ],
  },

  {
    id: 'sun-shows',
    day: 'Sunday',
    title: 'Shows for Children and whānau',
    blurb: 'Another morning of accessible shows.',
    access: 'ticketed',
    events: [
      {
        time: '10:00–10:30am',
        title: 'Box of Birds',
        image: '/images/shows/box-of-birds-1.jpg',
        images: ['/images/shows/box-of-birds-1.jpg', '/images/shows/box-of-birds-2.jpg'],
        by: 'Birdlife Productions',
        duration: '30 mins',
        age: '3–8',
        note: 'Audio described',
        venue: 'ridgeway',
        detail: RIDGWAY_ACCESS,
        blurb: BIRDLIFE_BLURB,
        bio: BIRDLIFE_BIO,
        credits: BIRDLIFE_CREDITS,
      },
      { time: '10:45–11:10am', title: 'Little Bad Mood', by: 'Marine', duration: '20 mins', age: '5+', venue: 'ridgeway', detail: RIDGWAY_ACCESS },
      {
        time: '12:00–12:30pm',
        title: 'Night Shift',
        image: '/images/shows/night-shift-1.jpg',
        images: ['/images/shows/night-shift-1.jpg', '/images/shows/night-shift-2.jpg'],
        by: 'Stephanie Cairns',
        duration: '30 mins',
        age: '10+',
        note: 'PG',
        venue: 'hall',
        blurb:
          'A funny exploration of community, anonymity and passive aggressive notes inspired by real-life texts. When disaster strikes, can we face the fact that we need each other, or do we want to stay hidden behind closed curtains? Can the puppet characters be brave enough to talk to each other and realise their interdependency, even after some rude and snarky behaviour? This is a shadow puppet work for our times using Stephanie’s (of Birdfeeder fame) inimitable puppetry style and highly crafted live soundtrack.',
        bio:
          'Stephanie has been playing around with shadow puppets since ages ago, after encountering Indonesian puppetry through her musical involvement in Wellington’s Javanese gamelan. She has taken her shows to Cuba Dupa, the Wellington Folk Festival and previous editions of the Wellington Puppetry Festival. Also a musician, Stephanie has created a large scale shadow puppetry show set to the music of her band, Birdfeeder. She’s also dabbled in giant street puppetry and collaborated with Anna Bailey (String Bean Puppets) both as a musician and puppeteer, including work for the latest TAHI festival — ‘Flutter’.',
      },
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
      {
        time: '9:00–11:30am',
        title: 'Exploring 3D Shadows',
        image: '/images/shows/exploring-3d-shadows-1.jpg',
        images: ['/images/shows/exploring-3d-shadows-1.jpg'],
        by: 'Rowena MacGill',
        duration: '2.5 hrs',
        age: '14+',
        venue: 'hall',
        blurb:
          'Movement and shadows can create wonderful worlds with which to enhance your shows, as backgrounds or main features. This stunning extended 2.5 hour workshop explores techniques of using 3D shadows with puppets, sets and lighting with one of Aotearoa’s top Shadow puppetry experts. If you enjoyed Rowena’s offerings at the Festival in 2024, give yourself a treat and sign up for this workshop.\n\nWe will be working with cardboard and participants are encouraged to bring craft knives, pencils, eraser, thin and thick cardboard, cutting board and anything to enhance puppets or sets eg wool, lace, small leaves or twigs. Fun!',
        warnings: 'The room will be in blackout at times.',
        bio:
          'Rowena MacGill (she/her) has been a Shadow Puppetry performer for 45 years, both here and in Japan. Coming to puppetry from an educational background, the message of her work is important to her. She feels workshops can be of great value to families and children as it helps them express their creativity and encourages manipulation skills. Rowena has always enjoyed going to ‘out of the way’ places with her work and has undertaken many international tours.',
      },
      // Late submission — Bridget is still waiting on Sarah's write-up, so
      // there's no real title yet. Time and venue are firm.
      { time: '10:00–11:00am', title: 'Workshop with Sarah Bell', by: 'Sarah Bell', duration: '1 hr', venue: 'upstairs' },
      {
        time: '11:15–11:50am',
        title: 'Puppetry in Warzones',
        image: '/images/shows/puppetry-in-warzones-1.jpg',
        images: ['/images/shows/puppetry-in-warzones-1.jpg', '/images/shows/puppetry-in-warzones-2.jpg'],
        by: 'Simone van Kan',
        duration: '40 mins',
        age: '14+',
        venue: 'upstairs',
        blurb:
          'Immerse yourselves for a while in the true meaning of ‘Puppets for Peace!’ Come and hear how Simone performed for orphans and refugees in war-torn Bosnia and Herzegovina and Romania during the nineties with her work ‘The Serious Road Trip’. If you ever doubted the power of puppetry to heal and inspire, this talk is for you!',
        bio:
          'Simone began her puppetry journey by performing fairytales and other stories with ‘The Little People’s Puppet Theatre’ in Rotorua in the 70s. She was able to draw on this experience when touring orphanages and refugee camps with her own puppet and clown work ‘The Serious Road Trip’. On returning to Aotearoa, she developed this story further, honing and specialising in Puppetry. She received scholarships to train with masters from around the world such as Berlin, Bochum, Paris and Wellington with Capital E. Simone is visiting the Festival from the Bay of Plenty.',
      },
      { time: '11:15am–12:00pm', title: 'Paper Bag Family', by: 'Marine', duration: '45 mins', age: '5+', venue: 'ridgeway', detail: RIDGWAY_ACCESS },
    ],
  },
  {
    id: 'sun-closing',
    day: 'Sunday',
    title: 'Closing Circle',
    blurb:
      'For anyone who wants to acknowledge and celebrate our wonderful weekend together.',
    note: '12:45–1:30pm at the Hall.',
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
  return Boolean(
    ev.blurb?.trim() ||
      ev.bio?.trim() ||
      ev.credits?.trim() ||
      ev.image?.trim() ||
      ev.images?.length,
  )
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
