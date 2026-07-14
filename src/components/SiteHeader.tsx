'use client'

import Link from 'next/link'
import { useState } from 'react'

// Top nav is deliberately trimmed to the handful of high-traffic pages —
// see summary for reasoning. Everything else (Volunteers, Team,
// Accessibility) lives in the footer instead.
const NAV = [
  { label: 'Program', href: '/program' },
  { label: 'Artists', href: '/artists' },
  { label: 'Cabaret', href: '/cabaret' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// This is the festival's own microsite, so its own hand-lettered-style
// wordmark leads the header — the Birdlife Productions bird-nest logo has
// been demoted to a small text credit in the footer instead (see
// SiteFooter). No corporate black bar either: warm cream/yellow with a
// tent-stripe bottom border instead.
export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 inset-x-0 z-50">
      <div style={{ backgroundColor: '#ffffff' }}>
        <div className="mx-auto max-w-[1440px] px-6 md:px-11 flex items-center justify-between py-3 md:py-4">
          <Link href="/" className="shrink-0 flex items-center gap-2" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/wpf-logo.png"
              alt=""
              className="h-11 w-11 md:h-12 md:w-12 shrink-0"
              style={{ mixBlendMode: 'multiply' }}
            />
            <span
              className="font-extrabold leading-none text-xl md:text-2xl tracking-tight"
              style={{ color: 'var(--wpf-ink)' }}
            >
              Wellington
              <br />
              <span style={{ color: 'var(--wpf-blue)' }}>Puppetry Festival</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="wpf-nav-link text-[15px] font-bold whitespace-nowrap"
                style={{ color: 'var(--wpf-ink)' }}
              >
                {item.label}
              </Link>
            ))}
            <span className="text-[14px] px-6 py-3 whitespace-nowrap rounded-full opacity-40 cursor-default" style={{ backgroundColor: 'var(--wpf-pink)', color: '#ffffff' }}>
              Tix on sale soon
            </span>
          </nav>

          {/* Mobile: tickets + menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <span className="text-[13px] px-4 py-2.5 whitespace-nowrap rounded-full opacity-40 cursor-default" style={{ backgroundColor: 'var(--wpf-pink)', color: '#ffffff' }}>
              Tix soon
            </span>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="p-2 -mr-2"
              style={{ color: 'var(--wpf-ink)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="lg:hidden mx-4 mb-4 rounded-xl border border-black/5 px-5 py-4 flex flex-col gap-3" style={{ backgroundColor: '#ffffff' }}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="wpf-nav-link text-base font-bold py-1"
                style={{ color: 'var(--wpf-ink)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
