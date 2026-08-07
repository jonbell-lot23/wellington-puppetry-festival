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
      // role=status so a screen reader announces the confirmation — otherwise
      // the form silently vanishes and there's no feedback that it worked.
      <p role="status" className="wpf-text-muted-on-dark text-sm py-4 max-w-md mx-auto leading-relaxed">
        Thanks! We&apos;ll be in touch once sign-ups are open. Follow us on Instagram or Facebook for updates in the meantime.
      </p>
    )
  }

  // Every field previously relied on its placeholder as its only label. That
  // gives a screen reader an unreliable name, and the label disappears for
  // everyone as soon as they start typing. Real <label>s now, visually hidden
  // where the design can't spare the room.
  return (
    <form onSubmit={handleSubmit} className="wpf-signup-panel w-full max-w-lg mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-first-name" className="wpf-visually-hidden">First name</label>
          <input
            id="signup-first-name"
            name="firstName"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="wpf-signup-input w-full"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="signup-last-name" className="wpf-visually-hidden">Last name</label>
          <input
            id="signup-last-name"
            name="lastName"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="wpf-signup-input w-full"
            autoComplete="family-name"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="signup-email" className="wpf-visually-hidden">Email address (required)</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="wpf-signup-input w-full"
            autoComplete="email"
          />
        </div>
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
