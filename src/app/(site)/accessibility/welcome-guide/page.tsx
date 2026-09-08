import Link from 'next/link'
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import NewTabHint from '@/components/NewTabHint'
import { getPageContent } from '@/app/actions'

export const revalidate = 60

// Anna's welcome guide, sent 7 Sep 2026 as a Word document "to go in the
// accessibility section — it could be attached as a word document or html".
// It's html: a .docx download is a worse answer for exactly the people this
// guide is for (no landing point for a screen reader, no reflow on a phone,
// and you can't read it at all without an app that opens Word files).
//
// Three deliberate departures from her document:
//
//  1. Sarah's mobile number appears six times in the original and appears
//     nowhere here. Sarah's standing rule since 11 Aug is no phone number on
//     the public site — people who flag an access need at checkout are given
//     it by email. Every one of those six places says "email us" instead.
//  2. Four photos are not where the .docx's running order implied. Word puts
//     an inline image in its own paragraph, so a photo can sit a paragraph
//     away from the sentence it illustrates: what looked like the Ridgway
//     drop-off is actually the loading zone outside VBC, and three of the
//     "walking to Ridgway" shots are already inside the school grounds. Every
//     photo below has been looked at and placed by what it shows. If you add
//     more, look at them — a mislabelled photo of the wrong door is worse here
//     than no photo.
//  3. The document repeats the three toilet photos again under its Toilets
//     heading. They appear once, with the room they're in.
//
// Everything else is Anna's text, lightly repunctuated. Don't "improve" the
// specifics: the step counts, the stop numbers and the distances are the
// content. If a venue detail changes, it changes here and in the Word original
// that gets sent to anyone who asks for it.

export const metadata: Metadata = {
  title: 'Welcome guide',
  description:
    'What to expect at the Wellington Puppetry Festival: getting there, the layout of each venue, toilets, seating, and how the shows run.',
}

/** A photo of the venue. The alt text is the content, not a label — see below. */
type Photo = { img: string; alt: string }

/** A paragraph, a bullet list, or a photo. Rendered in order. */
type Block = string | string[] | Photo

type Section = {
  id: string
  heading: string
  body: Block[]
  subsections?: { heading: string; body: Block[] }[]
}

