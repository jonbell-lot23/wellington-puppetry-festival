'use client'

import { useSyncExternalStore } from 'react'

// The current time, as an external store.
//
// Anything that changes by itself as the clock moves — a countdown, a day that
// strikes itself through at midnight — has to read the time in the browser.
// The pages are cached and the reader is not, so a "now" decided when the page
// was rendered is wrong by the time anyone sees it.
//
// Returns null until hydration. Callers render the neutral version (no
// countdown, nothing struck through) for that first frame, which is also
// exactly what a reader with JavaScript off keeps seeing — the plain
// programme, never a wrong one.

/**
 * getSnapshot must return the same value until something actually changes, so
 * the timestamp is cached and only replaced on a tick. Returning Date.now()
 * directly would tell React the store had changed on every single render.
 */
let cachedNow: number | null = null
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | null = null

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (timer === null) {
    cachedNow = Date.now()
    timer = setInterval(() => {
      cachedNow = Date.now()
      listeners.forEach((l) => l())
    }, 30_000)
  }
  // Fire once so the first value arrives without waiting out a whole tick.
  cachedNow = Date.now()
  listener()

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }
}

const getSnapshot = () => cachedNow
const getServerSnapshot = (): number | null => null

/** Current epoch milliseconds, or null before hydration. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
