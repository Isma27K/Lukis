import type { SketchPath } from "@/lib/sketch"

// Renders rough.js paths in an <svg>. Colors follow `className` (strokes use
// currentColor). With `animate`, strokes draw themselves in one after another
// from `delay` seconds, and fills fade in.
function Strokes({
  paths,
  className,
  animate = false,
  delay = 0,
  step = 0.06,
  nonScaling = false,
}: {
  paths: SketchPath[]
  className?: string
  animate?: boolean
  delay?: number
  step?: number
  // For sketches stretched to fit a box: keeps the pen the same width.
  nonScaling?: boolean
}) {
  return (
    <g className={className}>
      {paths.map((path, index) => {
        const filled = path.fill !== undefined && path.fill !== "none"
        return (
          <path
            key={index}
            d={path.d}
            stroke={path.stroke}
            strokeWidth={path.strokeWidth}
            fill={path.fill ?? "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect={nonScaling ? "non-scaling-stroke" : undefined}
            pathLength={animate && !filled ? 1 : undefined}
            className={
              animate ? (filled ? "sketch-fade" : "sketch-draw") : undefined
            }
            style={
              animate
                ? ({
                    "--delay": `${delay + index * step}s`,
                  } as React.CSSProperties)
                : undefined
            }
          />
        )
      })}
    </g>
  )
}

export { Strokes }
