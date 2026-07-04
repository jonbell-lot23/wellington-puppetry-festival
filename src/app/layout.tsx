import React from 'react'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Omnes (Adobe) is the reference face; Nunito is the closest free match
// (rounded geometric sans). Loaded across the weights the site uses.
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Wellington Puppetry Festival — Puppets for Peace',
  description:
    'A free, community-powered puppetry festival in Pōneke Wellington. Free family activities all Saturday, plus a full programme of local and visiting puppetry artists. Presented by Birdlife Productions.',
  icons: { icon: '/images/favicon.ico' },
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
