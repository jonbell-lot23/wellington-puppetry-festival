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

// Sarah, 11 Aug: Humanitix is live. Everything sells from one page, with the
// four ticket groups reachable as anchors on it. The numbering starts at
// zero — #group1 is the Saturday workshops, *not* the shows.
export const TICKETS_URL = 'https://events.humanitix.com/wellingtonpuppetryfestival/tickets'
/** Puppet Shows — every ticketed show, Saturday and Sunday. */
export const TICKETS_SHOWS_URL = `${TICKETS_URL}#group0`
export const TICKETS_SAT_WORKSHOPS_URL = `${TICKETS_URL}#group1`
export const TICKETS_SUN_WORKSHOPS_URL = `${TICKETS_URL}#group2`
/** Pea Soup + Puppets for Peace Cabaret — one ticket for the whole evening. */
export const TICKETS_CABARET_URL = `${TICKETS_URL}#group3`

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
  /** Alt text for `image`. Falls back to the event title if left blank. */
  imageAlt?: string
  /** Longer blurb — only shown on the event's own More info page. */
  blurb?: string
  /** Content warnings, comma separated. Shown under the blurb on the More info page. */
  warnings?: string
  /** Artist bio — only shown on the More info page. */
  bio?: string
  /** Creative team, one person per line ("Name (pronouns), role"). */
  credits?: string
  /**
   * Photo strip on the More info page. An empty string is a deliberate slot —
   * it renders a "photo coming soon" box, so a show can be laid out before its
   * photos arrive and the path pasted in later without a code change.
   */
  images?: string[]
  /** Alt text per photo in `images`, same order. Falls back to "{title} — photo N". */
  imagesAlt?: string[]
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
  free: { label: 'Free, no ticket needed', bg: 'var(--wpf-blue-soft)', fg: 'var(--wpf-ink)' },
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
  'Peter and his grandma build a nesting box for Ruru, but Peter must learn to be patient and wait to discover who will eventually nest in his ‘Box of Birds’! The story introduces young children to the idea of supporting our precious manu and the different needs they may have. Hailed as “the cutest little show in Aotearoa” by Hamilton Arts Festival, this is an exquisitely produced puppet show with interactive songs and percussion, designed very specifically for young children and their whānau to enjoy.'

const BIRDLIFE_BIO =
  'Birdlife Productions Theatre for Children (aka Bridget and Roger Sanders) are an award-winning professional partnership with a passion for communicating a greater dimension of the world through Puppetry, Masks, Music and Storytelling. Based here in Te Whanganui-a-Tara, they produce original high-quality theatre using a hand-made low-tech aesthetic and intimate, sophisticated storytelling techniques, and are committed to creating shows for Schools, Kindergartens, Theatres and Festivals touring both nationally and internationally. Current touring shows are ‘The Boy with Wings’, ‘Box of Birds’ and ‘Aya and the Butterfly’. They initiated the re-establishment of the ‘Wellington Puppetry Festival’ in 2024.'

const BIRDLIFE_CREDITS =
  'Roger Sanders, Maker, Writer, Musician and Performer\nBridget Sanders, Director, Writer, Maker and Performer'

const CODDINGTON_BIO =
  'Jon Coddington is a New Zealand-based theatre designer, illustrator, animator, and President of UNIMA Aotearoa NZ, who has worked primarily as a puppeteer and puppet-maker for over 13 years. A graduate of Toi Whakaari: NZ Drama School, his highlights include the hit marionette show Puppet Fiction, creating and performing puppets for Fat Freddy’s Drop music videos, and performing on stage with Coldplay. He has worked in screen puppetry (Custard’s World, Sweet Tooth), with training from Muppeteer Peter Linz, and in theatre has made Taniwhas with Silo Theatre, Vultures with Indian Ink, Trolls with Trick of the Light, and Crocodiles with Auckland Theatre Company, amongst many others.'

const FISH_BLURB =
  'Specially commissioned by the Wellington Puppetry Festival with funding from The Peace and Disarmament Education Trust, ‘The Fish’ is a magical puppetry performance featuring giant fish puppets, shadow play, crankies and physical theatre. A father shares the tale of his mother, who chose to live forever as a sunfish. When his daughter is swallowed by a giant fish, past and reality collide in an unforgettable journey of courage, family and the sea.'

