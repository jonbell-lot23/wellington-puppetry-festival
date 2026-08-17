import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'

// A public accessibility report. Two rules for whoever maintains this:
//
//  1. Nothing goes in the "Passing" column that hasn't actually been run.
//     The numbers below come from a real axe-core pass over the production
//     build (25 pages x 3 viewports), a scripted keyboard walk, and a 320px
//     reflow check — not from a checklist someone eyeballed.
//  2. "Open" stays honest. A report that only lists wins is marketing, and
//     the people who need this page can tell the difference immediately.
//  3. Never name an individual on this page. It records what the site does
//     and what it still gets wrong, not who did or asked for what — naming a
//     person turns a fault into their fault, and turns a request (like taking
//     a phone number down) into a thing they can be argued with about. Say
//     "the festival", "its owner", "an accessibility consultant".
//
// Re-run the audit before editing LAST_TESTED.

export const metadata: Metadata = {
  title: 'Accessibility report',
  description:
    'What we test on this website, what passes, what is still open, and what we have fixed so far.',
}

const LAST_TESTED = '7 August 2026'

// The first review by someone using a screen reader in earnest, rather than by
// us running tools at the site. JAWS 2026 on Windows 11 and Chrome. This is a
// different kind of date from LAST_TESTED above and is deliberately reported
// separately — one is a machine pass, the other is a person listening.
const SCREEN_READER_REVIEW = '14 August 2026'

const SUMMARY = [
  { figure: '25', label: 'pages tested' },
  { figure: '3', label: 'screen widths each' },
  { figure: '0', label: 'automated errors left' },
  { figure: '34', label: 'issues fixed' },
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
      'Every public page checked at desktop, phone and 320px widths. 25 pages, 75 page loads. Zero errors outstanding.',
    detail:
      'This caught 267 colour-contrast failures and a run of heading-order problems. All are fixed. Worth saying plainly: automated tools only catch roughly a quarter of real accessibility problems, so a clean run is a floor, not a finish line.',
  },
  {
    title: 'Zoom to 400%',
    status: 'pass',
    body:
      'Checked at a 320px-wide viewport, which is what a 1280px desktop looks like at 400% zoom. No content is cut off and nothing has to be scrolled sideways to read.',
    detail:
      'The header overflowed by 41px at this size, which made every page scroll horizontally. That was reported fixed in August 2026 and was not: the tickets pill was meant to step out of the way on very narrow screens and never did, so the header still ran 35px over and every page still scrolled sideways. Fixed properly on 17 August. The same ticket link is repeated in the mobile menu, so nothing is lost at that width.',
  },
  {
    title: 'Colour contrast',
    status: 'pass',
    body:
      'All text meets the WCAG AA minimum (4.5:1 for body text). Ratios were calculated directly rather than eyeballed.',
    detail:
      'The brand green was the root cause of most failures: white text on it reached only 4.31:1. It has been darkened slightly to clear AA in both directions without changing the look of the site.',
  },
  {
    title: 'Motion and animation',
    status: 'pass',
    body:
      'Nothing on the site animates on its own, nothing flashes, and there is no infinite scroll. The one animation is the "You!" tile on the sponsor wall, which plays when you hover or focus it.',
    detail:
      'Verified that it is fully suppressed when the operating system is set to reduce motion, with the whole rig removed rather than merely slowed down. It also runs on keyboard focus, so it is not mouse-only.',
  },
  {
    title: 'No accessibility overlay',
    status: 'pass',
    body:
      'This site uses no overlay plugin: no UserWay, no AccessiBe, nothing of that kind. Accessibility is built into the pages themselves.',
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
      'Ticket links point at Humanitix, which was preferred over Eventbrite for the booking flow. Tickets went on sale in August 2026, and each show and workshop links straight to its own section of the ticket page rather than dropping you at the top of a long list.',
  },
  {
    title: 'Venue access information published',
    status: 'pass',
    body:
      'How to reach each venue by car, bus and bike; where you will meet steps and uneven pavement; and where the wheelchair accessible toilets are. It says plainly which parts of the festival are not accessible.',
    detail:
      'It appears in three places rather than one: the access page, the note above the programme, and under the address on every individual event page — the last of these being where someone is actually deciding whether they can get in. The notes are attached to the four venues rather than to each of the twenty-odd listings, so the same room cannot end up described two different ways.',
  },
  {
    title: 'Screen reader pass',
    status: 'open',
    body:
      `Started, not finished. An accessibility consultant went through the site with JAWS on Windows on ${SCREEN_READER_REVIEW} and raised eighteen things, essentially none of which our automated checks had caught. Fifteen are fixed, one is half done, one is open, and one we have decided to leave as it is — they are listed as their own items on this page and in the changelog below. A pass on a phone, with VoiceOver on iOS, is still to come.`,
    detail:
      'The largest one: skipping to the content used to land you on the page wrapper rather than on the heading, and landing on a wrapper makes JAWS read the entire page out as one unbroken string. Every page did it, on every first visit, and no checker we run reports it. That is the argument for this kind of testing in one example.',
  },
  {
    title: 'Programme cards use details and summary',
    status: 'open',
    body:
      'The cards on the programme open and close with the browser’s own show/hide control. It is keyboard operable and works with JavaScript switched off, but support for it across screen readers is uneven, and the recommendation we have had is to rebuild them as a standard accordion instead.',
    detail:
      'What was wrong with them is fixed: the control used to be labelled with the whole card — the access chip, the title, the blurb, the practical note and the ticket link, several sentences of it — before you learned it was something you could open. It now says "See the programme" and names the day and strand. The rebuild is the remaining half and has not been done.',
  },
  {
    title: 'Te reo Māori marked up as te reo',
    status: 'pass',
    body:
      'Words like whānau, Te Whanganui-a-Tara, Aotearoa and Ngā Maunga Rū are marked in the code as te reo rather than English, per WCAG 3.1.2.',
    detail:
      'This page used to claim that made a screen reader pronounce them as te reo. That was wrong, and an accessibility consultant corrected us: very few screen readers can pronounce te reo at all. NVDA has a te reo voice that does not switch reliably between the two languages, and JAWS and the iPhone and Android screen readers do not have one. So the markup is correct and it is what a site can do, but for most people listening today it changes nothing audible. It is there for when that changes, and it is applied automatically as pages are built so it keeps working as the programme is edited.',
  },
  {
    title: 'Alt text proofreading',
    status: 'open',
    body:
      'Every meaningful image has alt text, and the descriptions are genuinely good — they describe what the puppets look like, not just that a puppet is present. Several have typos in them.',
    detail:
      'A misspelling gets read aloud as written, so it lands as a stumble in the middle of a description rather than as something you can skim past. The text is written and edited by the festival rather than in the code, so this is a proofread rather than a development task, and it is not done.',
  },
  {
    title: 'Accessible ticket options at booking',
    status: 'open',
    body:
      'Booking is live and does ask about access requirements, and the festival follows up by email with anyone who flags one. What has not been confirmed is whether each requirement is its own checkbox rather than a single box covering several at once.',
    detail:
      'Booking happens on Humanitix rather than on this site, so this is a setup task there and not something this site can fix. Left open rather than marked passing because nobody has been through the checkout to check.',
  },
  {
    title: 'Cabaret access information',
    status: 'planned',
    body:
      'Steps, surfaces and toilets are now covered for every venue including Vogelmorn Hall. Still missing: pre-show notes, drop-off points, entrance and ramp descriptions, and named support volunteers.',
    detail:
      'The venue notes went in as ordinary listing information rather than a separate access post, which is the shape the rest of this should take too. The cabaret evening is sold as one ticket and has no page of its own, so it has nowhere yet to put pre-show notes.',
  },
]

