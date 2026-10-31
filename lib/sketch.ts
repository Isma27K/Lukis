import rough from "roughjs"
import type { Drawable, Options } from "roughjs/bin/core"

// Hand-drawn strokes made the way the editor makes them: rough.js, with
// Excalidraw's default "artist" sloppiness. Every shape needs a seed, so the
// server and the browser draw exactly the same wobble.

type SketchPath = {
  d: string
  stroke: string
  strokeWidth: number
  fill?: string
}

type SketchOptions = Options & { seed: number }

type Point = [number, number]

const generator = rough.generator()

// Colors come from CSS: wrap shapes in an element with a `text-*` class.
const DEFAULTS: Options = {
  roughness: 1,
  bowing: 1,
  strokeWidth: 2,
  stroke: "currentColor",
  fillStyle: "solid",
}

function draw(drawable: Drawable): SketchPath[] {
  return generator.toPaths(drawable)
}

function options(o: SketchOptions): Options {
  return { ...DEFAULTS, ...o }
}

function rect(x: number, y: number, w: number, h: number, o: SketchOptions) {
  return draw(generator.rectangle(x, y, w, h, options(o)))
}

// A rectangle with rounded corners, like the editor's "round" edges.
function roundRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  o: SketchOptions
) {
  const d = [
    `M${x + r} ${y}`,
    `L${x + w - r} ${y}`,
    `Q${x + w} ${y} ${x + w} ${y + r}`,
    `L${x + w} ${y + h - r}`,
    `Q${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `L${x + r} ${y + h}`,
    `Q${x} ${y + h} ${x} ${y + h - r}`,
    `L${x} ${y + r}`,
    `Q${x} ${y} ${x + r} ${y}Z`,
  ].join(" ")
  return draw(generator.path(d, options(o)))
}

function ellipse(
  cx: number,
  cy: number,
  w: number,
  h: number,
  o: SketchOptions
) {
  return draw(generator.ellipse(cx, cy, w, h, options(o)))
}

function line(a: Point, b: Point, o: SketchOptions) {
  return draw(generator.line(a[0], a[1], b[0], b[1], options(o)))
}

function curve(points: Point[], o: SketchOptions) {
  return draw(generator.curve(points, options(o)))
}

function path(d: string, o: SketchOptions) {
  return draw(generator.path(d, options(o)))
}

// A curved arrow through `points`, with an open head at the last point.
function arrow(points: Point[], o: SketchOptions & { head?: number }) {
  const { head = 12, ...rest } = o
  const [x, y] = points[points.length - 1]
  const [px, py] = points[points.length - 2]
  const angle = Math.atan2(y - py, x - px)
  const wing = (offset: number): Point => [
    x - head * Math.cos(angle + offset),
    y - head * Math.sin(angle + offset),
  ]
  return [
    ...(points.length > 2
      ? curve(points, rest)
      : line(points[0], [x, y], rest)),
    ...line(wing(0.5), [x, y], { ...rest, seed: rest.seed + 1 }),
    ...line(wing(-0.5), [x, y], { ...rest, seed: rest.seed + 2 }),
  ]
}

const sketch = { rect, roundRect, ellipse, line, curve, path, arrow }

// A stable seed from a string, e.g. a drawing id, so each card gets its own
// wobble that doesn't change between renders.
function seedFrom(text: string) {
  let hash = 0
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0
  }
  return Math.abs(hash) % 2 ** 31
}

export { sketch, seedFrom }
export type { Point, SketchPath }