const FISH_BIO =
  'Joey Sheppard is an award-nominated multidisciplinary performer, puppeteer; and a graduate of Toi Whakaari New Zealand Drama School. Now based in Melbourne as part of St Martin’s Youth Arts EMBOLDEN Emerging Artist Program, she creates tactile, imaginative work that challenges expectations and gives voice to untold stories. Community is central to their practice; alongside fellow Toi grads, Joey created a youth arts initiative in the south of Aotearoa, sharing clowning, puppetry and movement with young people to nurture creativity and connection.'

const FISH_CREDITS =
  'Joey Sheppard (she/they), Creative lead, performer, puppeteer and puppet maker\nThomas Steinmann (he/him), Performer, head puppeteer'

// Alt text for photos reused across two listings each (Box of Birds and The
// Fish both run twice over the weekend, sharing the same production photos).
const BOX_OF_BIRDS_IMAGE_ALT =
  "Peter and his grandma puppets, an older character in a knitted headscarf embracing a boy puppet in a blue beanie"
const BOX_OF_BIRDS_IMAGES_ALT = [
  BOX_OF_BIRDS_IMAGE_ALT,
  'Two fluffy baby owl (ruru) puppets peeking over a wooden nesting box, with a third owl looking out through its round hole',
]
const FISH_IMAGE_ALT =
  'A shadow-puppet child figure suspended by threads over a lit screen, a hand reaching down from above'
