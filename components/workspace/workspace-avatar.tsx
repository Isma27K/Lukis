import { cn } from "cn"

import { initials } from "@/lib/format"
import { NOTE_BG, noteColorFor } from "@/lib/notes"

// A sticky-note square with the workspace's initials; the color follows the
// name, so each workspace is easy to spot.
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
        "flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-note-ink",
        NOTE_BG[noteColorFor(name)],
        className
      )}
    >
      {initials(name)}
    </span>
  )
}

export { WorkspaceAvatar }
