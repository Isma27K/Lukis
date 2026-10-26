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

export { ROLE_LABELS, assignableRoles, atLeast, canManage }
