"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { apiFetch, errorMessage } from "@/lib/api"
import type { TrashedDrawing } from "@/lib/types"

function RestoreDrawingButton({ drawing }: { drawing: TrashedDrawing }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function restore() {
    startTransition(async () => {
      try {
        await apiFetch(`/drawings/${drawing.id}/restore`, { method: "POST" })
        toast.success(`Restored “${drawing.title}”`)
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={restore} disabled={pending}>
      Restore
    </Button>
  )
}

function DeleteForeverButton({ drawing }: { drawing: TrashedDrawing }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Delete forever
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete “${drawing.title}” forever?`}
        description="The drawing and its images will be gone for everyone. This can't be undone."
        confirmLabel="Delete forever"
        onConfirm={async () => {
          await apiFetch(`/drawings/${drawing.id}/permanent`, {
            method: "DELETE",
          })
          router.refresh()
        }}
      />
    </>
  )
}

export { DeleteForeverButton, RestoreDrawingButton }
