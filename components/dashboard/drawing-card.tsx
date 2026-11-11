import Link from "next/link"

import { DrawingActions } from "@/components/dashboard/drawing-actions"
import { DrawingThumbnail } from "@/components/dashboard/drawing-thumbnail"
import { EditorAvatar, editedByLabel } from "@/components/dashboard/edited-by"
import type { ListedDrawing, Workspace } from "@/lib/types"

type DrawingItemProps = {
  drawing: ListedDrawing
  // Preformatted on the server, e.g. "5 minutes ago".
  editedLabel: string
  currentUserId: string
  canEdit: boolean
  canDelete: boolean
  moveTargets: Workspace[]
  publicLinks: boolean
}

// A drawing as a white sheet: the thumbnail on top, title and who edited it
// last underneath. One link covers the whole card underneath, so the actions
// button never sits inside it; everything on top ignores the pointer except
// that button.
function DrawingCard({
  drawing,
  editedLabel,
  currentUserId,
  canEdit,
  canDelete,
  moveTargets,
  publicLinks,
}: DrawingItemProps) {
  return (
    <li className="group/drawing relative">
      <Link
        href={`/d/${drawing.id}`}
        className="peer absolute inset-0 z-0 rounded-xl outline-none"
      >
        <span className="sr-only">{drawing.title}</span>
      </Link>
      <div className="pointer-events-none relative overflow-hidden rounded-xl border bg-card shadow-paper transition-[translate,box-shadow,border-color] duration-200 ease-out-expo group-hover/drawing:border-[color-mix(in_oklch,var(--border),var(--foreground)_14%)] group-hover/drawing:shadow-lift peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring peer-focus-visible:outline-solid focus-visible:outline-solid motion-safe:group-hover/drawing:-translate-y-0.5">
        <DrawingThumbnail drawing={drawing} className="border-b" />
        <div className="flex items-center gap-2.5 px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{drawing.title}</p>
            <p className="truncate text-xs text-muted-foreground tabular-nums">
              {editedByLabel(drawing, currentUserId, editedLabel)}
            </p>
          </div>
          <EditorAvatar drawing={drawing} />
        </div>
        {canEdit && (
          <DrawingActions
            drawing={drawing}
            canDelete={canDelete}
            moveTargets={moveTargets}
            publicLinks={publicLinks}
            className="pointer-events-auto absolute top-2.5 right-2.5 bg-card/95 opacity-0 shadow-paper group-hover/drawing:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 pointer-coarse:opacity-100"
          />
        )}
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
  publicLinks,
}: DrawingItemProps) {
  return (
    <li className="group/drawing relative flex items-center gap-4 px-3 py-2.5 transition-colors hover:bg-muted/50 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring has-[a:focus-visible]:outline-solid">
      <Link href={`/d/${drawing.id}`} className="absolute inset-0 outline-none">
        <span className="sr-only">{drawing.title}</span>
      </Link>
      <DrawingThumbnail
        drawing={drawing}
        className="pointer-events-none relative w-24 shrink-0 rounded-md border"
      />
      <div className="pointer-events-none relative min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{drawing.title}</p>
        <p className="truncate text-xs text-muted-foreground tabular-nums">
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
          publicLinks={publicLinks}
          className="relative"
        />
      )}
    </li>
  )
}

export { DrawingCard, DrawingRow }
export type { DrawingItemProps }
