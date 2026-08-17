// The canonical origin, in one place. Used by robots.ts, sitemap.ts and the
// root layout's metadataBase, which all have to agree or Google sees three
// different sites.
//
// www, not the apex: that's what the domain actually serves and what Bridget
// has been pasting into Instagram.
export const SITE_URL = 'https://www.wellingtonpuppetryfestival.com'

/**
 * The id on every page's <h1>, and the target of the "Skip to content" link.
 *
 * It used to be on <main>, which also carried tabindex="-1". Focusing a
 * container element makes JAWS read the whole container aloud, so skipping to
 * content announced the entire page as one unbroken string. The h1 is the
 * right landing spot anyway: it tells you where you are, and leaves you at the
 * top of the content rather than in a wrapper.
 *
 * One id per page, so anything rendering an <h1> sets it — PageHero does it
 * for most pages; the homepage, cabaret and event pages build their own.
 */
export const MAIN_HEADING_ID = 'main-heading'
