import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Jon, 19 Sep 2026: the page is the "Programme" everywhere it is written
      // — in the nav, in the heading, in every email to the festival team — but
      // the URL was the American "/program". The page moved to /programme and
      // the old spelling redirects here.
      //
      // Permanent (308), and it keeps the method and body, which matters
      // because these are the URLs already sent out: the Box of Birds show
      // pages went to the access consultant and the crew by email, and the
      // Saturday programme link is in Izzy's Day 1 crew email. None of those
      // may break.
      //
      // Order matters: the more specific rule is listed first.
      {
        source: '/program/:slug*',
        destination: '/programme/:slug*',
        permanent: true,
      },
      {
        source: '/program',
        destination: '/programme',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
