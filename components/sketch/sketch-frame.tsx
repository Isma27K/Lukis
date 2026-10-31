import { cn } from "cn"

import { Strokes } from "@/components/sketch/strokes"
import { sketch } from "@/lib/sketch"

const TONES = {
  ink: "text-foreground/70",
  muted: "text-muted-foreground/60",
  primary: "text-primary",
  destructive: "text-destructive",
}

// A hand-drawn border around its (relatively positioned) parent. `ratio` is
// the parent's rough width / height, so the wobble isn't squashed when the
// sketch stretches to fit.
function SketchFrame({
  seed,
  ratio = 4 / 3,
  tone = "ink",
  dashed = false,
  className,
}: {
  seed: number
  ratio?: number
  tone?: keyof typeof TONES
  dashed?: boolean
  className?: string
}) {
  const width = 320
  const height = Math.round(width / ratio)
  const paths = sketch.rect(3, 3, width - 6, height - 6, {
    seed,
    strokeWidth: 1.5,
    roughness: 1.1,
    // One pass reads better than the double line when dashed.
    disableMultiStroke: dashed,
  })
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible",
        TONES[tone],
        className
      )}
      strokeDasharray={dashed ? "7 7" : undefined}
    >
      <Strokes paths={paths} nonScaling />
    </svg>
  )
}

export { SketchFrame }
