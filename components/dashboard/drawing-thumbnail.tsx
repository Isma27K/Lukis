import { cn } from "cn"

import { Strokes } from "@/components/sketch/strokes"
import { sketch } from "@/lib/sketch"
import type { DrawingSummary } from "@/lib/types"

// Shown until the editor has made a thumbnail.
const PLACEHOLDER = sketch.curve(
  [
    [10, 40],
    [34, 18],
    [58, 38],
    [84, 16],
    [110, 30],
  ],
  { seed: 9, strokeWidth: 2 }
)

function thumbnailUrl(drawing: DrawingSummary, theme: "light" | "dark") {
  // The version makes each new thumbnail a new URL, so browsers can cache
  // every one of them for good.
  return `/api/drawings/${encodeURIComponent(drawing.id)}/thumbnail/${theme}?v=${drawing.thumbnail_version}`
}

// The editor renders the thumbnail in both themes; CSS shows the one matching
// the page, and lazy loading skips fetching the hidden one.
function DrawingThumbnail({
  drawing,
  className,
}: {
  drawing: DrawingSummary
  className?: string
}) {
  if (drawing.thumbnail_version === null) {
    return (
      <div
        className={cn(
          "flex aspect-video items-center justify-center bg-muted/60 dot-grid",
          className
        )}
      >
        <svg aria-hidden viewBox="0 0 120 60" className="w-24">
          <Strokes paths={PLACEHOLDER} className="text-muted-foreground/60" />
        </svg>
      </div>
    )
  }

  // Plain <img>: next/image's optimizer fetches from the server, without the
  // session cookie these need.
  return (
    <div
      className={cn(
        "aspect-video overflow-hidden bg-white dark:bg-[#121212]",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl(drawing, "light")}
        alt=""
        loading="lazy"
        className="size-full object-cover dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl(drawing, "dark")}
        alt=""
        loading="lazy"
        className="hidden size-full object-cover dark:block"
      />
    </div>
  )
}

export { DrawingThumbnail }