const CHANGELOG: { date: string; items: string[] }[] = [
  {
    date: '17 August 2026',
    items: [
      'Everything in this entry except the last item comes from an accessibility consultant’s review of the site with the JAWS screen reader. None of it had been found by the automated checks we run.',
      '“Skip to content” now lands on the page’s heading instead of on the wrapper around the content. Landing on the wrapper made JAWS read the whole page aloud as one unbroken string, on every page, every first visit — by a distance the worst thing on the site, and invisible to every tool we own.',
      'The footer links are now a navigation block labelled “Footer”, and the header’s is labelled “Main”, so the two can be told apart instead of both announcing as “navigation”.',
      'The header navigation is a real list, so a screen reader says how many links there are before you start moving through them.',
      'Accessibility moved out of the footer and into the header navigation. It had been reachable only from the very bottom of the page, which is the furthest point from where anyone starts.',
      'On the homepage and the Cabaret page, the heading now comes before the date line rather than after it. Anyone moving through a page by its headings was jumping straight past the dates.',
      'Venue links no longer carry the full postal address in a tooltip. A screen reader reads a tooltip out after the link text, so “Vogelmorn Hall” was followed by the whole street address, twice on rows that had two of them. The addresses are still on each event page as ordinary text.',
      'The programme cards used to announce the entire card — chip, title, blurb, note and ticket link — as the label of the control that opens them. They now say “See the programme” and name the day and strand.',
      'Every show and workshop inside the programme is now a heading, so you can move between them directly instead of reading through each list.',
      'The “More about…” link on each programme row moved to the end of the row. It used to be read out first, so you were offered more about a show before being told which show it was.',
      'Decorative arrows (→, ↗) are hidden from screen readers. They were being announced as “rightwards arrow”, which tells nobody anything.',
      'Every link that opens a new tab now says so — the Humanitix ticket links above all, since those hand you to a different website part-way through buying.',
      'The newsletter sign-up has visible labels. It had real labels already, but they were invisible and the placeholder text was doing the visible work: that disappears the moment you type, and a label nobody can see is one a voice-control user cannot say out loud to reach the field.',
      'On the Team page the four cards had “To be announced” as their heading, so the heading list read “To be announced” four times and the actual roles sat underneath as plain text. The role is the heading now, until there are names to put there.',
      'Not changed, on purpose: the “You!” tile on the sponsor wall still announces as “You! Support us” rather than matching the plainer “Support us” used everywhere else. It was raised as an inconsistency and it is one. The festival wants the tile to keep saying what it says, and a link whose name is a word louder than expected is a smaller cost than losing the invitation it is making.',
      'Every page has its own title. Nine of the eleven had been inheriting the same one, so arriving anywhere on the site announced the same words, and several open tabs were indistinguishable.',
      'Corrected the claim on this page about te reo Māori pronunciation, which was overstated. See the entry above for what it actually does.',
      'Found while doing the above, rather than in the review: every page was still scrolling sideways at a 320px screen width — the same as a desktop at 400% zoom — because the tickets pill in the header was supposed to drop out at that size and never did. This page has been claiming that check passed since 6 August. It did not, and it says so above now.',
    ],
  },
  {
    date: '12 August 2026',
    items: [
      'Published venue access information: getting to each venue by car, bus and bike, the steps and uneven pavement at Vogelmorn, and the fact that the only wheelchair accessible toilets are at Ridgway School Hall.',
      'The note above the programme said Ridgway is wheelchair accessible and said nothing about Vogelmorn, which read as though both were. It now names the steps between the buildings.',
      'Each event page carries its own venue\u2019s access note directly under the address, so the information is where someone is deciding whether they can get in \u2014 not one page away.',
      'Moved ticket buying off the programme listing and onto each event page, where it sits beside that event\u2019s venue and access details. You now see what the room is like before you book, not after.',
      'Tickets went on sale, so the disabled \u201cTix on sale soon\u201d placeholder is a real link. As a dimmed placeholder it had been the worst contrast on the site; the live button carries white on pink at 4.81:1.',
      'Removed the festival phone number from the site at its owner\u2019s request. Worth recording plainly: for some people a phone call is the accessible route and email is not, so this is a step backwards for them. Anyone who flags an access need at checkout is sent the number by email instead.',
    ],
  },
  {
    date: '7 August 2026',
    items: [
      'The "You!" tile on the sponsor wall is now a proper link to a Support page, rather than a button that only did something visual. Its animation plays on hover and on keyboard focus.',
      'Te reo Māori is now marked up across the whole site so screen readers pronounce it as te reo, not as English. It is applied automatically as pages are built, rather than typed in by hand, so it keeps working as the programme changes.',
      'Access information folded into the programme itself, instead of living only on this section of the site.',
      'Moved the "audio described" tag next to the show it describes. On a phone it had been sitting adrift in the row above.',
      'The day is now repeated inside each programme card, so you can tell whether you are looking at Saturday or Sunday once a card is open.',
      'Added the shows that offer audio description and touch tours, with their times.',
    ],
  },
  {
    date: '6 August 2026',
    items: [
      'Added a "Skip to content" link as the first stop on every page.',
      'Darkened the brand green so white text on it reads at 5.6:1 instead of 4.3:1. This alone cleared most of the site\'s contrast failures.',
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
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero
        heading="Accessibility report"
        intro="What we test on this website, how it is doing, and what we have not sorted yet."
      />

      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="wpf-text-muted text-sm leading-relaxed mb-8">
            Automated and keyboard testing last run <strong>{LAST_TESTED}</strong>{' '}
            against the live build. The site has changed since then — tickets
            went on sale, the venue access notes went in, and the changes from
            the review below landed — and those changes have not had a full
            audit run over them. Contrast and keyboard order were checked by
            hand for each new element, which is not the same thing, so the
            figures above describe the site as it was on that date.
            Separately, an accessibility consultant reviewed the site with the
            JAWS screen reader on <strong>{SCREEN_READER_REVIEW}</strong>; what
            that found, and what is still outstanding from it, is set out below.
            We publish the open items alongside the fixed ones. If something
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
                A <strong>screen reader review</strong> by an accessibility
                consultant, using JAWS on Windows. This is the one that finds
                what the others cannot: of the eighteen things it raised, the
                automated checks had flagged essentially none.
              </li>
              <li>
                Still to come: the same on a <strong>phone</strong>, with
                VoiceOver on iOS.
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
