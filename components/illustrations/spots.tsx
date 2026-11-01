import { cn } from "cn"

import { heart, polygon, sparkle } from "@/components/illustrations/shapes"
import { Cursor } from "@/components/sketch/cursor"
import { Strokes } from "@/components/sketch/strokes"
import { sketch, type Point } from "@/lib/sketch"

// Small scenes for empty states and error pages, all 240×160 and drawn with
// the editor's strokes. Muted lines carry the sketch; marker picks out one
// detail.

function Spot({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 160"
      className={cn("w-56 max-w-full", className)}
    >
      {children}
    </svg>
  )
}

function sparkles(cx: number, cy: number, size: number, seed: number) {
  return sparkle(cx, cy, size).flatMap(([a, b], index) =>
    sketch.line(a, b, { seed: seed + index, strokeWidth: 1.8 })
  )
}

// A pencil from its tip `tip` back along `angle` (radians), as body, cone and
// band outlines plus a yellow body fill.
function pencil(tip: Point, angle: number, seed: number) {
  const ux = Math.cos(angle)
  const uy = Math.sin(angle)
  const along = (d: number): Point => [tip[0] + ux * d, tip[1] + uy * d]
  const side = ([x, y]: Point, w: number): Point => [x - uy * w, y + ux * w]
  const coneBase = along(16)
  const end = along(86)
  const band = along(74)
  const body = polygon([
    side(coneBase, 7),
    side(end, 7),
    side(end, -7),
    side(coneBase, -7),
  ])
  return {
    fill: sketch.path(body, {
      seed,
      fill: "currentColor",
      stroke: "none",
      roughness: 0.5,
    }),
    outline: [
      ...sketch.path(body, { seed: seed + 1, strokeWidth: 1.6 }),
      ...sketch.path(polygon([tip, side(coneBase, 7), side(coneBase, -7)]), {
        seed: seed + 2,
        strokeWidth: 1.6,
      }),
      ...sketch.line(side(band, 7), side(band, -7), {
        seed: seed + 3,
        strokeWidth: 1.6,
      }),
    ],
  }
}

function BlankCanvas({ className }: { className?: string }) {
  const tool = pencil([146, 84], -0.65, 30)
  return (
    <Spot className={className}>
      <g transform="rotate(-3 105 79)">
        <Strokes
          paths={sketch.rect(30, 24, 150, 110, {
            seed: 21,
            fill: "currentColor",
            stroke: "none",
            roughness: 0.6,
          })}
          className="text-card"
          animate
        />
        <Strokes
          paths={sketch.rect(30, 24, 150, 110, { seed: 22, strokeWidth: 1.6 })}
          className="text-muted-foreground"
          animate
        />
      </g>
      <Strokes
        paths={sketch.curve(
          [
            [56, 104],
            [76, 82],
            [98, 100],
            [120, 72],
            [146, 84],
          ],
          { seed: 23, strokeWidth: 2.5, disableMultiStroke: true }
        )}
        className="text-primary"
        animate
        delay={0.5}
        step={0.4}
      />
      <Strokes
        paths={tool.fill}
        className="text-note-yellow"
        animate
        delay={0.2}
      />
      <Strokes
        paths={tool.outline}
        className="text-foreground/80"
        animate
        delay={0.25}
      />
      <Strokes
        paths={sparkles(206, 112, 8, 40)}
        className="text-primary"
        animate
        delay={1.1}
      />
    </Spot>
  )
}

