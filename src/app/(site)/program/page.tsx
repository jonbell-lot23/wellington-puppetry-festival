import Link from 'next/link'
import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import { teReo } from '@/lib/tereo'
import {
  ACCESS_STYLE,
  DAYS,
  VENUES,
  eventSlug,
  hasMoreInfo,
  parseStrands,
  publicEvents,
  venueMapUrl,
  type Strand,
  type StrandEvent,
  type VenueKey,
} from '@/lib/strands'

export const revalidate = 60

// One card per strand — "Saturday — Workshops", "Saturday — Shows for Children
// and whānau" — as Bridget asked (Jul 2026): shows and workshops were too hard
// to follow muddled together in a single per-day list.
//
// Cards and their programmes are edited together in /admin ("Programme —
// Schedule"); defaults live in lib/strands.ts. Expanding uses native
// <details>/<summary>, so this stays a server component with zero client JS and
// keeps keyboard/screen-reader behaviour for free.

// Venue names that become map links wherever they turn up in the venue note.
// The note is free text Bridget edits, so this is a scan rather than markup she
// has to remember — and if she rewords past a name, it just doesn't link.
//
// Longest first: the pattern alternates in this order, so 'Vogelmorn Bowling
// Club' wins before a shorter term could match inside it.
const MAP_TERMS: { term: string; venue: VenueKey }[] = [
  { term: 'Vogelmorn Bowling Club', venue: 'hall' },
  { term: 'Vogelmorn Hall', venue: 'hall' },
  { term: 'Ridgway School Hall', venue: 'ridgeway' },
  { term: 'Ridgway Hall', venue: 'ridgeway' },
]

/**
 * Link the venue names in the note where they already sit, rather than trailing
 * each one with a "(Map)". Two parentheticals in a three-line paragraph read as
 * clutter; the name is the thing you'd tap anyway.
 */
function withMapLinks(text: string) {
  const pattern = MAP_TERMS.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  return text.split(new RegExp(`(${pattern})`, 'g')).map((chunk, i) => {
    const hit = MAP_TERMS.find((t) => t.term === chunk)
    if (!hit) return <span key={i}>{chunk}</span>
    return (
      <a
        key={i}
        href={venueMapUrl(hit.venue)}
        target="_blank"
        rel="noreferrer"
        title={`Open ${VENUES[hit.venue].address} in Maps`}
        className="font-semibold underline decoration-dotted decoration-from-font underline-offset-4 hover:decoration-solid"
      >
        {chunk}
      </a>
    )
  })
}

/**
 * A colour dot and a label — never a pill. Bridget read the old bordered chip as
 * a button. It does now open the venue in the visitor's maps app, so a dotted
 * underline says "tappable" without pretending to be a button.
 */
