import { getPageContent } from '@/app/actions'
import PageHero from '@/components/PageHero'

export const revalidate = 60

export default async function ContactPage() {
  const c = await getPageContent('contact')

  return (
    <main style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <PageHero heading={c.heading} intro={c.intro} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl bg-[var(--wpf-yellow-soft)] border border-black/5 p-8 md:p-10">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-2">Email</p>
            <a
              href={`mailto:${c.email}`}
              className="text-xl md:text-2xl font-bold text-[var(--wpf-green-deep)] hover:underline break-all"
            >
              {c.email}
            </a>

            <div className="mt-8 pt-8 border-t border-black/10">
              <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-3">Follow along</p>
              <div className="flex justify-center gap-3">
                <a
                  href="https://www.instagram.com/BirdlifeProductions3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/BirdlifeProductions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
