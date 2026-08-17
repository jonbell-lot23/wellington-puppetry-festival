import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = { title: 'Our team' }

// Leave `name` empty until a real one is confirmed. An empty name puts the
// role in the heading and prints "To be announced" underneath; filling one in
// swaps them round, so the person's name becomes the heading and the role
// becomes the caption. See the note on the cards below for why.
const TEAM: { name?: string; role: string }[] = [
  { role: 'Festival Director' },
  { role: 'Producer' },
  { role: 'Community & Volunteers Lead' },
  { role: 'Marketing & Comms' },
]

export default async function TeamPage() {
  const c = await getPageContent('team')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        {/* The design has no visible heading between the h1 and the member
            cards, which left the h3s orphaned. A hidden h2 restores the
            outline without changing the layout. */}
        <h2 className="wpf-visually-hidden">Festival team</h2>
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* The heading is the person, or — while the roster is unconfirmed —
              the role they'll fill. It used to be the literal words "To be
              announced", four times over, which an accessibility consultant
              testing with JAWS (Aug 2026) found in the heading list: four
              identical headings saying nothing, with the only real
              information sitting underneath them as plain text. */}
          {TEAM.map((member, i) => (
            <div key={i} className="text-center">
              <div className="aspect-square rounded-full bg-[var(--wpf-yellow-soft)] border border-black/5 flex items-center justify-center mb-3">
                <ImagePlaceholder className="w-8 h-8 text-[var(--wpf-ink)]/40" />
              </div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--wpf-ink)' }}>
                {member.name?.trim() || member.role}
              </h3>
              <p className="wpf-text-muted text-xs font-medium">
                {member.name?.trim() ? member.role : 'To be announced'}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center wpf-text-muted text-sm mt-10">
          Full team bios coming soon.
        </p>
      </section>
    </main>
  )
}