function VenueLabel({ venue }: { venue: VenueKey }) {
  const v = VENUES[venue] ?? VENUES.hall
  return (
    <a
      href={venueMapUrl(venue)}
      target="_blank"
      rel="noreferrer"
      title={`Open ${v.address} in Maps`}
      className="relative z-10 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider shrink-0 wpf-text-muted underline decoration-dotted decoration-from-font underline-offset-4 hover:decoration-solid"
    >
      <span
        className="w-2 h-2 rounded-full shrink-0 no-underline"
        style={{ backgroundColor: v.bg, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)' }}
        aria-hidden="true"
      />
      {v.label}
    </a>
  )
}

function EventRow({ strand, ev }: { strand: Strand; ev: StrandEvent }) {
  const more = hasMoreInfo(ev)
  return (
    // The whole row is the link when there's a More info page. It's a stretched
    // overlay rather than a wrapping <a> so the venue map link and the tickets
    // button — both real links — can sit inside it without nesting anchors.
    <li
      className={`relative px-5 py-3.5 flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2 ${
        more ? 'transition-colors hover:bg-black/[0.03] focus-within:bg-black/[0.03]' : ''
      }`}
    >
      {more && (
        <Link
          href={`/program/${eventSlug(strand, ev)}`}
          className="absolute inset-0 z-0"
          aria-label={`More about ${ev.title}`}
        />
      )}
      {/* Left column carries everything time-ish: when, how long, who for. */}
      <div className="shrink-0 w-32">
        <p className="text-sm font-bold" style={{ color: 'var(--wpf-ink)' }}>
          {ev.time}
        </p>
        {ev.duration && <p className="text-sm wpf-text-muted">{ev.duration}</p>}
        {ev.age && <p className="text-xs font-bold wpf-text-muted">Ages: {ev.age}</p>}
      </div>
      {ev.image?.trim() && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ev.image}
          alt={ev.imageAlt?.trim() || ev.title}
          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-black/10"
        />
      )}
      <div className="flex-1 min-w-0 basis-full sm:basis-auto order-last sm:order-none">
        <p className="font-bold" style={{ color: 'var(--wpf-ink)' }}>
          {teReo(ev.title)}
          {ev.by && <span className="font-semibold wpf-text-muted"> · {teReo(ev.by)}</span>}
        </p>
        {/* Sarah, 7 Aug: "I don't know why it's centred". The tag used to sit
            in the right-hand group with the venue label. On a phone the title
            wraps onto its own line, which left "Audio described" stranded
            mid-row, detached from the show it describes. It belongs with the
            title. */}
        {ev.note && (
          <span
            className="mt-1 inline-block text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 border"
            style={{
              backgroundColor: 'var(--wpf-blue-soft)',
              color: 'var(--wpf-blue-deep)',
              borderColor: 'var(--wpf-blue-deep)',
            }}
          >
            {ev.note}
          </span>
        )}
        {ev.detail && <p className="text-sm wpf-text-muted">{teReo(ev.detail)}</p>}
        {/* Jon, 11 Aug: a pink "Buy tickets" button on every row turned the
            listing into a wall of buttons and drowned out the programme
            itself. Tickets now live at the top of each event's own page,
            where there's room to be unmissable. */}
        {more && (
          <p className="mt-1.5">
            {/* Not a link itself — the row overlay above handles the click. It's
                here so the row visibly advertises that there's more to read. */}
            <span
              className="text-xs font-bold uppercase tracking-widest underline underline-offset-4"
              style={{ color: 'var(--wpf-pink-deep)' }}
            >
              More info →
            </span>
          </p>
        )}
      </div>
      {/* shrink-0 is load-bearing: the label inside is shrink-0 too, so without
          it this container collapses under it and it overflows the row. */}
      <div className="flex items-center gap-2.5 ml-auto shrink-0">
        <VenueLabel venue={ev.venue} />
      </div>
    </li>
  )
}

/** The bit every card shows: access chip, title, blurb, note, optional CTA. */
function CardFace({ strand }: { strand: Strand }) {
  const access = ACCESS_STYLE[strand.access] ?? ACCESS_STYLE.ticketed
  return (
    <>
      <span
        className="self-start text-[11px] font-bold uppercase tracking-widest rounded-full px-3 py-1 mb-4 border border-black/10"
        style={{ backgroundColor: access.bg, color: access.fg }}
      >
        {access.label}
      </span>
      <h3 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--wpf-ink)' }}>
        {teReo(strand.title)}
      </h3>
      <p className="leading-relaxed wpf-text-muted">{teReo(strand.blurb)}</p>
      {strand.note && (
        <p className="mt-2 leading-relaxed font-semibold" style={{ color: 'var(--wpf-ink)' }}>
          {teReo(strand.note)}
        </p>
      )}
      {strand.ctaLabel && strand.ctaUrl && (
        <a
          href={strand.ctaUrl}
          className="self-start mt-5 inline-block rounded-full px-6 py-2.5 font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--wpf-pink)' }}
        >
          {strand.ctaLabel}
        </a>
      )}
    </>
  )
}

function StrandCard({ strand }: { strand: Strand }) {
  const shell =
    'rounded-2xl p-7 border border-black/5 bg-[var(--wpf-yellow-soft)] transition-transform'
  const events = publicEvents(strand)

  // No programme to show — Opening Event, Closing Circle. Flat card, no arrow.
  if (events.length === 0) {
    return (
      <div className={`${shell} flex flex-col`}>
        <CardFace strand={strand} />
      </div>
    )
  }

  return (
    <details className={`${shell} group open:bg-[var(--wpf-yellow-soft)]`}>
      <summary className="flex flex-col cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <CardFace strand={strand} />
        <span
          className="mt-5 inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest"
          style={{ color: 'var(--wpf-pink-deep)' }}
        >
          <span className="group-open:hidden">See the programme</span>
          <span className="hidden group-open:inline">Hide the programme</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-open:rotate-180"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>

      {/* Bridget, 6 Aug: "I get confused when opening the 'Saturday Shows' or
          Workshops because I forget I am in the 'Saturday' listing." The day
          is only on the <h2> group heading further up the page, which is off
          screen by the time a card is open. Repeating it here as a real
          heading fixes it for sighted readers and gives screen-reader users a
          labelled landmark into the list at the same time. */}
      <h4
        className="mt-5 mb-2 text-sm font-bold uppercase tracking-widest"
        style={{ color: 'var(--wpf-pink-deep)' }}
      >
        {strand.day}: {teReo(strand.title)}
      </h4>

      <ul className="rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden bg-[var(--wpf-cream)]">
        {events.map((ev, i) => (
          <EventRow key={i} strand={strand} ev={ev} />
        ))}
      </ul>
    </details>
  )
}

