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
  title: 'Birdlife Productions — theatre for children',
  description:
    'Birdlife Productions — creating wonder with Puppetry, Storytelling and Music. Home of the Wellington Puppetry Festival.',
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
