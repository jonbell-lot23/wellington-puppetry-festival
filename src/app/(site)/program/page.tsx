import Link from 'next/link'
import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import {
  ACCESS_STYLE,
  DAYS,
  VENUES,
  eventSlug,
  hasMoreInfo,
  parseStrands,
  publicEvents,
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

/** Venue is information, not an action — a colour dot and a label, never a pill. */
function VenueLabel({ venue }: { venue: VenueKey }) {
  const v = VENUES[venue] ?? VENUES.hall
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider shrink-0 wpf-text-muted">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: v.bg, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)' }}
        aria-hidden="true"
      />
      {v.label}
    </span>
  )
}

function EventRow({ strand, ev }: { strand: Strand; ev: StrandEvent }) {
  const more = hasMoreInfo(ev)
  return (
    <li className="px-5 py-3.5 flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2">
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
          alt={ev.title}
          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-black/10"
        />
      )}
      <div className="flex-1 min-w-0 basis-full sm:basis-auto order-last sm:order-none">
        <p className="font-bold" style={{ color: 'var(--wpf-ink)' }}>
          {ev.title}
          {ev.by && <span className="font-semibold wpf-text-muted"> · {ev.by}</span>}
        </p>
        {ev.detail && <p className="text-sm wpf-text-muted">{ev.detail}</p>}
        {(more || ev.ticketUrl?.trim()) && (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            {more && (
              <Link
                href={`/program/${eventSlug(strand, ev)}`}
                className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline"
                style={{ color: 'var(--wpf-pink-deep)' }}
              >
                More info
              </Link>
            )}
            {ev.ticketUrl?.trim() && (
              <a
                href={ev.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full px-3.5 py-1 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--wpf-pink)' }}
              >
                Buy tickets
              </a>
            )}
          </p>
        )}
      </div>
      {/* shrink-0 is load-bearing: the label inside is shrink-0 too, so without
          it this container collapses under it and it overflows the row. */}
      <div className="flex items-center gap-2.5 ml-auto shrink-0">
        {ev.note && (
          <span className="text-[11px] font-bold uppercase tracking-wider wpf-text-muted">
            {ev.note}
          </span>
        )}
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
        {strand.title}
      </h3>
      <p className="leading-relaxed wpf-text-muted">{strand.blurb}</p>
      {strand.note && (
        <p className="mt-2 leading-relaxed font-semibold" style={{ color: 'var(--wpf-ink)' }}>
          {strand.note}
        </p>
      )}
      {strand.ctaLabel && strand.ctaUrl && (
        <a
          href={strand.ctaUrl}
          target="_blank"
          rel="noreferrer"
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

      <ul className="mt-5 rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden bg-[var(--wpf-cream)]">
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
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Bridget: the Hall / Upstairs / the Green only make sense once you
              know they're all rooms at one address. Say so before the listings. */}
          {c.venueNote && (
            <p
              className="mb-12 rounded-xl px-5 py-4 leading-relaxed border border-black/10"
              style={{ backgroundColor: 'var(--wpf-blue-soft)', color: 'var(--wpf-ink)' }}
            >
              {c.venueNote}
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

          <p className="mt-16 text-center text-sm wpf-text-muted">{c.footnote}</p>
        </div>
      </section>
    </main>
  )
}
