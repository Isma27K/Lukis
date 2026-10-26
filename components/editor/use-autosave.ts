"use client"

import {
  isInvisiblySmallElement,
  serializeAsJSON,
} from "@excalidraw/excalidraw"
import type {
  ExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types"
import type { AppState } from "@excalidraw/excalidraw/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { ApiError, apiFetch, errorMessage } from "@/lib/api"

type SaveStatus = "saved" | "pending" | "saving" | "retrying" | "failed"

// Save this long after the last change…
const SAVE_DELAY_MS = 1000
// …but never sit on changes longer than this while someone keeps drawing.
const MAX_SAVE_DELAY_MS = 5000
const RETRY_DELAY_MS = 5000

// The appState fields the editor itself keeps for a database (background
// color, grid…), as JSON so changes are cheap to spot.
function persistedAppState(appState: AppState) {
  const { appState: cleaned } = JSON.parse(
    serializeAsJSON([], appState, {}, "database")
  )
  return JSON.stringify(cleaned)
}

function createAutosaver(
  drawingId: string,
  storedElements: readonly ExcalidrawElement[],
  onStatus: (status: SaveStatus) => void
) {
  // Element versions the server already has, so a save only sends what
  // changed; the server merges it into the stored scene.
  const savedVersions = new Map(storedElements.map((el) => [el.id, el.version]))
  // Taken from the first onChange, once the editor has filled in defaults, so
  // merely opening a drawing doesn't count as an edit.
  let savedAppState: string | null = null
  let latest: {
    elements: readonly OrderedExcalidrawElement[]
    appState: AppState
  } | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  let firstPendingAt: number | null = null
  let saving: Promise<void> | null = null

  function unsavedChanges() {
    if (!latest) {
      return null
    }
    const elements = latest.elements.filter(
      (el) =>
        savedVersions.get(el.id) !== el.version &&
        // Skip stray clicks, and things deleted before they were ever saved.
        (el.isDeleted ? savedVersions.has(el.id) : !isInvisiblySmallElement(el))
    )
    const appState = persistedAppState(latest.appState)
    const appStateChanged = savedAppState !== null && appState !== savedAppState
    if (elements.length === 0 && !appStateChanged) {
      return null
    }
    return { elements, appState: appStateChanged ? appState : null }
  }

  function schedule(delay = SAVE_DELAY_MS) {
    clearTimeout(timer)
    firstPendingAt ??= Date.now()
    const deadline = firstPendingAt + MAX_SAVE_DELAY_MS - Date.now()
    timer = setTimeout(save, Math.max(0, Math.min(delay, deadline)))
  }

  async function save({ keepalive = false } = {}): Promise<void> {
    clearTimeout(timer)
    if (saving) {
      // The running save checks for newer changes when it finishes.
      return saving
    }
    const changes = unsavedChanges()
    if (!changes) {
      onStatus("saved")
      return
    }

    firstPendingAt = null
    onStatus("saving")
    saving = (async () => {
      try {
        await apiFetch(`/drawings/${drawingId}/scene`, {
          method: "PUT",
          body: {
            elements: changes.elements,
            app_state: changes.appState && JSON.parse(changes.appState),
          },
          keepalive,
        })
        for (const el of changes.elements) {
          savedVersions.set(el.id, el.version)
        }
        if (changes.appState) {
          savedAppState = changes.appState
        }
        onStatus("saved")
      } catch (error) {
        // Losing a race with another save (409) or the network is worth
        // retrying; anything else (deleted, access revoked) won't fix itself.
        if (error instanceof ApiError && error.status !== 409) {
          onStatus("failed")
          toast.error(`Couldn't save: ${errorMessage(error)}`)
          return
        }
        onStatus("retrying")
        timer = setTimeout(save, RETRY_DELAY_MS)
      } finally {
        saving = null
      }
    })()
    await saving
    if (unsavedChanges() && !timer) {
      schedule()
    }
  }

  return {
    onChange(
      elements: readonly OrderedExcalidrawElement[],
      appState: AppState
    ) {
      latest = { elements, appState }
      savedAppState ??= persistedAppState(appState)
      if (unsavedChanges()) {
        if (!saving) {
          onStatus("pending")
        }
        schedule()
      }
    },
    save,
    hasUnsavedChanges() {
      return saving !== null || unsavedChanges() !== null
    },
  }
}

// Saves the scene as it changes, plus on tab hide, page close and unmount.
function useAutosave(
  drawingId: string,
  storedElements: readonly ExcalidrawElement[],
  enabled: boolean
) {
  const [status, setStatus] = useState<SaveStatus>("saved")
  const [autosaver] = useState(() =>
    createAutosaver(drawingId, storedElements, setStatus)
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        autosaver.save({ keepalive: true })
      }
    }
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (autosaver.hasUnsavedChanges()) {
        autosaver.save({ keepalive: true })
        // Ask the browser to confirm leaving while changes are in flight.
        event.preventDefault()
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("beforeunload", onBeforeUnload)
      autosaver.save()
    }
  }, [autosaver, enabled])

  return {
    status,
    onChange: enabled ? autosaver.onChange : undefined,
    save: autosaver.save,
  }
}

export { useAutosave }
export type { SaveStatus }