function EmptyTrash({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <Strokes
        paths={[
          ...sketch.path(
            polygon([
              [80, 58],
              [160, 58],
              [150, 140],
              [90, 140],
            ]),
            { seed: 51, strokeWidth: 1.8 }
          ),
          ...sketch.line([70, 50], [170, 50], { seed: 52, strokeWidth: 1.8 }),
          ...sketch.path("M106 50 L108 41 L132 41 L134 50", {
            seed: 53,
            strokeWidth: 1.8,
          }),
          ...sketch.line([100, 72], [104, 126], { seed: 54, strokeWidth: 1.4 }),
          ...sketch.line([120, 72], [120, 126], { seed: 55, strokeWidth: 1.4 }),
          ...sketch.line([140, 72], [136, 126], { seed: 56, strokeWidth: 1.4 }),
        ]}
        className="text-muted-foreground"
        animate
      />
      <Strokes
        paths={[
          ...sketch.ellipse(194, 126, 36, 30, { seed: 57, strokeWidth: 1.6 }),
          ...sketch.curve(
            [
              [182, 122],
              [192, 112],
              [200, 128],
              [188, 134],
              [204, 118],
            ],
            { seed: 58, strokeWidth: 1.2, disableMultiStroke: true }
          ),
        ]}
        className="text-primary"
        animate
        delay={0.7}
      />
      <Strokes
        paths={sparkles(60, 92, 7, 59)}
        className="text-muted-foreground"
        animate
        delay={1}
      />
    </Spot>
  )
}

function NoMatches({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <Strokes
        paths={[
          ...sketch.rect(28, 36, 44, 32, { seed: 61, strokeWidth: 1.4 }),
          ...sketch.ellipse(100, 48, 26, 26, { seed: 62, strokeWidth: 1.4 }),
          ...sketch.curve(
            [
              [26, 112],
              [46, 100],
              [66, 116],
              [88, 102],
            ],
            { seed: 63, strokeWidth: 1.4 }
          ),
        ]}
        className="text-muted-foreground"
        animate
      />
      <Strokes
        paths={[
          ...sketch.ellipse(148, 74, 72, 72, { seed: 64, strokeWidth: 2 }),
          ...sketch.line([174, 100], [208, 136], {
            seed: 65,
            strokeWidth: 5,
            disableMultiStroke: true,
          }),
        ]}
        className="text-foreground/80"
        animate
        delay={0.4}
      />
      <text
        x="148"
        y="88"
        textAnchor="middle"
        className="fill-primary font-hand text-[40px]"
      >
        ?
      </text>
    </Spot>
  )
}

function Envelope({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <Strokes
        paths={sketch.rect(50, 40, 140, 96, {
          seed: 71,
          fill: "currentColor",
          stroke: "none",
          roughness: 0.6,
        })}
        className="text-card"
        animate
      />
      <Strokes
        paths={[
          ...sketch.rect(50, 40, 140, 96, { seed: 72, strokeWidth: 1.8 }),
          ...sketch.path("M50 40 L120 94 L190 40", {
            seed: 73,
            strokeWidth: 1.8,
          }),
          ...sketch.line([50, 136], [104, 90], { seed: 74, strokeWidth: 1.2 }),
          ...sketch.line([190, 136], [136, 90], { seed: 75, strokeWidth: 1.2 }),
        ]}
        className="text-muted-foreground"
        animate
      />
      <Strokes
        paths={sketch.path(heart(120, 96, 22), {
          seed: 76,
          fill: "currentColor",
          stroke: "none",
        })}
        className="text-primary"
        animate
        delay={0.9}
      />
      <Strokes
        paths={[
          ...sketch.line([202, 58], [222, 52], { seed: 77, strokeWidth: 1.8 }),
          ...sketch.line([204, 78], [226, 78], { seed: 78, strokeWidth: 1.8 }),
          ...sketch.line([202, 98], [222, 104], { seed: 79, strokeWidth: 1.8 }),
        ]}
        className="text-primary"
        animate
        delay={1.1}
      />
    </Spot>
  )
}

