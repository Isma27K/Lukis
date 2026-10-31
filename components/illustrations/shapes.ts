import type { Point } from "@/lib/sketch"

// SVG path data for doodles that rough.js then sketches.

function polygon(points: Point[]) {
  return `M${points.map(([x, y]) => `${x} ${y}`).join(" L")} Z`
}

function heart(cx: number, cy: number, size: number) {
  const s = size
  return [
    `M${cx} ${cy + s * 0.35}`,
    `C${cx - s * 0.9} ${cy - s * 0.2} ${cx - s * 0.45} ${cy - s * 0.85} ${cx} ${cy - s * 0.35}`,
    `C${cx + s * 0.45} ${cy - s * 0.85} ${cx + s * 0.9} ${cy - s * 0.2} ${cx} ${cy + s * 0.35}Z`,
  ].join(" ")
}

function star(cx: number, cy: number, outer: number, inner = outer * 0.45) {
  const points: Point[] = []
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)])
  }
  return polygon(points)
}

// A four-line sparkle, as separate strokes.
function sparkle(cx: number, cy: number, size: number): [Point, Point][] {
  return [
    [
      [cx, cy - size],
      [cx, cy + size],
    ],
    [
      [cx - size, cy],
      [cx + size, cy],
    ],
  ]
}

export { heart, polygon, sparkle, star }
