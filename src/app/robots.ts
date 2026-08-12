// Bridget, 13 Aug: "is it possible to remove what ever is blocking google from
// finding the site?" Nothing was blocking it — no noindex on any public page,
// no X-Robots-Tag from Vercel. The site simply went live on 12 Aug with no
// robots.txt and no sitemap, so there was nothing telling Google it existed.
// This file plus sitemap.ts is that missing invitation. Indexing still needs
// someone to submit the domain in Google Search Console — a robots.txt does
// not summon a crawler on its own.
//
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md
import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin editor and its login screen already send `noindex` in their
      // own metadata; this keeps well-behaved crawlers from spending requests
      // on them at all. /archives/v1 is the retired first design, kept for
      // reference — real, but not something to surface in search.
      disallow: ['/admin', '/admin/', '/admin-login', '/archives/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