// Alt text is written for someone deciding whether they can get through a
// door, so it counts steps, names surfaces and says which side the handrail is
// on. It is longer than alt text usually is, on purpose.
const SECTIONS: Section[] = [
  {
    id: 'getting-there',
    heading: 'Getting there',
    body: [],
    subsections: [
      {
        heading: 'By car',
        body: [
          'There is one accessible carpark in front of Vogelmorn Bowling Club.',
          {
            img: '/images/welcome-guide/vbc-accessible-carpark.png',
            alt: 'A single car park marked with a wheelchair symbol on the road directly outside Vogelmorn Bowling Club, a yellow and green weatherboard building with a corrugated iron roof. A blue wheelchair-parking sign stands on a pole beside the space, and the club’s gated entrance with noticeboards is a few metres away.',
          },
          'There are two accessible parks in the Ridgway School driveway on Mornington Road.',
          {
            img: '/images/welcome-guide/ridgway-accessible-parks.jpg',
            alt: 'Two car parks marked with a wheelchair symbol on the sealed driveway in front of Ridgway School, with a van parked in one space. A wooden paling fence runs along the left side of the driveway.',
          },
          'There is free on-street parking on the residential streets around the venue. Parking close by may be limited, so you may need to park some distance away. There is a loading bay in front of Vogelmorn Bowling Club.',
        ],
      },
      {
        heading: 'By bus',
        body: [
          'The number 7 bus stops close to both Vogelmorn Hall and Ridgway School.',
          'For the hall, get off at stop 7725, Mills Road at Vennel Street. It is a 100m walk down Vennel Street to the hall.',
          'For Ridgway School hall, stay on for one more stop and get off at stop 7726, Ridgway at Mornington Road.',
          {
            img: '/images/welcome-guide/bus-stop.jpg',
            alt: 'A Metlink bus stop pole numbered 7726 on the footpath on Mornington Road at Ridgway School, with a small glass-sided shelter behind it. Concrete steps with a metal handrail lead up from the footpath.',
          },
        ],
      },
      {
        heading: 'By taxi or Uber',
        body: [
          'For Vogelmorn Bowling Club and Vogelmorn Hall: there is a 10-minute loading zone outside the gate to the VBC building, 93 Mornington Road. If you need help getting from the drop-off point to either building, email us and we will arrange it.',
          {
            img: '/images/welcome-guide/vbc-loading-zone.jpg',
            alt: 'The street outside Vogelmorn Bowling Club, with a car parked at the kerb against a low brick wall. A blue accessible-parking sign stands at one end of the parking area and a 10-minute loading zone sign at the other, beside the gap in the wall that leads to the club’s gate.',
          },
          'For Ridgway School hall: the drop-off zone is the driveway to Ridgway School, 120 Mornington Road, by the two accessible car parks in front of the school gate. Before the shows and the workshop there will be a volunteer guide meeting people at the gate.',
          {
            img: '/images/welcome-guide/ridgway-driveway.jpg',
            alt: 'A wide, flat sealed driveway leading up to a black metal gate at Ridgway School, with a van parked to the right and a modern dark-clad school building on the left. A wheelie bin numbered 120 stands beside the gate.',
          },
        ],
      },
    ],
  },
  {
    id: 'venues',
    heading: 'The venues',
    body: [
      'The festival takes place at the Vogelmorn Bowling Precinct, which includes the bowling green, Vogelmorn Hall, the Vogelmorn upstairs space, the downstairs space and the cafe.',
      'The second location is Ridgway School hall, 210m from the Vogelmorn Precinct.',
      'There will be volunteers at each venue who can explain how to get to the other one. Volunteers wear hats with a high-vis band around the hat.',
      'If you would like a volunteer to guide you around the festival, email us and we will organise one for you.',
    ],
    subsections: [
      {
        heading: 'Vogelmorn Bowling Club',
        body: [
          'Inside the bowling club are three separate spaces: the downstairs space, with seating and a large table, where the free family craft workshops happen on Saturday morning; the cafe, open on Saturday; and the upstairs space, where the workshops for adults are held on Saturday and Sunday.',
          'Through the gate there is a concrete path. On the left there is a flight of concrete steps leading up to glass doors into the venue.',
          {
            img: '/images/welcome-guide/vbc-path.jpg',
            alt: 'A flat concrete path running alongside the bowling club building. The lawn is on the left, with a trampoline, a slide and ride-on toys on the grass and a painted mural along the far wall. On the right the path passes under a verandah, with wooden steps up to the building and hand-painted signs pointing to the VBC cafe, the toilets and the hall.',
          },
          'To your left as you enter is a carpeted room with couches, a coffee table and a shelf of picture books, and a standing-height table where the free family craft activities happen during the Junk Puppet Carnival on Saturday, 10am–2pm.',
          {
            img: '/images/welcome-guide/vbc-downstairs-room.jpg',
            alt: 'A room with dark red patterned carpet, a black leather couch and a small red coffee table, and a long wooden bar-height table with stools. Large windows along the far wall look out over neighbouring rooftops, and a doorway with stairs leading up is on the left.',
          },
          'Through the glass doors to the right there are six carpeted stairs with a handrail which lead up to the cafe.',
          {
            img: '/images/welcome-guide/vbc-stairs-to-cafe.jpg',
            alt: 'A short flight of six carpeted stairs with a handrail on each side, leading up from a red-carpeted hallway through an open door to cafe seating beyond. A sign on the wall to the left lists the upstairs bar, the downstairs co-working space and the VBC cafe.',
          },
          'At the bottom of the stairs, on the left, is a door into a bathroom with two toilet cubicles. It is for all genders and is not wheelchair accessible.',
          {
            img: '/images/welcome-guide/vbc-downstairs-toilet.jpg',
            alt: 'An open wooden door labelled Wharepaku, for all genders, leading into a bathroom with pale green walls, a wall-mounted sink under a window, and a towel rail. The floor is dark wood with a red mat.',
          },
          'There is a baby change table in the bathroom area.',
          {
            img: '/images/welcome-guide/vbc-change-table.jpg',
            alt: 'A small room with pale green walls and a bare wooden floor, containing a wooden baby change table with a fitted mat and a row of coat hooks on the wall above it. A rubbish bin stands to one side, with an open door to another room on the left.',
          },
          'At the top of the stairs is the cafe. It has wooden floors, tables and chairs.',
          {
            img: '/images/welcome-guide/vbc-cafe.jpg',
            alt: 'The cafe, with polished wooden floorboards, round and square tables with dark upholstered chairs, and hanging pot plants along the ceiling beams. A blackboard sign reading Dirty Dishes stands near a shelf of mugs, with windows and green curtains along the far wall.',
          },
          'The counter is to the left.',
          {
            img: '/images/welcome-guide/vbc-cafe-counter.jpg',
            alt: 'The cafe counter: a long wooden bench with a stainless steel servery, hanging pots and pans, and shelves of glasses and crockery underneath. A high chair stands to the right, below a wall painted with a yellow and green triangle mural.',
          },
          'To the right, through a glass door, there are nine wooden stairs leading to the upstairs space.',
          {
            img: '/images/welcome-guide/vbc-stairs-to-upstairs.jpg',
            alt: 'A straight flight of about nine wooden stairs with a handrail on each side, between walls covered in dark floral wallpaper, leading up to a bright room with a piano visible through the doorway at the top.',
          },
          'The upstairs space has wooden floors, windows to the left, and a toilet for all genders to the right which is not wheelchair accessible. There is a low stage, couches and chairs, a black curtain dividing the space, and a carpeted area with more couches behind it.',
          {
            img: '/images/welcome-guide/vbc-upstairs-space.jpg',
            alt: 'A large room with polished wooden floorboards and dark wood-panelled walls, containing a piano, sofas, bar stools and a disco ball hanging from the ceiling. A dark curtain divides off part of the room, and rugs are laid near the front.',
          },
        ],
      },
      {
        heading: 'The Green',
        body: [
          'Between the bowling club and the hall is The Green: a flat lawn, fenced, with three gates around the perimeter that are not always closed. There are bikes and toys on the green and a trampoline in the corner. People sometimes bring their dogs.',
          'On Saturday the carnival is on this lawn, with marquees set up for craft activities and roving performers.',
          {
            img: '/images/welcome-guide/the-green.jpg',
            alt: 'A wide flat grass lawn beside Vogelmorn Bowling Club, seen from a covered deck with blue posts and a step down onto the grass. Folding tables and families with prams are set up along the edge of the lawn, with a soccer goal and the yellow hall building across the field.',
          },
          'The closest toilets to The Green are inside Vogelmorn Bowling Club (which has a change table) or in the hall. Neither is wheelchair accessible. The closest wheelchair accessible toilet is 220m away at Ridgway School hall.',
        ],
      },
      {
        heading: 'Vogelmorn Hall',
        body: [
          'The hall is the location for the opening and closing, the children and whānau shows on Saturday, the Saturday evening cabaret and pea soup, and the Sunday morning shows for adults and teenagers.',
          'From the bowling club you can walk across The Green and through a gate to the main entrance. Or you can go back out the gate and along the footpath, which takes you to the main entrance, or further around to the accessible entrance on the side of the building.',
          'The main entrance has seven concrete and brick steps with wooden handrails on both sides, then three concrete steps with no handrail, then one more step up into the hall.',
          {
            img: '/images/welcome-guide/hall-main-steps.jpg',
            alt: 'A flight of red brick steps with white-painted wooden handrails on both sides, leading up a garden path to open double doors into the hall. Low shrubs and a stone retaining wall line the steps on either side.',
          },
          {
            img: '/images/welcome-guide/hall-main-entrance.jpg',
            alt: 'Looking through the open double doors at the top of the entrance steps into a dark hallway, with doors on either side and a fire exit sign overhead. There is a raised threshold to step over just inside the doorway.',
          },
          'Through the main doors is a small foyer, with toilets for all genders on either side. Neither is wheelchair accessible.',
          {
            img: '/images/welcome-guide/hall-toilet-door.jpg',
            alt: 'A toilet door off the foyer, marked Wharepaku with a female symbol, set into a pale green-panelled wall beside a large open wooden door. The floor is dark polished wood.',
          },
          {
            img: '/images/welcome-guide/hall-foyer-toilet.jpg',
            alt: 'Inside one of the hall toilets: two wall-mounted sinks under a frosted window, soap dispensers and a towel rail. A partition wall with a sliding door leads through to a cubicle, and the floor is dark wood.',
          },
          'The hall has a stage down one end.',
          {
            img: '/images/welcome-guide/hall-stage.jpg',
            alt: 'Inside the hall: a long room with a curved white ceiling, dark wood-panelled walls and polished wooden floorboards. A raised stage with a black curtain is at the far end, with tall windows down one side and stacked chairs along the other.',
          },
          'The wheelchair accessible entrance is the double doors at the stage end of the hall. Let someone at the main entrance know if you need to use it, or email us in advance and we will have it open for you.',
          {
            img: '/images/welcome-guide/hall-accessible-entrance.jpg',
            alt: 'The accessible entrance seen from inside the hall: a pair of green double doors with a horizontal push bar, set into the dark wood-panelled wall near the stage, with a doormat on the floorboards in front of them.',
          },
          {
            img: '/images/welcome-guide/hall-accessible-doors.jpg',
            alt: 'The same doors seen from outside: a pair of light-coloured double doors in the hall’s yellow weatherboard wall, opening onto a level concrete ramp with garden shrubs along its edge.',
          },
        ],
      },
      {
        heading: 'Ridgway School hall',
        body: [
          'Ridgway School hall is 220m along Mornington Road. It is the wet-weather location for the puppet carnival on Saturday morning, the venue for the audio description workshop on Saturday afternoon, and for two family-friendly puppet shows on Sunday morning.',
          {
            img: '/images/welcome-guide/ridgway-map.png',
            alt: 'A map of the walking route from Vogelmorn Green down Mornington Road to Ridgway School, marked as 210 metres and about two minutes on foot.',
          },
          'From the gate at Vogelmorn Bowling Club, cross the road and walk up the hill.',
          {
            img: '/images/welcome-guide/ridgway-footpath.jpg',
            alt: 'The footpath along Mornington Road where it crosses the entrance to the Ridgway School driveway. The path is flat sealed concrete at street level, with the dark-clad school building and a wooden fence on the right and houses further down the street.',
          },
          {
            img: '/images/welcome-guide/ridgway-gate-from-inside.jpg',
            alt: 'Looking back out through the open school gate towards the road, from inside the grounds. Bike racks and a parked bicycle are to the left, two round orange no-entry signs are fixed to the gate, and the ground is flat sealed asphalt.',
          },
          'Through the gate there is a ramp which takes you up to a verandah. Follow the verandah around to the double doors.',
          {
            img: '/images/welcome-guide/ridgway-verandah-ramp.jpg',
            alt: 'The covered verandah at Ridgway School, with children’s bags and coats hanging along the wall and a wooden deck under the roof. On the right, a concrete ramp with no steps rises gently from the paved courtyard onto the deck.',
          },
          {
            img: '/images/welcome-guide/ridgway-verandah.jpg',
            alt: 'The covered wooden deck leading to a set of dark-framed glass double doors, one of them propped open. Bike racks stand to one side, and the deck is level all the way to the doors.',
          },
          'Through the double doors on the right there is an accessible toilet.',
          {
            img: '/images/welcome-guide/ridgway-accessible-toilet.jpg',
            alt: 'A hallway leading to a door marked with the wheelchair accessible toilet symbol, with wood-toned door frames and a level vinyl floor. A yellow wet-floor sign stands nearby, and a sink and bench are visible in a side room to the left.',
          },
          'Before you reach the hall there is a foyer space with a low table, and a library nook to the left.',
          {
            img: '/images/welcome-guide/ridgway-foyer.jpg',
            alt: 'A carpeted room with a long low table and plastic chairs, book display shelves to the left, and a small kitchenette with cupboards and a sink to the right. Glass doors at the far end lead through to another space.',
          },
          {
            img: '/images/welcome-guide/ridgway-library-nook.jpg',
            alt: 'The library nook: grey carpet, a wooden desk, a returns bin, and shelving stocked with books and games along the walls, with a small round table and an armchair in the middle.',
          },
          'The hall itself is like a small gymnasium, with wooden floors, floor-to-ceiling windows and a high ceiling.',
          {
            img: '/images/welcome-guide/ridgway-hall-interior.jpg',
            alt: 'Ridgway School hall: a space like a small gymnasium, with polished wooden floors marked out for basketball, a high ceiling, and floor-to-ceiling glass doors along one side letting in daylight. A basketball hoop is mounted on the far wall.',
          },
        ],
      },
    ],
  },
  {
    id: 'toilets',
    heading: 'Toilets',
    body: [
      'There are toilets for all genders downstairs in Vogelmorn Bowling Club (with a change table), upstairs in Vogelmorn Bowling Club, and in the foyer of the hall. None of these are wheelchair accessible. There are photographs of each of them in the venue sections above.',
      'There are accessible toilets at Ridgway School hall.',
    ],
  },
  {
    id: 'food',
    heading: 'Food and drink',
    body: [
      'On Saturday a cafe operates upstairs in Vogelmorn Bowling Club, and there is an ice cream van parked on the lawn.',
      'You are welcome to bring your own food and picnic on the lawn.',
    ],
  },
  {
    id: 'shows',
    heading: 'At the puppet shows',
    body: [],
    subsections: [
      {
        heading: 'Seating',
        body: ['Seating is a mix of rows of chairs without arms, and mats on the floor.'],
      },
      {
        heading: 'Eating and drinking',
        body: ['You can bring snacks and a drink bottle if you need to eat or drink during the show.'],
      },
      {
        heading: 'Lighting',
        body: ['There is no blackout at any point.'],
      },
      {
        heading: 'Coming and going',
        body: [
          'There is a quick turnaround between shows, so the theatre opens shortly before each one.',
          'There is no lockout. You can come and go during the show as you need to.',
          'Fidget toys, ear defenders, sunglasses and anything else you need to access the show or feel comfortable are welcome.',
        ],
      },
    ],
  },
  {
    id: 'workshops',
    heading: 'At the workshops',
    body: [
      'All the workshops except “Building Access from the Start” take place on the upper level of Vogelmorn Bowling Club, which is not wheelchair accessible. Email us for more detail about getting into that building.',
      '“Building Access from the Start” takes place at Ridgway School hall and is wheelchair accessible.',
      'Places are limited and we recommend booking in advance. If you have questions or requirements that would help you take part, email us before the day.',
    ],
  },
  {
    id: 'carnival',
    heading: 'At the carnival',
    body: [
      'The carnival is on the Vogelmorn Green: roving performers you can choose to interact with, a band, a free show called “Little Landscapes” you sign up for on the day, parachute games, games to play, and an ice cream van. There are puppet-making workshops for families — no booking needed, but numbers are limited.',
      'If it rains, the carnival moves to Ridgway School hall. The band and some of the roving performers will be on the covered verandah before you go in. The workshops are inside, “Little Landscapes” is in the library nook, and the junk games, parachute games and the rest of the roving performers are in the main hall space.',
    ],
  },
]

