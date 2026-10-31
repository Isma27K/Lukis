import { cn } from "cn"

import { ROLE_LABELS } from "@/lib/roles"
import type { Role } from "@/lib/types"

// Highlighter colors, from most to least power.
const ROLE_COLORS: Record<Role, string> = {
  owner: "bg-note-orange text-note-ink",
  admin: "bg-note-violet text-note-ink",
  editor: "bg-note-green text-note-ink",
  viewer: "bg-muted text-muted-foreground",
}

function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        ROLE_COLORS[role],
        className
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}

export { RoleBadge }
