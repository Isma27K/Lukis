import { cn } from "cn"

// A strip of washi tape, for pinning sheets and notes to the page. Place it
// with absolute positioning classes.
function Tape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 h-5 w-16 bg-tape [clip-path:polygon(0_12%,5%_0,10%_14%,15%_0,85%_0,90%_14%,95%_0,100%_12%,100%_88%,95%_100%,90%_86%,85%_100%,15%_100%,10%_86%,5%_100%,0_88%)]",
        className
      )}
    />
  )
}

export { Tape }
