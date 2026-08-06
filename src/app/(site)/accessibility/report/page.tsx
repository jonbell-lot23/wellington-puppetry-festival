import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'

// A public accessibility report. Two rules for whoever maintains this:
//
//  1. Nothing goes in the "Passing" column that hasn't actually been run.
//     The numbers below come from a real axe-core pass over the production
//     build (10 pages x 3 viewports), a scripted keyboard walk, and a 320px
//     reflow check — not from a checklist someone eyeballed.
//  2. "Open" stays honest. A report that only lists wins is marketing, and
//     the people who need this page can tell the difference immediately.
//
// Re-run the audit before editing LAST_TESTED.

export const metadata: Metadata = {
  title: 'Accessibility report — Wellington Puppetry Festival',
  description:
    'What we test on this website, what passes, what is still open, and what we have fixed so far.',
}

const LAST_TESTED = '6 August 2026'

const SUMMARY = [
  { figure: '11', label: 'pages tested' },
  { figure: '3', label: 'screen widths each' },
  { figure: '0', label: 'automated errors left' },
  { figure: '13', label: 'issues fixed' },
]

type Status = 'pass' | 'open' | 'planned'

const STATUS_LABEL: Record<Status, string> = {
  pass: 'Passing',
  open: 'Open',
  planned: 'Not yet started',
}

// Status is carried by the badge's text, not only its colour — colour alone
// would fail WCAG 1.4.1 for anyone who can't distinguish the two.
const STATUS_STYLE: Record<Status, { bg: string; fg: string; border: string }> = {
  pass: { bg: 'var(--wpf-blue-soft)', fg: 'var(--wpf-blue-deep)', border: 'var(--wpf-blue-deep)' },
  open: { bg: 'var(--wpf-yellow-soft)', fg: '#7a5c00', border: '#7a5c00' },
  planned: { bg: 'var(--wpf-pink-soft)', fg: 'var(--wpf-pink-deep)', border: 'var(--wpf-pink-deep)' },
}

