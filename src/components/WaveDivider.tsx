// Squarespace-style wave section divider, matching the shape used to
// transition between sections on tahifestivalnz.com.
export default function WaveDivider({
  fromColor,
  toColor,
  flip = false,
}: {
  fromColor: string
  toColor: string
  flip?: boolean
}) {
  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden leading-[0]"
      style={{ backgroundColor: fromColor, transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full h-[60px] md:h-[100px]"
      >
        <path
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,48 L1440,120 L0,120 Z"
          fill={toColor}
        />
      </svg>
    </div>
  )
}
