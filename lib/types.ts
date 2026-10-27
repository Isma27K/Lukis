import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types"
import type { AppState } from "@excalidraw/excalidraw/types"

// Shapes returned by the FastAPI backend.

type Role = "owner" | "admin" | "editor" | "viewer"

// What the server has switched on. Without email there's no verification,
// password reset or invite emails; invites are shared as links.
type Features = { email: boolean }

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
  // Changes with every new thumbnail; null until the editor has made one.
  thumbnail_version: number | null
}

type Drawing = DrawingSummary & {
  workspace_id: string
  role: Role
}

type TrashedDrawing = DrawingSummary & {
  deleted_at: string
  // Who moved it to the trash; null if their account is gone.
  deleted_by: string | null
}

type Scene = {
  elements: ExcalidrawElement[]
  app_state: Partial<AppState>
  rev: number
}

type Member = {
  user_id: string
  name: string
  email: string
  role: Role
  joined_at: string
}

type Invite = {
  id: string
  email: string
  role: Role
  created_at: string
  expires_at: string
}

// Only returned when the invite is created; the backend keeps just a hash.
type CreatedInvite = Invite & { token: string }

type InvitePreview = {
  workspace_name: string
  role: Role
  email: string
  invited_by: string
  expires_at: string
}

export type {
  CreatedInvite,
  Drawing,
  DrawingSummary,
  Features,
  Invite,
  InvitePreview,
  Member,
  Role,
  Scene,
  TrashedDrawing,
  Workspace,
}
