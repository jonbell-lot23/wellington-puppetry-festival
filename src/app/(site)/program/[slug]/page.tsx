import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPageContent } from '@/app/actions'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import {
  VENUES,
  eventSlug,
  findEventBySlug,
  hasMoreInfo,
  parseStrands,
  publicEvents,
  venueMapUrl,
} from '@/lib/strands'

export const revalidate = 60

// The "More info" page Bridget asked for (Jul 2026): the listing on /program
// stays clean and precise, and each show or workshop with something more to say
// gets its own page — blurb, image, artist bio, tickets — with an obvious way
// back to the listing.
//
// Slugs are derived from the strand id + title (see lib/strands.ts), so there's
// no slug field for Bridget to maintain in /admin. Renaming a show changes its
// URL; that's fine while nothing links in from outside.

/** Blank-line-separated text from /admin, rendered as paragraphs. */
function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p, i) => <p key={i}>{p}</p>)
}

async function loadStrands() {
  const stored = await getPageContent('program-schedule')
  return parseStrands(stored.strandsJson)
}

export async function generateStaticParams() {
  const strands = await loadStrands()
  return strands.flatMap((strand) =>
    publicEvents(strand)
      .filter(hasMoreInfo)
      .map((ev) => ({ slug: eventSlug(strand, ev) })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const found = findEventBySlug(await loadStrands(), slug)
  if (!found) return { title: 'Programme — Wellington Puppetry Festival' }
  return { title: `${found.event.title} — Wellington Puppetry Festival` }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const found = findEventBySlug(await loadStrands(), slug)
  // Events with nothing extra to show never link here, and shouldn't render an
  // near-empty page if someone guesses the URL.
  if (!found || !hasMoreInfo(found.event)) notFound()

  const { strand, event: ev } = found
  const venue = VENUES[ev.venue] ?? VENUES.hall

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/program"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-10"
            style={{ color: 'var(--wpf-pink-deep)' }}
          >
            <span aria-hidden="true">←</span> Back to the programme
          </Link>

          <p className="text-sm font-bold uppercase tracking-widest wpf-text-muted mb-2">
            {strand.day} · {strand.title}
          </p>
          <h1 className="text-4xl font-extrabold mb-3" style={{ color: 'var(--wpf-ink)' }}>
            {ev.title}
          </h1>
          {ev.by && (
            <p className="text-xl font-bold mb-6 wpf-text-muted">{ev.by}</p>
          )}

          <dl className="flex flex-wrap gap-x-8 gap-y-3 mb-10">
            {[
              { term: 'When', value: [ev.time, ev.duration].filter(Boolean).join(' · ') },
              { term: 'Ages', value: ev.age },
            ]
              .filter((d) => d.value)
              .map((d) => (
                <div key={d.term}>
                  <dt className="text-[11px] font-bold uppercase tracking-widest wpf-text-muted">
                    {d.term}
                  </dt>
                  <dd className="font-bold" style={{ color: 'var(--wpf-ink)' }}>
                    {d.value}
                  </dd>
                </div>
              ))}
            {/* Where gets the full address and a maps link — this is the page
                someone has open while they're trying to find the door. */}
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest wpf-text-muted">
                Where
              </dt>
              <dd className="font-bold" style={{ color: 'var(--wpf-ink)' }}>
                {venue.label}
              </dd>
              <dd>
                <a
                  href={venueMapUrl(ev.venue)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold underline underline-offset-4 hover:no-underline"
                  style={{ color: 'var(--wpf-pink-deep)' }}
                >
                  {venue.address}
                </a>
              </dd>
            </div>
          </dl>

          {ev.image?.trim() && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ev.image}
              alt={ev.imageAlt?.trim() || ev.title}
              className="w-full rounded-2xl mb-10 border border-black/10"
            />
          )}

          {ev.blurb?.trim() && (
            <div className="space-y-4 text-lg leading-relaxed mb-10" style={{ color: 'var(--wpf-ink)' }}>
              {paragraphs(ev.blurb)}
            </div>
          )}

          {ev.warnings?.trim() && (
            <p
              className="rounded-xl px-5 py-4 mb-10 leading-relaxed border border-black/10"
              style={{ backgroundColor: 'var(--wpf-cream)', color: 'var(--wpf-ink)' }}
            >
              <span className="font-bold">Content warnings: </span>
              {ev.warnings}
            </p>
          )}

          {/* Photo slots. An empty string is a placeholder Bridget has claimed
              but not filled yet — it says so rather than silently collapsing. */}
          {ev.images && ev.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {ev.images.map((src, i) =>
                src.trim() ? (
                  // object-contain, not cover: production shots come in at
                  // whatever shape they were taken, and cropping a puppet out
                  // of frame to fill a tidy box is worse than letterboxing.
                  <div
                    key={i}
                    className="w-full aspect-[4/3] rounded-2xl border border-black/10 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={ev.imagesAlt?.[i]?.trim() || `${ev.title} — photo ${i + 1}`}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </div>
                ) : (
                  <div
                    key={i}
                    className="w-full aspect-[4/3] rounded-2xl border border-black/10 flex flex-col items-center justify-center gap-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--wpf-ink)' }}
                  >
                    <ImagePlaceholder className="w-12 h-12 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest wpf-text-muted">
                      Photo coming soon
                    </p>
                  </div>
                ),
              )}
            </div>
          )}

          {(ev.bio?.trim() || ev.credits?.trim()) && (
            <div className="rounded-2xl p-7 mb-10 border border-black/5 bg-[var(--wpf-yellow-soft)]">
              {ev.bio?.trim() && (
                <>
                  <h2 className="text-sm font-bold uppercase tracking-widest wpf-text-muted mb-3">
                    About the artist
                  </h2>
                  <div className="space-y-4 leading-relaxed" style={{ color: 'var(--wpf-ink)' }}>
                    {paragraphs(ev.bio)}
                  </div>
                </>
              )}

              {ev.credits?.trim() && (
                <>
                  <h2
                    className={`text-sm font-bold uppercase tracking-widest wpf-text-muted mb-3 ${
                      ev.bio?.trim() ? 'mt-7 pt-7 border-t border-black/10' : ''
                    }`}
                  >
                    Creative team
                  </h2>
                  <ul className="space-y-1.5 leading-relaxed" style={{ color: 'var(--wpf-ink)' }}>
                    {ev.credits
                      .split('\n')
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {ev.ticketUrl?.trim() && (
            <a
              href={ev.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full px-8 py-3 font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--wpf-pink)' }}
            >
              Buy tickets
            </a>
          )}

          <p className="mt-14 pt-8 border-t border-black/10">
            <Link
              href="/program"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              style={{ color: 'var(--wpf-pink-deep)' }}
            >
              <span aria-hidden="true">←</span> Back to the programme
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
