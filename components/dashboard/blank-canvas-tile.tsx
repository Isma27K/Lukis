"use client"

import { PlusIcon } from "lucide-react"

import { useNewDrawing } from "@/components/dashboard/use-new-drawing"

// The first tile in the grid: an empty sheet on the editor's dot grid that
// starts a drawing. Sized like a drawing card so the grid lines up.
function BlankCanvasTile({ workspaceId }: { workspaceId: string }) {
  const { open, pending } = useNewDrawing(workspaceId)

  return (
    <li>
      <button
        type="button"
        onClick={open}
        disabled={pending}
        className="group/blank flex size-full flex-row items-center overflow-hidden rounded-xl border border-dashed border-[color-mix(in_oklch,var(--input),var(--foreground)_12%)] text-left transition-[border-color,background-color] duration-200 hover:border-primary-edge hover:bg-card disabled:opacity-60 sm:flex-col sm:items-stretch"
      >
        <span className="flex shrink-0 items-center justify-center p-3 sm:aspect-video sm:w-full sm:dot-grid sm:p-0">
          <span className="flex size-11 items-center justify-center rounded-full border bg-card text-foreground shadow-paper transition-[color,translate,box-shadow] duration-200 ease-out-expo group-hover/blank:text-primary-ink group-hover/blank:shadow-lift motion-safe:group-hover/blank:-translate-y-0.5">
            <PlusIcon className="size-5" />
          </span>
        </span>
        <span className="flex flex-col py-3 pr-3.5 sm:px-3.5">
          <span className="text-sm font-semibold">
            {pending ? "Opening…" : "Blank canvas"}
          </span>
          <span className="text-xs text-muted-foreground">
            Start from scratch
          </span>
        </span>
      </button>
    </li>
  )
}

export { BlankCanvasTile }
