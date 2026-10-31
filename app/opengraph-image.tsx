import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { StaticLogoMark } from "@/components/brand/logo-mark"

export const alt = "Lukis: sketch together"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// The image renderer can't read woff2 or Excalifont's ligature tables, so
// this is a TTF copy of app/fonts/excalifont-latin.woff2 with its OpenType
// layout tables (GSUB/GPOS) dropped.
const excalifont = await readFile(
  join(process.cwd(), "app/fonts/excalifont-latin.ttf")
)

const INK = "#1c1917"

function Note({
  text,
  color,
  rotate,
  style,
}: {
  text: string
  color: string
  rotate: number
  style: React.CSSProperties
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        width: 230,
        height: 200,
        padding: 26,
        fontSize: 52,
        color: INK,
        background: color,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 18px 24px -14px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {text}
    </div>
  )
}

// Shown when a Lukis link is shared, invites included.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 80,
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: "Excalifont",
        color: INK,
        backgroundColor: "#faf7f2",
        backgroundImage:
          "radial-gradient(circle, rgba(28,25,23,0.12) 1.5px, transparent 2px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <StaticLogoMark size={150} />
        <div style={{ display: "flex", fontSize: 150, marginTop: -16 }}>
          lukis
        </div>
      </div>
      <div style={{ display: "flex", marginTop: 36, fontSize: 64 }}>
        <div
          style={{
            display: "flex",
            padding: "0 12px",
            background: "#fbe4d8",
            transform: "rotate(-1deg)",
          }}
        >
          Sketch together.
        </div>
      </div>
      <Note
        text="ideas!"
        color="#ffec99"
        rotate={-6}
        style={{ right: 210, top: 90 }}
      />
      <Note
        text="ship it"
        color="#ffc9c9"
        rotate={5}
        style={{ right: 70, top: 300 }}
      />
    </div>,
    {
      ...size,
      fonts: [{ name: "Excalifont", data: excalifont, style: "normal" }],
    }
  )
}
