import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const revalidate = 60

// Placeholder line-up — replace with real artist bios once confirmed.
const ARTISTS = [
  { name: 'To be announced', role: 'Marionette company', country: 'New Zealand' },
  { name: 'To be announced', role: 'Shadow puppetry artist', country: 'New Zealand' },
  { name: 'To be announced', role: 'Giant puppet makers', country: 'New Zealand' },
  { name: 'To be announced', role: 'Family show performer', country: 'International guest' },
]

function Avatar() {
  return (
    <div className="aspect-square rounded-xl bg-[var(--wpf-yellow-soft)] border border-black/5 flex items-center justify-center">
      <ImagePlaceholder className="w-10 h-10 text-[var(--wpf-green-deep)]/50" />
    </div>
  )
}

export default async function ArtistsPage() {
  const c = await getPageContent('artists')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ARTISTS.map((a, i) => (
              <div key={i} className="text-center">
                <Avatar />
                <h3 className="mt-4 font-bold text-gray-900">{a.name}</h3>
                <p className="text-[var(--wpf-green-deep)] text-sm font-medium">{a.role}</p>
                <p className="text-gray-500 text-xs">{a.country}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-10">
            Full artist line-up to be announced alongside the 2026 programme.
          </p>
        </div>
      </section>
    </main>
  )
}
