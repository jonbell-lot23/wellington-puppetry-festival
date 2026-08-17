'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import NewTabHint from '@/components/NewTabHint'

// Top nav is deliberately trimmed to the handful of high-traffic pages —
// see summary for reasoning. Team still lives in the footer only; Volunteers
// was promoted here per Bridget's request.
//
// Accessibility was promoted here too (Aug 2026), after an accessibility
// consultant pointed out that the footer-only links were the ones a disabled
// visitor is most likely to be looking for — and the footer is the furthest
// point in the page from where they start. Team and Support us stay in the
// footer: they're the two with no bearing on whether someone can attend.
const NAV = [
  { label: 'Programme', href: '/program' },
  // Artists page hidden for now — head shots weren't available; bios will
  // live in the programme listings instead. Re-add when ready.
  { label: 'Cabaret', href: '/cabaret' },
  { label: 'About', href: '/about' },
  { label: 'Volunteers', href: '/volunteers' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Contact', href: '/contact' },
]

// "Home" is only added on the mobile menu — people were losing their way
// back to the homepage on mobile, but the desktop header already has the
// wordmark as a persistent, always-visible way home.
const MOBILE_NAV = [{ label: 'Home', href: '/' }, ...NAV]

// The festival-wide Humanitix link. Per-show links (which deep-link to a
// group on the same page) live on the programme listings instead.
const TICKETS_URL = 'https://events.humanitix.com/wellingtonpuppetryfestival/tickets'

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

          {/* Desktop nav.
              The links are a real <ul> so a screen reader announces how many
              there are before you start moving through them — asked for by an
              accessibility consultant, Aug 2026. gap tightens at lg and opens
              back up at xl: six links plus the tickets pill don't fit beside
              the wordmark at exactly 1024px otherwise. */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Main">
            <ul className="flex items-center gap-5 xl:gap-7">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="wpf-nav-link text-[15px] font-bold whitespace-nowrap"
                    style={{ color: 'var(--wpf-ink)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Sarah, 11 Aug: tickets are live, so this is a real link now.
                The old placeholder was white over --wpf-pink at opacity-40,
                which read 1.93:1 — it's the transparency that failed, not the
                colour. Solid --wpf-pink carries white at 4.81:1, so this uses
                the same button as every other CTA on the site rather than a
                darker pink of its own.

                Outside the <ul>: it goes to Humanitix, not to a page of this
                site, so it isn't one of the nav items being counted. */}
            <a
              href={TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="wpf-btn-primary wpf-btn-focus text-[14px] px-6 py-3 whitespace-nowrap"
            >
              Get Tickets
              <NewTabHint />
            </a>
          </nav>

          {/* Mobile: tickets + menu toggle.
              The pill is hidden below 380px — at a 400% zoom / 320px viewport
              it pushes the menu button off the right edge, which makes the
              page scroll sideways. The same tickets link is repeated in the
              mobile menu and the footer, so nothing is lost at that width.

              It hides via .wpf-hide-below-380 rather than Tailwind's `hidden`.
              That was the original fix and it never worked: `hidden` is a
              layered utility and .wpf-btn-primary is unlayered, so the
              button's own `display: inline-block` won and the pill stayed put.
              See the note on that class in globals.css. */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href={TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="wpf-btn-primary wpf-btn-focus wpf-hide-below-380 text-[13px] px-4 py-2.5 whitespace-nowrap"
            >
              Tickets
              <NewTabHint />
            </a>
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
            <ul className="flex flex-col gap-3">
              {MOBILE_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="wpf-nav-link text-base font-bold py-1 inline-block"
                    style={{ color: 'var(--wpf-ink)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Repeated here because the header pill is hidden below 380px. */}
            <a
              href={TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="wpf-btn-primary wpf-btn-focus self-start text-base px-6 py-2.5 mt-1"
            >
              Get Tickets
              <NewTabHint />
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
