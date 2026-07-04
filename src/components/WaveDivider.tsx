type WaveDividerProps = {
  fromColor: string
  toColor: string
}

/** Wave-shaped transition between two stacked page sections. */
export default function WaveDivider({ fromColor, toColor }: WaveDividerProps) {
  return (
    <div style={{ backgroundColor: fromColor }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-20 block"
        aria-hidden="true"
      >
        <path
          d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
          fill={toColor}
        />
      </svg>
    </div>
  )
}