// The two Matterport walkthroughs are the most useful thing in the whole guide
// for someone deciding whether they can get in, so they get their own block
// rather than a line in the venue prose.
const TOURS = [
  { label: 'Vogelmorn Bowling Club', url: 'https://my.matterport.com/show/?m=WZftUiJAyRw' },
  { label: 'Vogelmorn Hall', url: 'https://my.matterport.com/show/?m=Z5oK7J77UxS' },
]

function isPhoto(block: Block): block is Photo {
  return typeof block === 'object' && !Array.isArray(block)
}

function Body({ body }: { body: Block[] }) {
  return (
    <>
      {body.map((item, i) => {
        if (isPhoto(item)) {
          return (
            // Height-capped and object-contain rather than full-bleed: about a
            // third of these are portrait phone photos, and at the full column
            // width a single flight of stairs fills the screen — with 31 photos
            // that turns the guide into a scroll. Contain, not cover, because
            // cropping the top off those stairs defeats the point of the photo.
            <div
              key={item.img}
              className="w-full max-h-[26rem] rounded-2xl border border-black/10 overflow-hidden flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.alt}
                loading="lazy"
                className="max-w-full max-h-[26rem] w-auto h-auto object-contain"
              />
            </div>
          )
        }
        return Array.isArray(item) ? (
          <ul key={i} className="list-disc pl-6 space-y-1.5 mb-4 leading-relaxed">
            {item.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : (
          <p key={i} className="leading-relaxed mb-4">
            {item}
          </p>
        )
      })}
    </>
  )
}

export default async function WelcomeGuidePage() {
  const contact = await getPageContent('contact')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero
        heading="Welcome guide"
        intro="The Wellington Puppetry Festival takes place at the Vogelmorn Precinct and Ridgway School hall. This guide tells you how to get there, what each venue is like inside, and what happens at the shows."
      />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl" style={{ color: 'var(--wpf-ink)' }}>
          {/* A contents list, because this is long and most people arrive
              wanting one specific fact — the steps, or the toilets. */}
          <nav aria-labelledby="guide-contents" className="mb-14">
            <h2
              id="guide-contents"
              className="text-sm font-bold uppercase tracking-widest wpf-text-muted mb-3"
            >
              In this guide
            </h2>
            <ul className="space-y-1.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="wpf-btn-focus font-semibold underline underline-offset-4 hover:no-underline"
                    style={{ color: 'var(--wpf-pink-deep)' }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="mb-12 scroll-mt-28">
              <h2 className="wpf-section-heading mb-4">{s.heading}</h2>
              <Body body={s.body} />
              {s.subsections?.map((sub) => (
                <div key={sub.heading} className="mt-8">
                  <h3 className="font-bold mb-2">{sub.heading}</h3>
                  <Body body={sub.body} />
                </div>
              ))}
            </section>
          ))}

          <section id="tours" className="mb-12 scroll-mt-28">
            <h2 className="wpf-section-heading mb-4">Look around before you come</h2>
            <p className="leading-relaxed mb-4">
              There is a virtual walkthrough of each Vogelmorn building. Vogelmorn Bowling Club is a
              community venue, so you can also visit in person beforehand to get your bearings.
            </p>
            <ul className="space-y-2">
              {TOURS.map((tour) => (
                <li key={tour.url}>
                  <a
                    href={tour.url}
                    target="_blank"
                    rel="noreferrer"
                    className="wpf-btn-focus font-semibold underline underline-offset-4 hover:no-underline"
                    style={{ color: 'var(--wpf-pink-deep)' }}
                  >
                    Virtual tour of {tour.label}
                    <span aria-hidden="true"> ↗</span>
                    <NewTabHint />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section
            id="questions"
            className="rounded-2xl p-7 border border-black/5 bg-[var(--wpf-yellow-soft)] scroll-mt-28"
          >
            <h2 className="wpf-section-heading mb-3">Anything we haven’t covered</h2>
            <p className="leading-relaxed">
              If you have a question, or something you need in order to come, email us and we will
              sort it out with you before the day.
              {contact.email && (
                <>
                  {' '}
                  <a
                    href={`mailto:${contact.email}`}
                    className="wpf-btn-focus font-semibold underline underline-offset-4"
                    style={{ color: 'var(--wpf-pink-deep)' }}
                  >
                    {contact.email}
                  </a>
                </>
              )}
            </p>
          </section>

          <p className="mt-14 pt-8 border-t border-black/10">
            <Link
              href="/accessibility"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              style={{ color: 'var(--wpf-pink-deep)' }}
            >
              <span aria-hidden="true">←</span> Back to accessibility
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
