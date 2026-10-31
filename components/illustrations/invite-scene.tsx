import { cn } from "cn"

import { sparkle } from "@/components/illustrations/shapes"
import { Cursor } from "@/components/sketch/cursor"
import { Strokes } from "@/components/sketch/strokes"
import { sketch } from "@/lib/sketch"

// Long names would run off the note.
function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// The invite page's hero: the workspace's name on a sticky note, with the
// inviter's cursor pointing at it.
function InviteScene({
  workspace,
  inviter,
  className,
}: {
  workspace: string
  inviter: string
  className?: string
}) {
  return (
    <div className={cn("relative aspect-[13/10] w-full", className)}>
      <svg aria-hidden viewBox="0 0 520 400" className="size-full">
        <g transform="rotate(-3 260 190)">
          <Strokes
            paths={sketch.rect(110, 90, 300, 200, {
              seed: 201,
              fill: "currentColor",
              stroke: "none",
              roughness: 0.7,
            })}
            className="text-note-yellow"
            animate
          />
          <text
            x="260"
            y="160"
            textAnchor="middle"
            className="fill-note-ink font-hand text-[24px]"
          >
            you&apos;re invited to
          </text>
          <text
            x="260"
            y="218"
            textAnchor="middle"
            className="fill-note-ink font-hand text-[40px]"
          >
            {clip(workspace, 16)}
          </text>
          <Strokes
            paths={sketch.curve(
              [
                [170, 236],
                [230, 230],
                [300, 238],
                [352, 230],
              ],
              { seed: 202, strokeWidth: 3, disableMultiStroke: true }
            )}
            className="text-primary"
            animate
            delay={0.5}
          />
        </g>
        <Strokes
          paths={sketch.arrow(
            [
              [96, 330],
              [120, 300],
              [150, 284],
            ],
            { seed: 203 }
          )}
          className="text-foreground"
          animate
          delay={0.8}
        />
        <Strokes
          paths={[
            ...sparkle(440, 80, 12).flatMap(([a, b], index) =>
              sketch.line(a, b, { seed: 204 + index, strokeWidth: 2 })
            ),
            ...sparkle(462, 120, 7).flatMap(([a, b], index) =>
              sketch.line(a, b, { seed: 206 + index, strokeWidth: 2 })
            ),
          ]}
          className="text-primary"
          animate
          delay={1.1}
        />
      </svg>
      <Cursor
        name={inviter}
        color="violet"
        className="top-[80%] left-[10%] motion-safe:animate-bob"
      />
    </div>
  )
}

export { InviteScene }
