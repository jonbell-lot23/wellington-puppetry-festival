'use client'

import { useEffect, useRef, useState } from 'react'

// The last tile on the sponsor wall. It isn't a sponsor, it's an ask — so it
// renders as an invitation rather than as a logo we haven't received yet.
//
// Click it and the letters get strung up: a control bar swings down, four
// strings drop, and "You!" does a loose-jointed jig before the rig hauls back
// out of frame. It's a puppetry festival; confetti would have been a waste of
// a good excuse.
//
// The whole timeline lives in CSS (see globals.css). React's only job is to
// mount the rig, bump a key so a second click restarts cleanly rather than
// joining the animation half-finished, and clear it when the run is over.

const LETTERS = ['Y', 'o', 'u', '!']
const RUN_MS = 3400

export default function SponsorInvite() {
  const [run, setRun] = useState(0)
  const [dancing, setDancing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const play = () => {
    if (timer.current) clearTimeout(timer.current)
    // Remounting via key is what makes a mid-run re-click start over — CSS
    // animations otherwise ignore a class that's already applied.
    setRun((n) => n + 1)
    setDancing(true)
    timer.current = setTimeout(() => setDancing(false), RUN_MS)
  }

  return (
    <button
      type="button"
      onClick={play}
      // Six logos plus this tile is seven, so it lands alone on the last row.
      // Full width on mobile, centred under the middle column above that, so
      // the position reads as chosen rather than left over.
      className="group col-span-2 sm:col-span-1 sm:col-start-2 h-24 flex items-center justify-center px-3 rounded-2xl border-2 border-dashed transition-all duration-200 hover:-translate-y-1 hover:rotate-[-1.5deg] hover:border-solid"
      style={{ borderColor: 'var(--wpf-pink)' }}
      aria-label="Could your logo be here? Get in touch about sponsoring the festival."
    >
      <span key={run} className="relative">
        {dancing && (
          <span className="wpf-rig" aria-hidden="true">
            <span className="wpf-rig-bar" />
            {LETTERS.map((_, i) => (
              <span
                key={i}
                className="wpf-rig-string"
                // Spread the strings across the word rather than pinning them
                // to glyph centres — close enough to read right, and it
                // survives the letters moving underneath them.
                style={{ left: `${18 + i * 21}%`, animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </span>
        )}

        <span
          className="flex items-end text-3xl font-extrabold leading-none transition-transform duration-200 group-hover:scale-110"
          style={{ color: 'var(--wpf-pink-deep)' }}
        >
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              className={dancing ? 'wpf-marionette' : 'inline-block'}
              // Slack in each string takes up at its own rate, so the limbs
              // never arrive together. This stagger is the whole illusion.
              style={dancing ? { animationDelay: `${i * 0.085}s` } : undefined}
            >
              {ch}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
