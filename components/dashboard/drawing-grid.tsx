"use client"

import { SearchIcon } from "lucide-react"
import { useState } from "react"

import { DrawingCard } from "@/components/dashboard/drawing-card"
import { NewDrawingButton } from "@/components/dashboard/new-drawing-button"
import { EmptyState } from "@/components/empty-state"
import { Input } from "@/components/ui/input"
import type { DrawingSummary, Workspace } from "@/lib/types"

// The workspace's drawings with a title filter. Every drawing is already
// loaded, so searching happens right here.
function DrawingGrid({
  workspaceId,
  drawings,
  canEdit,
  canDelete,
  moveTargets,
}: {
  workspaceId: string
  // With labels preformatted on the server, e.g. "5 minutes ago".
  drawings: (DrawingSummary & { editedLabel: string })[]
  canEdit: boolean
  canDelete: boolean
  moveTargets: Workspace[]
}) {
  const [query, setQuery] = useState("")
  const needle = query.trim().toLocaleLowerCase()
  const shown = needle
    ? drawings.filter((d) => d.title.toLocaleLowerCase().includes(needle))
    : drawings

  if (drawings.length === 0) {
    return (
      <EmptyState title="Nothing drawn yet">
        {canEdit ? (
          <>
            <p className="text-sm text-muted-foreground">
              Start with a blank canvas.
            </p>
            <NewDrawingButton workspaceId={workspaceId} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No one has drawn anything in this workspace yet.
          </p>
        )}
      </EmptyState>
    )
  }

  return (
    <>
      <div className="relative w-full max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search drawings"
          aria-label="Search drawings by title"
          className="bg-card pl-9"
        />
      </div>
      {shown.length === 0 ? (
        <EmptyState title="No matches">
          <p className="text-sm text-muted-foreground">
            No drawing titles contain “{query.trim()}”.
          </p>
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ editedLabel, ...drawing }) => (
            <DrawingCard
              key={drawing.id}
              drawing={drawing}
              editedLabel={editedLabel}
              canEdit={canEdit}
              canDelete={canDelete}
              moveTargets={moveTargets}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export { DrawingGrid }
