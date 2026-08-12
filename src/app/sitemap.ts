// The list of URLs handed to Google. Paired with robots.ts — see the note
// there about why neither existed until 13 Aug.
//
// The show pages are derived from the live programme rather than typed out, so
// when Bridget adds a blurb in /admin and a listing earns its More info page,
// that page turns up here too. `hasMoreInfo` is the same gate /program/[slug]
// uses for generateStaticParams, so the sitemap can't advertise a 404.
//
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md
import type { MetadataRoute } from 'next'

import { getPageContent } from '@/app/actions'
import { SITE_URL } from '@/lib/site'
import { eventSlug, hasMoreInfo, parseStrands, publicEvents } from '@/lib/strands'

// Left out on purpose: /artists and /program/v2 both redirect to /program, and
// listing a redirect just spends a crawl on a URL that isn't the destination.
// /admin, /admin-login and /archives are covered by the disallow in robots.ts.
const STATIC_PATHS = [
  '',
  '/program',
  '/cabaret',
  '/about',
  '/team',
  '/volunteers',
  '/accessibility',
  '/accessibility/report',
  '/support',
  '/contact',
]

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stored = await getPageContent('program-schedule')
  const strands = parseStrands(stored.strandsJson)

  const showPaths = strands.flatMap((strand) =>
    publicEvents(strand)
      .filter(hasMoreInfo)
      .map((ev) => `/program/${eventSlug(strand, ev)}`),
  )

  // One festival, one weekend — everything moves together, so there's no
  // honest per-page lastModified to give. The programme is the part that
  // actually changes, hence the higher changeFrequency on those.
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' || path === '/program' ? 1 : 0.7,
    })),
    ...showPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
