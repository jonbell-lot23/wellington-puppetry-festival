import { teReo } from '@/lib/tereo'

// A change the reader needs to notice, without the page shouting at them.
//
// Jon, 19 Sep 2026, on the Carnival's venue move: "Don't say it like this:
// MOVED because of the wind... No SHOUTING but you can underline it with
// pink."
//
// So: an ordinary sentence in ordinary case, carrying a thick pink underline.
// Pink is the site's attention colour and nothing else on a listing row is
// underlined, which is enough to make it the first thing the eye lands on —
// capitals only make text harder to read, and read as panic.
//
// Deliberately not role="alert" or aria-live: this is part of the page, met in
// the normal reading order, not an announcement that should interrupt.

export default function Notice({ children }: { children: string }) {
  return (
    <p className="mt-3 leading-relaxed">
      <span
        className="font-semibold underline decoration-[var(--wpf-pink)] underline-offset-4"
        style={{ color: 'var(--wpf-ink)', textDecorationThickness: '3px' }}
      >
        {teReo(children)}
      </span>
    </p>
  )
}
