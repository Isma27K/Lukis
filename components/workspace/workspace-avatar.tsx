import { cn } from "cn"

import { initials } from "@/lib/format"

function WorkspaceAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground",
        className
      )}
    >
      {initials(name)}
    </span>
  )
}

export { WorkspaceAvatar }
