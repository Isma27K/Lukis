import { ImageResponse } from "next/og"

import { StaticLogoMark } from "@/components/brand/logo-mark"

export const size = { width: 64, height: 64 }
export const contentType = "image/png"

// The favicon: the logo mark on its own.
export default function Icon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <StaticLogoMark size={64} />
    </div>,
    size
  )
}
