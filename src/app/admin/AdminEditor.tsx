'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { saveSiteContent, type SiteContent } from '../actions'

const editStyle =
  'outline-none ring-2 ring-yellow-400/0 hover:ring-yellow-400/50 focus:ring-yellow-400 rounded px-0.5 transition-all cursor-text'

export default function AdminEditor({ initialContent }: { initialContent: SiteContent }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const refs = {
    heroSubheading: useRef<HTMLParagraphElement>(null),
    heroHeading: useRef<HTMLHeadingElement>(null),
    badgeTitle: useRef<HTMLParagraphElement>(null),
    badgeSubtext: useRef<HTMLParagraphElement>(null),
    dateLocation: useRef<HTMLSpanElement>(null),
    heroCta: useRef<HTMLSpanElement>(null),
    formHeading: useRef<HTMLHeadingElement>(null),
    formSubtext: useRef<HTMLParagraphElement>(null),
    signupButton: useRef<HTMLSpanElement>(null),
    footerName: useRef<HTMLParagraphElement>(null),
    footerDate: useRef<HTMLParagraphElement>(null),
    footerEmail: useRef<HTMLSpanElement>(null),
  }

  const handleSave = async () => {
    setSaving(true)
    const t = (ref: React.RefObject<HTMLElement | null>, fallback: string) =>
      ref.current?.textContent?.trim() || fallback

    const content: SiteContent = {
      heroSubheading: t(refs.heroSubheading, initialContent.heroSubheading),
      heroHeading: t(refs.heroHeading, initialContent.heroHeading),
      badgeTitle: t(refs.badgeTitle, initialContent.badgeTitle),
      badgeSubtext: t(refs.badgeSubtext, initialContent.badgeSubtext),
      dateLocation: t(refs.dateLocation, initialContent.dateLocation),
      heroCta: t(refs.heroCta, initialContent.heroCta),
      formHeading: t(refs.formHeading, initialContent.formHeading),
      formSubtext: t(refs.formSubtext, initialContent.formSubtext),
      signupButton: t(refs.signupButton, initialContent.signupButton),
      successHeading: initialContent.successHeading,
      successSubtext: initialContent.successSubtext,
      footerName: t(refs.footerName, initialContent.footerName),
      footerDate: t(refs.footerDate, initialContent.footerDate),
      footerEmail: t(refs.footerEmail, initialContent.footerEmail),
    }

    await saveSiteContent(content)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="relative">
      {/* Admin toolbar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-black/90 border-b border-yellow-400/30 px-6 py-3 flex items-center justify-between backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 font-bold text-sm">Admin</span>
          <span className="text-white/40 text-xs">Click any text to edit · changes save to DB</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-white/40 hover:text-white text-xs transition-colors">
            View site ↗
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-4 py-1.5 rounded text-sm transition-colors"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Page preview with editables — offset for toolbar */}
      <main className="min-h-screen pt-12" style={{ backgroundColor: '#1a0a0a' }}>
        <section className="flex flex-col items-center px-4 pt-10 pb-0">
          <Image
            src="/images/festival-5.png"
            alt="Wellington Puppetry Festival"
            width={700}
            height={700}
            className="w-full max-w-2xl rounded-t-lg"
            priority
          />
        </section>

        <section className="relative px-4 pb-0" style={{ backgroundColor: '#1a0a0a' }}>
          <div
            className="absolute inset-x-0 top-0 h-full"
            style={{
              backgroundImage: "url('/images/festival-banner.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              opacity: 0.12,
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-14 px-2">
            <div className="flex flex-col justify-center">
              <p
                ref={refs.heroSubheading}
                contentEditable
                suppressContentEditableWarning
                className={`text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4 ${editStyle}`}
              >
                {initialContent.heroSubheading}
              </p>
              <h1
                ref={refs.heroHeading}
                contentEditable
                suppressContentEditableWarning
                className={`text-white text-3xl md:text-4xl font-bold leading-tight mb-4 ${editStyle}`}
              >
                {initialContent.heroHeading}
              </h1>
              <div className="w-12 h-0.5 bg-yellow-400 mb-6" />
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-5 py-4 mb-6">
                <span className="text-3xl">🎭</span>
                <div>
                  <p
                    ref={refs.badgeTitle}
                    contentEditable
                    suppressContentEditableWarning
                    className={`text-yellow-300 font-bold text-lg leading-tight ${editStyle}`}
                  >
                    {initialContent.badgeTitle}
                  </p>
                  <p
                    ref={refs.badgeSubtext}
                    contentEditable
                    suppressContentEditableWarning
                    className={`text-yellow-200/70 text-sm ${editStyle}`}
                  >
                    {initialContent.badgeSubtext}
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                <span
                  ref={refs.dateLocation}
                  contentEditable
                  suppressContentEditableWarning
                  className={editStyle}
                >
                  {initialContent.dateLocation}
                </span>
                <br />
                <span
                  ref={refs.heroCta}
                  contentEditable
                  suppressContentEditableWarning
                  className={editStyle}
                >
                  {initialContent.heroCta}
                </span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-green-900/80 border border-green-700/40 rounded-xl px-6 py-8 backdrop-blur-sm">
                <h2
                  ref={refs.formHeading}
                  contentEditable
                  suppressContentEditableWarning
                  className={`text-white text-xl font-bold mb-1 ${editStyle}`}
                >
                  {initialContent.formHeading}
                </h2>
                <p
                  ref={refs.formSubtext}
                  contentEditable
                  suppressContentEditableWarning
                  className={`text-green-300 text-sm mb-6 ${editStyle}`}
                >
                  {initialContent.formSubtext}
                </p>

                <div className="flex flex-col gap-3 opacity-50 pointer-events-none select-none">
                  <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white/40 text-sm">First name</div>
                  <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white/40 text-sm">Last name</div>
                  <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white/40 text-sm">Email address</div>
                  <div className="w-full bg-yellow-400 text-green-900 font-bold px-6 py-3 rounded-lg text-sm text-center">
                    <span
                      ref={refs.signupButton}
                      contentEditable
                      suppressContentEditableWarning
                      className="pointer-events-auto cursor-text"
                    >
                      {initialContent.signupButton}
                    </span>
                  </div>
                </div>

                <p className="text-green-400/60 text-xs mt-4 text-center">We&apos;ll always respect your privacy.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-center px-4 pt-4 pb-12" style={{ backgroundColor: '#1a0a0a' }}>
          <Image
            src="/images/festival-1.png"
            alt="Giant Turtle Puppet"
            width={900}
            height={400}
            className="w-full max-w-4xl rounded-lg"
          />
        </section>

        <footer className="bg-black/60 text-white/40 text-sm px-6 py-8 text-center border-t border-white/5">
          <p
            ref={refs.footerName}
            contentEditable
            suppressContentEditableWarning
            className={`text-white/60 font-medium ${editStyle}`}
          >
            {initialContent.footerName}
          </p>
          <p
            ref={refs.footerDate}
            contentEditable
            suppressContentEditableWarning
            className={`mt-1 ${editStyle}`}
          >
            {initialContent.footerDate}
          </p>
          <p className="mt-3">
            <span
              ref={refs.footerEmail}
              contentEditable
              suppressContentEditableWarning
              className={`hover:text-white transition-colors ${editStyle}`}
            >
              {initialContent.footerEmail}
            </span>
          </p>
        </footer>
      </main>
    </div>
  )
}
