'use client'

import { useState } from 'react'

export default function SignupForm() {
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
      <p className="wpf-text-muted-on-dark text-sm py-4 max-w-md mx-auto leading-relaxed">
        Thanks! We&apos;ll be in touch once sign-ups are open — follow us on Instagram or Facebook for updates in the meantime.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="wpf-signup-panel w-full max-w-lg mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="wpf-signup-input"
          autoComplete="given-name"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="wpf-signup-input"
          autoComplete="family-name"
        />
      </div>
      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="wpf-signup-input flex-1"
          autoComplete="email"
        />
        <button
          type="submit"
          className="wpf-btn-accent wpf-btn-focus shrink-0 text-sm px-6 py-2.5 sm:py-[0.625rem]"
        >
          Sign up
        </button>
      </div>
    </form>
  )
}
