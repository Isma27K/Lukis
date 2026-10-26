import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types"
import type { AppState } from "@excalidraw/excalidraw/types"

// Shapes returned by the FastAPI backend.

type Role = "owner" | "admin" | "editor" | "viewer"

type Workspace = {
  id: string
  name: string
  personal: boolean
  // The current user's role here.
  role: Role
}

type DrawingSummary = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

type Drawing = DrawingSummary & {
  workspace_id: string
  role: Role
}

type Scene = {
  elements: ExcalidrawElement[]
  app_state: Partial<AppState>
  rev: number
}

export type { Drawing, DrawingSummary, Role, Scene, Workspace }
