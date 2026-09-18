import type { Metadata } from 'next'

import PageHero from '@/components/PageHero'
import CrewSheet, { CrewSheetNav } from '@/components/CrewSheet'
import MissingSnapshot from '@/components/MissingSnapshot'
import { readSnapshot } from '@/lib/crew-snapshots'
import { SHEETS } from '@/lib/sheets'

// Bridget's volunteer assignments, rendered readably. See the schedule page
// for why revalidate is 60 and not the sync interval.
//
// The jobs sheet has no time columns — the hours are written inside the task
// labels ("Packing In 6:30am - 9am"), and src/lib/sheets.ts digs them out. A
// row whose time can't be read still appears, marked "No time given", because
// a shift you can't see is worse than a shift with a vague time.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Job assignments',
  description: 'Wellington Puppetry Festival volunteer job assignments, by day.',
  robots: { index: false, follow: false },
}

export default async function CrewJobsPage() {
  const snapshot = await readSnapshot('jobs')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero
        heading="Job assignments"
        intro="Who is on what, across the weekend. Put your name in to see only your own."
      />

      <section className="px-6 pt-12 pb-20">
        <div className="mx-auto max-w-3xl">
          <CrewSheetNav current="jobs" />

          {snapshot ? (
            <>
              <CrewSheet
                entries={snapshot.entries}
                fetchedAt={snapshot.fetchedAt}
                changedAt={snapshot.changedAt}
                sourceUrl={snapshot.sourceUrl}
              />
              {snapshot.notes.length > 0 && (
                <aside
                  className="rounded-2xl p-6 border border-black/5 bg-[var(--wpf-blue-soft)]"
                  aria-labelledby="jobs-notes"
                  style={{ color: 'var(--wpf-ink)' }}
                >
                  <h2 id="jobs-notes" className="font-extrabold text-lg mb-2">
                    From the top of the sheet
                  </h2>
                  <ul className="space-y-2 leading-relaxed">
                    {snapshot.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </aside>
              )}
            </>
          ) : (
            <MissingSnapshot sourceUrl={SHEETS.jobs.url} />
          )}
        </div>
      </section>
    </main>
  )
}
