import { ImageResponse } from "next/og"

import { StaticLogoMark } from "@/components/brand/logo-mark"

// Install icons for manifest.ts: the mark on paper, inside the middle 80%
// that Android's "maskable" crop always keeps.
const SIZES = [192, 512]

export function generateStaticParams() {
  return SIZES.map((size) => ({ size: String(size) }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const size = Number((await params).size)
  if (!SIZES.includes(size)) {
    return new Response("Not found", { status: 404 })
  }
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#f5f5f2",
      }}
    >
      <StaticLogoMark size={Math.round(size * 0.7)} />
    </div>,
    { width: size, height: size }
  )
}
