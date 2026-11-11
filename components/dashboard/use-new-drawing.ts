"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { NEW_DRAWING_PATH } from "@/components/editor/drawing-target"

// Opens a blank canvas in the editor. Nothing is saved in the workspace until
// something is drawn on it or it's given a name (see DrawingTarget).
function useNewDrawing(workspaceId: string) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function open() {
    startTransition(() => {
      router.push(`${NEW_DRAWING_PATH}?w=${encodeURIComponent(workspaceId)}`)
    })
  }

  return { open, pending }
}

export { useNewDrawing }
