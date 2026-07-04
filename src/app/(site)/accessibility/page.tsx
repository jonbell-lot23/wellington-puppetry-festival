import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

const INFO = [
  {
    title: 'Venue access',
    body: 'We work with venues across Wellington to ensure wheelchair access, accessible seating and accessible toilets wherever possible. Specific venue access details will be listed alongside each show in the programme.',
  },
  {
    title: 'Sensory-friendly',
    body: 'Our free Saturday activities are designed to be welcoming for neurodivergent kids and families, with space to move around and no obligation to stay for a full show.',
  },
  {
    title: 'Companion tickets',
    body: 'Support person / companion tickets are available on request for ticketed shows — contact us ahead of time and we\'ll sort it out.',
  },
  {
    title: 'Let us know',
    body: 'If you have a specific access need we haven\'t covered here, get in touch — we\'d rather know in advance so we can make it work.',
  },
]

export default async function AccessibilityPage() {
  const c = await getPageContent('accessibility')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {INFO.map((item) => (
            <div key={item.title} className="rounded-xl bg-[var(--wpf-yellow-soft)] p-6 border border-black/5">
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/contact"
            className="inline-block rounded-full font-bold px-7 py-3.5 text-white hover:brightness-110 transition"
            style={{ backgroundColor: 'var(--wpf-green-deep)' }}
          >
            Contact us about access needs
          </a>
        </div>
      </section>
    </main>
  )
}
