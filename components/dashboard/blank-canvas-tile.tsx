"use client"

import { PlusIcon } from "lucide-react"

import { useCreateDrawing } from "@/components/dashboard/use-create-drawing"
import { SketchFrame } from "@/components/sketch/sketch-frame"

// The first tile in the grid: an empty, dashed sheet that starts a drawing.
// Sized like a drawing card so the grid lines up.
function BlankCanvasTile({ workspaceId }: { workspaceId: string }) {
  const { create, pending } = useCreateDrawing(workspaceId)

  return (
    <li className="motion-safe:animate-pop">
      <button
        type="button"
        onClick={create}
        disabled={pending}
        className="group/blank flex w-full flex-col gap-3 text-left outline-none disabled:opacity-60"
      >
        <span className="relative block rounded-lg p-2 transition-colors group-hover/blank:bg-card/60 group-focus-visible/blank:ring-3 group-focus-visible/blank:ring-ring/50">
          <span className="flex aspect-video flex-col items-center justify-center gap-1 text-muted-foreground transition-colors group-hover/blank:text-primary">
            <PlusIcon className="size-8" />
            <span className="font-hand text-2xl">
              {pending ? "Opening…" : "Blank canvas"}
            </span>
          </span>
          <SketchFrame
            seed={5}
            ratio={1.6}
            dashed
            tone="muted"
            className="transition-colors group-hover/blank:text-primary"
          />
        </span>
        <span className="px-1 text-xs text-muted-foreground">
          Start from scratch
        </span>
      </button>
    </li>
  )
}

export { BlankCanvasTile }
