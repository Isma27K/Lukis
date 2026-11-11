"use client"

import { exportScene, getNonDeletedElements } from "@excalidraw/excalidraw"
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types"
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types"
import { useEffect, useState } from "react"

import { apiFetch } from "@/lib/api"

type Snapshot = {
  elements: readonly ExcalidrawElement[]
  appState: AppState
  files: BinaryFiles
}

type PreviewScene = {
  elements: readonly ExcalidrawElement[]
  appState: Partial<AppState>
  files: BinaryFiles
}

// The dashboard shows these in 16:9 cards, at up to about 320px wide.
const WIDTH = 640
const HEIGHT = 360
// Rendered this long after a save, and at most this often while someone keeps
// editing; leaving the editor renders one straight away.
const DELAY_MS = 2_000
const MIN_INTERVAL_MS = 15_000
// Drawings from before thumbnails existed get one once their images have had
// a moment to load.
const BACKFILL_DELAY_MS = 5_000

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

// A PNG of the scene fitted into a 16:9 card, as the dashboard and the
// version history show drawings.
function renderPreview(
  { elements, appState, files }: PreviewScene,
  theme: "light" | "dark"
) {
  return exportScene({
    type: "png",
    data: {
      elements: getNonDeletedElements(elements),
      appState: { viewBackgroundColor: appState.viewBackgroundColor },
      files,
    },
    config: {
      theme,
      width: WIDTH,
      height: HEIGHT,
      fit: "contain",
      position: "center",
      padding: 24,
    },
  })
}

async function render(snapshot: Snapshot) {
  const [light, dark] = await Promise.all(
    (["light", "dark"] as const).map(async (theme) =>
      blobToDataUrl(await renderPreview(snapshot, theme))
    )
  )
  return { light, dark }
}

function createThumbnailer(apiBase: Promise<string>, hasThumbnail: boolean) {
  let latest: Snapshot | null = null
  // Whether the saved drawing has changed since the last thumbnail.
  let stale = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let lastRenderAt = 0
  let running: Promise<void> | null = null

  function schedule(delay: number) {
    stale = true
    clearTimeout(timer)
    const wait = Math.max(delay, lastRenderAt + MIN_INTERVAL_MS - Date.now())
    timer = setTimeout(flush, wait)
  }

  async function flush(): Promise<void> {
    clearTimeout(timer)
    if (running) {
      await running
    }
    if (!stale || !latest) {
      return
    }
    const snapshot = latest
    stale = false
    lastRenderAt = Date.now()
    running = (async () => {
      try {
        const path = `${await apiBase}/thumbnail`
        if (getNonDeletedElements(snapshot.elements).length === 0) {
          await apiFetch(path, { method: "DELETE" })
        } else {
          await apiFetch(path, { method: "PUT", body: await render(snapshot) })
        }
      } catch (error) {
        // An outdated thumbnail isn't worth interrupting anyone for.
        console.warn("Couldn't update the thumbnail", error)
      } finally {
        running = null
      }
    })()
    await running
  }

  return {
    onChange(
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles
    ) {
      const first = latest === null
      latest = { elements, appState, files }
      if (first && !hasThumbnail && elements.length > 0) {
        schedule(BACKFILL_DELAY_MS)
      }
    },
    // Called after each successful save, so thumbnails show saved work.
    onSaved() {
      schedule(DELAY_MS)
    },
    flush,
  }
}

// Keeps the dashboard thumbnail up to date while an editor works on the
// drawing, through `apiBase` (see DrawingTarget). Viewers never render one.
function useThumbnail(
  apiBase: Promise<string>,
  enabled: boolean,
  hasThumbnail: boolean
) {
  const [thumbnailer] = useState(() => createThumbnailer(apiBase, hasThumbnail))

  useEffect(() => {
    if (!enabled) {
      return
    }
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        void thumbnailer.flush()
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      void thumbnailer.flush()
    }
  }, [thumbnailer, enabled])

  return {
    onChange: enabled ? thumbnailer.onChange : undefined,
    onSaved: thumbnailer.onSaved,
    flush: thumbnailer.flush,
  }
}

export { renderPreview, useThumbnail }
