import Link from 'next/link'

// The last tile on the sponsor wall. It isn't a sponsor, it's an ask — so it
// renders as an invitation rather than as a logo we haven't received yet.
//
// Hover (or focus) it and the letters get strung up: a control bar swings
// down, four strings drop, and "You!" does a loose-jointed jig before the rig
// hauls back out of frame. It's a puppetry festival; confetti would have been
// a waste of a good excuse.
//
// It used to be a <button> that played the jig on click. It's a <Link> now,
// because clicking it goes somewhere — and a control that navigates should be
// a link, so middle-click, cmd-click and "open in new tab" all work the way
// people expect. That change also let the whole animation move into CSS
// (:hover / :focus-visible), which is why there's no client JS left here.
//
// The timeline lives in globals.css, and is removed entirely under
// prefers-reduced-motion.

const LETTERS = ['Y', 'o', 'u', '!']

export default function SponsorInvite() {
  return (
    <Link
      href="/support"
      // Six logos plus this tile is seven, so it lands alone on the last row.
      // Full width on mobile, centred under the middle column above that, so
      // the position reads as chosen rather than left over.
      className="wpf-sponsor-invite wpf-btn-focus group col-span-2 sm:col-span-1 sm:col-start-2 h-28 flex flex-col items-center justify-center gap-1 px-3 rounded-2xl border-2 border-dashed transition-all duration-200 hover:-translate-y-1 hover:rotate-[-1.5deg] hover:border-solid"
      style={{ borderColor: 'var(--wpf-pink)' }}
    >
      <span className="relative">
        <span className="wpf-rig" aria-hidden="true">
          <span className="wpf-rig-bar" />
          {LETTERS.map((_, i) => (
            <span
              key={i}
              className="wpf-rig-string"
              // Spread the strings across the word rather than pinning them
              // to glyph centres — close enough to read right, and it
              // survives the letters moving underneath them.
              style={{ left: `${18 + i * 21}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </span>

        <span
          className="flex items-end text-3xl font-extrabold leading-none transition-transform duration-200 group-hover:scale-110"
          style={{ color: 'var(--wpf-pink-deep)' }}
        >
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              className="wpf-marionette inline-block"
              // Slack in each string takes up at its own rate, so the limbs
              // never arrive together. This stagger is the whole illusion.
              style={{ animationDelay: `${i * 0.085}s` }}
            >
              {ch}
            </span>
          ))}
        </span>
      </span>
      {/* Bridget: the tile read as decoration, not a link — "You!" alone
          doesn't say what clicking it does. A small caption underneath
          keeps the joke but makes the CTA obvious without hovering. */}
      <span
        className="text-xs font-semibold uppercase tracking-wide underline underline-offset-2"
        style={{ color: 'var(--wpf-pink-deep)' }}
      >
        Support us
      </span>
    </Link>
  )
}
