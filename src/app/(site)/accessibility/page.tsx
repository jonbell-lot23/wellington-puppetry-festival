import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import { teReo } from '@/lib/tereo'

export const revalidate = 60

export default async function AccessibilityPage() {
  const c = await getPageContent('accessibility')

  // Card text is editable in /admin (see the 'accessibility' entry in
  // lib/pages.ts) — access provisions change as venues are confirmed, and
  // waiting on a developer to correct them is the wrong shape for this page.
  // A card with an empty title is dropped, so the count can vary.
  const cards = [1, 2, 3, 4]
    .map((n) => ({ title: c[`card${n}Label`], body: c[`card${n}Body`] }))
    .filter((card) => card.title?.trim())

  const accessShows = [1, 2, 3]
    .map((n) => ({ title: c[`accessShow${n}Label`], body: c[`accessShow${n}Body`] }))
    .filter((show) => show.title?.trim())

  return (
    <main id="main" tabIndex={-1} style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        {/* Hidden h2 — the card titles are h3s and the design has no visible
            heading above them, which left them skipping a level. */}
        <h2 className="wpf-visually-hidden">Access at the festival</h2>
        <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((item) => (
            <div key={item.title} className="rounded-xl bg-[var(--wpf-yellow-soft)] p-6 border border-black/5">
              <h3 className="font-bold mb-2" style={{ color: 'var(--wpf-ink)' }}>{item.title}</h3>
              <p className="wpf-text-muted text-sm leading-relaxed">{teReo(item.body)}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/contact"
            className="wpf-btn-primary wpf-btn-focus px-7 py-3.5"
          >
            {c.ctaLabel}
          </a>
        </div>

        {/* Linked to from the end of the programme as its own destination —
            scroll-mt keeps the heading clear of the sticky header on arrival. */}
        {accessShows.length > 0 && (
          <div id="accessible-shows" className="mx-auto max-w-3xl mt-16 scroll-mt-28">
            <h2 className="wpf-section-heading mb-3">{c.accessShowsHeading}</h2>
            <p className="wpf-text-muted text-sm leading-relaxed mb-6 max-w-2xl">
              {c.accessShowsIntro}
            </p>
            <ul className="space-y-4">
              {accessShows.map((show) => (
                <li
                  key={show.title}
                  className="rounded-xl bg-[var(--wpf-blue-soft)] p-6 border border-black/5"
                >
                  <h3 className="font-bold mb-2" style={{ color: 'var(--wpf-ink)' }}>
                    {show.title}
                  </h3>
                  {/* Each line of the field is its own line on the page — one
                      per showing — so times stay scannable. */}
                  {show.body
                    ?.split('\n')
                    .filter((line) => line.trim())
                    .map((line) => (
                      <p key={line} className="wpf-text-muted text-sm leading-relaxed">
                        {line}
                      </p>
                    ))}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mx-auto max-w-3xl mt-14 pt-10 border-t border-black/10 text-center">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--wpf-ink)' }}>
            {c.reportHeading}
          </h2>
          <p className="wpf-text-muted text-sm leading-relaxed max-w-xl mx-auto mb-5">
            {c.reportBody}
          </p>
          <a href="/accessibility/report" className="wpf-btn-secondary wpf-btn-focus px-6 py-3">
            {c.reportLinkLabel}
          </a>
        </div>
      </section>
    </main>
  )
}
