type PageHeroProps = {
  heading: string
  intro: string
}

/** Simple centered title band used at the top of secondary pages. */
export default function PageHero({ heading, intro }: PageHeroProps) {
  return (
    <section className="px-6 pt-28 pb-16 md:pt-36 md:pb-20 text-center" style={{ backgroundColor: 'var(--wpf-cream)' }}>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight text-balance" style={{ color: 'var(--wpf-green-deep)' }}>
          {heading}
        </h1>
        <p className="mt-4 leading-relaxed opacity-80 text-balance" style={{ color: 'var(--wpf-ink)' }}>
          {intro}
        </p>
      </div>
    </section>
  )
}
