import type { CSSProperties } from 'react'

// Generic, brand-neutral "image coming soon" placeholder — used anywhere we
// don't have a real photo yet (artist/team headshots, sponsor logos).
// Deliberately not bird/puppet/brand themed so it reads as a plain
// placeholder rather than implying any specific identity.
export default function ImagePlaceholder({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      style={style}
      fill="none"
      aria-hidden
    >
      <rect x="2" y="2" width="44" height="44" rx="6" fill="currentColor" fillOpacity="0.08" />
      <rect x="2" y="2" width="44" height="44" rx="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="17" cy="18" r="4.5" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
      <path
        d="M6 36l10.5-11 7.5 8 5-5.5L42 36"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
