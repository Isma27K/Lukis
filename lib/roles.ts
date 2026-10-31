import type { Role } from "@/lib/types"

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
}

const ROLE_RANK: Record<Role, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
}

function atLeast(role: Role, min: Role) {
  return ROLE_RANK[role] >= ROLE_RANK[min]
}

// These mirror the backend's rules (function/workspaces.py), which are the
// ones that count; the UI uses them only to hide controls that would fail.
// Owners manage everyone. Admins manage editors and viewers, and can promote
// them as far as admin.
function canManage(actor: Role, target: Role) {
  return (
    actor === "owner" ||
    (actor === "admin" && (target === "editor" || target === "viewer"))
  )
}

function assignableRoles(actor: Role): Role[] {
  if (actor === "owner") {
    return ["owner", "admin", "editor", "viewer"]
  }
  return actor === "admin" ? ["admin", "editor", "viewer"] : []
}

// Moving drawings to the trash, restoring them, deleting them forever and
// moving them out to another workspace. Editors change what's in a drawing but
// can't remove it (REMOVE_ROLE in routes/drawings.py).
function canDeleteDrawings(role: Role) {
  return atLeast(role, "admin")
}

// Erasing a version from a drawing's history follows the same rule
// (remove_version in routes/versions.py). Saving, naming and restoring
// versions only takes an editor.
const canDeleteVersions = canDeleteDrawings

export {
  ROLE_LABELS,
  assignableRoles,
  atLeast,
  canDeleteDrawings,
  canDeleteVersions,
  canManage,
}
