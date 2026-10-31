import { cn } from "cn"

const TONES = {
  green: "bg-note-green text-note-ink",
  yellow: "bg-note-yellow text-note-ink",
  muted: "bg-muted text-muted-foreground",
}

// A small highlighter label, like RoleBadge.
function Pill({
  tone,
  children,
  className,
}: {
  tone: keyof typeof TONES
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export { Pill }