const FISH_IMAGES_ALT = [
  FISH_IMAGE_ALT,
  'A leaping fish shadow puppet silhouetted against a glowing paper screen inside billowing dark fabric',
]

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
    note: 'No ticket required. Pack a picnic and bring the whānau.',
    access: 'free',
    events: [
      {
        time: '10:00am–2:00pm',
        title: 'Free KidsZone',
        venue: 'green',
        detail:
          'Junk games, ice cream van, roaming puppeteers & musicians all day. Wet weather venue: Ridgway School Hall.',
      },
      { time: '10:30–11:30am', title: 'Junk Puppet Workshop', duration: '1 hr', venue: 'green' },
      { time: '12:00–1:00pm', title: 'Junk Puppet Workshop', duration: '1 hr', venue: 'green' },
    ],
  },
  {
    id: 'sat-shows',
    day: 'Saturday',
    // Bridget, 24 Aug (off Sarah's observation that Humanitix groups the
    // tickets this way): titled to match the ticket groups ("Saturday Shows"
    // / "Sunday Shows") — was "Shows for Children and whānau". The blurb
    // keeps the who-it's-for framing the title used to carry.
    title: 'Saturday Shows',
    blurb: 'A morning of glorious puppet shows designed for different ages to enjoy!',
    note: 'Check the programme here and buy your tickets quick.',
    access: 'ticketed',
    events: [
      {
        time: '10:00–10:30am',
        title: 'Box of Birds',
        ticketUrl: TICKETS_SHOWS_URL,
        image: '/images/shows/box-of-birds-1.jpg',
        imageAlt: BOX_OF_BIRDS_IMAGE_ALT,
        images: ['/images/shows/box-of-birds-1.jpg', '/images/shows/box-of-birds-2.jpg'],
        imagesAlt: BOX_OF_BIRDS_IMAGES_ALT,
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
        ticketUrl: TICKETS_SHOWS_URL,
        image: '/images/shows/migit-and-the-dragon-1.jpg',
        imageAlt: "Kerry and Mary McCammon performing with a suitcase puppet featuring sun and moon faces, to a classroom of children with hands raised",
        images: ['/images/shows/migit-and-the-dragon-1.jpg', '/images/shows/migit-and-the-dragon-2.jpg'],
        imagesAlt: [
          "Kerry and Mary McCammon performing with a suitcase puppet featuring sun and moon faces, to a classroom of children with hands raised",
          "Kerry and Mary McCammon in pirate costume as Long John Knickers and Nudger, performing with a ukulele at an outdoor event",
        ],
        by: 'Natural Magic',
        duration: '30 mins',
        age: '3–10',
        venue: 'hall',
        blurb:
          'Join Long John Knickers and Nudger as they tell you the tale of Migit and the Dragon, a “mouse moon myth”. This is an original story, told with glove and finger puppets, storytelling, mask and music. A little mouse goes on a quest to overcome the dragon which is threatening Mousetown. Along the way, he meets a Wizard, the Giant in the Sun and the Woman in the Moon, and faces his own fear, with surprising results. A participatory glove puppet show full of magic and fun!',
        bio:
          'Coming to the festival from Ōtautahi Christchurch, Kerry and Mary formed Natural Magic together in 1981 in the UK. They had both previously trained and worked as teachers. Since 1981 they have worked continuously as performers, writing and presenting their original shows and music. For the past 20 odd years (very odd years!) they have become increasingly identified with their pirate characters, Long John Knickers and Nudger. They are pirates for peace and for FUN, as immortalised by Margaret Mahy; loving friendship, community, adventure, curiosity and joy.',
        credits: 'Kerry and Mary McCammon, Joint writers, performers and musicians',
      },
      {
        time: '12:00–12:45pm',
        title: 'Little Top Circus',
        ticketUrl: TICKETS_SHOWS_URL,
        image: '/images/shows/little-top-circus-1.jpg',
        imageAlt: "A marionette circus strongman puppet in a red-and-white striped costume with a waxed moustache and boots",
        images: ['/images/shows/little-top-circus-1.jpg', '/images/shows/little-top-circus-2.jpg'],
        imagesAlt: [
          "A marionette circus strongman puppet in a red-and-white striped costume with a waxed moustache and boots",
          "Close-up of a foam clown-face puppet head with a red nose and big round ears",
        ],
        by: 'Jon Coddington',
        duration: '45 mins',
        age: 'All',
        venue: 'hall',
        blurb:
          'Little Top Circus is a tabletop circus, reminiscent of classic P. T. Barnum revelry, and aims to capture the spectacle of traditional circus on an unfolding and transforming box/table. Featuring acts such as the acrobat ‘The Amazing Piccini’, ‘Miss Baker’ the ‘Squirrel Monkey’ tight rope master, Clowns, Animal feats, and many more to amaze and delight. A fun new puppet show for all ages from a Master Puppeteer!',
        bio: CODDINGTON_BIO,
        credits:
          'Jon Coddington, Solo artist\nNatasha Wilson, Support\nHannah K. Clarke, Support',
      },

      {
        time: '1:15–2:00pm',
        title: 'The Fish: Festival Commission',
        ticketUrl: TICKETS_SHOWS_URL,
        image: '/images/shows/the-fish-1.png',
        imageAlt: FISH_IMAGE_ALT,
        by: 'Joey Sheppard',
        duration: '40 mins',
        age: '7+',
        venue: 'hall',
        blurb: FISH_BLURB,
        warnings: 'Flashing lights. Fear of death (being eaten).',
        bio: FISH_BIO,
        credits: FISH_CREDITS,
        images: ['/images/shows/the-fish-1.png', '/images/shows/the-fish-2.png'],
        imagesAlt: FISH_IMAGES_ALT,
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
        ticketUrl: TICKETS_SAT_WORKSHOPS_URL,
        image: '/images/shows/basic-mechanisms-1.jpg',
        imageAlt: "A mechanical four-legged dog puppet built from wood, wire and hinges, showing its internal movement mechanism",
        images: ['/images/shows/basic-mechanisms-1.jpg', '/images/shows/basic-mechanisms-2.jpg'],
        imagesAlt: [
          "A mechanical four-legged dog puppet built from wood, wire and hinges, showing its internal movement mechanism",
          "Jon Coddington smiling while operating a large vulture puppet with tattered wings, in front of a seated workshop audience",
        ],
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
        ticketUrl: TICKETS_SAT_WORKSHOPS_URL,
        image: '/images/shows/bespoke-backpacks-1.jpg',
        imageAlt: "A glowing green goblin-faced giant puppet waving to a nighttime street parade crowd",
        images: ['/images/shows/bespoke-backpacks-1.jpg', '/images/shows/bespoke-backpacks-2.jpg'],
        imagesAlt: [
          "A glowing green goblin-faced giant puppet waving to a nighttime street parade crowd",
          "A fluffy white giant puppet head strapped into a wooden carrying-backpack frame",
        ],
        by: 'Ally Rogers',
        duration: '45 mins',
        age: '14+',
        venue: 'upstairs',
        blurb:
          'Ever wanted to build a Giant walkabout or roaming puppet? In this workshop you will get a step by step explanation of how to design and make backpacks to carry large puppets and walkabouts. From very simple, basic structures to heavy duty backpacks which will enable the carrying of heavier, taller structures. Ally will share where resources can be obtained or found and share ideas on how to make these projects more economically and environmentally friendly.',
        bio:
          'Ally Rogers was lucky to learn about lantern making many years ago and fell in love with the craft. Since then she has made many large scale Puppets, taught workshops and organised whole lantern festivals and parades. This love took her to the UK in 2018 where she worked with a team of Artists, and was taught how to make very large lantern puppets and the backpacks needed to carry them. Ally loves working in community and believes that we should share our knowledge and encourage creativity at all times.',
        credits:
          'Ally Rogers, Maker of lanterns, puppets, parade puppets, walkabouts, theatre props and costumes',
      },
      // Bridget, 18 Aug: her own "Make a Puppet and Bring it to Life!" is out of
      // the weekend, and Sarah's workshop takes the slot it leaves — moved here
      // from Sunday, at 12:30 rather than Bridget's old 12:15–1:45pm.
      //
      // The master sheet calls it "Patterns for Puppet heads". Sarah has since
      // given it the fuller subtitle below, which is what Humanitix sells it
      // under and what a ticket-holder will have seen.
      //
      // Jon, 4 Sep: this entry had drifted badly from the live record — the
      // stored strandsJson has carried Sarah's blurb, bio and photos since
      // 20 Aug while this fallback still said "no blurb yet". Re-synced from
      // the DB so the fallback isn't a worse page than the real one.
      //
      // Photos 3 and 4 are the two Sarah sent on 4 Sep, appended to the
      // gallery; 1 (the marked-up sculpt) stays the lead image and 2 is her
      // portrait.
      {
        time: '12:30–1:30pm',
        title: 'Pattern Making for Puppets: From Sculpt to Pattern',
        ticketUrl: TICKETS_SAT_WORKSHOPS_URL,
        image: '/images/shows/pattern-making-for-puppets-1.jpg',
        imageAlt:
          "A pale foam head sculpt marked up with pattern lines and labels such as 'front brow', 'eye bag' and 'side nose', sitting on a workbench surrounded by craft supplies.",
        images: [
          '/images/shows/pattern-making-for-puppets-1.jpg',
          '/images/shows/pattern-making-for-puppets-2.jpg',
          '/images/shows/pattern-making-for-puppets-3.jpg',
          '/images/shows/pattern-making-for-puppets-4.jpg',
        ],
        imagesAlt: [
          "A pale foam head sculpt marked up with pattern lines and labels such as 'front brow', 'eye bag' and 'side nose', sitting on a workbench surrounded by craft supplies.",
          'Portrait of Sarah Bell, a woman with long brown hair wearing colourful patterned glasses and red lipstick.',
          "A felt animal head, machine-stitched together from flat pattern pieces, fitted over a dressmaker's head form in a busy workroom.",
          "Three sculpted puppet heads wrapped in tape, each drawn over in marker with seam lines and labels such as 'nose', 'cheek', 'F eye' and 'chin'.",
        ],
        by: 'Sarah Bell',
        duration: '1 hr',
        venue: 'upstairs',
        detail: "Optional – bring a small thing you'd like to make a pattern from.",
        blurb:
          "Learn how to translate a three-dimensional form into a working pattern, whether from your own sculpt or an existing toy or object. We'll cover the practicalities of scaling your pattern up or down to suit your puppet, and explore how your choice of materials shapes not only the look of your puppet but the pattern itself. Leave with the skills to design and make your own.",
        bio:
          "Sarah Bell is a maker working in puppetry design, fabrication and costume for theatre and film. Her work combines traditional craftsmanship with practical problem-solving and a huge range of materials. She specialises in the weird, wild, and wonderful and is based in Wellington. Her 'Finding Nemo' puppets were an amazing and memorable addition to the Saturday Gala of the 2024 Puppetry Festival!",
      },
      // Lauren and Judith's BLENNZ access workshop. The 29 Jul itinerary gives
      // it the Saturday 2–5pm slot at Ridgway — the only afternoon session, and
      // the only one not at the Bowling Club.
      {
        time: '2:00–5:00pm',
        title: 'Building Access from the Start',
        ticketUrl: TICKETS_SAT_WORKSHOPS_URL,
        image: '/images/shows/building-access-1.jpg',
        imageAlt: "Portrait of a woman with short grey hair, smiling",
        images: ['/images/shows/building-access-1.jpg'],
        imagesAlt: [
          "Portrait of a woman with short grey hair, smiling",
        ],
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
          'Lauren Hayes (she/her), Arts Accessibility Consultant\nJudith Jones (she/her), Audio Describer',
      },
    ],
  },
  {
    id: 'sat-peace',
    day: 'Saturday',
    title: 'Puppets for Peace and Pea Soup Platter',
    blurb:
      'An evening of cutting-edge puppetry entertainment, including our freshly commissioned work by Joey Sheppard, a scintillating puppet cabaret, all rounded off with a gourmet dinner, all included in the price.',
    access: 'ticketed',
    // One ticket covers the whole evening, so the link belongs on the card
    // rather than on each row inside it.
    ctaLabel: 'Get Cabaret Tickets',
    ctaUrl: TICKETS_CABARET_URL,
    events: [
      { time: '5:30–5:45pm', title: 'Doors open', venue: 'hall' },
      { time: '5:45–5:55pm', title: 'Karakia & Opening Circle', venue: 'hall' },
      {
        time: '6:00–6:40pm',
        title: 'The Fish: Festival Commission',
        image: '/images/shows/the-fish-1.png',
        imageAlt: FISH_IMAGE_ALT,
        by: 'Joey Sheppard',
        duration: '40 mins',
        age: '7+',
        venue: 'hall',
        blurb: FISH_BLURB,
        warnings: 'Flashing lights. Fear of death (being eaten).',
        bio: FISH_BIO,
        credits: FISH_CREDITS,
        images: ['/images/shows/the-fish-1.png', '/images/shows/the-fish-2.png'],
        imagesAlt: FISH_IMAGES_ALT,
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
    // Bridget, 24 Aug: matches Humanitix, see sat-shows.
    title: 'Sunday Shows',
    blurb: 'Another morning of accessible shows.',
    access: 'ticketed',
    events: [
      {
        time: '10:00–10:30am',
        title: 'Box of Birds',
        ticketUrl: TICKETS_SHOWS_URL,
        image: '/images/shows/box-of-birds-1.jpg',
        imageAlt: BOX_OF_BIRDS_IMAGE_ALT,
        images: ['/images/shows/box-of-birds-1.jpg', '/images/shows/box-of-birds-2.jpg'],
        imagesAlt: BOX_OF_BIRDS_IMAGES_ALT,
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
        // Bridget, 24 Aug: Steph's show moves to the morning.
        time: '10:00–10:30am',
        title: 'Night Shift',
        image: '/images/shows/night-shift-1.jpg',
        imageAlt: "A shadow-puppet screen showing a city skyline with a bridge, buildings and trees, with a performer silhouetted reaching up beside it",
        images: ['/images/shows/night-shift-1.jpg', '/images/shows/night-shift-2.jpg'],
        imagesAlt: [
          "A shadow-puppet screen showing a city skyline with a bridge, buildings and trees, with a performer silhouetted reaching up beside it",
          "A blue-lit shadow puppet screen showing a city skyline with a bridge and a leaping fish silhouette under a crescent moon",
        ],
        by: 'Stephanie Cairns',
        duration: '30 mins',
        age: '10+',
        note: 'PG',
        venue: 'hall',
        blurb:
          'A funny exploration of community, anonymity and passive aggressive notes inspired by real-life texts. When disaster strikes, can we face the fact that we need each other, or do we want to stay hidden behind closed curtains? Can the puppet characters be brave enough to talk to each other and realise their interdependency, even after some rude and snarky behaviour? This is a shadow puppet work for our times using Stephanie’s (of Birdfeeder fame) inimitable puppetry style and highly crafted live soundtrack.',
        bio:
          'Stephanie has been playing around with shadow puppets since ages ago, after encountering Indonesian puppetry through her musical involvement in Wellington’s Javanese gamelan. She has taken her shows to Cuba Dupa, the Wellington Folk Festival and previous editions of the Wellington Puppetry Festival. Also a musician, Stephanie has created a large scale shadow puppetry show set to the music of her band, Birdfeeder. She’s also dabbled in giant street puppetry and collaborated with Anna Bailey (String Bean Puppets) both as a musician and puppeteer, including work for the latest TAHI festival, ‘Flutter’.',
      },
      // Bridget, 26 Aug: Simone's talk moves across from the Sunday
      // Workshops card to sit here, before Asra — it reads as a show, not a
      // workshop, and the Sunday afternoon in the Hall now runs in one
      // continuous list so people can see what follows what.
      {
        // Bridget, 18 Aug: moved to Vogelmorn Hall, same day, a quarter of an
        // hour earlier than the 11:15–11:50am it used to hold.
        // Bridget, 24 Aug: 11:00–11:30 — a 30-minute slot, though her note
        // still says 40 mins. Times as sent; the duration below is hers too.
        time: '11:00–11:30am',
        title: 'Puppetry in Warzones',
        // Bridget calls this "Simone's Free Talk", so the workshop ticket link
        // it carried under sun-workshops comes off and the row says free
        // instead — the card chip above it reads "Ticketed" for the shows.
        detail: 'Free, no ticket needed.',
        image: '/images/shows/puppetry-in-warzones-1.jpg',
        imageAlt: "Simone van Kan laughing while holding up a fantastical furry monster hand-puppet with purple hair and big round eyes",
        images: ['/images/shows/puppetry-in-warzones-1.jpg', '/images/shows/puppetry-in-warzones-2.jpg'],
        imagesAlt: [
          "Simone van Kan laughing while holding up a fantastical furry monster hand-puppet with purple hair and big round eyes",
          "An old photograph of two performers posing beside large costumed puppet figures, one in a polka-dot dress, one blue-faced in striped pyjamas",
        ],
        by: 'Simone van Kan',
        duration: '40 mins',
        age: '14+',
        venue: 'hall',
        blurb:
          'Immerse yourselves for a while in the true meaning of ‘Puppets for Peace!’ Come and hear how Simone performed for orphans and refugees in war-torn Bosnia and Herzegovina and Romania during the nineties with her work ‘The Serious Road Trip’. If you ever doubted the power of puppetry to heal and inspire, this talk is for you!',
        bio:
          'Simone began her puppetry journey by performing fairytales and other stories with ‘The Little People’s Puppet Theatre’ in Rotorua in the 70s. She was able to draw on this experience when touring orphanages and refugee camps with her own puppet and clown work ‘The Serious Road Trip’. On returning to Aotearoa, she developed this story further, honing and specialising in Puppetry. She received scholarships to train with masters from around the world such as Berlin, Bochum, Paris and Wellington with Capital E. Simone is visiting the Festival from the Bay of Plenty.',
      },
      // Bridget, 24 Aug: new to the programme — Asra, from Sumud Ensemble,
      // midday Sunday in the Hall. Went in as its own card first (so the 14+
      // and content warning sat on the card face); Bridget, 25 Aug: list it
      // under Sunday Shows like the others. The warnings still lead the More
      // info page. Blurb, bio and credits are from the ensemble's own doc,
      // as sent.
      {
        time: '12:00–1:00pm',
        title: 'Asra: Stories of Palestinian Prisoners',
        by: 'Sumud Ensemble',
        duration: '60 mins',
        age: '14+',
        venue: 'hall',
        image: '/images/shows/asra-1.jpg',
        imageAlt:
          'Two performers dressed in black kneel in darkness, operating a life-size child puppet in ochre-coloured clothing as it reaches one arm forward into the light.',
        images: ['/images/shows/asra-1.jpg'],
        imagesAlt: [
          'Two performers dressed in black kneel in darkness, operating a life-size child puppet in ochre-coloured clothing as it reaches one arm forward into the light.',
        ],
        blurb:
          'Palestinian prisoners detained and arrested by the Israeli military occupation are referred to as Captives or Asra أسرى. Using puppetry and audience participation, this documentary theatre production explores the experiences of Asra and the importance of Thaqafah ثقافة or Culture, such as literature, poetry, and songs, as practices of resistance and liberation.\n\nSo often puppetry is thought of as a children’s art form and it is rare to have shows in Aotearoa for adult audiences that address serious topics. We are very excited to welcome Asra to our festival, fitting so well into our theme of ‘Puppets for Peace’.',
        warnings: 'Depictions of torture and abuse.',
        bio:
          'We are Sumud Ensemble. We make theatre in solidarity with Palestinians and for liberation of all oppressed peoples everywhere. We are enthusiastic learners when it comes to Puppetry! Some of our rōpū are mimes and have experience making puppets, others are voice actors and musicians.',
        credits:
          'Rand Hazou, Director\nPaul Lewis, Puppetry Director\nTerry Hooper, Performer\nZoe Higgins, Performer\nAcacia O’Connor, Performer',
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
        // Bridget, 24 Aug: re-timed from 9:00–11:30am.
        time: '10:45am–1:15pm',
        title: 'Exploring 3D Shadows',
        ticketUrl: TICKETS_SUN_WORKSHOPS_URL,
        image: '/images/shows/exploring-3d-shadows-1.jpg',
        imageAlt: "A shadow puppet screen showing a line of animal silhouettes (a bird, cat and dog) holding hands mid-dance",
        images: ['/images/shows/exploring-3d-shadows-1.jpg'],
        imagesAlt: [
          "A shadow puppet screen showing a line of animal silhouettes (a bird, cat and dog) holding hands mid-dance",
        ],
        by: 'Rowena MacGill',
        duration: '2.5 hrs',
        age: '14+',
        // Bridget, 18 Aug: moved to Upstairs. Same day, same times.
        venue: 'upstairs',
        blurb:
          'Movement and shadows can create wonderful worlds with which to enhance your shows, as backgrounds or main features. This stunning extended 2.5 hour workshop explores techniques of using 3D shadows with puppets, sets and lighting with one of Aotearoa’s top Shadow puppetry experts. If you enjoyed Rowena’s offerings at the Festival in 2024, give yourself a treat and sign up for this workshop.\n\nWe will be working with cardboard and participants are encouraged to bring craft knives, pencils, eraser, thin and thick cardboard, cutting board and anything to enhance puppets or sets eg wool, lace, small leaves or twigs. Fun!',
        warnings: 'The room will be in blackout at times.',
        bio:
          'Rowena MacGill (she/her) has been a Shadow Puppetry performer for 45 years, both here and in Japan. Coming to puppetry from an educational background, the message of her work is important to her. She feels workshops can be of great value to families and children as it helps them express their creativity and encourages manipulation skills. Rowena has always enjoyed going to ‘out of the way’ places with her work and has undertaken many international tours.',
      },
      // Bridget, 18 Aug: Sarah's "Pattern Making for Puppets" has moved to
      // Saturday — it's in sat-workshops now, in the slot Bridget's own
      // workshop used to hold.
      // Bridget, 26 Aug: Simone's "Puppetry in Warzones" has left this card
      // too — it's listed under Sunday Shows now, above Asra.
      { time: '11:15am–12:00pm', title: 'Paper Bag Family', by: 'Marine', duration: '45 mins', age: '5+', venue: 'ridgeway', detail: RIDGWAY_ACCESS },
    ],
  },
  {
    id: 'sun-closing',
    day: 'Sunday',
    title: 'Closing Circle',
    blurb:
      'For anyone who wants to acknowledge and celebrate our wonderful weekend together.',
    // Bridget, 24 Aug: pushed back to make room for Asra at midday.
    note: '1:30–2:30pm at Vogelmorn Hall.',
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
