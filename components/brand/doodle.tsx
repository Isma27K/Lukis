import { cn } from "cn"

// A little sketch (box, arrow, circle) for empty states. Strokes follow the
// text color, with the underline in marker.
function Doodle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-muted-foreground", className)}
    >
      <path d="M10 18c12-1.5 26-1 38 .5 1 9 .8 19-.3 28-12 1-25 .8-37-.3-1-9-1.2-19-.7-28.2Z" />
      <path d="M54 34c9-5 19-6 28-2" />
      <path d="M76.5 26.5 83 32l-7.5 4" />
      <path d="M101 21c8 1 12 9 9 16-3 8-13 10-19 5-6-6-4-16 3-19 3-1.5 5-2 7-2" />
      <path
        d="M14 64c20-4 42-3 62-1s30 1 34-1"
        strokeWidth={3}
        className="text-primary"
      />
    </svg>
  )
}

export { Doodle }
