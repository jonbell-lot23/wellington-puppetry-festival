import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

const INFO = [
  {
    title: 'Venue access',
    body: 'We work with venues across Wellington to ensure wheelchair access, accessible seating and accessible toilets wherever possible. Specific venue access details will be listed alongside each show in the programme.',
  },
  {
    title: 'Sensory-friendly',
    body: 'Our free Saturday activities are designed to be welcoming for neurodivergent kids and families, with space to move around and no obligation to stay for a full show.',
  },
  {
    title: 'Companion tickets',
    body: 'Support person / companion tickets are available on request for ticketed shows — contact us ahead of time and we\'ll sort it out.',
  },
  {
    title: 'Let us know',
    body: 'If you have a specific access need we haven\'t covered here, get in touch — we\'d rather know in advance so we can make it work.',
  },
]

export default async function AccessibilityPage() {
  const c = await getPageContent('accessibility')

  return (
    <main id="main" tabIndex={-1} style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        {/* Hidden h2 — the card titles are h3s and the design has no visible
            heading above them, which left them skipping a level. */}
        <h2 className="wpf-visually-hidden">Access at the festival</h2>
        <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {INFO.map((item) => (
            <div key={item.title} className="rounded-xl bg-[var(--wpf-yellow-soft)] p-6 border border-black/5">
              <h3 className="font-bold mb-2" style={{ color: 'var(--wpf-ink)' }}>{item.title}</h3>
              <p className="wpf-text-muted text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/contact"
            className="wpf-btn-primary wpf-btn-focus px-7 py-3.5"
          >
            Contact us about access needs
          </a>
        </div>

        <div className="mx-auto max-w-3xl mt-14 pt-10 border-t border-black/10 text-center">
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--wpf-ink)' }}>
            How accessible is this website?
          </h2>
          <p className="wpf-text-muted text-sm leading-relaxed max-w-xl mx-auto mb-5">
            We test this site with a keyboard, with automated checkers and at
            high zoom, and we publish what we find — including what we haven&apos;t
            fixed yet.
          </p>
          <a href="/accessibility/report" className="wpf-btn-secondary wpf-btn-focus px-6 py-3">
            Read our accessibility report
          </a>
        </div>
      </section>
    </main>
  )
}
