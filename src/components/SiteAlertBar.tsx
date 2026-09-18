'use client'

import { useNow } from '@/components/useNow'

// The visible half of the alert bar. Client-side so it can take itself down
// the moment it expires.
//
// Jon, 19 Sep: "The carnival is a limited time, take it down when it's done.
// Not tonight, now." The Carnival runs until 2pm, so the bar goes at 2pm — a
// banner still shouting about a venue change for something that finished two
// hours ago is worse than no banner.
//
// Checked in two places on purpose. The server drops it too (see SiteAlert),
// which handles readers with no JavaScript, but those pages are cached — so
// without this a stale copy could keep showing the bar after it expired. Here
// it disappears on hydration, immediately, whatever the cache thinks.
//
// Before hydration it shows. That is the safe direction: briefly showing a
// just-expired notice is better than briefly hiding a live one that tells
// somebody which building to walk to.

export default function SiteAlertBar({
  text,
  detail,
  expiresAt,
}: {
  text: string
  detail?: string
  expiresAt?: string
}) {
  const now = useNow()

  if (expiresAt && now !== null) {
    const until = Date.parse(expiresAt)
    if (!Number.isNaN(until) && now >= until) return null
  }

  return (
    <aside
      // role="alert" would interrupt a screen reader mid-sentence on every
      // page load. This is important but it is not an emergency announcement,
      // so it is a labelled region met in the normal reading order instead.
      aria-labelledby="site-alert-heading"
      className="px-5 py-4 text-center"
      style={{ backgroundColor: 'var(--wpf-pink)', color: '#ffffff' }}
    >
      <p
        id="site-alert-heading"
        className="font-extrabold text-lg md:text-2xl leading-snug max-w-3xl mx-auto"
      >
        {text}
      </p>
      {detail && (
        <p className="mt-1.5 text-base md:text-lg max-w-3xl mx-auto leading-snug">{detail}</p>
      )}
    </aside>
  )
}
