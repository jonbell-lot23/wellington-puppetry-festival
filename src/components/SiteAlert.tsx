import { getPageContent } from '@/app/actions'

// The festival-wide alert bar. Built 19 Sep 2026, on the Saturday, because the
// wind moved the Junk Puppet Carnival to Ridgway School Hall and people were
// already on their way to the Green.
//
// Bridget asked for this on the 17th: "something prepared for the wet
// weather/wind call on Saturday morning - something on the website that tells
// people the Carnival is still going ahead", then "can it also indicate the
// change of venue for the Carnival - at The Ridgeway School".
//
// It sits above the header on every page, and it is impossible to miss on
// purpose: full-bleed pink, white text, large. This is the one piece of the
// site where shouting is correct — someone reading it is standing outside in
// the wind with a child, deciding which way to walk.
//
// Blank `alertText` hides the whole bar, so turning it off after the weekend
// is an edit in /admin and not a deploy. Same for changing the wording when
// the call changes.
export default async function SiteAlert() {
  const c = await getPageContent('site-alert')
  const text = c.alertText?.trim()
  if (!text) return null

  const detail = c.alertDetail?.trim()

  return (
    <aside
      // role="alert" would interrupt a screen reader mid-sentence on every
      // page load. This is important but not an emergency announcement, so it
      // is a labelled region the reader meets in the normal order instead.
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
