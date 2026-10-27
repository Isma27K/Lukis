"use client"

import { SearchIcon } from "lucide-react"
import { useState } from "react"

import { DrawingCard } from "@/components/dashboard/drawing-card"
import { Input } from "@/components/ui/input"
import type { DrawingSummary, Workspace } from "@/lib/types"

// The workspace's drawings with a title filter. Every drawing is already
// loaded, so searching happens right here.
function DrawingGrid({
  drawings,
  canEdit,
  canDelete,
  moveTargets,
}: {
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
      <p className="py-16 text-center text-xs text-muted-foreground">
        No drawings yet.
        {canEdit && " Create one to get started."}
      </p>
    )
  }

  return (
    <>
      <div className="relative w-full max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search drawings"
          aria-label="Search drawings by title"
          className="pl-8"
        />
      </div>
      {shown.length === 0 ? (
        <p className="py-16 text-center text-xs text-muted-foreground">
          No drawings match “{query.trim()}”.
        </p>
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
