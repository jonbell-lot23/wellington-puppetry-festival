import PageHero from '@/components/PageHero'
import { VENUES, type ScheduleEvent, type VenueKey } from '@/lib/schedule'
import { ACCESS_STYLE, DAYS, STRANDS, type Strand } from './strands'

// PROTOTYPE of the "one card per strand" programme (Bridget, Jul 2026).
// Live page is still /program. Data is hardcoded in ./strands.ts.
//
// Expanding uses native <details>/<summary> so this stays a server component
// with zero client JS — and it keeps keyboard/screen-reader behaviour for free.

export const metadata = { title: 'Programme (v2 preview) — Wellington Puppetry Festival' }

function VenueChip({ venue }: { venue: VenueKey }) {
  const v = VENUES[venue] ?? VENUES.hall
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 shrink-0 border border-black/10"
      style={{ backgroundColor: v.bg, color: 'var(--wpf-ink)' }}
    >
      {v.label}
    </span>
  )
}

function EventRow({ ev }: { ev: ScheduleEvent }) {
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
      </div>
      {/* shrink-0 is load-bearing: the chips inside are shrink-0 too, so without
          it this container collapses under them and they overflow the row. */}
      <div className="flex items-center gap-1.5 ml-auto shrink-0">
        {ev.note && (
          <span
            className="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 shrink-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: 'var(--wpf-ink)' }}
          >
            {ev.note}
          </span>
        )}
        <VenueChip venue={ev.venue} />
      </div>
    </li>
  )
}

/** The bit every card shows: access chip, title, blurb, note, optional CTA. */
function CardFace({ strand }: { strand: Strand }) {
  const access = ACCESS_STYLE[strand.access]
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

  // No programme to show — Opening Event, Closing Circle. Flat card, no arrow.
  if (strand.events.length === 0) {
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
        {strand.events.map((ev, i) => (
          <EventRow key={i} ev={ev} />
        ))}
      </ul>
    </details>
  )
}

export default function ProgramV2Page() {
  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero
        heading="Programme"
        intro="Three days of puppetry across the Hall, Upstairs, the Green and Ridgeway Hall. Open any strand to see what's on."
      />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Preview banner — delete when this replaces /program */}
          <p
            className="mb-12 rounded-xl px-5 py-3 text-sm font-semibold border border-black/10"
            style={{ backgroundColor: 'var(--wpf-pink-soft)', color: 'var(--wpf-pink-deep)' }}
          >
            Preview of the new structure — the live programme is still at /program.
          </p>

          <div className="space-y-16">
            {DAYS.map(({ day, date }) => {
              const strands = STRANDS.filter((s) => s.day === day)
              if (strands.length === 0) return null
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
                    {strands.map((s) => (
                      <StrandCard key={s.id} strand={s} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-16 text-center text-sm wpf-text-muted">
            Programme details may shift a little as the festival comes together — check back closer
            to the weekend.
          </p>
        </div>
      </section>
    </main>
  )
}
