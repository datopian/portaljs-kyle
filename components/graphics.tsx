// Lightweight, dependency-free background graphics (inline SVG) used to add depth
// and a modern, on-brand texture to sections. All CSP-safe (no external assets).

// The Texas silhouette path (shared with the favicon mark), in a ~0..96 coordinate box.
export const TEXAS_PATH =
  'M34 4 L52 4 L52 26 L70 26 L75 40 L73 52 L70 60 L72 66 L69 71 L60 75 L50 80 L41 92 L36 82 L28 78 L22 70 L19 73 L16 64 L8 56 L3 47 L16 34 L34 34 Z'

// A faint dotted grid, absolutely positioned to fill its (relative) parent.
export function DotGrid({
  className = '',
  color = '#ffffff',
  opacity = 0.12,
  gap = 22,
  radius = 1.4,
}: {
  className?: string
  color?: string
  opacity?: number
  gap?: number
  radius?: number
}) {
  const id = `dots-${gap}-${Math.round(opacity * 100)}`
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity }}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={gap / 2} cy={gap / 2} r={radius} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// A large decorative Texas silhouette watermark for hero/section backgrounds.
export function TexasWatermark({
  className = '',
  fill = '#ffffff',
  opacity = 0.06,
}: {
  className?: string
  fill?: string
  opacity?: number
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 96"
      className={`pointer-events-none absolute ${className}`}
      style={{ opacity }}
      fill={fill}
    >
      <path d={TEXAS_PATH} />
    </svg>
  )
}
