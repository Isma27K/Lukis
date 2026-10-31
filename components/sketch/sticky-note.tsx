import { cn } from "cn"

import { NOTE_BG, type NoteColor } from "@/lib/notes"

// A pastel paper note. It's paper in both themes, so text is always ink.
function StickyNote({
  color = "yellow",
  className,
  children,
}: {
  color?: NoteColor
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "relative rounded-[3px] p-5 text-note-ink shadow-note",
        NOTE_BG[color],
        className
      )}
    >
      {children}
    </div>
  )
}

export { StickyNote }
