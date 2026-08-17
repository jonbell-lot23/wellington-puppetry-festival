import { teReo } from '@/lib/tereo'
import { MAIN_HEADING_ID } from '@/lib/site'

export default function PageHero({
  heading,
  intro,
  sunburst = true,
  scallop = true,
  bg = 'var(--wpf-yellow)',
  textColor = 'var(--wpf-ink)',
}: {
  heading: string
  intro?: string
  sunburst?: boolean
  scallop?: boolean
  bg?: string
  textColor?: string
}) {
  return (
    <section
      className={`relative px-6 pt-16 pb-14 md:pt-24 md:pb-20 ${sunburst ? 'wpf-sunburst' : ''} ${scallop ? 'wpf-hero-scallop-mask z-10' : ''}`}
      style={{ backgroundColor: sunburst ? undefined : bg, color: textColor }}
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Where "Skip to content" lands. tabindex="-1" makes the heading
            focusable without adding it to the tab order. */}
        <h1
          id={MAIN_HEADING_ID}
          tabIndex={-1}
          className="wpf-skip-target font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight text-balance"
        >
          {teReo(heading)}
        </h1>
        {intro && (
          <p className="mt-5 text-base md:text-lg wpf-text-muted leading-relaxed text-balance max-w-2xl mx-auto">
            {teReo(intro)}
          </p>
        )}
      </div>
    </section>
  )
}