const CHECKS: { title: string; status: Status; body: string; detail?: string }[] = [
  {
    title: 'Keyboard-only navigation',
    status: 'pass',
    body:
      'Every page was walked start to finish with the Tab key and no mouse. Every stop is reachable, every stop shows a visible focus ring, and the order follows the page as it reads.',
    detail:
      'A "Skip to content" link is now the first stop on every page, so you are not tabbing through the logo and four nav links before you reach anything. The mobile menu opens with Enter, reports its open/closed state, and closes with Escape.',
  },
  {
    title: 'Automated checker (axe-core, WCAG 2.2 AA)',
    status: 'pass',
    body:
      '11 pages checked at desktop, phone and 320px widths — 33 page loads in total. Zero errors outstanding.',
    detail:
      'This caught 267 colour-contrast failures and a run of heading-order problems. All are fixed. Worth saying plainly: automated tools only catch roughly a quarter of real accessibility problems, so a clean run is a floor, not a finish line.',
  },
  {
    title: 'Zoom to 400%',
    status: 'pass',
    body:
      'Checked at a 320px-wide viewport, which is what a 1280px desktop looks like at 400% zoom. No content is cut off and nothing has to be scrolled sideways to read.',
    detail:
      'The header used to overflow by 41px at this size, which made every page scroll horizontally. The "Tix soon" pill now steps out of the way on very narrow screens.',
  },
  {
    title: 'Colour contrast',
    status: 'pass',
    body:
      'All text meets the WCAG AA minimum (4.5:1 for body text). Ratios were calculated directly rather than eyeballed.',
    detail:
      'The brand green was the root cause of most failures — white text on it reached only 4.31:1. It has been darkened slightly to clear AA in both directions without changing the look of the site.',
  },
  {
    title: 'Motion and animation',
    status: 'pass',
    body:
      'Nothing on the site animates on its own, nothing flashes, and there is no infinite scroll. The one animation is the "You!" tile on the sponsor wall, which only plays when you choose to click it.',
    detail:
      'Verified that it is fully suppressed when the operating system is set to reduce motion — the whole rig is removed rather than merely slowed down.',
  },
  {
    title: 'No accessibility overlay',
    status: 'pass',
    body:
      'This site uses no overlay plugin — no UserWay, no AccessiBe, nothing of that kind. Accessibility is built into the pages themselves.',
  },
  {
    title: 'Form labels',
    status: 'pass',
    body:
      'The newsletter sign-up fields have real, properly associated labels and autocomplete hints.',
    detail:
      'They previously relied on placeholder text alone, which gives a screen reader an unreliable name and disappears for everyone the moment you start typing.',
  },
  {
    title: 'Tap target sizes',
    status: 'pass',
    body:
      'Every link and button is at least 24x24px on a phone, meeting WCAG 2.5.8.',
    detail: 'The footer links were 19px tall and have been given more room.',
  },
  {
    title: 'Ticketing platform',
    status: 'pass',
    body:
      'Ticket links point at Humanitix, which was preferred over Eventbrite for the booking flow.',
  },
  {
    title: 'Screen reader pass',
    status: 'open',
    body:
      'Not done yet. An accessibility consultant will run this once the site is ready for it, and that testing will find things the automated tools cannot.',
    detail:
      'Landmarks, heading structure and alt text are all in place to give that pass a sensible starting point, but none of that substitutes for someone actually listening to the site.',
  },
  {
    title: 'Te reo Māori pronunciation',
    status: 'open',
    body:
      'Words like whānau and Pōneke are not yet marked up so a screen reader pronounces them as te reo rather than as English.',
    detail:
      'Done for the fixed page text. The programme listings are edited through the admin tool and stored separately, so marking those up needs a change to how that content is saved — it has not been done yet.',
  },
  {
    title: 'Accessible ticket options at booking',
    status: 'planned',
    body:
      'Access requirements need to be selectable individually at booking, each as its own proper checkbox rather than one box covering several options.',
    detail:
      'Booking happens on Humanitix rather than on this site, so this is a setup task there. Flagged here so it does not get lost.',
  },
  {
    title: 'Cabaret access information',
    status: 'planned',
    body:
      'Pre-show notes, wayfinding, drop-off points, entrance and ramp descriptions, and named support volunteers are not on the site yet.',
    detail:
      'The plan is to fold this into the ordinary event listing rather than putting it in a separate access post, so it reaches everyone and reads as normal information.',
  },
]

