'use client'

import { useState } from 'react'

// Footer mailing-list form: white inputs on the dark maroon footer,
// light-blue Sign Up button — matches the Birdlife original.
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
      <p className="text-sm py-4" style={{ color: 'var(--wpf-ink)', opacity: 0.9 }}>
        Thanks! We&apos;ll be in touch once sign-ups are open — follow us on Instagram or Facebook for updates in the meantime.
      </p>
    )
  }

  const input =
    'w-full max-w-[300px] px-4 py-2.5 rounded-md bg-white text-gray-800 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--signup-blue)]'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className={input}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className={input}
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={input}
      />
      <button
        type="submit"
        className="w-fit rounded-md hover:brightness-105 text-sm font-bold px-6 py-2.5 transition mt-1"
        style={{ backgroundColor: 'var(--wpf-yellow)', color: 'var(--wpf-ink)' }}
      >
        Sign Up
      </button>
    </form>
  )
}
