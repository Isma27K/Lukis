import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { StaticLogoMark } from "@/components/brand/logo-mark"
import { sketch, type SketchPath } from "@/lib/sketch"

export const alt = "Lukis: sketch together"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// The image renderer can't read woff2 or Excalifont's ligature tables, so
// this is a TTF copy of app/fonts/excalifont-latin.woff2 with its OpenType
// layout tables (GSUB/GPOS) dropped.
const excalifont = await readFile(
  join(process.cwd(), "app/fonts/excalifont-latin.ttf")
)

const INK = "#1e1e1c"

// rough.js paths drawn with fixed colors: the image has no CSS. A plain
// function, not a component: the renderer only takes intrinsic elements
// inside <svg>.
function drawn(paths: SketchPath[], color: string) {
  return paths.map((path, index) => (
    <path
      key={index}
      d={path.d}
      fill={path.fill === undefined || path.fill === "none" ? "none" : color}
      stroke={path.stroke === "none" ? "none" : color}
      strokeWidth={path.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ))
}

// A small board, drawn the way the editor draws: a box, an arrow and an
// ellipse.
const BOARD = {
  note: sketch.roundRect(48, 150, 200, 120, 14, { seed: 21 }),
  arrow: sketch.arrow(
    [
      [262, 206],
      [312, 186],
      [356, 212],
    ],
    { seed: 22, head: 12 }
  ),
  ellipse: sketch.ellipse(448, 214, 170, 104, { seed: 23 }),
}

// Shown when a Lukis link is shared, invites included: the wordmark beside a
// sheet of canvas with a sketch on it. The page's title and description
// travel with the link, so the image carries no headline.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "0 72px",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "Excalifont",
        color: INK,
        backgroundColor: "#f5f5f2",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <StaticLogoMark size={128} />
        <div style={{ display: "flex", fontSize: 128, marginTop: -14 }}>
          lukis
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: 560,
          height: 420,
          borderRadius: 24,
          border: "1px solid #e1e1db",
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle, rgba(30,30,28,0.14) 1.5px, transparent 2px)",
          backgroundSize: "24px 24px",
          boxShadow: "0 30px 50px -24px rgba(30,30,28,0.28)",
        }}
      >
        <svg
          width={560}
          height={420}
          viewBox="0 0 560 420"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {drawn(BOARD.note, INK)}
          {drawn(BOARD.arrow, INK)}
          {drawn(BOARD.ellipse, INK)}
        </svg>
        <div
          style={{
            position: "absolute",
            top: 186,
            left: 48,
            width: 200,
            display: "flex",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          ideas
        </div>
        <div
          style={{
            position: "absolute",
            top: 186,
            left: 363,
            width: 170,
            display: "flex",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          share
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Excalifont", data: excalifont, style: "normal" }],
    }
  )
}
