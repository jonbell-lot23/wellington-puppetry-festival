// Reading the festival's own traffic back out of Vercel Web Analytics.
//
// Jon, 20 Sep 2026: "it might be fun to run some analytics. How many uniques
// did we get? Etc. Load up at /stats/"
//
// Vercel opened a public read API for Web Analytics in 2026, which is what
// this uses. Two shapes: `visits/count` gives one lifetime total, and
// `visits/aggregate` gives rows grouped by a dimension (`by=day`, `by=route`,
// `by=country`, and friends).
//
// Everything here runs on the server. The token is a Vercel access token with
// read access to the team, and it must never reach the browser — hence no
// NEXT_PUBLIC_ prefix, and hence the page that uses this being a server
// component that only ever sends down the finished numbers.

const API = 'https://api.vercel.com/v1/query/web-analytics'

/** The project this site is deployed as. */
const PROJECT_ID = process.env.VERCEL_ANALYTICS_PROJECT_ID ?? 'prj_Fb1QF3EzZIYAxti4FF52VUF1v9Sb'
const TEAM_ID = process.env.VERCEL_ANALYTICS_TEAM_ID ?? 'team_dSnfxncbww1olUYH5gbmmn3d'

export type Totals = { pageviews: number; visitors: number }
export type Row = { label: string; pageviews: number; visitors: number }

/**
 * Why a stats page might have nothing to show.
 *
 * Distinguished on purpose: "no token" is something to go and fix in Vercel,
 * "not enabled" is a different thing to go and fix in Vercel, and "no data"
 * means it is all wired up and nobody has visited yet. Collapsing them into
 * one "could not load stats" would hide which of the three it is, which is the
 * only genuinely useful information when the page is empty.
 */
export type Unavailable =
  | { kind: 'no-token' }
  | { kind: 'not-enabled' }
  | { kind: 'error'; message: string }

export type Stats = {
  totals: Totals
  byDay: Row[]
  byRoute: Row[]
  byCountry: Row[]
  byReferrer: Row[]
  byDevice: Row[]
  byBrowser: Row[]
}

function query(path: string, params: Record<string, string>): string {
  const q = new URLSearchParams({ projectId: PROJECT_ID, teamId: TEAM_ID, ...params })
  return `${API}/${path}?${q}`
}

async function call<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    // Vercel's numbers move slowly and this page is read by a handful of
    // people, so there is no reason to hit the API on every render.
    next: { revalidate: 300 },
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const code = body?.error?.code
    if (code === 'web_analytics_not_enabled') throw new NotEnabled()
    throw new Error(body?.error?.message ?? `Vercel returned ${res.status}`)
  }
  return body as T
}

class NotEnabled extends Error {}

/** Pull one grouped query, tolerating the odd dimension that returns nothing. */
async function aggregate(
  by: string,
  token: string,
  opts: { since?: string; until?: string; limit?: number } = {},
): Promise<Row[]> {
  const params: Record<string, string> = { by }
  if (opts.since) params.since = opts.since
  if (opts.until) params.until = opts.until
  if (opts.limit) params.limit = String(opts.limit)

  const body = await call<{ data?: Record<string, unknown>[] }>(query('visits/aggregate', params), token)
  const rows = Array.isArray(body.data) ? body.data : []

  return rows.map((r) => ({
    // The label column is named after the dimension, except for `day`, which
    // comes back as `timestamp`.
    label: String(r[by] ?? r.timestamp ?? '—'),
    pageviews: Number(r.pageviews ?? 0),
    visitors: Number(r.visitors ?? 0),
  }))
}

/**
 * Everything the stats page shows, or the reason it cannot show it.
 *
 * Returns rather than throws: an analytics page is decoration, and it should
 * never be the thing that takes a festival website down during the festival.
 */
export async function getStats(
  since: string,
  until: string,
): Promise<{ stats: Stats } | { unavailable: Unavailable }> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN?.trim()
  if (!token) return { unavailable: { kind: 'no-token' } }

  const range = { since, until }

  try {
    const [totals, byDay, byRoute, byCountry, byReferrer, byDevice, byBrowser] = await Promise.all([
      call<{ data?: Partial<Totals> }>(query('visits/count', {}), token).then((b) => ({
        pageviews: Number(b.data?.pageviews ?? 0),
        visitors: Number(b.data?.visitors ?? 0),
      })),
      aggregate('day', token, range),
      aggregate('route', token, { ...range, limit: 15 }),
      aggregate('country', token, { ...range, limit: 10 }),
      aggregate('referrerHostname', token, { ...range, limit: 10 }),
      aggregate('deviceType', token, range),
      aggregate('browserName', token, { ...range, limit: 6 }),
    ])

    return { stats: { totals, byDay, byRoute, byCountry, byReferrer, byDevice, byBrowser } }
  } catch (err) {
    if (err instanceof NotEnabled) return { unavailable: { kind: 'not-enabled' } }
    return {
      unavailable: { kind: 'error', message: err instanceof Error ? err.message : 'Unknown error' },
    }
  }
}