// The 404: a box half rubbed out, the eraser still there.
function Erased({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <Strokes
        paths={sketch.rect(36, 36, 116, 84, { seed: 81, strokeWidth: 2 })}
        className="text-muted-foreground"
        animate
      />
      <Strokes
        paths={sketch.curve(
          [
            [96, 132],
            [118, 104],
            [132, 118],
            [150, 84],
            [166, 100],
          ],
          {
            seed: 82,
            strokeWidth: 26,
            roughness: 0.4,
            disableMultiStroke: true,
          }
        )}
        className="text-background"
        animate
        delay={0.5}
        step={0.5}
      />
      <g transform="rotate(28 186 104)">
        <Strokes
          paths={[
            ...sketch.rect(156, 90, 62, 30, {
              seed: 83,
              fill: "currentColor",
              stroke: "none",
              roughness: 0.5,
            }),
          ]}
          className="text-note-pink"
          animate
          delay={0.2}
        />
        <Strokes
          paths={sketch.rect(156, 90, 24, 30, {
            seed: 84,
            fill: "currentColor",
            stroke: "none",
            roughness: 0.5,
          })}
          className="text-note-blue"
          animate
          delay={0.25}
        />
        <Strokes
          paths={[
            ...sketch.rect(156, 90, 62, 30, { seed: 85, strokeWidth: 1.6 }),
            ...sketch.line([180, 90], [180, 120], {
              seed: 86,
              strokeWidth: 1.4,
            }),
          ]}
          className="text-foreground/80"
          animate
          delay={0.3}
        />
      </g>
      <Strokes
        paths={[
          ...sketch.ellipse(150, 140, 5, 4, { seed: 87, fill: "currentColor" }),
          ...sketch.ellipse(164, 146, 4, 3, { seed: 88, fill: "currentColor" }),
          ...sketch.ellipse(140, 150, 3, 3, { seed: 89, fill: "currentColor" }),
        ]}
        className="text-muted-foreground"
        animate
        delay={1}
      />
    </Spot>
  )
}

// For errors: a sketch scribbled out, with a crack through it.
function Smudge({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <Strokes
        paths={sketch.rect(60, 36, 120, 84, {
          seed: 91,
          strokeWidth: 1.8,
          fill: "currentColor",
          fillStyle: "zigzag",
          hachureGap: 9,
          fillWeight: 1.2,
        })}
        className="text-muted-foreground"
        animate
        step={0.15}
      />
      <Strokes
        paths={sketch.path("M158 22 L138 58 L156 68 L128 112", {
          seed: 92,
          strokeWidth: 3,
          disableMultiStroke: true,
        })}
        className="text-primary"
        animate
        delay={0.8}
      />
      <Strokes
        paths={sparkles(196, 118, 8, 93)}
        className="text-primary"
        animate
        delay={1.2}
      />
    </Spot>
  )
}

// A personal workspace's members: just your own cursor in an empty room.
function Solo({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn("relative w-56 max-w-full", className)}>
      <Spot className="w-full">
        <Strokes
          paths={sketch.ellipse(120, 82, 190, 110, {
            seed: 101,
            strokeWidth: 1.5,
          })}
          className="text-muted-foreground/70"
          animate
        />
        <Strokes
          paths={[...sparkles(40, 36, 7, 102), ...sparkles(206, 132, 6, 104)]}
          className="text-primary"
          animate
          delay={0.6}
        />
      </Spot>
      <Cursor
        name={name}
        color="orange"
        className="top-[36%] left-[40%] motion-safe:animate-bob"
      />
    </div>
  )
}

