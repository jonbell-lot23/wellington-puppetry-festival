import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import SignupForm from '@/components/SignupForm'

export const revalidate = 60

export default async function ContactPage() {
  const c = await getPageContent('contact')

  return (
    <main id="main" tabIndex={-1} style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Left: socials + email */}
          <div className="rounded-2xl bg-[var(--wpf-yellow-soft)] border border-black/5 p-8 md:p-10 h-full">
            <p className="wpf-section-kicker mb-2">Email</p>
            <a
              href={`mailto:${c.email}`}
              className="wpf-btn-focus text-base md:text-lg font-bold hover:underline break-all transition-colors"
              style={{ color: 'var(--wpf-pink-deep)' }}
            >
              {c.email}
            </a>
            {c.contactName && (
              <p className="mt-2 text-sm wpf-text-muted">Your message reaches {c.contactName}.</p>
            )}

            {/* Sarah's number, from the Humanitix access listing (Aug 2026).
                Worth having on the page for anyone who'd rather not put an
                access need in writing to a stranger. */}
            {c.phone && (
              <div className="mt-8 pt-8 border-t border-black/10">
                <p className="wpf-section-kicker mb-2">Phone</p>
                <a
                  href={`tel:${c.phone.replace(/\s+/g, '')}`}
                  className="wpf-btn-focus text-base md:text-lg font-bold hover:underline transition-colors"
                  style={{ color: 'var(--wpf-pink-deep)' }}
                >
                  {c.phone}
                </a>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-black/10">
              <p className="wpf-section-kicker mb-3">Follow along</p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/wellingtonpuppetryfestival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wpf-btn-secondary wpf-btn-focus text-sm px-5 py-2.5 border-black/15"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/wellingtonpuppetryfestival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wpf-btn-secondary wpf-btn-focus text-sm px-5 py-2.5 border-black/15"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right: newsletter */}
          {/* Dark-on-green here was 2.24:1 for the kicker. White on the deep
              green reads at 6.44:1 and matches the footer treatment. */}
          <div className="rounded-2xl p-8 md:p-10 h-full" style={{ backgroundColor: 'var(--wpf-blue-deep)' }}>
            <p className="wpf-section-kicker mb-2" style={{ color: 'var(--wpf-blue-on-dark)' }}>Newsletter</p>
            <p className="font-bold text-base mb-6" style={{ color: '#ffffff' }}>
              {c.newsletterSubtext}
            </p>
            <SignupForm />
          </div>

        </div>
      </section>
    </main>
  )
}
