import type { Metadata } from 'next'

import { getStats, type Row, type Unavailable } from '@/lib/vercel-analytics'

// How the festival's website actually did.
//
// Jon, 20 Sep 2026: "it might be fun to run some analytics. How many uniques
// did we get? Etc."
//
// Not indexed, and linked from nowhere — it is for the people who made the
// festival, not for the public. It is deliberately not behind a login either:
// there is nothing here but visit counts for a public website, and putting an
// auth wall in front of it would cost more than it protects.

export const metadata: Metadata = {
  title: 'Site stats',
  robots: { index: false, follow: false },
}

export const revalidate = 300

// The window the festival lived in. A few days either side of the weekend,
// because the interesting story is partly the run-up — when people were
// looking things up before deciding to come.
const SINCE = '2026-08-20'
const UNTIL = '2026-09-27'

export default async function StatsPage() {
  const result = await getStats(SINCE, UNTIL)

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-extrabold text-4xl md:text-5xl leading-tight" style={{ color: 'var(--wpf-ink)' }}>
            How the website did
          </h1>
          <p className="mt-3 text-lg wpf-text-muted leading-relaxed">
            Traffic to wellingtonpuppetryfestival.com, from {niceDate(SINCE)} to {niceDate(UNTIL)}.
            Counts come from Vercel Web Analytics, which is cookieless and stores nothing that
            identifies anybody.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          {'unavailable' in result ? (
            <NotAvailable reason={result.unavailable} />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4 mb-12">
                <BigNumber
                  value={result.stats.totals.visitors}
                  label="Unique visitors"
                  detail="People, counted once each per day — the closest thing to “how many humans”."
                  accent="var(--wpf-pink)"
                />
                <BigNumber
                  value={result.stats.totals.pageviews}
                  label="Page views"
                  detail="Every page opened, including the same person reading three things."
                  accent="var(--wpf-blue)"
                />
              </div>

              <Chart rows={result.stats.byDay} />

              <Table title="Most-read pages" rows={result.stats.byRoute} head="Page" />
              <Table title="Where people came from" rows={result.stats.byReferrer} head="Referrer" />
              <Table title="Countries" rows={result.stats.byCountry} head="Country" />
              <Table title="Phone, tablet or computer" rows={result.stats.byDevice} head="Device" />
              <Table title="Browsers" rows={result.stats.byBrowser} head="Browser" />
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function BigNumber({
  value,
  label,
  detail,
  accent,
}: {
  value: number
  label: string
  detail: string
  accent: string
}) {
  return (
    <div className="rounded-2xl p-7 border border-black/5" style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}>
      <p className="font-extrabold tabular-nums leading-none text-5xl md:text-6xl" style={{ color: accent }}>
        {value.toLocaleString('en-NZ')}
      </p>
      <p className="mt-3 font-extrabold text-lg" style={{ color: 'var(--wpf-ink)' }}>
        {label}
      </p>
      <p className="mt-1 text-sm wpf-text-muted leading-relaxed">{detail}</p>
    </div>
  )
}

/**
 * A day-by-day bar chart, drawn with divs.
 *
 * No charting library: this is six weeks of one number, the whole shape fits
 * in a flex row, and a 40KB dependency to draw rectangles would be the most
 * expensive thing on the site.
 */
function Chart({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null
  const peak = Math.max(...rows.map((r) => r.visitors), 1)

  return (
    <section className="mb-12">
      <h2 className="wpf-section-heading mb-4">Visitors per day</h2>
      <div
        className="rounded-2xl p-6 border border-black/5 overflow-x-auto"
        style={{ backgroundColor: 'var(--wpf-blue-soft)' }}
      >
        <ol className="flex items-end gap-1.5 min-w-full" style={{ height: 180 }}>
          {rows.map((r) => {
            const day = new Date(r.label)
            const busiest = r.visitors === peak
            return (
              <li
                key={r.label}
                className="flex-1 min-w-[10px] rounded-t"
                style={{
                  height: `${Math.max(2, (r.visitors / peak) * 100)}%`,
                  backgroundColor: busiest ? 'var(--wpf-pink)' : 'var(--wpf-blue)',
                }}
                // The only practical way to read an individual bar on a chart
                // this dense — and it is the accessible name too, so a screen
                // reader gets the same sentence a hover does.
                title={`${day.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}: ${r.visitors.toLocaleString('en-NZ')} visitors, ${r.pageviews.toLocaleString('en-NZ')} views`}
                aria-label={`${day.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}: ${r.visitors} visitors`}
              />
            )
          })}
        </ol>
        <p className="mt-3 text-sm wpf-text-muted">
          {niceDate(rows[0].label)} to {niceDate(rows[rows.length - 1].label)}. The pink bar is the
          busiest day.
        </p>
      </div>
    </section>
  )
}

function Table({ title, rows, head }: { title: string; rows: Row[]; head: string }) {
  if (rows.length === 0) return null
  const peak = Math.max(...rows.map((r) => r.visitors), 1)

  return (
    <section className="mb-12">
      <h2 className="wpf-section-heading mb-4">{title}</h2>
      <div className="rounded-2xl border border-black/5 overflow-hidden" style={{ backgroundColor: 'var(--wpf-yellow-soft)' }}>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-widest wpf-text-muted">
              <th className="px-5 py-3 font-bold">{head}</th>
              <th className="px-5 py-3 font-bold text-right">Visitors</th>
              <th className="px-5 py-3 font-bold text-right">Views</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-black/5">
                <th scope="row" className="px-5 py-3 font-semibold" style={{ color: 'var(--wpf-ink)' }}>
                  {/* A bar behind the label, so the shape of the list is
                      readable without reading every number. */}
                  <span className="relative inline-block max-w-full">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 -mx-1 rounded"
                      style={{ width: `${(r.visitors / peak) * 100}%`, backgroundColor: 'var(--wpf-yellow)' }}
                    />
                    <span className="relative break-all">{r.label || '—'}</span>
                  </span>
                </th>
                <td className="px-5 py-3 text-right tabular-nums font-bold" style={{ color: 'var(--wpf-ink)' }}>
                  {r.visitors.toLocaleString('en-NZ')}
                </td>
                <td className="px-5 py-3 text-right tabular-nums wpf-text-muted">
                  {r.pageviews.toLocaleString('en-NZ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/**
 * The empty state, which is three different empty states.
 *
 * Each one says the actual next action rather than "no data available" — this
 * page is read by the two people who can fix it.
 */
function NotAvailable({ reason }: { reason: Unavailable }) {
  const { heading, body } = explain(reason)

  return (
    <div className="rounded-2xl p-7 border" style={{ backgroundColor: 'var(--wpf-pink-soft)', borderColor: 'var(--wpf-pink)' }}>
      <h2 className="font-extrabold text-2xl" style={{ color: 'var(--wpf-ink)' }}>
        {heading}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed" style={{ color: 'var(--wpf-ink)' }}>
        {body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  )
}

function explain(reason: Unavailable): { heading: string; body: string[] } {
  switch (reason.kind) {
    case 'no-token':
      return {
        heading: 'No Vercel token set',
        body: [
          'This page reads the numbers from Vercel’s Web Analytics API, which needs an access token.',
          'Create one at vercel.com/account/tokens with read access to the Lot23 team, then add it to this project as the environment variable VERCEL_ANALYTICS_TOKEN and redeploy.',
        ],
      }
    case 'not-enabled':
      return {
        heading: 'Web Analytics is switched off',
        body: [
          'The site has been sending page views all along — the tracking code is on every page — but Web Analytics is not enabled on the Vercel project, so Vercel has been discarding them rather than storing them.',
          'Turn it on under the project’s Analytics tab in Vercel. It starts collecting from that moment; it cannot backfill traffic from before it was enabled.',
        ],
      }
    case 'error':
      return {
        heading: 'Could not load the numbers',
        body: [
          'Vercel’s analytics API returned an error, so there is nothing to show. The site itself is unaffected.',
          reason.message,
        ],
      }
  }
}

function niceDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
