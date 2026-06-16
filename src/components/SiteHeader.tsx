'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const SITE = 'https://www.birdlifeproductions.co.nz'

// Only the festival page lives here; the rest of the nav points to the
// live Birdlife Productions site.
const NAV = [
  { label: 'Home', href: `${SITE}/home`, external: true },
  { label: 'Wellington Puppetry Festival', href: '/', external: false },
  { label: 'Shows', href: `${SITE}/shows`, external: true },
  { label: 'About Us', href: `${SITE}/about-us`, external: true },
  { label: 'For Teachers', href: `${SITE}/for-teachers`, external: true },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8 flex items-center justify-between py-4 md:py-5">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/bp-logo.png"
            alt="Birdlife Productions"
            width={120}
            height={120}
            priority
            className="w-[64px] md:w-[78px] h-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                className="text-white text-[15px] font-medium hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-white text-[15px] font-medium hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                {item.label}
              </Link>
            ),
          )}
          <a
            href={`${SITE}/contact`}
            className="rounded-[10px] bg-[#fcfbff] text-black text-[14px] font-medium px-5 py-2.5 hover:bg-white transition-colors whitespace-nowrap"
          >
            Contact us
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-white p-2 -mr-2"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden mx-4 rounded-xl bg-black/85 backdrop-blur px-5 py-4 flex flex-col gap-3">
          {NAV.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} className="text-white text-base font-medium py-1">
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-white text-base font-medium py-1"
              >
                {item.label}
              </Link>
            ),
          )}
          <a
            href={`${SITE}/contact`}
            className="mt-1 rounded-[10px] bg-[#fcfbff] text-black text-center text-sm font-medium px-5 py-2.5"
          >
            Contact us
          </a>
        </nav>
      )}
    </header>
  )
}
