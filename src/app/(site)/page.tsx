import Image from 'next/image'
import Link from 'next/link'
import { getPageContent } from '@/app/actions'

export const revalidate = 60

export default async function FestivalPage() {
  const c = await getPageContent('wellington-puppetry-festival')

  return (
    <main className="bg-white">
      {/* Hero — sunburst + arched title + tent + "Puppets for Peace" banner,
          all baked into one image, full-bleed. */}
      <section className="relative w-full aspect-square md:aspect-[1440/1207]">
        <Image
          src="/images/wpf-title.png"
          alt="Wellington Puppetry Festival — Puppets for Peace, 18–20 September 2026"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </section>

      {/* White text block */}
      <section className="bg-white px-6 py-28 md:min-h-[594px] md:flex md:items-center">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <h1 className="text-[var(--brand-green)] font-bold text-2xl md:text-[26px] leading-snug">
            {c.line1}
          </h1>
          <h2 className="text-[var(--brand-green)] font-bold text-2xl md:text-[26px] leading-snug mt-5">
            {c.line2}
          </h2>
          <h2 className="text-[var(--brand-green)] font-bold text-2xl md:text-[26px] leading-snug mt-7">
            {c.line3}
          </h2>
          <Link
            href={c.buttonLink || '#footer-signup'}
            className="mt-10 inline-block rounded-xl bg-black text-white font-light tracking-wide text-lg md:text-xl px-10 py-5 hover:bg-black/85 transition-colors"
          >
            {c.buttonText}
          </Link>
        </div>
      </section>

      {/* Turtle banner — striped curtains + caption baked into the image */}
      <section className="relative w-full aspect-[1440/660]">
        <Image
          src="/images/wpf-turtle-banner.png"
          alt="Giant Turtle Puppet — Amy Atkins, image courtesy of Thomas Kay"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </section>
    </main>
  )
}
