import Link from 'next/link'
import { teReo } from '@/lib/tereo'
import { notFound } from 'next/navigation'
import { getPageContent } from '@/app/actions'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import NewTabHint from '@/components/NewTabHint'
import { MAIN_HEADING_ID } from '@/lib/site'
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
    // teReo() here covers blurbs and bios in one place — between them that's
    // most of the te reo on the site.
    .map((p, i) => <p key={i}>{teReo(p)}</p>)
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
  // The root layout appends "| Wellington Puppetry Festival" to every page
  // title, so these are just the part that changes.
  if (!found) return { title: 'Programme' }
  return { title: found.event.title }
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

          {/* Heading before the kicker, matching the homepage and cabaret —
              the kicker carries the day, and heading navigation skipped
              straight over it when it sat above the h1 (the accessibility
              consultant's Aug 2026 re-test: dates above headings get missed,
              or misattributed to the previous event). */}
          <h1
            id={MAIN_HEADING_ID}
            tabIndex={-1}
            className="wpf-skip-target text-4xl font-extrabold mb-2"
            style={{ color: 'var(--wpf-ink)' }}
          >
            {teReo(ev.title)}
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest wpf-text-muted mb-3">
            {strand.day} · {teReo(strand.title)}
          </p>
          {ev.by && (
            <p className="text-xl font-bold mb-6 wpf-text-muted">{ev.by}</p>
          )}

          {/* Jon, 11 Aug: the ticket button sits beside the When/Ages/Where
              block rather than in a banner of its own underneath it — the
              practical details and the way to act on them read as one thing,
              and it saves a whole row above the fold. */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <dl className="flex-1 flex flex-wrap gap-x-8 gap-y-3">
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
                  <span className="wpf-visually-hidden"> (opens Google Maps in a new tab)</span>
                </a>
              </dd>
              {/* Bridget, 18 Aug: this used to be Sarah's full access notes for
                  the venue — three sentences on steps and toilets, printed
                  above the blurb of every show and workshop that uses the room.
                  Read one page and it's useful; read four and it's the toilets
                  you remember. The notes live once on /accessibility now, and
                  this is the pointer to them. Still on the page where someone
                  is deciding whether they can get in — just not the loudest
                  thing on it. */}
              {/* The one-line venue detail from the listing — in practice
                  "Wheelchair accessible venue." on the Ridgway rows. Short
                  enough to belong here, and it's the single fact someone is
                  looking for when they open a Ridgway show. */}
              {ev.detail?.trim() && (
                <dd className="text-sm leading-relaxed wpf-text-muted mt-2 max-w-md">
                  {teReo(ev.detail)}
                </dd>
              )}
              <dd className="mt-2">
                <a
                  href="/accessibility#venues"
                  className="wpf-btn-focus text-sm font-semibold underline underline-offset-4 hover:no-underline"
                  style={{ color: 'var(--wpf-pink-deep)' }}
                >
                  Access at our venues
                  <span aria-hidden="true"> →</span>
                </a>
              </dd>
            </div>
          </dl>

          {/* The programme listing no longer carries per-row ticket buttons,
              so this is where someone buys a ticket for this event.

              Jon, 12 Aug: on a phone the new tab opens on top of this one with
              no visible tab bar, and the back swipe doesn't cross tabs — so it
              reads as a one-way door, and you'd think you had to come back
              here for each show you wanted. You don't: Humanitix sells the
              whole festival from that one page, so the second line is doing
              the real work here. The arrow and the hidden text are the
              standard warning that a link leaves for a new tab (WCAG 3.2.5).

              Jon, 13 Aug: briefly tried same-tab to fix that back button.
              Bridget asked for the new tab back — losing sight of the
              programme mid-purchase reads as if Back will empty the cart.
              It won't, but the anxiety is real and it lands while someone is
              part-way through paying. Keep the new tab; the copy above is
              what makes it safe. */}
          {ev.ticketUrl?.trim() && (
            <div className="shrink-0 self-start sm:self-auto sm:text-center">
              <a
                href={ev.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="wpf-btn-primary wpf-btn-focus text-lg px-9 py-4 text-center"
              >
                Buy tickets
                <span aria-hidden="true"> ↗</span>
                <NewTabHint />
              </a>
              <p className="text-xs leading-snug wpf-text-muted mt-2 sm:max-w-[16rem]">
                Opens in a new tab. You can book several shows and workshops in
                one order there.
              </p>
            </div>
          )}
          </div>

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
                      alt={ev.imagesAlt?.[i]?.trim() || `${ev.title}, photo ${i + 1}`}
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

          {/* Repeated at the end of a long read, quieter than the panel up top
              so it doesn't compete with it. */}
          {ev.ticketUrl?.trim() && (
            <a
              href={ev.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="wpf-btn-primary wpf-btn-focus px-8 py-3"
            >
              Buy tickets
              <span aria-hidden="true"> ↗</span>
              <NewTabHint />
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
