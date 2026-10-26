"use client"

import "@excalidraw/excalidraw/index.css"

import { Excalidraw, THEME } from "@excalidraw/excalidraw"
import { useTheme } from "next-themes"

function ExcalidrawEditor() {
  const { resolvedTheme } = useTheme()

  return (
    <Excalidraw theme={resolvedTheme === "dark" ? THEME.DARK : THEME.LIGHT} />
  )
}

export { ExcalidrawEditor }
