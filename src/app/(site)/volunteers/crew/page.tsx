import Link from 'next/link'
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import NewTabHint from '@/components/NewTabHint'

export const revalidate = 60

// The crew's one-page home for the festival weekend, built 19 Sep 2026 from
// Izzy Pecora's "Crew/Volunteer Call - Day 1" email. That email carried five
// attachments and two Google Sheets links, which is four too many things to
// find on a phone at 8am in a carpark. This page is the single link that
// holds all of them, with the details people actually ask for underneath.
//
// Three deliberate decisions:
//
//  1. It lives at /volunteers/crew, not /volunteers. /volunteers is the public
//     "come and help" sign-up page and it stays exactly as it is — replacing
//     it mid-festival would take down the recruitment page on the busiest
//     weekend of the year.
//  2. `noindex`. This is working information for twenty people for two days,
//     not something to leave in Google's index afterwards. It's deliberately
//     not in sitemap.ts either.
//  3. No personal mobile numbers. Sarah's standing rule since 11 Aug is no
//     phone number on the public site, and this page is public — unlisted is
//     not private. Izzy's mobile went to the crew by email and stays there;
//     this page says so rather than republishing it. The two numbers here are
//     organisations, not people: the school office and the hospital, and the
//     hospital one is on the call sheet for a reason.
//
// The roster used to be linked but never reproduced. That changed the same day,
// on Jon's call: /volunteers/crew/jobs now renders it, because a spreadsheet
// nobody can read on a phone is not actually a privacy control — it just makes
// the information useless to the people who need it while staying just as
// public. The names shown are first names against jobs, the pages are
// noindex, and the mobile-number rule above still stands.

export const metadata: Metadata = {
  title: 'Crew info',
  description:
    'Call times, venues, schedules and contacts for Wellington Puppetry Festival crew and volunteers.',
  robots: { index: false, follow: false },
}

/** An external working document. Everything here opens in a new tab. */
type Resource = {
  label: string
  href: string
  detail: string
  /** Set for links that need a Google account / the share link to open. */
  external?: boolean
}

const RESOURCES: Resource[] = [
  // The two readable views come first, and the raw spreadsheets are further
  // down under "the originals". A spreadsheet on a phone in a carpark is the
  // problem these pages exist to solve, so they should not be the second
  // thing someone finds.
  {
    label: 'Weekend schedule',
    href: '/volunteers/crew/schedule',
    detail: 'The whole schedule sheet at once, all three days, if you want the big picture.',
  },
  {
    label: 'Job assignments',
    href: '/volunteers/crew/jobs',
    detail: 'The whole assignments sheet at once. Same name filter.',
  },
  {
    label: 'Public programme',
    href: '/programme',
    detail: 'What the audience sees. Use this one when someone asks you what is on.',
  },
  {
    label: 'Access information',
    href: '/accessibility',
    detail: 'Step-free routes, the accessible toilets, and the audio described shows.',
  },
  {
    label: 'Welcome guide',
    href: '/accessibility/welcome-guide',
    detail: 'Both venues described in detail, with photos. Useful for wayfinding questions.',
  },
  {
    label: 'The schedule spreadsheet',
    href: 'https://docs.google.com/spreadsheets/d/1qor54hKPbTDgGePcRipx6VTdHcqCNQam8vX7796dAqc/edit?usp=sharing',
    detail: 'Izzy’s original. The live copy, if you need to edit it or check something the page missed.',
    external: true,
  },
  {
    label: 'The assignments spreadsheet',
    href: 'https://docs.google.com/spreadsheets/d/1fvC8A0W_g9YSfm6Kx5fs-Fhzngd1JSuOqjB2HKgVww4/edit?usp=sharing',
    detail: 'Bridget’s original, same again.',
    external: true,
  },
]

/** One line of the day. `note` is the bit people get wrong without being told. */
type Moment = { time: string; what: string; where?: string; note?: string }

const SATURDAY: Moment[] = [
  {
    time: '8:00am',
    what: 'General call — cast and crew arrive',
    note: 'Set-up is already under way from 6:30am for the leads.',
  },
  { time: '9:00am', what: 'Team health & safety briefing', where: 'The Green (TBC)' },
  { time: '9:30am', what: 'Workshops and the Box of Birds touch tour begin' },
  { time: '10:00am', what: 'First shows, and the Junk Puppet Carnival opens' },
  {
    time: '1:45pm',
    what: 'Daytime programme ends',
    note: 'Everything turns over to evening set-up and the Cabaret.',
  },
  { time: '5:30pm', what: 'Drinks — audience arrive for the evening programme', where: 'Hall' },
  { time: '9:00pm', what: 'Clean up — end of Day 1', where: 'Hall' },
]

