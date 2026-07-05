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
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="block w-full h-[80px] md:h-[130px]"
      >
        {/* Back wave — slightly muted, offset */}
        <path
          d="M0,80 C360,140 720,20 1080,60 C1260,80 1360,100 1440,70 L1440,140 L0,140 Z"
          fill={toColor}
          opacity="0.4"
        />
        {/* Front wave */}
        <path
          d="M0,70 C240,130 480,10 720,50 C960,90 1200,130 1440,55 L1440,140 L0,140 Z"
          fill={toColor}
        />
      </svg>
    </div>
  )
}
