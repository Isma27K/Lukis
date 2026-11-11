"use client"

import { LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react"
import { useState } from "react"

import { BlankCanvasTile } from "@/components/dashboard/blank-canvas-tile"
import { DrawingCard, DrawingRow } from "@/components/dashboard/drawing-card"
import { NewDrawingButton } from "@/components/dashboard/new-drawing-button"
import { EmptyState } from "@/components/empty-state"
import { BlankCanvas, NoMatches } from "@/components/illustrations/spots"
import { Strokes } from "@/components/sketch/strokes"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sketch } from "@/lib/sketch"
import type { ListedDrawing, Workspace } from "@/lib/types"
import { cn } from "@/lib/utils"

type DrawingSort = "edited" | "name" | "created"
type DrawingView = "grid" | "list"

const SORT_LABELS: Record<DrawingSort, string> = {
  edited: "Last edited",
  name: "Name",
  created: "Newest",
}

function sortDrawings<T extends ListedDrawing>(
  drawings: T[],
  sort: DrawingSort
) {
  if (sort === "name") {
    return [...drawings].sort((a, b) => a.title.localeCompare(b.title))
  }
  if (sort === "created") {
    return [...drawings].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    )
  }
  // The server already lists them by last edit.
  return drawings
}

// Sort and view go in the URL, so a reload or a shared link looks the same,
// without asking the server to render again. Defaults stay out of it.
function rememberInUrl(sort: DrawingSort, view: DrawingView) {
  const params = new URLSearchParams(window.location.search)
  params.delete("sort")
  params.delete("view")
  if (sort !== "edited") {
    params.set("sort", sort)
  }
  if (view !== "grid") {
    params.set("view", view)
  }
  const search = params.toString()
  window.history.replaceState(
    null,
    "",
    search ? `?${search}` : window.location.pathname
  )
}

// "start here", with an arrow curling toward the button beside it.
const START_ARROW = sketch.arrow(
  [
    [6, 8],
    [30, 6],
    [52, 22],
  ],
  { seed: 17, strokeWidth: 1.8, head: 9 }
)

// The workspace's drawings: search, sort, grid or list. Every drawing is
// already loaded, so all of it happens right here.
function DrawingGrid({
  workspaceId,
  drawings,
  currentUserId,
  canEdit,
  canDelete,
  moveTargets,
  publicLinks,
  initialSort,
  initialView,
}: {
  workspaceId: string
  // With labels preformatted on the server, e.g. "5 minutes ago".
  drawings: (ListedDrawing & { editedLabel: string })[]
  currentUserId: string
  canEdit: boolean
  canDelete: boolean
  moveTargets: Workspace[]
  // Whether the site allows public links, so drawings can be shared.
  publicLinks: boolean
  initialSort: DrawingSort
  initialView: DrawingView
}) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState(initialSort)
  const [view, setView] = useState(initialView)
  const needle = query.trim().toLocaleLowerCase()
  const shown = sortDrawings(
    needle
      ? drawings.filter((d) => d.title.toLocaleLowerCase().includes(needle))
      : drawings,
    sort
  )

  function change(next: { sort?: DrawingSort; view?: DrawingView }) {
    const nextSort = next.sort ?? sort
    const nextView = next.view ?? view
    setSort(nextSort)
    setView(nextView)
    rememberInUrl(nextSort, nextView)
  }

  if (drawings.length === 0) {
    return (
      <EmptyState
        illustration={<BlankCanvas className="w-72" />}
        title={canEdit ? "Draw your first idea" : "Nothing drawn yet"}
      >
        {canEdit ? (
          <div className="relative mt-2">
            <span
              aria-hidden
              className="absolute top-1/2 right-full mr-3 hidden -translate-y-full items-end gap-1 text-primary-ink sm:flex"
            >
              <span className="font-hand text-lg whitespace-nowrap">
                start here
              </span>
              <svg viewBox="0 0 60 30" className="w-14">
                <Strokes paths={START_ARROW} animate delay={0.8} />
              </svg>
            </span>
            <NewDrawingButton workspaceId={workspaceId} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No one has drawn anything in this workspace yet.
          </p>
        )}
      </EmptyState>
    )
  }

  const itemProps = {
    currentUserId,
    canEdit,
    canDelete,
    moveTargets,
    publicLinks,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search drawings"
            aria-label="Search drawings by title"
            className="pl-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select
            items={SORT_LABELS}
            value={sort}
            onValueChange={(value) => value && change({ sort: value })}
          >
            <SelectTrigger className="w-36" aria-label="Sort drawings">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as DrawingSort[]).map((value) => (
                <SelectItem key={value} value={value}>
                  {SORT_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div
            role="group"
            aria-label="Layout"
            className="flex rounded-lg border bg-card p-0.5 shadow-[0_1px_2px_var(--paper-shadow)]"
          >
            {(
              [
                ["grid", "Grid", LayoutGridIcon],
                ["list", "List", ListIcon],
              ] as const
            ).map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={view === value}
                title={label}
                onClick={() => change({ view: value })}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4",
                  view === value && "bg-muted text-foreground"
                )}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState illustration={<NoMatches />} title="No matches">
          <p className="text-sm text-muted-foreground">
            No drawing titles contain “{query.trim()}”.
          </p>
        </EmptyState>
      ) : view === "list" ? (
        <ul className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card shadow-paper">
          {shown.map(({ editedLabel, ...drawing }) => (
            <DrawingRow
              key={drawing.id}
              drawing={drawing}
              editedLabel={editedLabel}
              {...itemProps}
            />
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {canEdit && !needle && <BlankCanvasTile workspaceId={workspaceId} />}
          {shown.map(({ editedLabel, ...drawing }) => (
            <DrawingCard
              key={drawing.id}
              drawing={drawing}
              editedLabel={editedLabel}
              {...itemProps}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export { DrawingGrid }
export type { DrawingSort, DrawingView }
