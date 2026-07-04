// Frozen snapshot of the pre-redesign SiteFooter, preserved so /archives/v1
// keeps rendering exactly as the live site looked before the TAHI-style
// relaunch. Do not update this file when the live footer changes.

import Image from 'next/image'
import SignupForm from '@/components/SignupForm'

const SITE = 'https://www.birdlifeproductions.co.nz'

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

const LINKS = [
  { label: 'Shows', href: `${SITE}/shows` },
  { label: 'For Teachers', href: `${SITE}/for-teachers` },
  { label: 'Contact', href: `${SITE}/contact` },
  { label: 'About', href: `${SITE}/about-us` },
]

export default function ArchivedSiteFooterV1() {
  return (
    <footer id="footer-signup" className="relative text-white overflow-hidden" style={{ backgroundColor: '#271620' }}>
      <Image src="/images/footer-bg.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative mx-auto max-w-[1100px] px-6 md:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-lg md:text-xl font-bold leading-snug mb-3">
            Sign up for occasional updates from Birdlife Productions
          </h3>
          <p className="text-white/80 text-sm mb-1">as well as some news and updates!</p>
          <p className="text-white/80 text-sm mb-5">We will always respect your privacy!</p>
          <SignupForm />
        </div>

        <div className="md:pl-6">
          <div className="flex items-center gap-3 mb-6">
            <a
              href="https://www.instagram.com/BirdlifeProductions3/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid place-items-center w-8 h-8 rounded-full bg-white text-gray-900 hover:opacity-80 transition"
            >
              <Instagram />
            </a>
            <a
              href="https://www.facebook.com/BirdlifeProductions"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid place-items-center w-8 h-8 rounded-full bg-white text-gray-900 hover:opacity-80 transition"
            >
              <Facebook />
            </a>
          </div>

          <ul className="space-y-2.5 mb-6">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-white/90 underline underline-offset-2 hover:text-white text-sm">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-white/70 text-xs">
            Site made with <span className="text-red-400">❤</span> by Pola Design
          </p>
        </div>
      </div>
    </footer>
  )
}