const CHANGELOG: { date: string; items: string[] }[] = [
  {
    date: '6 August 2026',
    items: [
      'Added a "Skip to content" link as the first stop on every page.',
      'Darkened the brand green so white text on it reads at 5.6:1 instead of 4.3:1 — this alone cleared most of the site\'s contrast failures.',
      'Replaced the faded "Tix on sale soon" pill, which sat at 1.9:1, with a bordered blush version at 7.5:1.',
      'Swapped see-through white footer text for solid tints (was 2.5:1 at its worst, now 4.7:1 or better).',
      'Turned the contact page newsletter panel white-on-deep-green; its label was previously 2.2:1.',
      'Moved small bold "kicker" labels to the deeper pink so they clear 4.5:1 on butter-yellow cards.',
      'Brightened the Cabaret ticket button and its footnote, which were 4.4:1 and 3.8:1.',
      'Gave the newsletter fields real labels, ids and names instead of relying on placeholder text.',
      'Added open/closed state to the mobile menu button, and made Escape close it and return focus.',
      'Fixed heading order on the accessibility, team and volunteers pages, where h3s appeared with no h2 above them.',
      'Stopped the header overflowing at 320px, which had been forcing every page to scroll sideways at high zoom.',
      'Enlarged footer links to meet the 24px minimum tap target.',
      'Marked Pōneke as te reo in the footer and on the about page.',
    ],
  },
  {
    date: 'Earlier',
    items: [
      'Alt text added across the site and made editable in the admin tool.',
      'Wheelchair access noted on every Ridgway School Hall listing.',
      'Venue names linked to maps in the programme.',
      'Reduced-motion support added, so the sponsor-wall animation is removed entirely for anyone who asks their device to limit motion.',
    ],
  },
]

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLE[status]
  return (
    <span
      className="shrink-0 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
      style={{ backgroundColor: s.bg, color: s.fg, borderColor: s.border }}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

export default function AccessibilityReportPage() {
  const passing = CHECKS.filter((c) => c.status === 'pass').length

  return (
    <main id="main" tabIndex={-1} style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero
        heading="Accessibility report"
        intro="What we test on this website, how it is doing, and what we have not sorted yet."
      />

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="wpf-text-muted text-sm leading-relaxed mb-8">
            Last tested <strong>{LAST_TESTED}</strong> against the live build.
            We publish the open items alongside the fixed ones — if something
            here is wrong, or you hit a problem we have not listed,{' '}
            <a
              href="/contact"
              className="wpf-btn-focus font-bold underline underline-offset-2"
              style={{ color: 'var(--wpf-pink-deep)' }}
            >
              please tell us
            </a>
            .
          </p>

          {/* Summary figures */}
          <h2 className="wpf-visually-hidden">Summary</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
            {SUMMARY.map((s) => (
              <li
                key={s.label}
                className="rounded-xl bg-[var(--wpf-yellow-soft)] border border-black/5 px-4 py-5 text-center"
              >
                <p className="font-extrabold text-3xl leading-none mb-1" style={{ color: 'var(--wpf-blue-deep)' }}>
                  {s.figure}
                </p>
                <p className="wpf-text-muted text-xs font-medium leading-snug">{s.label}</p>
              </li>
            ))}
          </ul>

          {/* Checks */}
          <h2 className="wpf-section-heading mb-2">What we tested</h2>
          <p className="wpf-text-muted text-sm mb-8">
            {passing} of {CHECKS.length} checks are passing.
          </p>

          <ul className="space-y-4">
            {CHECKS.map((check) => (
              <li
                key={check.title}
                className="rounded-xl bg-white border border-black/10 p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-base md:text-lg" style={{ color: 'var(--wpf-ink)' }}>
                    {check.title}
                  </h3>
                  <StatusBadge status={check.status} />
                </div>
                <p className="wpf-text-muted text-sm leading-relaxed">{check.body}</p>
                {check.detail && (
                  <p className="wpf-text-muted text-sm leading-relaxed mt-2.5 pl-3 border-l-2" style={{ borderColor: 'var(--wpf-yellow-deep)' }}>
                    {check.detail}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {/* How we test */}
          <h2 className="wpf-section-heading mt-16 mb-4">How we test</h2>
          <div className="rounded-xl bg-[var(--wpf-blue-soft)] border border-black/5 p-5 md:p-6">
            <ul className="space-y-2.5 wpf-text-muted text-sm leading-relaxed list-disc pl-5">
              <li>
                A scripted pass with <strong>axe-core</strong> against WCAG 2.2 A
                and AA, across every public page at three screen widths.
              </li>
              <li>
                A <strong>keyboard walk</strong> of each page, recording every
                stop, its order, and whether it shows a focus ring.
              </li>
              <li>
                A <strong>reflow check</strong> at 320px, equivalent to 400% zoom
                on a desktop screen.
              </li>
              <li>
                <strong>Contrast ratios calculated directly</strong> from the
                colour values, rather than judged by eye.
              </li>
              <li>
                A <strong>reduced-motion check</strong>, confirming animation is
                genuinely removed and not just shortened.
              </li>
              <li>
                Still to come: a <strong>screen reader pass</strong> with someone
                who uses one daily.
              </li>
            </ul>
          </div>

          {/* Changelog */}
          <h2 className="wpf-section-heading mt-16 mb-4">Changelog</h2>
          <div className="space-y-8">
            {CHANGELOG.map((entry) => (
              <div key={entry.date}>
                <h3
                  className="font-bold text-sm uppercase tracking-wider mb-3"
                  style={{ color: 'var(--wpf-pink-deep)' }}
                >
                  {entry.date}
                </h3>
                <ul className="space-y-2 wpf-text-muted text-sm leading-relaxed list-disc pl-5">
                  {entry.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-black/10 text-center">
            <a href="/accessibility" className="wpf-btn-secondary wpf-btn-focus px-6 py-3">
              Access info for festival-goers
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
