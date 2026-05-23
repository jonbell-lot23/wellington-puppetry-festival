'use client'

import { useState } from 'react'
import type { SiteContent } from '@/app/actions'

export default function NewsletterForm({ content }: { content: SiteContent }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="text-4xl">🎉</span>
        <p className="text-yellow-300 font-bold text-lg">{content.successHeading}</p>
        <p className="text-green-300 text-sm">{content.successSubtext}</p>
      </div>
    )
  }

  return (
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
        {content.signupButton}
      </button>
    </form>
  )
}