export default async function ProgramPage() {
  const [c, stored] = await Promise.all([
    getPageContent('program'),
    getPageContent('program-schedule'),
  ])
  const strands = parseStrands(stored.strandsJson)

  return (
    <main id="main" tabIndex={-1} style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Bridget, 8 Aug: unclear where to buy tickets while browsing the
              programme — a banner above the listings, pointing at the
              per-event "Buy tickets" buttons and a general tickets link. */}
          {c.ticketsNote && (
            <p
              className="mb-6 rounded-xl px-5 py-4 leading-relaxed border"
              style={{ backgroundColor: 'var(--wpf-pink-soft)', borderColor: 'var(--wpf-pink-deep)', color: 'var(--wpf-ink)' }}
            >
              {c.ticketsNote}
              {c.ticketsUrl && (
                <>
                  {' '}
                  <a
                    href={c.ticketsUrl}
                    className="font-semibold underline underline-offset-2"
                  >
                    {c.ticketsLabel}
                  </a>
                </>
              )}
            </p>
          )}
          {/* Bridget: the Hall / Upstairs / the Green only make sense once you
              know they're all rooms at one address. Say so before the listings. */}
          {c.venueNote && (
            <p
              className="mb-12 rounded-xl px-5 py-4 leading-relaxed border border-black/10"
              style={{ backgroundColor: 'var(--wpf-blue-soft)', color: 'var(--wpf-ink)' }}
            >
              {withMapLinks(c.venueNote)}
            </p>
          )}

          <div className="space-y-16">
            {DAYS.map(({ day, date }) => {
              const forDay = strands.filter((s) => s.day === day)
              if (forDay.length === 0) return null
              return (
                <div key={day} id={day.toLowerCase()} className="scroll-mt-24">
                  <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="text-3xl font-extrabold" style={{ color: 'var(--wpf-ink)' }}>
                      {day}
                    </h2>
                    <span className="text-sm font-bold uppercase tracking-widest wpf-text-muted">
                      {date}
                    </span>
                  </div>
                  <div className="space-y-5">
                    {forDay.map((s) => (
                      <StrandCard key={s.id} strand={s} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Access note sits at the end of the programme, before the "details
              may shift" footnote — deliberately in the main flow rather than
              tucked in the footer, so it's read as ordinary festival
              information by everyone who reaches the end of the listings. */}
          {c.accessBody && (
            <section
              aria-labelledby="programme-access"
              className="mt-16 rounded-2xl bg-[var(--wpf-blue-soft)] border border-black/5 p-6 md:p-8"
            >
              <h2
                id="programme-access"
                className="font-extrabold text-xl mb-2"
                style={{ color: 'var(--wpf-ink)' }}
              >
                {c.accessHeading}
              </h2>
              <p className="wpf-text-muted text-sm leading-relaxed max-w-2xl">{teReo(c.accessBody)}</p>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <a
                  href="/accessibility#accessible-shows"
                  className="wpf-btn-focus text-sm font-bold underline underline-offset-4"
                  style={{ color: 'var(--wpf-pink-deep)' }}
                >
                  {c.accessLinkLabel} →
                </a>
                <a
                  href="/contact"
                  className="wpf-btn-focus text-sm font-bold underline underline-offset-4"
                  style={{ color: 'var(--wpf-pink-deep)' }}
                >
                  Contact us about access →
                </a>
              </p>
            </section>
          )}

          <p className="mt-16 text-center text-sm wpf-text-muted">{c.footnote}</p>
        </div>
      </section>
    </main>
  )
}
