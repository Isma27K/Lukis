import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types"
import type { AppState } from "@excalidraw/excalidraw/types"

import { apiFetch } from "@/lib/api"
import type { Drawing } from "@/lib/types"

// Where a blank canvas opens (/d/new?w=<workspace>), until its first change
// saves it as a drawing at /d/<id>.
const NEW_DRAWING_PATH = "/d/new"

// What a new drawing is created with: whichever change came first.
type FirstSave = {
  title?: string
  elements?: readonly ExcalidrawElement[]
  app_state?: Partial<AppState> | null
}

// Where an editor's drawing lives on the backend. A new drawing isn't there
// yet: opening a blank canvas saves nothing, and its first change creates it.
type DrawingTarget = {
  // /drawings/{id}, or /share/{token} for a guest on a public link. Settles
  // once the drawing exists, so whatever waits on it (the live connection,
  // image uploads, thumbnails) stays quiet on an untouched canvas.
  apiBase: Promise<string>
  // Creates the drawing with `first` on it, unless it already exists. False
  // means it did (or another change was just creating it), and `first` still
  // has to be saved the usual way.
  create(first?: FirstSave, options?: { keepalive?: boolean }): Promise<boolean>
}

function savedDrawing(apiBase: string): DrawingTarget {
  return { apiBase: Promise.resolve(apiBase), create: async () => false }
}

// `onCreated` runs once, when the first change has made the drawing.
function newDrawing(
  workspaceId: string,
  onCreated: (drawing: Drawing) => void
): DrawingTarget {
  let created = false
  let creating: Promise<void> | null = null
  let resolveApiBase: (apiBase: string) => void
  const apiBase = new Promise<string>((resolve) => {
    resolveApiBase = resolve
  })

  return {
    apiBase,
    async create(first = {}, { keepalive = false } = {}) {
      if (created) {
        return false
      }
      if (creating) {
        // Throws if that attempt fails, so this change is retried too.
        await creating
        return false
      }
      creating = (async () => {
        const drawing = await apiFetch<Drawing>(
          `/workspaces/${encodeURIComponent(workspaceId)}/drawings`,
          { method: "POST", body: first, keepalive }
        )
        created = true
        resolveApiBase(`/drawings/${encodeURIComponent(drawing.id)}`)
        onCreated(drawing)
      })()
      try {
        await creating
      } finally {
        // A failed attempt leaves the next change to try again.
        creating = null
      }
      return true
    },
  }
}

export { NEW_DRAWING_PATH, newDrawing, savedDrawing }
export type { DrawingTarget }
