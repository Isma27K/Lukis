import { cn } from "cn"

const TONES = {
  green: "border-chart-3/35 bg-chart-3/10 text-foreground",
  yellow: "border-chart-4/45 bg-chart-4/12 text-foreground",
  muted: "border-border bg-muted text-muted-foreground",
}

// A small status label, in the same chip shape as RoleBadge.
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
        "inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export { Pill }
