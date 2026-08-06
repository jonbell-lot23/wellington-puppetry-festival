'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Top nav is deliberately trimmed to the handful of high-traffic pages —
// see summary for reasoning. Everything else (Volunteers, Team,
// Accessibility) lives in the footer instead.
const NAV = [
  { label: 'Program', href: '/program' },
  // Artists page hidden for now — head shots weren't available; bios will
  // live in the programme listings instead. Re-add when ready.
  { label: 'Cabaret', href: '/cabaret' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// This is the festival's own microsite, so its own hand-lettered-style
// wordmark leads the header — the Birdlife Productions bird-nest logo has
// been demoted to a small text credit in the footer instead (see
// SiteFooter). No corporate black bar either: warm cream/yellow with a
// tent-stripe bottom border instead.
export default function SiteHeader({ logoAlt }: { logoAlt?: string }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Escape closes the mobile menu and puts focus back on the toggle, so a
  // keyboard user isn't stranded in a menu they can't dismiss.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 inset-x-0 z-50">
      <div style={{ backgroundColor: '#ffffff' }}>
        <div className="mx-auto max-w-[1440px] px-6 md:px-11 flex items-center justify-between py-3 md:py-4">
          <Link href="/" className="shrink-0 flex items-center gap-2" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/wpf-logo.png"
              alt={logoAlt ?? ''}
              className="h-11 md:h-12 w-auto object-contain shrink-0"
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
            {/* Was opacity-40 over pink to read as "not yet active", which
                dropped white-on-pink to 1.93:1 — the worst contrast on the
                site. The dimming now comes from a soft blush fill with ink
                text (11.15:1) rather than from transparency. */}
            <span
              className="text-[14px] font-semibold px-6 py-3 whitespace-nowrap rounded-full cursor-default border"
              style={{ backgroundColor: 'var(--wpf-pink-soft)', color: 'var(--wpf-pink-deep)', borderColor: 'var(--wpf-pink-deep)' }}
            >
              Tix on sale soon
            </span>
          </nav>

          {/* Mobile: tickets + menu toggle.
              The pill is hidden below 380px — at a 400% zoom / 320px viewport
              it pushed the menu button off the right edge (doc width 361 vs
              320), which made the page scroll sideways. The same "tickets
              soon" message is repeated in the footer, so nothing is lost. */}
          <div className="lg:hidden flex items-center gap-2">
            <span
              className="hidden min-[380px]:inline-block text-[13px] px-4 py-2.5 whitespace-nowrap rounded-full cursor-default"
              style={{ backgroundColor: 'var(--wpf-pink-deep)', color: '#ffffff' }}
            >
              Tix soon
            </span>
            <button
              ref={toggleRef}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="wpf-btn-focus p-2 -mr-2"
              style={{ color: 'var(--wpf-ink)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="lg:hidden mx-4 mb-4 rounded-xl border border-black/5 px-5 py-4 flex flex-col gap-3"
            style={{ backgroundColor: '#ffffff' }}
          >
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
