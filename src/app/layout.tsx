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
  // No `template` here: pages already end their own titles with
  // ": Wellington Puppetry Festival", so a template would say it twice.
  title: TITLE,
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
        width: 1751,
        height: 959,
        alt: 'Puppeteers and giant puppets at the Wellington Puppetry Festival',
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
