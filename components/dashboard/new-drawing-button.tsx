"use client"

import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { apiFetch, errorMessage } from "@/lib/api"
import type { Drawing } from "@/lib/types"

function NewDrawingButton({ workspaceId }: { workspaceId: string }) {
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

  return (
    <Button onClick={create} disabled={pending}>
      <PlusIcon data-icon="inline-start" />
      New drawing
    </Button>
  )
}

export { NewDrawingButton }
