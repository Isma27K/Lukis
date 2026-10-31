import { Doodle } from "@/components/brand/doodle"
import type { DrawingSummary } from "@/lib/types"

function thumbnailUrl(drawing: DrawingSummary, theme: "light" | "dark") {
  // The version makes each new thumbnail a new URL, so browsers can cache
  // every one of them for good.
  return `/api/drawings/${encodeURIComponent(drawing.id)}/thumbnail/${theme}?v=${drawing.thumbnail_version}`
}

// The editor renders the thumbnail in both themes; CSS shows the one matching
// the page, and lazy loading skips fetching the hidden one.
function DrawingThumbnail({ drawing }: { drawing: DrawingSummary }) {
  if (drawing.thumbnail_version === null) {
    return (
      <div className="flex aspect-video items-center justify-center border-b bg-muted">
        <Doodle className="w-20 opacity-70" />
      </div>
    )
  }

  // Plain <img>: next/image's optimizer fetches from the server, without the
  // session cookie these need.
  return (
    <div className="aspect-video border-b bg-muted">
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
