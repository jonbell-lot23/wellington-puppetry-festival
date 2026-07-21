import { getPageContent } from '@/app/actions'

export const revalidate = 60

// The "special page for cabaret" from the brief — deliberately a different,
// moodier treatment (dark + gold) than the rest of the bright site, since
// this is an after-dark, adults-only event within the festival.
export default async function CabaretPage() {
  const c = await getPageContent('cabaret')

  return (
    <main style={{ backgroundColor: 'var(--wpf-maroon)' }} className="text-white">
      <section className="px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="uppercase tracking-[0.2em] text-xs md:text-sm font-bold mb-4"
            style={{ color: 'var(--wpf-yellow)' }}
          >
            {c.kicker}
          </p>
          <h1 className="font-extrabold text-4xl md:text-6xl leading-tight text-balance">{c.heading}</h1>
          <p className="mt-6 text-white/80 leading-relaxed max-w-2xl mx-auto text-balance">{c.intro}</p>
          <a
            href={c.ticketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-9 rounded-full font-bold text-base px-8 py-4 hover:brightness-125 transition"
            style={{ backgroundColor: '#000000', color: 'var(--wpf-pink)' }}
          >
            {c.ticketsLabel}
          </a>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          {[
            { label: c.card1Label, body: c.card1Body },
            { label: c.card2Label, body: c.card2Body },
            { label: c.card3Label, body: c.card3Body },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-white/5 border border-white/10 p-6">
              <p className="font-bold mb-2" style={{ color: 'var(--wpf-yellow)' }}>{f.label}</p>
              <p className="text-white/70 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-white/40 text-xs mt-10">
          {c.footnote}
        </p>
      </section>
    </main>
  )
}
