import React from 'react'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SITE_URL } from '@/lib/site'
import './globals.css'

// Omnes (Adobe) is the reference face; Nunito is the closest free match
// (rounded geometric sans). Loaded across the weights the site uses.
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const TITLE = 'Wellington Puppetry Festival: Puppets for Peace'
const DESCRIPTION =
  'A free, community-powered puppetry festival in Te Whanganui-a-Tara Wellington. Free family activities all Saturday, plus a full programme of local and visiting puppetry artists. Presented by Birdlife Productions.'

// Bridget, 13 Aug: "do we need to add SEO stuff?" This is it. Until now the
// only metadata was a title and a description, which meant two things: no
// canonical origin (so per-page metadata had no base to resolve against), and
// no Open Graph card — a link posted to Facebook or Instagram showed a bare
// URL with no picture, on a festival that is almost entirely shared that way.
export const metadata: Metadata = {
  // Makes relative URLs in any page's metadata resolve to the real domain.
  metadataBase: new URL(SITE_URL),
  // Every page gets its own title, ending in the festival name.
  //
  // Until Aug 2026 almost none of them did: nine of the eleven public pages
  // inherited "Wellington Puppetry Festival: Puppets for Peace" verbatim, so a
  // screen reader announced the same words on arrival at every one, and a
  // browser window with three of them open showed three identical tabs. An
  // accessibility consultant flagged it, and asked for one consistent format
  // rather than the mix of separators we had.
  //
  // The template is the format. A page sets `title: 'Support us'` and gets
  // "Support us | Wellington Puppetry Festival" — the distinguishing part
  // first, where it survives a truncated tab. The homepage uses `default`.
  title: {
    default: TITLE,
    template: '%s | Wellington Puppetry Festival',
  },
  description: DESCRIPTION,
  icons: { icon: '/images/favicon.ico' },
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Wellington Puppetry Festival',
    locale: 'en_NZ',
    type: 'website',
    images: [
      {
        url: '/images/festival-banner.jpg',
        width: 1600,
        height: 900,
        alt: 'Two puppeteers from Toro Pikopiko Puppets holding carved kare-tao and taniwha puppets at the Wellington Puppetry Festival',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/festival-banner.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
