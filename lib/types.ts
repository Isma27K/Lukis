import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types"
import type { AppState } from "@excalidraw/excalidraw/types"

// Shapes returned by the FastAPI backend.

type Role = "owner" | "admin" | "editor" | "viewer"

// Who may sign up: the first account with the setup code from the server
// logs, anyone, or only people with an invite from the site owner.
type RegistrationMode = "setup" | "open" | "invite_only"

// What the server has switched on. Without email there's no verification,
// password reset or invite emails; invites are shared as links.
// `public_links`: whether the site owner allows sharing drawings publicly.
type Features = {
  email: boolean
  registration: RegistrationMode
  public_links: boolean
}

// Settings for the whole site, which only its owner can see.
type SiteSettings = { registration_open: boolean; public_links: boolean }

// Lets one email address sign up while sign-up is invite-only.
type SignupInvite = {
  id: string
  email: string
  created_at: string
  expires_at: string
}

// Only returned when the invite is created; the backend keeps just a hash.
type CreatedSignupInvite = SignupInvite & { token: string }

// What the sign-up page learns from an invite link.
type SignupInvitePreview = { email: string }

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

// Someone who changed a drawing.
type Editor = { id: string; name: string }

// A drawing as the workspace list shows it.
type ListedDrawing = DrawingSummary & {
  // Whoever changed it last; null if their account is gone.
  updated_by: Editor | null
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

// What anyone with a drawing's public link can do with it.
type ShareAccess = "view" | "edit"

// A drawing's public link, as the people who can share it see it.
type ShareLink = {
  enabled: boolean
  // The link is /s/<token>.
  token: string
  access: ShareAccess
  has_password: boolean
  expires_at: string | null
}

// What the shared page learns about a link before opening the drawing.
type ShareInfo = {
  access: ShareAccess
  password_required: boolean
  // No password, or this browser has entered it.
  unlocked: boolean
  // Hidden until unlocked.
  title: string | null
  has_thumbnail: boolean
  // Set for members, who get the full editor instead.
  member_drawing_id: string | null
  // The logged-in visitor's name, if any.
  viewer_name: string | null
}

// An entry in a drawing's version history.
type VersionSummary = {
  id: string
  // null for automatic snapshots and checkpoints.
  name: string | null
  // When the drawing looked like this.
  created_at: string
  // Who made the change that led to it; null if their account is gone.
  created_by: Editor | null
  element_count: number
  // When an unnamed version will be deleted; null for named ones.
  expires_at: string | null
}

type Version = VersionSummary & {
  elements: ExcalidrawElement[]
  app_state: Partial<AppState>
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
  CreatedSignupInvite,
  Drawing,
  DrawingSummary,
  Editor,
  Features,
  Invite,
  InvitePreview,
  ListedDrawing,
  Member,
  RegistrationMode,
  Role,
  Scene,
  ShareAccess,
  ShareInfo,
  ShareLink,
  SignupInvite,
  SignupInvitePreview,
  SiteSettings,
  TrashedDrawing,
  Version,
  VersionSummary,
  Workspace,
}
