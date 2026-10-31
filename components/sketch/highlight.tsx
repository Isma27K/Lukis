import { cn } from "cn"

import { Strokes } from "@/components/sketch/strokes"
import { sketch } from "@/lib/sketch"

// A marker swash behind a word or two, like highlighting on paper.
function Highlight({
  children,
  seed = 3,
  className,
}: {
  children: React.ReactNode
  seed?: number
  className?: string
}) {
  const paths = sketch.rect(4, 6, 192, 28, {
    seed,
    stroke: "none",
    fill: "currentColor",
    fillStyle: "solid",
    roughness: 2,
  })
  return (
    <span className={cn("relative isolate inline-block", className)}>
      <svg
        aria-hidden
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        className="absolute inset-x-[-0.2em] bottom-[0.02em] -z-10 h-[0.55em] w-[calc(100%+0.4em)] -rotate-1 text-highlight"
      >
        <Strokes paths={paths} />
      </svg>
      {children}
    </span>
  )
}

export { Highlight }
