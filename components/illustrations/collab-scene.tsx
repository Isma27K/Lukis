import { cn } from "cn"

import { heart, star } from "@/components/illustrations/shapes"
import { Cursor } from "@/components/sketch/cursor"
import { Strokes } from "@/components/sketch/strokes"
import { sketch } from "@/lib/sketch"

const note = { stroke: "none", fill: "currentColor", roughness: 0.7 } as const

// The sign-in hero: a board mid-session, with sticky notes, a small flow and
// two people's cursors wandering over it. Everything draws itself in.
function CollabScene({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[13/10] w-full", className)}>
      <svg aria-hidden viewBox="0 0 520 400" className="size-full">
        <g transform="rotate(-4 121 106)">
          <Strokes
            paths={sketch.rect(36, 36, 170, 140, { ...note, seed: 1 })}
            className="text-note-yellow"
            animate
          />
          <text x="58" y="84" className="fill-note-ink font-hand text-[30px]">
            ideas!
          </text>
          <Strokes
            paths={[
              ...sketch.line([58, 110], [176, 107], {
                seed: 2,
                strokeWidth: 1.5,
              }),
              ...sketch.line([58, 132], [154, 131], {
                seed: 3,
                strokeWidth: 1.5,
              }),
              ...sketch.line([58, 154], [166, 151], {
                seed: 4,
                strokeWidth: 1.5,
              }),
            ]}
            className="text-note-ink/70"
            animate
            delay={0.3}
          />
        </g>

        <Strokes
          paths={sketch.roundRect(272, 40, 150, 64, 14, { seed: 5 })}
          className="text-foreground"
          animate
          delay={0.5}
        />
        <text
          x="347"
          y="80"
          textAnchor="middle"
          className="fill-foreground font-hand text-[26px]"
        >
          sketch
        </text>
        <Strokes
          paths={sketch.arrow(
            [
              [212, 96],
              [242, 74],
              [266, 72],
            ],
            { seed: 6 }
          )}
          className="text-foreground"
          animate
          delay={0.8}
        />

        <Strokes
          paths={sketch.ellipse(352, 212, 156, 72, { seed: 7 })}
          className="text-foreground"
          animate
          delay={1.1}
        />
        <text
          x="352"
          y="220"
          textAnchor="middle"
          className="fill-foreground font-hand text-[26px]"
        >
          share
        </text>
        <Strokes
          paths={sketch.arrow(
            [
              [346, 110],
              [354, 140],
              [352, 170],
            ],
            { seed: 8 }
          )}
          className="text-primary"
          animate
          delay={1.4}
        />

        <g transform="rotate(5 140 290)">
          <Strokes
            paths={sketch.rect(60, 232, 160, 118, { ...note, seed: 9 })}
            className="text-note-pink"
            animate
            delay={0.2}
          />
          <text x="82" y="280" className="fill-note-ink font-hand text-[30px]">
            ship it
          </text>
          <Strokes
            paths={sketch.path(heart(150, 316, 30), {
              seed: 10,
              fill: "currentColor",
              stroke: "none",
            })}
            className="text-primary"
            animate
            delay={1.9}
          />
        </g>
        <Strokes
          paths={sketch.arrow(
            [
              [282, 236],
              [256, 262],
              [232, 278],
            ],
            { seed: 11 }
          )}
          className="text-foreground"
          animate
          delay={1.7}
        />

        <Strokes
          paths={sketch.path(star(458, 312, 26), { seed: 12 })}
          className="text-primary"
          animate
          delay={2.1}
        />
        <Strokes
          paths={sketch.curve(
            [
              [300, 262],
              [330, 256],
              [362, 262],
              [400, 255],
            ],
            { seed: 13, strokeWidth: 3, disableMultiStroke: true }
          )}
          className="text-primary"
          animate
          delay={2.3}
        />
      </svg>
      <Cursor
        name="Ada"
        color="blue"
        className="top-[30%] left-[64%] motion-safe:animate-drift-a"
      />
      <Cursor
        name="Bo"
        color="green"
        className="top-[64%] left-[38%] motion-safe:animate-drift-b"
      />
    </div>
  )
}

export { CollabScene }
