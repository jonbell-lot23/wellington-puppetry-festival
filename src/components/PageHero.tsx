export default function PageHero({
  heading,
  intro,
  sunburst = true,
  bg = 'var(--wpf-yellow)',
  textColor = 'var(--wpf-ink)',
}: {
  heading: string
  intro?: string
  sunburst?: boolean
  bg?: string
  textColor?: string
}) {
  return (
    <section
      className={`relative px-6 pt-16 pb-14 md:pt-24 md:pb-20 ${sunburst ? 'wpf-sunburst' : ''}`}
      style={{ backgroundColor: sunburst ? undefined : bg, color: textColor }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight text-balance">
          {heading}
        </h1>
        {intro && (
          <p className="mt-5 text-base md:text-lg wpf-text-muted leading-relaxed text-balance max-w-2xl mx-auto">
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
