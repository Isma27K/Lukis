"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { apiFetch, errorMessage } from "@/lib/api"
import type { Drawing } from "@/lib/types"

// Creates a blank drawing in the workspace and opens it in the editor.
function useCreateDrawing(workspaceId: string) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function create() {
    startTransition(async () => {
      try {
        const drawing = await apiFetch<Drawing>(
          `/workspaces/${workspaceId}/drawings`,
          { method: "POST", body: {} }
        )
        router.push(`/d/${drawing.id}`)
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return { create, pending }
}

export { useCreateDrawing }
