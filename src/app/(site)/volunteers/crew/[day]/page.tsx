import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import PageHero from '@/components/PageHero'
import CrewDay from '@/components/CrewDay'
import MissingSnapshot from '@/components/MissingSnapshot'
import { readSnapshot } from '@/lib/crew-snapshots'
import { FESTIVAL_DAYS, SHEETS, type DayKey, type Entry } from '@/lib/sheets'

// One page per festival day: /volunteers/crew/saturday, /sunday, /friday.
//
// Jon, 19 Sep: "Saturday and Sunday need their own pages... take me to a page
// with nothing on it. Just an obvious list that's easy to scroll." So this is
// deliberately the plainest page on the site — a date, a list, and the name
// box. Both spreadsheets are merged into one chronological run, because on the
// day nobody cares which document a job was typed into.
//
// The day routes are the ones to send people to. /volunteers/crew/schedule and
// /jobs are still there for anyone who wants a whole sheet at once.

export const revalidate = 60

/** URL segment → the day it means. Friday is included so the set is complete. */
const DAY_BY_SLUG: Record<string, DayKey> = {
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export function generateStaticParams() {
  return Object.keys(DAY_BY_SLUG).map((day) => ({ day }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ day: string }>
}): Promise<Metadata> {
  const { day } = await params
  const key = DAY_BY_SLUG[day.toLowerCase()]
  if (!key) return { title: 'Crew', robots: { index: false, follow: false } }
  const info = FESTIVAL_DAYS.find((d) => d.key === key)!
  return {
    title: `${key} — crew`,
    description: `Everything happening on ${info.label} at the Wellington Puppetry Festival, for crew and volunteers.`,
    robots: { index: false, follow: false },
  }
}

export default async function CrewDayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params
  const key = DAY_BY_SLUG[day.toLowerCase()]
  if (!key) notFound()

  const info = FESTIVAL_DAYS.find((d) => d.key === key)!
  const [schedule, jobs] = await Promise.all([readSnapshot('schedule'), readSnapshot('jobs')])

  // Merge the two sheets into one list for this day. The tag travels with each
  // row so the card can say where it came from.
  const tag = (entries: Entry[] | undefined, source: 'Schedule' | 'Job') =>
    (entries ?? []).filter((e) => e.day === key).map((e) => ({ ...e, source }))

  const entries = [...tag(schedule?.entries, 'Schedule'), ...tag(jobs?.entries, 'Job')]

  // The freshest of the two pulls is what the page can honestly claim.
  const fetchedAt = [schedule?.fetchedAt, jobs?.fetchedAt]
    .filter((v): v is string => Boolean(v))
    .sort()
    .at(-1)

  const others = FESTIVAL_DAYS.filter((d) => d.key !== key)

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={key} intro={info.label} />

      <section className="px-6 pt-10 pb-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Other days" className="flex flex-wrap gap-2 mb-8">
            {others.map((d) => (
              <Link
                key={d.key}
                href={`/volunteers/crew/${d.key.toLowerCase()}`}
                className="wpf-btn-focus rounded-full px-5 py-2.5 font-bold border"
                style={{ color: 'var(--wpf-ink)', borderColor: 'rgba(0,0,0,0.18)' }}
              >
                {d.key}
              </Link>
            ))}
            <Link
              href="/volunteers/crew"
              className="wpf-btn-focus rounded-full px-5 py-2.5 font-bold border"
              style={{ color: 'var(--wpf-ink)', borderColor: 'rgba(0,0,0,0.18)' }}
            >
              Crew info
            </Link>
          </nav>

          {fetchedAt ? (
            <CrewDay entries={entries} fetchedAt={fetchedAt} sourceUrl={SHEETS.schedule.url} />
          ) : (
            <MissingSnapshot sourceUrl={SHEETS.schedule.url} />
          )}
        </div>
      </section>
    </main>
  )
}
