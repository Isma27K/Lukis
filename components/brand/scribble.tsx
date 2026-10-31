import { cn } from "cn"

// A marker stroke that stretches to the width it's given; the stroke itself
// stays the same thickness.
function Scribble({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      fill="none"
      className={cn("text-primary", className)}
    >
      <path
        d="M2 5.5C18 2.8 34 6.6 51 4.2S83 2.6 98 4.8"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export { Scribble }
