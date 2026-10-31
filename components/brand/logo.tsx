import { cn } from "cn"

import { Scribble } from "@/components/brand/scribble"

const SIZES = {
  sm: { text: "text-3xl", line: "h-1.5" },
  lg: { text: "text-6xl", line: "h-2.5" },
}

// The "lukis" wordmark: the editor's hand-drawn font, underlined in marker.
function Logo({
  size = "sm",
  className,
}: {
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col font-hand leading-none text-foreground",
        SIZES[size].text,
        className
      )}
    >
      lukis
      <Scribble className={cn("-mt-0.5 w-full", SIZES[size].line)} />
    </span>
  )
}

export { Logo }
