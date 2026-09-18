import type { Metadata } from 'next'

import PageHero from '@/components/PageHero'
import CrewSheet, { CrewSheetNav } from '@/components/CrewSheet'
import { readSnapshot } from '@/lib/crew-snapshots'
import { SHEETS } from '@/lib/sheets'
import MissingSnapshot from '@/components/MissingSnapshot'

// Izzy's weekend schedule, rendered readably instead of as a spreadsheet.
// The content is a snapshot written by scripts/sync-sheets.ts every 30
// minutes; this page just reads the latest one.
//
// revalidate is 60 rather than 1800: the sync writes on its own cadence, and a
// page cached for half an hour on top of a job that runs every half hour can
// show something an hour old while claiming otherwise. A cheap read every
// minute keeps the "last updated" line honest.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Weekend schedule',
  description: 'The Wellington Puppetry Festival weekend schedule for crew and volunteers.',
  robots: { index: false, follow: false },
}

export default async function CrewSchedulePage() {
  const snapshot = await readSnapshot('schedule')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero
        heading="Weekend schedule"
        intro="Everything that happens, when, and who is on it. Put your name in to see only your own."
      />

      <section className="px-6 pt-12 pb-20">
        <div className="mx-auto max-w-3xl">
          <CrewSheetNav current="schedule" />

          {snapshot ? (
            <CrewSheet
              entries={snapshot.entries}
              fetchedAt={snapshot.fetchedAt}
              changedAt={snapshot.changedAt}
              sourceUrl={snapshot.sourceUrl}
            />
          ) : (
            <MissingSnapshot sourceUrl={SHEETS.schedule.url} />
          )}
        </div>
      </section>
    </main>
  )
}
