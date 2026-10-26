"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiFetch, errorMessage } from "@/lib/api"
import type { DrawingSummary } from "@/lib/types"

function DeleteDrawingDialog({
  drawing,
  open,
  onOpenChange,
}: {
  drawing: DrawingSummary
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function remove() {
    startTransition(async () => {
      try {
        await apiFetch(`/drawings/${drawing.id}`, { method: "DELETE" })
        onOpenChange(false)
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{drawing.title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            It will be removed from this workspace for everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={remove}
            disabled={pending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteDrawingDialog }
