import { getPageContent } from '@/app/actions'
import SiteAlertBar from '@/components/SiteAlertBar'

// The festival-wide alert bar. Built 19 Sep 2026, on the Saturday, because the
// wind moved the Junk Puppet Carnival to Ridgway School Hall and people were
// already on their way to the Green.
//
// Bridget asked for this on the 17th: "something prepared for the wet
// weather/wind call on Saturday morning - something on the website that tells
// people the Carnival is still going ahead", then "can it also indicate the
// change of venue for the Carnival - at The Ridgeway School".
//
// It sits above the header on every page and is impossible to miss on purpose.
// This is the one part of the site where shouting is correct: whoever is
// reading it is outside in the wind with a child, deciding which way to walk.
//
// Two ways to take it down, and they do different jobs:
//
//   alertText blank  — the bar never renders. For "that's over, thanks".
//   alertUntil set   — the bar removes itself at that instant, with no edit
//                      and no deploy. For a thing with a known end, like a
//                      four-hour carnival.
//
// The expiry is checked here as well as in the client component so that a
// reader with no JavaScript stops seeing it too, within the page's revalidate
// window rather than immediately.
/**
 * Has this instant passed?
 *
 * Outside the component on purpose: reading the clock inside a component body
 * is impure, and React's lint rule is right to say so even on the server,
 * where this renders once per revalidate rather than on every paint. The
 * precise cut-off is the client component's job (see SiteAlertBar); this is
 * the coarse one that serves readers with no JavaScript.
 */
function hasPassed(iso: string): boolean {
  const until = Date.parse(iso)
  return !Number.isNaN(until) && Date.now() >= until
}

export default async function SiteAlert() {
  const c = await getPageContent('site-alert')
  const text = c.alertText?.trim()
  if (!text) return null

  const expiresAt = c.alertUntil?.trim()
  if (expiresAt && hasPassed(expiresAt)) return null

  return <SiteAlertBar text={text} detail={c.alertDetail?.trim() || undefined} expiresAt={expiresAt} />
}
