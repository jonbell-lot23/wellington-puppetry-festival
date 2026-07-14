import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import SignupForm from '@/components/SignupForm'

export const revalidate = 60

export default async function ContactPage() {
  const c = await getPageContent('contact')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Left: socials + email */}
          <div className="rounded-2xl bg-[var(--wpf-yellow-soft)] border border-black/5 p-8 md:p-10 h-full">
            <p className="wpf-section-kicker opacity-80 mb-2">Email</p>
            <a
              href={`mailto:${c.email}`}
              className="text-base md:text-lg font-bold hover:underline break-all transition-colors hover:text-[var(--wpf-pink-deep)]"
              style={{ color: 'var(--wpf-pink)' }}
            >
              {c.email}
            </a>

            <div className="mt-8 pt-8 border-t border-black/10">
              <p className="wpf-section-kicker opacity-80 mb-3">Follow along</p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/BirdlifeProductions3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wpf-btn-secondary wpf-btn-focus text-sm px-5 py-2.5 border-black/15"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/BirdlifeProductions"
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
          <div className="rounded-2xl p-8 md:p-10 h-full" style={{ backgroundColor: 'var(--wpf-blue)' }}>
            <p className="wpf-section-kicker mb-2" style={{ color: 'rgba(13,38,0,0.6)' }}>Newsletter</p>
            <p className="font-bold text-base mb-6" style={{ color: '#0d2600' }}>
              {c.newsletterSubtext}
            </p>
            <SignupForm />
          </div>

        </div>
      </section>
    </main>
  )
}
