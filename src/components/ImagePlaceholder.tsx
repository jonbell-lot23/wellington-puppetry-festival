type ImagePlaceholderProps = {
  className?: string
  style?: React.CSSProperties
}

/** Generic stand-in icon for images not yet supplied. */
export default function ImagePlaceholder({ className, style }: ImagePlaceholderProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5-9 9" />
    </svg>
  )
}
