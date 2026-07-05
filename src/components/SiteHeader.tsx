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
      <div className="wpf-stripe-border h-[6px] w-full" />
      <div style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}>
        <div className="mx-auto max-w-[1440px] px-6 md:px-11 flex items-center justify-between py-3 md:py-4">
          <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
            <span
              className="font-extrabold leading-none text-xl md:text-2xl tracking-tight"
              style={{ color: 'var(--wpf-ink)' }}
            >
              Wellington
              <br />
              <span style={{ color: 'var(--wpf-orange-deep)' }}>Puppetry Festival</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap"
                style={{ color: 'var(--wpf-ink)' }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://events.humanitix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full text-white text-[14px] font-bold px-6 py-3 hover:brightness-110 transition whitespace-nowrap"
              style={{ backgroundColor: 'var(--wpf-orange-deep)' }}
            >
              Get Tickets
            </a>
          </nav>

          {/* Mobile: tickets + menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="https://events.humanitix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full text-white text-[13px] font-bold px-4 py-2.5 whitespace-nowrap"
              style={{ backgroundColor: 'var(--wpf-orange-deep)' }}
            >
              Tickets
            </a>
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
          <nav className="lg:hidden mx-4 mb-4 rounded-xl bg-white/60 backdrop-blur px-5 py-4 flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-bold py-1"
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
