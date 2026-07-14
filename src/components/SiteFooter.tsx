'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
const TICKETS_URL = 'https://events.humanitix.com/'

function Instagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-.9.04-1.4.2-1.7.32-.43.17-.74.37-1.06.7-.32.32-.52.63-.7 1.06-.12.3-.28.8-.32 1.7C3.45 8.5 3.45 8.9 3.45 12s0 3.5.07 4.7c.04.9.2 1.4.32 1.7.17.43.37.74.7 1.06.32.32.63.52 1.06.7.3.12.8.28 1.7.32 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c.9-.04 1.4-.2 1.7-.32.43-.17.74-.37 1.06-.7.32-.32.52-.63.7-1.06.12-.3.28-.8.32-1.7.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.04-.9-.2-1.4-.32-1.7a2.9 2.9 0 0 0-.7-1.06 2.9 2.9 0 0 0-1.06-.7c-.3-.12-.8-.28-1.7-.32-1.2-.07-1.6-.07-4.7-.07Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-.34a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
    </svg>
  )
}

function Facebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

// Secondary nav — the items trimmed out of the top nav (see SiteHeader
// comment) live here instead, plus a repeated tickets link per the brief's
// "ticket links everywhere" note.
const LINKS = [
  { label: 'Volunteers', href: '/volunteers' },
  { label: 'Team', href: '/team' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Get Tickets', href: TICKETS_URL, external: true },
]

export default function SiteFooter() {
  const pathname = usePathname()
  // Cabaret is the intentionally moody maroon page — let the wine colour flow
  // straight into the footer with no wave and no blue break.
  const maroon = pathname?.startsWith('/cabaret') ?? false
  const ink = 'var(--wpf-ink)'

  const greenBg = 'var(--wpf-blue)'
  const greenText = 'rgba(13,38,0,0.75)'
  const greenMuted = 'rgba(13,38,0,0.5)'

  return (
    <>
    {/* Wave at top — green rises from below */}
    {!maroon && (
      <div aria-hidden className="relative w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[100px]">
          <path d="M0,55 C360,100 720,10 1080,45 C1260,65 1360,80 1440,50 L1440,100 L0,100 Z" fill={greenBg} opacity="0.4" />
          <path d="M0,65 C240,105 480,5 720,40 C960,75 1200,100 1440,60 L1440,100 L0,100 Z" fill={greenBg} />
        </svg>
      </div>
    )}
    <footer style={{ backgroundColor: maroon ? 'var(--wpf-maroon-deep)' : greenBg, color: maroon ? '#ffffff' : greenText }}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-14 md:py-16 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10">
        <div>
          <p className="font-extrabold leading-none text-xl mb-4">
            Wellington
            <br />
            Puppetry Festival
          </p>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: maroon ? 'rgba(255,255,255,0.75)' : greenText }}>
            A free, community-powered puppetry festival in Pōneke Wellington —
            proudly Wellington Funky since day one.
          </p>
          <p className="text-xs mt-3" style={{ color: maroon ? 'rgba(255,255,255,0.55)' : greenMuted }}>Presented by Birdlife Productions</p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://www.instagram.com/BirdlifeProductions3/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid place-items-center w-9 h-9 rounded-full bg-white transition hover:scale-105"
              style={{ color: maroon ? 'var(--wpf-pink)' : greenBg }}
            >
              <Instagram />
            </a>
            <a
              href="https://www.facebook.com/BirdlifeProductions"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid place-items-center w-9 h-9 rounded-full bg-white transition hover:scale-105"
              style={{ color: maroon ? 'var(--wpf-pink)' : greenBg }}
            >
              <Facebook />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: maroon ? 'rgba(255,255,255,0.55)' : greenMuted }}>More</p>
          <ul className="space-y-2.5">
            {LINKS.map((l) => {
              const linkStyle = { color: maroon ? 'rgba(255,255,255,0.8)' : greenText }
              return l.external ? (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:opacity-100 transition-opacity" style={linkStyle}>
                    {l.label}
                  </a>
                </li>
              ) : (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm font-medium hover:opacity-100 transition-opacity" style={linkStyle}>
                    {l.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 border-t" style={{ borderColor: 'rgba(13,38,0,0.15)' }}>
        <p className="text-xs" style={{ color: maroon ? 'rgba(255,255,255,0.5)' : greenMuted }}>
          © {new Date().getFullYear()} Wellington Puppetry Festival · Birdlife Productions
        </p>
        <p className="text-xs" style={{ color: maroon ? 'rgba(255,255,255,0.5)' : greenMuted }}>
          <Link href="/archives/v1" className="underline underline-offset-2 hover:opacity-100">
            Previous site
          </Link>
        </p>
      </div>
    </footer>
    </>
  )
}
