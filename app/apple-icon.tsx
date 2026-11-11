import { ImageResponse } from "next/og"

import { StaticLogoMark } from "@/components/brand/logo-mark"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Home-screen icon: the mark on paper, since iOS fills transparency black.
export default function AppleIcon() {
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
      <StaticLogoMark size={150} />
    </div>,
    size
  )
}
