import { cn } from "cn"

import { initials } from "@/lib/format"

// Sticky-note colors from the editor's palette, with ink text in both themes.
const COLORS = [
  "bg-[#ffc9c9]",
  "bg-[#b2f2bb]",
  "bg-[#a5d8ff]",
  "bg-[#ffec99]",
  "bg-[#d0bfff]",
  "bg-[#ffd8a8]",
]

// The same name always gets the same color.
function colorFor(name: string) {
  let hash = 0
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

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
        "flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-[#1c1917]",
        colorFor(name),
        className
      )}
    >
      {initials(name)}
    </span>
  )
}

export { WorkspaceAvatar }
