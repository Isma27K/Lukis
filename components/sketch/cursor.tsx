import { cn } from "cn"

import { NOTE_BG, NOTE_TEXT, type NoteColor } from "@/lib/notes"

// Someone else's pointer, as the editor shows collaborators: an arrow and a
// name tag in their color. Position it with absolute positioning classes.
function Cursor({
  name,
  color = "blue",
  className,
}: {
  name: string
  color?: NoteColor
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute flex items-start", className)}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "size-6 drop-shadow-[0_1px_1px_rgb(0_0_0/0.25)]",
          NOTE_TEXT[color]
        )}
      >
        <path
          d="M4 3l15 7.5-6.5 1.8L9.5 19z"
          fill="currentColor"
          stroke="var(--note-ink)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "mt-4 -ml-1 rounded-full px-2 py-0.5 font-hand text-sm whitespace-nowrap text-note-ink shadow-sm",
          NOTE_BG[color]
        )}
      >
        {name}
      </span>
    </span>
  )
}

export { Cursor }