// A drawing's version history before it has any: a stack of pages, a clock,
// and an arrow winding back.
function Rewind({ className }: { className?: string }) {
  const pages = [
    { x: 74, y: 30, angle: -7, seed: 111 },
    { x: 64, y: 40, angle: 3, seed: 113 },
    { x: 54, y: 50, angle: -2, seed: 115 },
  ]
  return (
    <Spot className={className}>
      {pages.map(({ x, y, angle, seed }, index) => (
        <g key={seed} transform={`rotate(${angle} ${x + 55} ${y + 40})`}>
          <Strokes
            paths={sketch.rect(x, y, 110, 80, {
              seed,
              fill: "currentColor",
              stroke: "none",
              roughness: 0.6,
            })}
            className="text-card"
            animate
            delay={index * 0.15}
          />
          <Strokes
            paths={sketch.rect(x, y, 110, 80, {
              seed: seed + 1,
              strokeWidth: 1.6,
            })}
            className="text-muted-foreground"
            animate
            delay={index * 0.15}
          />
        </g>
      ))}
      <Strokes
        paths={sketch.curve(
          [
            [72, 104],
            [88, 84],
            [104, 98],
            [124, 76],
            [142, 88],
          ],
          { seed: 117, strokeWidth: 1.8, disableMultiStroke: true }
        )}
        className="text-muted-foreground"
        animate
        delay={0.5}
      />
      <Strokes
        paths={sketch.ellipse(184, 112, 52, 52, {
          seed: 118,
          fill: "currentColor",
          stroke: "none",
          roughness: 0.6,
        })}
        className="text-card"
        animate
        delay={0.6}
      />
      <Strokes
        paths={sketch.ellipse(184, 112, 52, 52, {
          seed: 119,
          strokeWidth: 1.8,
        })}
        className="text-foreground/80"
        animate
        delay={0.6}
      />
      <Strokes
        paths={[
          ...sketch.line([184, 112], [184, 96], {
            seed: 120,
            strokeWidth: 2.2,
          }),
          ...sketch.line([184, 112], [195, 119], {
            seed: 121,
            strokeWidth: 2.2,
          }),
        ]}
        className="text-primary"
        animate
        delay={0.9}
      />
      <Strokes
        paths={sketch.arrow(
          [
            [212, 80],
            [214, 44],
            [190, 22],
            [154, 20],
          ],
          { seed: 122, strokeWidth: 2.2, head: 10, disableMultiStroke: true }
        )}
        className="text-primary"
        animate
        delay={1.1}
        step={0.2}
      />
    </Spot>
  )
}

// Live collaboration, for the public site: two people's cursors over a
// shared note and the arrow one of them is drawing.
function Together({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-56 max-w-full", className)}>
      <Spot className="w-full">
        <g transform="rotate(-5 81 70)">
          <Strokes
            paths={sketch.rect(36, 34, 90, 72, {
              seed: 201,
              fill: "currentColor",
              stroke: "none",
              roughness: 0.6,
            })}
            className="text-note-yellow"
            animate
          />
          <Strokes
            paths={[
              ...sketch.line([50, 58], [110, 56], {
                seed: 202,
                strokeWidth: 1.5,
              }),
              ...sketch.line([50, 76], [98, 77], {
                seed: 203,
                strokeWidth: 1.5,
              }),
            ]}
            className="text-note-ink/70"
            animate
            delay={0.3}
          />
        </g>
        <Strokes
          paths={sketch.ellipse(184, 104, 72, 48, {
            seed: 204,
            strokeWidth: 1.8,
          })}
          className="text-muted-foreground"
          animate
          delay={0.4}
        />
        <Strokes
          paths={sketch.arrow(
            [
              [128, 76],
              [146, 104],
              [144, 104],
            ],
            { seed: 205, strokeWidth: 2.2, head: 9, disableMultiStroke: true }
          )}
          className="text-primary"
          animate
          delay={0.8}
        />
      </Spot>
      <Cursor
        name="Ada"
        color="blue"
        className="top-[50%] left-[18%] motion-safe:animate-drift-a"
      />
      <Cursor
        name="Bo"
        color="green"
        className="top-[16%] left-[62%] motion-safe:animate-drift-b"
      />
    </div>
  )
}

