'use client'

import { useRef, useState } from 'react'
import { submitSignup } from '@/app/actions'

/**
 * `panel` draws the translucent box the form sits in. The archived v1 footer
 * wants it — the form floats there on a plain colour band. On /contact the
 * form already sits inside a card, and the panel made it a box inside a box,
 * so that page passes panel={false} and the card does the containing.
 */
export default function SignupForm({
  panel = true,
  /** Which form this is, recorded on the row so the two are tellable apart. */
  source = 'website',
}: {
  panel?: boolean
  source?: string
}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  // The honeypot. Left empty by anyone with eyes; see the field at the foot
  // of the form and submitSignup in app/actions.ts.
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [already, setAlready] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  // Validation used to be the browser's: `required` + type=email pops a native
  // bubble, which a screen reader announces once — and then it's gone. The
  // accessibility consultant (Aug 2026): "I can't then go back and check to
  // see what the message said, I can only tell that the field is marked as
  // having an error." So the form validates itself (noValidate below) and the
  // message is ordinary text that stays on the page until the field is fixed,
  // tied to the input with aria-describedby so it re-reads on focus.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    const problem = !trimmed
      ? 'Error: Enter your email address.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        ? 'Error: Enter an email address that includes an @, like name@example.com.'
        : ''
    if (problem) {
      setError(problem)
      // Focus lands on the field so the label, the invalid state and the
      // message are all announced together — no hunting for what went wrong.
      emailRef.current?.focus()
      return
    }

    // Until Nov 2026 the next line was `setSubmitted(true)` and that was the
    // whole of it: the form thanked you and dropped your address on the
    // floor. It goes to the database now, and — this is the point — it only
    // says thank you if the write came back ok. A failure says so and gives
    // an email address to use instead, because a sign-up that silently
    // vanishes is worse than one that visibly fails.
    setPending(true)
    setError('')
    const result = await submitSignup({ firstName, lastName, email: trimmed, source, company })
    setPending(false)

    if (!result.ok) {
      setError(`Error: ${result.error}`)
      emailRef.current?.focus()
      return
    }
    setAlready(result.already)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      // role=status so a screen reader announces the confirmation — otherwise
      // the form silently vanishes and there's no feedback that it worked.
      <p
        role="status"
        className={`wpf-text-muted-on-dark text-sm leading-relaxed ${panel ? 'py-4 max-w-md mx-auto' : ''}`}
      >
        {already
          ? 'You\u2019re already on the list — nothing more to do. We\u2019ll be in touch about what\u2019s coming up.'
          : 'Thanks, you\u2019re on the list. We\u2019ll be in touch about puppetry events and workshops, and about the next festival.'}
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
    <form
      onSubmit={handleSubmit}
      noValidate
      className={panel ? 'wpf-signup-panel w-full max-w-lg mx-auto' : 'w-full'}
    >
      {/* Honeypot. Hidden from sight AND from the accessibility tree AND from
          the tab order AND from autofill — a field a screen reader announces
          and then penalises you for filling in is a trap for the wrong
          people. Only something reading the raw markup finds it, which is
          exactly who it is for. Checked in submitSignup. */}
      <div aria-hidden="true" className="wpf-visually-hidden">
        <label htmlFor="signup-company" tabIndex={-1}>
          Company (leave this blank)
        </label>
        <input
          id="signup-company"
          name="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
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
            ref={emailRef}
            id="signup-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'signup-email-error' : undefined}
            className={`wpf-signup-input w-full ${error ? 'wpf-signup-input-invalid' : ''}`}
            autoComplete="email"
          />
          {/* role=alert announces the message the moment it appears; being
              plain text, it also stays put for anyone who wants to read it
              again. Starts with "Error:" so the severity survives being read
              out of visual context. */}
          {error && (
            <p id="signup-email-error" role="alert" className="wpf-signup-error">
              {error}
            </p>
          )}
        </div>
        {/* Disabled while the write is in flight, so a slow connection does
            not get three rows and three thank-yous out of one person. The
            label changes with it rather than only the cursor — aria-disabled
            would keep it focusable but there is nothing useful to do with it
            mid-submit, and the text is what actually tells you what is
            happening. */}
        <button
          type="submit"
          disabled={pending}
          className="wpf-btn-accent wpf-btn-focus shrink-0 text-sm px-6 py-2.5 sm:py-[0.625rem] disabled:opacity-70 disabled:cursor-default"
        >
          {pending ? 'Signing up…' : 'Sign up'}
        </button>
      </div>
    </form>
  )
}
