import Link from "next/link"

import { DrawingActions } from "@/components/dashboard/drawing-actions"
import { DrawingThumbnail } from "@/components/dashboard/drawing-thumbnail"
import { EditorAvatar, editedByLabel } from "@/components/dashboard/edited-by"
import { SketchFrame } from "@/components/sketch/sketch-frame"
import { Tape } from "@/components/sketch/tape"
import { seedFrom } from "@/lib/sketch"
import type { ListedDrawing, Workspace } from "@/lib/types"

type DrawingItemProps = {
  drawing: ListedDrawing
  // Preformatted on the server, e.g. "5 minutes ago".
  editedLabel: string
  currentUserId: string
  canEdit: boolean
  canDelete: boolean
  moveTargets: Workspace[]
}

// A drawing as a sheet taped to the page, in a hand-drawn frame. One link
// covers the whole card underneath, so the actions button never sits inside
// it; everything on top ignores the pointer except that button.
function DrawingCard({
  drawing,
  index,
  editedLabel,
  currentUserId,
  canEdit,
  canDelete,
  moveTargets,
}: DrawingItemProps & { index: number }) {
  const even = index % 2 === 0
  return (
    <li
      className="group/drawing relative"
      style={{ "--tilt": even ? "-1deg" : "1deg" } as React.CSSProperties}
    >
      <Link
        href={`/d/${drawing.id}`}
        className="peer absolute inset-0 rounded-lg outline-none"
      >
        <span className="sr-only">{drawing.title}</span>
      </Link>
      <div className="pointer-events-none relative rounded-lg bg-card p-2 shadow-paper transition-[translate,rotate,box-shadow] duration-200 group-hover/drawing:-translate-y-1 group-hover/drawing:shadow-paper-lg peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 motion-safe:group-hover/drawing:rotate-(--tilt)">
        <DrawingThumbnail drawing={drawing} className="rounded-sm" />
        <SketchFrame seed={seedFrom(drawing.id)} ratio={1.6} />
        <Tape
          className={
            even ? "-top-2.5 left-6 -rotate-6" : "-top-2.5 right-6 rotate-6"
          }
        />
        {canEdit && (
          <DrawingActions
            drawing={drawing}
            canDelete={canDelete}
            moveTargets={moveTargets}
            className="pointer-events-auto absolute top-3.5 right-3.5 opacity-0 group-hover/drawing:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
          />
        )}
      </div>
      <div className="pointer-events-none relative mt-3 flex items-center gap-2.5 px-1">
        <EditorAvatar drawing={drawing} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{drawing.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {editedByLabel(drawing, currentUserId, editedLabel)}
          </p>
        </div>
      </div>
    </li>
  )
}

// The same drawing as a row, for the list view.
function DrawingRow({
  drawing,
  editedLabel,
  currentUserId,
  canEdit,
  canDelete,
  moveTargets,
}: DrawingItemProps) {
  return (
    <li className="group/drawing relative flex items-center gap-4 px-3 py-2.5 transition-colors hover:bg-muted/60 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50 has-[a:focus-visible]:ring-inset">
      <Link href={`/d/${drawing.id}`} className="absolute inset-0 outline-none">
        <span className="sr-only">{drawing.title}</span>
      </Link>
      <DrawingThumbnail
        drawing={drawing}
        className="pointer-events-none relative w-24 shrink-0 rounded-sm border"
      />
      <div className="pointer-events-none relative min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{drawing.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {editedByLabel(drawing, currentUserId, editedLabel)}
        </p>
      </div>
      <span className="pointer-events-none relative hidden sm:block">
        <EditorAvatar drawing={drawing} />
      </span>
      {canEdit && (
        <DrawingActions
          drawing={drawing}
          canDelete={canDelete}
          moveTargets={moveTargets}
          className="relative"
        />
      )}
    </li>
  )
}

export { DrawingCard, DrawingRow }
export type { DrawingItemProps }
