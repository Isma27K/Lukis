import { CaptureUpdateAction, newElementWith } from "@excalidraw/excalidraw"
import type {
  ExcalidrawElement,
  FileId,
} from "@excalidraw/excalidraw/element/types"
import type {
  BinaryFileData,
  BinaryFiles,
  DataURL,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types"
import { isInitializedImageElement } from "@excalidraw/element"

import { ApiError, apiFetch, errorMessage } from "@/lib/api"

// Images are stored behind the API, not in the scene: image elements only
// carry a fileId. Modeled on Excalidraw's FileManager
// (../excalidraw/excalidraw-app/data/FileManager.ts) and how its collab client
// drives it:
// - Editors upload the files their scene uses that the server doesn't have
//   yet, then flip those images' status from "pending" to "saved". That edit
//   reaches everyone like any other and tells them the file is ready.
// - Everyone downloads the files their scene uses but the editor lacks.
// Both are driven from onChange, which also fires for remote changes.

type FileState =
  | "uploading"
  | "downloading"
  // On the server and in this editor.
  | "done"
  // An upload or download failed and is retried later (see `retries`).
  | "failed"
  // The server refused the upload (too big, wrong type…). Not retried.
  | "rejected"

type Plan = {
  uploads: Map<FileId, BinaryFileData>
  downloads: Set<FileId>
  // Some images uploaded but still marked "pending".
  markSaved: boolean
  // When to look again for work that isn't due yet, in ms.
  recheckIn: number | null
}

// Lets a burst of pastes go up together, as in Excalidraw.
const UPLOAD_DELAY_MS = 300
// Someone else's image still marked "pending" may be mid-upload, so it's left
// alone this long before being downloaded anyway (from Excalidraw's
// Collab.tsx).
const PENDING_GRACE_MS = 10_000
const RETRY_DELAYS_MS = [2_000, 5_000, 15_000, 30_000]
// A file still missing after this many downloads is given up on until the
// drawing is reopened. Uploads keep retrying, or the image would be lost.
const MAX_DOWNLOAD_ATTEMPTS = RETRY_DELAYS_MS.length + 1

function fileUrl(drawingId: string, fileId: string) {
  return `/drawings/${encodeURIComponent(drawingId)}/files/${encodeURIComponent(fileId)}`
}

function readAsDataUrl(blob: Blob) {
  return new Promise<DataURL>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as DataURL)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function downloadFile(
  drawingId: string,
  id: FileId
): Promise<BinaryFileData> {
  const response = await fetch(`/api${fileUrl(drawingId, id)}`)
  if (!response.ok) {
    throw new ApiError(response.status, `Couldn't load image ${id}`)
  }
  const blob = await response.blob()
  return {
    id,
    mimeType: blob.type as BinaryFileData["mimeType"],
    dataURL: await readAsDataUrl(blob),
    created: Date.now(),
    lastRetrieved: Date.now(),
  }
}

class ImageFiles {
  private api: ExcalidrawImperativeAPI | null = null
  private states = new Map<FileId, FileState>()
  // For failed files: how often they failed and when to try again.
  private retries = new Map<FileId, { count: number; at: number }>()
  private timers = {
    upload: null as { id: ReturnType<typeof setTimeout>; at: number } | null,
    download: null as { id: ReturnType<typeof setTimeout>; at: number } | null,
  }

  constructor(
    private readonly drawingId: string,
    private readonly canEdit: boolean,
    // An upload the server refused, e.g. because the image is too large.
    private readonly onRejected: (message: string) => void
  ) {}

  attach(api: ExcalidrawImperativeAPI | null) {
    this.api = api
    if (!api) {
      for (const timer of Object.values(this.timers)) {
        if (timer) {
          clearTimeout(timer.id)
        }
      }
      this.timers = { upload: null, download: null }
    }
  }

  onChange = (elements: readonly ExcalidrawElement[], files: BinaryFiles) => {
    if (!this.api) {
      return
    }
    const plan = this.plan(elements, files)
    if (plan.uploads.size || plan.markSaved) {
      this.schedule("upload", UPLOAD_DELAY_MS)
    }
    if (plan.downloads.size) {
      this.schedule("download", 0)
    }
    if (plan.recheckIn !== null) {
      // Retries and grace periods can fall due in either direction.
      this.schedule("upload", plan.recheckIn)
      this.schedule("download", plan.recheckIn)
    }
  }

  isUploading() {
    return [...this.states.values()].includes("uploading")
  }

  private plan(elements: readonly ExcalidrawElement[], files: BinaryFiles) {
    const now = Date.now()
    const plan: Plan = {
      uploads: new Map(),
      downloads: new Set(),
      markSaved: false,
      recheckIn: null,
    }
    const later = (at: number) => {
      plan.recheckIn = Math.min(plan.recheckIn ?? Infinity, at - now)
    }

    for (const element of elements) {
      if (!isInitializedImageElement(element) || element.isDeleted) {
        continue
      }
      const id = element.fileId
      const state = this.states.get(id)
      const file = files[id]
      const retryAt = this.retries.get(id)?.at ?? 0

      if (file) {
        // Added here (inserted or pasted), or downloaded earlier.
        if (!this.canEdit) {
          continue
        }
        if (state === undefined || (state === "failed" && retryAt <= now)) {
          plan.uploads.set(id, file)
        } else if (state === "failed") {
          later(retryAt)
        } else if (state === "done" && element.status === "pending") {
          plan.markSaved = true
        }
        continue
      }

      // Only files never tried, or whose download failed. "done" without a
      // file means the editor turned it down; asking again would loop.
      if (state !== undefined && state !== "failed") {
        continue
      }
      const readyAt =
        state === "failed"
          ? retryAt
          : element.status === "pending"
            ? element.updated + PENDING_GRACE_MS
            : now
      if (readyAt <= now) {
        plan.downloads.add(id)
      } else if (readyAt !== Infinity) {
        later(readyAt)
      }
    }
    return plan
  }

  private schedule(kind: "upload" | "download", delay: number) {
    const at = Date.now() + Math.max(0, delay)
    const current = this.timers[kind]
    if (current && current.at <= at) {
      return
    }
    if (current) {
      clearTimeout(current.id)
    }
    this.timers[kind] = {
      at,
      id: setTimeout(() => {
        this.timers[kind] = null
        void (kind === "upload" ? this.upload() : this.download())
      }, delay),
    }
  }

  private failed(id: FileId, maxAttempts = Infinity) {
    const count = (this.retries.get(id)?.count ?? 0) + 1
    const delay = RETRY_DELAYS_MS[Math.min(count, RETRY_DELAYS_MS.length) - 1]
    this.states.set(id, "failed")
    this.retries.set(id, {
      count,
      at: count >= maxAttempts ? Infinity : Date.now() + delay,
    })
  }

  // Looks for follow-up work once a batch is done.
  private replan() {
    const api = this.api
    if (api) {
      this.onChange(api.getSceneElementsIncludingDeleted(), api.getFiles())
    }
  }

  private async upload() {
    const api = this.api
    if (!api || !this.canEdit) {
      return
    }
    const { uploads } = this.plan(
      api.getSceneElementsIncludingDeleted(),
      api.getFiles()
    )
    for (const id of uploads.keys()) {
      this.states.set(id, "uploading")
    }

    await Promise.all(
      [...uploads.values()].map(async (file) => {
        try {
          await apiFetch(fileUrl(this.drawingId, file.id), {
            method: "PUT",
            body: { data_url: file.dataURL },
          })
          this.states.set(file.id, "done")
          this.retries.delete(file.id)
        } catch (error) {
          // Too big, wrong type or access lost: retrying won't help.
          if (error instanceof ApiError && error.status < 500) {
            this.states.set(file.id, "rejected")
            this.onRejected(errorMessage(error))
          } else {
            this.failed(file.id)
          }
        }
      })
    )
    if (this.api !== api) {
      return
    }
    this.markSaved(api)
    this.replan()
  }

  private async download() {
    const api = this.api
    if (!api) {
      return
    }
    const { downloads } = this.plan(
      api.getSceneElementsIncludingDeleted(),
      api.getFiles()
    )
    for (const id of downloads) {
      this.states.set(id, "downloading")
    }

    const loaded: BinaryFileData[] = []
    await Promise.all(
      [...downloads].map(async (id) => {
        try {
          loaded.push(await downloadFile(this.drawingId, id))
          this.states.set(id, "done")
          this.retries.delete(id)
        } catch {
          // Often just not uploaded yet: its status was flipped early, or it
          // was pasted from another drawing still marked "saved".
          this.failed(id, MAX_DOWNLOAD_ATTEMPTS)
        }
      })
    )
    if (this.api !== api) {
      return
    }
    if (loaded.length) {
      api.addFiles(loaded)
    }
    this.replan()
  }

  // Tells everyone (and the saved scene) that these files can be downloaded.
  private markSaved(api: ExcalidrawImperativeAPI) {
    let changed = false
    const elements = api.getSceneElementsIncludingDeleted().map((element) => {
      if (
        isInitializedImageElement(element) &&
        !element.isDeleted &&
        element.status === "pending" &&
        this.states.get(element.fileId) === "done"
      ) {
        changed = true
        return newElementWith(element, { status: "saved" })
      }
      return element
    })
    if (changed) {
      // Bookkeeping, not an edit: keep it off the undo stack.
      api.updateScene({ elements, captureUpdate: CaptureUpdateAction.NEVER })
    }
  }
}

export { ImageFiles, downloadFile }
