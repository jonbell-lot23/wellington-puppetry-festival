import Image from 'next/image'
import { getSiteContent } from './actions'
import NewsletterForm from '@/components/NewsletterForm'

export const revalidate = 60

export default async function Home() {
  const content = await getSiteContent()

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1a0a0a' }}>
      <section className="flex flex-col items-center px-4 pt-10 pb-0">
        <Image
          src="/images/festival-5.png"
          alt="Wellington Puppetry Festival – Puppets for Peace, 18–20 September 2026"
          width={700}
          height={700}
          className="w-full max-w-2xl rounded-t-lg"
          priority
        />
      </section>

      <section className="relative px-4 pb-0" style={{ backgroundColor: '#1a0a0a' }}>
        <div
          className="absolute inset-x-0 top-0 h-full"
          style={{
            backgroundImage: "url('/images/festival-banner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: 0.12,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-14 px-2">
          <div className="flex flex-col justify-center">
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4">
              {content.heroSubheading}
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
              {content.heroHeading}
            </h1>
            <div className="w-12 h-0.5 bg-yellow-400 mb-6" />
            <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-5 py-4 mb-6">
              <span className="text-3xl">🎭</span>
              <div>
                <p className="text-yellow-300 font-bold text-lg leading-tight">{content.badgeTitle}</p>
                <p className="text-yellow-200/70 text-sm">{content.badgeSubtext}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {content.dateLocation}
              <br />
              {content.heroCta}
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-green-900/80 border border-green-700/40 rounded-xl px-6 py-8 backdrop-blur-sm">
              <h2 className="text-white text-xl font-bold mb-1">{content.formHeading}</h2>
              <p className="text-green-300 text-sm mb-6">{content.formSubtext}</p>
              <NewsletterForm content={content} />
              <p className="text-green-400/60 text-xs mt-4 text-center">We&apos;ll always respect your privacy.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center px-4 pt-4 pb-12" style={{ backgroundColor: '#1a0a0a' }}>
        <Image
          src="/images/festival-1.png"
          alt="Giant Turtle Puppet – Image courtesy of Thomas Kay"
          width={900}
          height={400}
          className="w-full max-w-4xl rounded-lg"
        />
      </section>

      <footer className="bg-black/60 text-white/40 text-sm px-6 py-8 text-center border-t border-white/5">
        <p className="text-white/60 font-medium">{content.footerName}</p>
        <p className="mt-1">{content.footerDate}</p>
        <p className="mt-3">
          <a href={`mailto:${content.footerEmail}`} className="hover:text-white transition-colors">
            {content.footerEmail}
          </a>
        </p>
      </footer>
    </main>
  )
}
