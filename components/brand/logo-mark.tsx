import { cn } from "cn"

import { Strokes } from "@/components/sketch/strokes"
import { sketch, type Point, type SketchPath } from "@/lib/sketch"

// The cursive "l" looping across the note.
const LOOP: Point[] = [
  [12, 33],
  [19, 27],
  [25, 18],
  [27, 11],
  [23.5, 9.5],
  [20.5, 14],
  [20, 23],
  [22, 31],
  [27, 34],
  [35, 30],
]

// The mark's strokes in a 48×48 box, shared by the logo, the app icons and
// the link preview image so they all draw the same note.
const LOGO_MARK = {
  note: sketch.roundRect(6, 6, 36, 36, 7, {
    seed: 11,
    fill: "currentColor",
    fillStyle: "solid",
    stroke: "none",
    roughness: 0.6,
  }),
  outline: sketch.roundRect(6, 6, 36, 36, 7, {
    seed: 12,
    strokeWidth: 1.6,
    roughness: 0.8,
  }),
  loop: sketch.curve(LOOP, {
    seed: 13,
    strokeWidth: 3,
    roughness: 0.5,
    disableMultiStroke: true,
  }),
}

// A marker-colored sticky note with a looped "l" drawn on it. Colors come
// from the theme, so it follows light and dark.
function LogoMark({
  animate = false,
  className,
}: {
  animate?: boolean
  className?: string
}) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={cn("size-9", className)}>
      <g transform="rotate(-6 24 24)">
        <Strokes paths={LOGO_MARK.note} className="text-primary" />
        <Strokes paths={LOGO_MARK.outline} className="text-ink" />
        <Strokes
          paths={LOGO_MARK.loop}
          className="text-primary-foreground"
          animate={animate}
          delay={0.2}
        />
      </g>
    </svg>
  )
}

// The mark with fixed colors, for images rendered outside the page (icons,
// link previews), where there's no CSS to supply them.
function StaticLogoMark({ size }: { size: number }) {
  const colored = (paths: SketchPath[], color: string) =>
    paths.map((path, index) => (
      <path
        key={index}
        d={path.d}
        fill={path.fill === "none" ? "none" : color}
        stroke={path.stroke === "none" ? "none" : color}
        strokeWidth={path.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <g transform="rotate(-6 24 24)">
        {colored(LOGO_MARK.note, "#c8410f")}
        {colored(LOGO_MARK.outline, "#1c1917")}
        {colored(LOGO_MARK.loop, "#ffffff")}
      </g>
    </svg>
  )
}

export { LogoMark, StaticLogoMark }
