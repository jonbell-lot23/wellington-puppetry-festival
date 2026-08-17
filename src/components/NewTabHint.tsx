// The standard warning that a link leaves for a new tab (WCAG 3.2.5, Change on
// Request). Sighted users get the ↗ arrow next to the big ticket buttons; this
// is the same information for anyone who can't see it.
//
// An accessibility consultant reviewing the site (Aug 2026) asked for it on
// every Humanitix link in particular: those hand you to a different platform
// mid-purchase, and finding that out after the fact is the worst time.
// It's applied to every external link on the site rather than only the ticket
// ones, so there's no rule to remember about which links get it.
//
// Rendered as a leading space + text so it reads as "Get Tickets, opens in a
// new tab" rather than running the two together.
export default function NewTabHint() {
  return <span className="wpf-visually-hidden"> (opens in a new tab)</span>
}
