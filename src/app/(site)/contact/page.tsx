import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import SignupForm from '@/components/SignupForm'
import NewTabHint from '@/components/NewTabHint'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = { title: 'Contact & Newsletter' }

// Jon, 26 Aug: "this page is weird". Three things were making it so, and
// none of them were the idea of the page:
//
//  - The newsletter card printed `c.newsletterSubtext`, which is a *home*
//    page field. On this slug it came back undefined, so the card had an
//    empty bold paragraph holding a 24px gap open above the form, under a
//    kicker with nothing to explain it. The field lives on this page now
//    (see lib/pages.ts) and says what signing up gets you.
//  - The two cards were in a grid with `items-start`, so `h-full` on each
//    resolved to its own content height and the cards ended up different
//    heights — the yellow one stopping well short of the green one.
//  - The signup form brought its own translucent panel, which put a box
//    inside a box on the green card. It's plain here; the card is the panel.
//
// The page is "Contact & Newsletter" now, in the nav, the tab title and the
// footer — the newsletter is half of what's on it, and calling the whole
// thing "Contact" hid that.

/**
 * The address as a link, breakable at the @.
 *
 * It was `break-all`, which broke it mid-word: "wellingtonpuppetryfestival@gmai
 * / l.com" on a phone. A <wbr> offers the @ as the one place to wrap, so a
 * narrow screen gets local-part / domain on two lines and anything wider keeps
 * it on one. `overflow-wrap: anywhere` stays as the last resort below ~300px,
 * where even the local part alone doesn't fit.
 */
function EmailLink({ email, className, style }: { email: string; className?: string; style?: React.CSSProperties }) {
  const at = email.indexOf('@')
  return (
    <a href={`mailto:${email}`} className={className} style={style}>
      {at === -1 ? (
        email
      ) : (
        <>
          {email.slice(0, at + 1)}
          <wbr />
          {email.slice(at + 1)}
        </>
      )}
    </a>
  )
}

// Jon, 26 Aug: the third block in this card — a row of links to Programme,
// Volunteering and Accessibility under "Also on the site" — is out. It was
// my addition, the reasoning being that the intro paragraph names those three
// things; but the header, the footer and the intro itself all already point
// at them, and a card headed "Email us" is a strange place to be handed a
// fourth set of navigation. The card is the two things it's for: the address
// and the socials.

export default async function ContactPage() {
  const c = await getPageContent('contact')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        {/* No `items-start`: the two cards stretch to the same height, which is
            what the h-full on each was always meant to do. */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Left: email, socials, and the pages people usually want */}
          <div className="rounded-2xl bg-[var(--wpf-yellow-soft)] border border-black/5 p-6 sm:p-8 md:p-10 flex flex-col">
            <h2 className="wpf-section-kicker mb-3">Email us</h2>
            <EmailLink
              email={c.email}
              className="wpf-btn-focus text-[17px] md:text-xl font-bold hover:underline underline-offset-4 [overflow-wrap:anywhere] transition-colors mb-7"
              style={{ color: 'var(--wpf-pink-deep)' }}
            />

            {/* Fixed spacing, not mt-auto. The card stretches to match the
                newsletter card beside it, and pushing the socials to the foot
                of it just opened a hole in the middle — the slack reads
                better as quiet space under a short card than as a gap between
                two things that belong together. */}
            <div className="pt-7 border-t border-black/10">
              <h2 className="wpf-section-kicker mb-3">Follow along</h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/wellingtonpuppetryfestival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wpf-btn-secondary wpf-btn-focus text-sm px-5 py-2.5 border-black/15"
                >
                  Instagram
                  <NewTabHint />
                </a>
                <a
                  href="https://www.facebook.com/wellingtonpuppetryfestival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wpf-btn-secondary wpf-btn-focus text-sm px-5 py-2.5 border-black/15"
                >
                  Facebook
                  <NewTabHint />
                </a>
              </div>
            </div>
          </div>

          {/* Right: newsletter.
              Dark-on-green here was 2.24:1 for the kicker. White on the deep
              green reads at 6.44:1 and matches the footer treatment. */}
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col"
            style={{ backgroundColor: 'var(--wpf-blue-deep)' }}
          >
            <h2 className="wpf-section-kicker mb-3" style={{ color: 'var(--wpf-blue-on-dark)' }}>
              Newsletter
            </h2>
            {c.newsletterSubtext && (
              <p className="font-bold text-[17px] md:text-xl leading-snug mb-6" style={{ color: '#ffffff' }}>
                {c.newsletterSubtext}
              </p>
            )}
            <SignupForm panel={false} />
          </div>

        </div>
      </section>
    </main>
  )
}
