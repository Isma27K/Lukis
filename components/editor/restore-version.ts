import {
  bumpVersion,
  CaptureUpdateAction,
  newElementWith,
  restoreElements,
} from "@excalidraw/excalidraw"
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types"
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types"

import type { Version } from "@/lib/types"

// The scene that brings `version` back over `current`, as edits that win
// everywhere: the backend's merge, other editors' reconcile and this
// editor's autosave all keep the element with the higher version, so every
// restored element is bumped past any copy this editor knows of, and
// everything the version lacks is deleted as a tombstone.
function restoredElements(
  current: readonly ExcalidrawElement[],
  version: Version
): ExcalidrawElement[] {
  const currentById = new Map(current.map((el) => [el.id, el]))
  const restored = restoreElements(version.elements, null, {
    repairBindings: true,
  }).map((el) =>
    bumpVersion(
      { ...el, isDeleted: false },
      Math.max(el.version, currentById.get(el.id)?.version ?? 0)
    )
  )
  const restoredIds = new Set(restored.map((el) => el.id))
  const removed = current
    .filter((el) => !restoredIds.has(el.id))
    .map((el) => (el.isDeleted ? el : newElementWith(el, { isDeleted: true })))

  // Fractional indexes order by code point, as on the backend; the editor
  // repairs any that clash.
  return [...restored, ...removed].sort((a, b) => {
    const [ia, ib] = [a.index ?? "", b.index ?? ""]
    return ia < ib ? -1 : ia > ib ? 1 : a.id < b.id ? -1 : 1
  })
}

// Puts a version back on the canvas as one undoable step. Autosave and live
// collaboration pick it up like any other edit.
function restoreVersion(api: ExcalidrawImperativeAPI, version: Version) {
  api.updateScene({
    elements: restoredElements(api.getSceneElementsIncludingDeleted(), version),
    // The scene settings a version keeps: background, grid…
    appState: { ...api.getAppState(), ...version.app_state },
    captureUpdate: CaptureUpdateAction.IMMEDIATELY,
  })
}

export { restoreVersion }
