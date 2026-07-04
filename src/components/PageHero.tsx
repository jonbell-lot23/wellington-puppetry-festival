// Shared coloured header band used across the lightweight interior pages
// (Program, Artists, Volunteers, About, Contact, Team, Accessibility) so the
// new nav pages feel like one consistent site rather than disconnected stubs.
// Defaults to the warm sunburst-yellow treatment used on the homepage.
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
      className={`relative px-6 pt-20 pb-16 md:pt-24 md:pb-24 ${sunburst ? 'wpf-sunburst' : ''}`}
      style={{ backgroundColor: sunburst ? undefined : bg, color: textColor }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-extrabold text-4xl md:text-6xl leading-tight text-balance">{heading}</h1>
        {intro && (
          <p className="mt-5 text-base md:text-lg opacity-80 leading-relaxed text-balance">{intro}</p>
        )}
      </div>
    </section>
  )
}
