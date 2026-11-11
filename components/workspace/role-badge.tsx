import { cn } from "cn"

import { ROLE_LABELS } from "@/lib/roles"
import type { Role } from "@/lib/types"

// A dot per role, from most to least power.
const ROLE_DOTS: Record<Role, string> = {
  owner: "bg-primary",
  admin: "bg-guide",
  editor: "bg-chart-3",
  viewer: "bg-muted-foreground/60",
}

function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border bg-card px-2.5 text-xs font-medium text-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", ROLE_DOTS[role])}
      />
      {ROLE_LABELS[role]}
    </span>
  )
}

export { RoleBadge }
