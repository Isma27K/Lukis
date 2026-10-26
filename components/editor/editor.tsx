"use client"

import dynamic from "next/dynamic"

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH?: string | string[]
  }
}

// Excalidraw needs `window` as soon as it's imported, so it never renders on
// the server.
const Editor = dynamic(
  async () => {
    // Load fonts from public/fonts (copied there by scripts/build-excalidraw.sh)
    // rather than the esm.sh fallback, so they match our build of the editor.
    window.EXCALIDRAW_ASSET_PATH = "/"
    const { ExcalidrawEditor } = await import("./excalidraw-editor")
    return ExcalidrawEditor
  },
  { ssr: false }
)

export { Editor }
