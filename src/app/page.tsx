"use client"

import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#1a0a0a" }}>

      {/* Hero image */}
      <section className="flex flex-col items-center px-4 pt-10 pb-0">
        <Image
          src="/images/festival-5.png"
          alt="Wellington Puppetry Festival – Puppets for Peace, 18–20 September 2026"
          width={700}
          height={700}
          className="w-full max-w-2xl rounded-t-lg"
          priority
        />
      </section>

      {/* Two-column: Coming soon + Signup */}
      <section
        className="relative px-4 pb-0"
        style={{ backgroundColor: "#1a0a0a" }}
      >
        {/* Background banner image — decorative strip */}
        <div
          className="absolute inset-x-0 top-0 h-full"
          style={{
            backgroundImage: "url('/images/festival-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            opacity: 0.12,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-14 px-2">

          {/* Left: Programme announcement */}
          <div className="flex flex-col justify-center">
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4">
              Wellington Puppetry Festival 2026
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
              Thanks for your<br />submissions
            </h1>
            <div className="w-12 h-0.5 bg-yellow-400 mb-6" />
            <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-5 py-4 mb-6">
              <span className="text-3xl">🎭</span>
              <div>
                <p className="text-yellow-300 font-bold text-lg leading-tight">Programme Coming Soon</p>
                <p className="text-yellow-200/70 text-sm">Full lineup announced June 2026</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              18–20 September 2026 · Wellington, NZ<br />
              Sign up to be the first to know when the programme drops.
            </p>
          </div>

          {/* Right: Newsletter signup */}
          <div className="flex flex-col justify-center">
            <div className="bg-green-900/80 border border-green-700/40 rounded-xl px-6 py-8 backdrop-blur-sm">
              <h2 className="text-white text-xl font-bold mb-1">Stay in the loop</h2>
              <p className="text-green-300 text-sm mb-6">Get news and announcements direct to your inbox.</p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-6 py-3 rounded-lg transition-colors text-sm mt-1"
                  >
                    Sign up for Festival News
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <span className="text-4xl">🎉</span>
                  <p className="text-yellow-300 font-bold text-lg">You&apos;re on the list!</p>
                  <p className="text-green-300 text-sm">We&apos;ll be in touch when the programme is announced.</p>
                </div>
              )}

              <p className="text-green-400/60 text-xs mt-4 text-center">We&apos;ll always respect your privacy.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Puppet image */}
      <section className="flex justify-center px-4 pt-4 pb-12" style={{ backgroundColor: "#1a0a0a" }}>
        <Image
          src="/images/festival-1.png"
          alt="Giant Turtle Puppet – Image courtesy of Thomas Kay"
          width={900}
          height={400}
          className="w-full max-w-4xl rounded-lg"
        />
      </section>

      {/* Footer */}
      <footer className="bg-black/60 text-white/40 text-sm px-6 py-8 text-center border-t border-white/5">
        <p className="text-white/60 font-medium">Wellington Puppetry Festival</p>
        <p className="mt-1">18–20 September 2026 · Wellington, NZ</p>
        <p className="mt-3">
          <a href="mailto:wellingtonpuppetryfestival@gmail.com" className="hover:text-white transition-colors">
            wellingtonpuppetryfestival@gmail.com
          </a>
        </p>
      </footer>
    </main>
  )
}
