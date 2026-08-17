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

  // Every field once relied on its placeholder as its only label. That was
  // fixed with real <label>s, but they were visually hidden and the
  // placeholders were left doing the visible work — which an accessibility
  // consultant flagged in Aug 2026 as still the same problem wearing a
  // different hat. A placeholder vanishes as soon as you type, which is hard
  // on anyone who loses their thread mid-form, and a label nobody can see is
  // a label a voice-control user can't say out loud to reach the field.
  //
  // So: visible labels, and no placeholders repeating them.
  return (
    <form onSubmit={handleSubmit} className="wpf-signup-panel w-full max-w-lg mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-first-name" className="wpf-signup-label">First name</label>
          <input
            id="signup-first-name"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="wpf-signup-input w-full"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="signup-last-name" className="wpf-signup-label">Last name</label>
          <input
            id="signup-last-name"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="wpf-signup-input w-full"
            autoComplete="family-name"
          />
        </div>
      </div>
      {/* items-end so the button still lines up with the input now that the
          input has a label sitting above it. */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          {/* "(required)" in the label text rather than only an asterisk or
              only the `required` attribute — it's the one field that has to be
              filled in, and that should be readable before you submit. */}
          <label htmlFor="signup-email" className="wpf-signup-label">Email address (required)</label>
          <input
            id="signup-email"
            name="email"
            type="email"
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
