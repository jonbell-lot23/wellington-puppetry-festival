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

      {/* White text block — centred in an airy ~594px section */}
      <section className="bg-white px-6 py-24 flex items-center justify-center md:min-h-[594px] md:py-0">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <h1 className="text-[var(--brand-green)] font-semibold text-[22px] md:text-[25px] leading-[1.7]">
            {c.line1}
          </h1>
          <h2 className="text-[var(--brand-green)] font-semibold text-[22px] md:text-[25px] leading-[1.7]">
            {c.line2}
          </h2>
          <h2 className="text-[var(--brand-green)] font-semibold text-[22px] md:text-[25px] leading-[1.7] mt-4">
            {c.line3}
          </h2>
          <Link
            href={c.buttonLink || '#footer-signup'}
            className="mt-11 inline-block rounded-[10px] bg-black text-white font-light tracking-wide text-[19px] md:text-[20px] px-7 py-5 hover:bg-black/85 transition-colors"
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