const SUNDAY: Moment[] = [
  { time: '8:00am', what: 'Set-up and tech troubleshooting for the day’s shows' },
  { time: '9:30am', what: 'Touch tour for Box of Birds', where: 'Ridgway School Hall' },
  { time: '10:00am', what: 'Shows begin in both venues' },
  { time: '1:30pm', what: 'Closing circle', where: 'Hall' },
  { time: '2:30pm', what: 'Clean up', where: 'Hall' },
]

type Venue = {
  name: string
  address: string
  note: string
  phone?: { label: string; number: string }
}

const VENUES: Venue[] = [
  {
    name: 'Vogelmorn Bowling Club',
    address: '93 Mornington Road, Brooklyn, Wellington 6021',
    note: 'The Hall, Upstairs and the Green are all part of this one site. Getting between them means steps and uneven ground.',
  },
  {
    name: 'Ridgway School Hall',
    address: '120 Mornington Road, Mornington, Wellington 6021',
    note: 'A short walk further up the same road. Wheelchair accessible, and the only wheelchair accessible toilets are here. It is also the wet weather venue for the Carnival.',
    phone: { label: 'School office', number: '04 939 8771' },
  },
]

export default function CrewPage() {
  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero
        heading="Crew info"
        intro="Everything for the festival weekend in one place: the working documents up top, the details you will actually be asked for underneath."
      />

      <section className="px-6 pt-14 pb-10 md:pt-20">
        <div className="mx-auto max-w-3xl">
          {/* Jon, 19 Sep: "I don't see the full day pages for Saturday and
              stuff" — they were only linked from inside the sheet pages, which
              is two taps too deep for the thing most people want. They go
              first, as three big buttons, above everything else. */}
          <h2 className="wpf-section-heading mb-4">Today, and the other days</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {[
              { day: 'Friday', date: '18 Sep' },
              { day: 'Saturday', date: '19 Sep' },
              { day: 'Sunday', date: '20 Sep' },
            ].map((d) => (
              <Link
                key={d.day}
                href={`/volunteers/crew/${d.day.toLowerCase()}`}
                className="wpf-btn-focus block rounded-2xl p-5 text-center border-2 hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: 'var(--wpf-pink)',
                  borderColor: 'var(--wpf-pink)',
                  color: '#ffffff',
                }}
              >
                <span className="block font-extrabold text-xl">{d.day}</span>
                <span className="block text-sm opacity-90">{d.date} · everything on</span>
              </Link>
            ))}
          </div>

          <h2 className="wpf-section-heading mb-6">Everything else</h2>
          <ul className="space-y-3">
            {RESOURCES.map((r) => (
              <li key={r.href}>
                {r.external ? (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wpf-btn-focus block rounded-2xl p-5 border border-black/5 bg-[var(--wpf-yellow-soft)] hover:border-black/20 transition-colors"
                  >
                    <ResourceBody {...r} />
                  </a>
                ) : (
                  <Link
                    href={r.href}
                    className="wpf-btn-focus block rounded-2xl p-5 border border-black/5 bg-[var(--wpf-yellow-soft)] hover:border-black/20 transition-colors"
                  >
                    <ResourceBody {...r} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm wpf-text-muted leading-relaxed">
            The schedule and assignments pages copy the spreadsheets every 30 minutes and say at the
            top how long ago that was. The spreadsheets themselves are always the final word — open
            those if something looks wrong or you need to make a change.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="wpf-section-heading mb-3">Key details</h2>
          <p className="leading-relaxed mb-8" style={{ color: 'var(--wpf-ink)' }}>
            The short version, for when there is no time to open a spreadsheet.
          </p>

          <Card tone="pink">
            <h3 className="font-extrabold text-xl mb-1">General call: 8:00am</h3>
            <p className="leading-relaxed">
              Saturday cast and crew arrive at 8:00am for set-up. Fill up a water bottle before you
              come — it is a long day, and the day gets away on people.
            </p>
          </Card>

          <Day title="Saturday 19 September" moments={SATURDAY} />
          <Day title="Sunday 20 September" moments={SUNDAY} />

          <Card>
            <h3 className="font-extrabold text-xl mb-4">Venues</h3>
            <ul className="space-y-5">
              {VENUES.map((v) => (
                <li key={v.name}>
                  <p className="font-bold">{v.name}</p>
                  <p className="wpf-text-muted">{v.address}</p>
                  {v.phone && (
                    <p className="wpf-text-muted">
                      {v.phone.label}:{' '}
                      <a href={`tel:${v.phone.number.replace(/\s/g, '')}`} className="underline underline-offset-4">
                        {v.phone.number}
                      </a>
                    </p>
                  )}
                  <p className="mt-1 leading-relaxed">{v.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-relaxed">
              <strong>Parking is limited</strong> and first come, first served. Carpool, or arrange a
              drop-off and pick-up if you can. There is free on-street parking on the streets
              around both venues, but you may end up some distance away.
            </p>
          </Card>

          <Card tone="pink">
            <h3 className="font-extrabold text-xl mb-4">Health &amp; safety</h3>
            <ul className="space-y-3 leading-relaxed">
              <li>
                <strong>If you are First Aid trained and certified, tell Izzy when you arrive.</strong>{' '}
                She is keeping the list.
              </li>
              <li>
                The full team health and safety induction is at 9:00am on Saturday, on the Green.
                It covers the lost child procedure — be there for it.
              </li>
              <li>
                Nearest hospital: <strong>Wellington Regional Hospital</strong>, 49 Riddiford Street,
                Newtown.{' '}
                <a href="tel:043855999" className="underline underline-offset-4 font-semibold">
                  04 385 5999
                </a>
                . In an emergency, call 111 first.
              </li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-extrabold text-xl mb-4">Who to ask</h3>
            <ul className="space-y-3 leading-relaxed">
              <li>
                <strong>Izzy Pecora</strong> — Stage Manager. Mainly on the show schedule and tech
                in Vogelmorn Hall, but ask her anything. Her mobile and WhatsApp number is in the
                Day 1 crew email.
              </li>
              <li>
                <strong>Bridget Sanders, Sarah Bell and Anna Bailey</strong> — festival leads. They
                move between venues during the day.
              </li>
              <li>
                Not urgent?{' '}
                <a
                  href="mailto:wellingtonpuppetryfestival@gmail.com"
                  className="underline underline-offset-4 font-semibold"
                >
                  wellingtonpuppetryfestival@gmail.com
                </a>
              </li>
            </ul>
          </Card>

          <Card tone="green">
            <h3 className="font-extrabold text-xl mb-3">What you get</h3>
            <p className="leading-relaxed">
              Free standby access to every show, and a student-priced discount to the Cabaret — free
              if you are volunteering or performing in it. You are also invited to the opening and
              closing functions, which need an RSVP.
            </p>
          </Card>

          <p className="mt-10 text-sm wpf-text-muted leading-relaxed">
            Looking for the sign-up form instead?{' '}
            <Link href="/volunteers" className="underline underline-offset-4 font-semibold">
              Volunteer with us
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}

function ResourceBody({ label, detail, external }: Resource) {
  return (
    <>
      <span className="font-bold text-lg" style={{ color: 'var(--wpf-pink-deep)' }}>
        {label}
        {external && (
          <>
            {' '}
            <span aria-hidden="true">↗</span>
            <NewTabHint />
          </>
        )}
      </span>
      <span className="block mt-1 leading-relaxed" style={{ color: 'var(--wpf-ink)' }}>
        {detail}
      </span>
    </>
  )
}

const TONES = {
  cream: 'bg-[var(--wpf-yellow-soft)]',
  pink: 'bg-[var(--wpf-pink-soft)]',
  green: 'bg-[var(--wpf-blue-soft)]',
} as const

function Card({
  tone = 'cream',
  children,
}: {
  tone?: keyof typeof TONES
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-2xl p-7 mb-6 border border-black/5 ${TONES[tone]}`}
      style={{ color: 'var(--wpf-ink)' }}
    >
      {children}
    </div>
  )
}

function Day({ title, moments }: { title: string; moments: Moment[] }) {
  return (
    <Card>
      <h3 className="font-extrabold text-xl mb-4">{title}</h3>
      {/* A description list, not a table: two columns of time-and-thing read
          correctly to a screen reader this way, and it stacks on a phone
          without a horizontal scroll. */}
      <dl className="space-y-4">
        {moments.map((m) => (
          <div key={m.time + m.what} className="sm:flex sm:gap-5">
            <dt className="font-bold tabular-nums sm:w-24 sm:shrink-0">{m.time}</dt>
            <dd className="sm:flex-1">
              {m.what}
              {m.where && <span className="wpf-text-muted"> · {m.where}</span>}
              {m.note && <span className="block text-sm wpf-text-muted mt-0.5">{m.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