// Workspaces and roles: three people, each with a role tag.
function Roles({ className }: { className?: string }) {
  const rows = [
    { y: 36, initial: "A", label: "owner", color: "text-note-pink" },
    { y: 80, initial: "B", label: "editor", color: "text-note-blue" },
    { y: 124, initial: "C", label: "viewer", color: "text-note-green" },
  ]
  return (
    <Spot className={className}>
      {rows.map(({ y, initial, label, color }, index) => {
        const seed = 210 + index * 4
        return (
          <g key={label}>
            <Strokes
              paths={sketch.ellipse(64, y, 34, 34, {
                seed,
                fill: "currentColor",
                stroke: "none",
                roughness: 0.5,
              })}
              className={color}
              animate
              delay={index * 0.15}
            />
            <text
              x="64"
              y={y + 6}
              textAnchor="middle"
              className="fill-note-ink font-hand text-[18px]"
            >
              {initial}
            </text>
            {index === 0 && (
              <Strokes
                paths={sketch.roundRect(94, y - 12, 92, 24, 12, {
                  seed: seed + 1,
                  fill: "currentColor",
                  stroke: "none",
                })}
                className="text-highlight"
                animate
                delay={0.3}
              />
            )}
            <Strokes
              paths={sketch.roundRect(94, y - 12, 92, 24, 12, {
                seed: seed + 2,
                strokeWidth: 1.5,
              })}
              className="text-muted-foreground"
              animate
              delay={0.3 + index * 0.15}
            />
            <text
              x="140"
              y={y + 5}
              textAnchor="middle"
              className="fill-foreground font-hand text-[16px]"
            >
              {label}
            </text>
          </g>
        )
      })}
      <Strokes
        paths={sparkles(210, 28, 7, 224)}
        className="text-primary"
        animate
        delay={0.9}
      />
    </Spot>
  )
}

// Share links: a chain link, an eye for viewing and a pencil for editing.
function ShareLink({ className }: { className?: string }) {
  const tool = pencil([150, 132], -0.55, 232)
  return (
    <Spot className={className}>
      <g transform="rotate(-28 92 80)">
        <Strokes
          paths={[
            ...sketch.roundRect(34, 64, 76, 32, 16, {
              seed: 230,
              strokeWidth: 2.4,
            }),
            ...sketch.roundRect(80, 64, 76, 32, 16, {
              seed: 231,
              strokeWidth: 2.4,
            }),
          ]}
          className="text-foreground/80"
          animate
          step={0.15}
        />
      </g>
      <Strokes
        paths={sketch.ellipse(190, 46, 54, 30, { seed: 236, strokeWidth: 1.8 })}
        className="text-muted-foreground"
        animate
        delay={0.5}
      />
      <Strokes
        paths={sketch.ellipse(190, 46, 14, 14, {
          seed: 237,
          fill: "currentColor",
          stroke: "none",
        })}
        className="text-primary"
        animate
        delay={0.7}
      />
      <Strokes
        paths={tool.fill}
        className="text-note-yellow"
        animate
        delay={0.8}
      />
      <Strokes
        paths={tool.outline}
        className="text-foreground/80"
        animate
        delay={0.85}
      />
    </Spot>
  )
}

// Privacy: a padlock with a marker keyhole.
function Padlock({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <Strokes
        paths={sketch.path("M98 74 V56 C98 30 142 30 142 56 V74", {
          seed: 240,
          strokeWidth: 2.6,
        })}
        className="text-muted-foreground"
        animate
      />
      <Strokes
        paths={sketch.roundRect(76, 72, 88, 66, 10, {
          seed: 241,
          fill: "currentColor",
          stroke: "none",
          roughness: 0.6,
        })}
        className="text-card"
        animate
        delay={0.2}
      />
      <Strokes
        paths={sketch.roundRect(76, 72, 88, 66, 10, {
          seed: 242,
          strokeWidth: 2,
        })}
        className="text-foreground/80"
        animate
        delay={0.2}
      />
      <Strokes
        paths={[
          ...sketch.ellipse(120, 98, 16, 16, {
            seed: 243,
            fill: "currentColor",
            stroke: "none",
          }),
          ...sketch.line([120, 102], [120, 118], {
            seed: 244,
            strokeWidth: 4,
          }),
        ]}
        className="text-primary"
        animate
        delay={0.6}
      />
      <Strokes
        paths={[...sparkles(44, 52, 8, 245), ...sparkles(198, 116, 7, 247)]}
        className="text-primary"
        animate
        delay={0.9}
      />
    </Spot>
  )
}

export {
  BlankCanvas,
  EmptyTrash,
  Envelope,
  Erased,
  NoMatches,
  Padlock,
  Rewind,
  Roles,
  ShareLink,
  Smudge,
  Solo,
  Together,
}
