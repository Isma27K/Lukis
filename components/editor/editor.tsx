"use client"

import dynamic from "next/dynamic"

import type { DrawingEditorProps } from "@/components/editor/drawing-editor"

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH?: string | string[]
  }
}

// Excalidraw needs `window` as soon as it's imported, so it never renders on
// the server.
const Editor = dynamic<DrawingEditorProps>(
  async () => {
    // Load fonts from public/fonts (copied there by scripts/build-excalidraw.sh)
    // rather than the esm.sh fallback, so they match our build of the editor.
    window.EXCALIDRAW_ASSET_PATH = "/"
    const { DrawingEditor } = await import("@/components/editor/drawing-editor")
    return DrawingEditor
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-dot-grid font-hand text-2xl text-muted-foreground">
        Loading editor…
      </div>
    ),
  }
)

export { Editor }
