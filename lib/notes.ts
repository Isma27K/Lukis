import { seedFrom } from "@/lib/sketch"

// The editor's pastel palette, used for sticky notes, cursors and avatars.
// Notes are paper in both themes, so anything on them is ink.
const NOTE_COLORS = [
  "yellow",
  "pink",
  "blue",
  "green",
  "violet",
  "orange",
] as const

type NoteColor = (typeof NOTE_COLORS)[number]

const NOTE_BG: Record<NoteColor, string> = {
  yellow: "bg-note-yellow",
  pink: "bg-note-pink",
  blue: "bg-note-blue",
  green: "bg-note-green",
  violet: "bg-note-violet",
  orange: "bg-note-orange",
}

const NOTE_TEXT: Record<NoteColor, string> = {
  yellow: "text-note-yellow",
  pink: "text-note-pink",
  blue: "text-note-blue",
  green: "text-note-green",
  violet: "text-note-violet",
  orange: "text-note-orange",
}

// The same name always gets the same color, e.g. for avatars.
function noteColorFor(name: string): NoteColor {
  return NOTE_COLORS[seedFrom(name) % NOTE_COLORS.length]
}

export { NOTE_BG, NOTE_TEXT, noteColorFor }
export type { NoteColor }
