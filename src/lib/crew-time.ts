// Relative-time wording for the crew pages: "(Now!)", "(In 53 minutes)",
// "(Finished)".
//
// Pure functions, taking `now` as an argument rather than reading the clock
// themselves. That is what makes them testable, and it is what lets the
// components pass a `now` that only exists after hydration — see the note in
// crew-ui.tsx about why the server must not guess the time.

import type { Entry } from './sheets'

export type Timing = { label: string; status: 'now' | 'soon' | 'later' | 'past' }

/** Minutes → "53 minutes", "2 hours 5 minutes", "3 hours". */
export function describeGap(minutes: number): string {
  if (minutes < 1) return 'less than a minute'
  if (minutes === 1) return '1 minute'
  if (minutes < 60) return `${minutes} minutes`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const hh = h === 1 ? '1 hour' : `${h} hours`
  if (m === 0) return hh
  return `${hh} ${m === 1 ? '1 minute' : `${m} minutes`}`
}

/** How long ago something happened, for the "last updated" line. */
export function describeAge(minutes: number): string {
  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.round(minutes / 60)
  if (hours === 1) return 'about an hour ago'
  if (hours < 24) return `about ${hours} hours ago`
  const days = Math.round(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

/**
 * Where an entry sits relative to now.
 *
 * Returns null for rows the sheet gave no time for — they still render, they
 * just don't get a countdown, because inventing one would be worse than
 * admitting the sheet didn't say.
 */
export function timingFor(entry: Entry, now: number): Timing | null {
  if (!entry.startsAt) return null
  const start = Date.parse(entry.startsAt)
  const end = entry.endsAt ? Date.parse(entry.endsAt) : null
  if (Number.isNaN(start)) return null

  if (now >= start && end !== null && now < end) {
    const left = Math.round((end - now) / 60_000)
    return {
      label: left <= 1 ? 'Now! Finishing up' : `Now! ${describeGap(left)} left`,
      status: 'now',
    }
  }

  // No end time: treat it as a moment, and keep calling it "now" for a
  // generous ten minutes rather than flipping to "finished" the instant it
  // starts. A 10:00am showtime is still very much now at 10:04.
  if (end === null && now >= start && now - start < 10 * 60_000) {
    return { label: 'Now!', status: 'now' }
  }

  if (now < start) {
    const until = Math.round((start - now) / 60_000)
    return { label: `In ${describeGap(until)}`, status: until <= 30 ? 'soon' : 'later' }
  }

  return { label: end !== null ? 'Finished' : 'Started earlier', status: 'past' }
}

/** Chronological, with untimed rows after the timed ones rather than at midnight. */
export function byStartTime(a: Entry, b: Entry): number {
  if (a.startsAt && b.startsAt) return a.startsAt.localeCompare(b.startsAt)
  if (a.startsAt) return -1
  if (b.startsAt) return 1
  return 0
}
