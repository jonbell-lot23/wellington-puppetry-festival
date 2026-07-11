import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const revalidate = 60

const TEAM = [
  { name: 'To be announced', role: 'Festival Director' },
  { name: 'To be announced', role: 'Producer' },
  { name: 'To be announced', role: 'Community & Volunteers Lead' },
  { name: 'To be announced', role: 'Marketing & Comms' },
]

export default async function TeamPage() {
  const c = await getPageContent('team')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <div key={i} className="text-center">
              <div className="aspect-square rounded-full bg-[var(--wpf-yellow-soft)] border border-black/5 flex items-center justify-center mb-3">
                <ImagePlaceholder className="w-8 h-8 text-[var(--wpf-ink)]/40" />
              </div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--wpf-ink)' }}>{member.name}</h3>
              <p className="wpf-text-muted text-xs font-medium">{member.role}</p>
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
