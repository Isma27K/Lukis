"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiFetch, errorMessage } from "@/lib/api"
import type { DrawingSummary } from "@/lib/types"

function RenameDrawingDialog({
  drawing,
  open,
  onOpenChange,
}: {
  drawing: DrawingSummary
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function rename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = new FormData(event.currentTarget).get("title")
    startTransition(async () => {
      try {
        await apiFetch(`/drawings/${drawing.id}`, {
          method: "PATCH",
          body: { title },
        })
        onOpenChange(false)
        router.refresh()
      } catch (error) {
        setError(errorMessage(error))
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setError(undefined)
        onOpenChange(open)
      }}
    >
      <DialogContent>
        <form onSubmit={rename} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Rename drawing</DialogTitle>
          </DialogHeader>
          <Field data-invalid={!!error}>
            <Input
              name="title"
              aria-label="Title"
              defaultValue={drawing.title}
              required
              maxLength={120}
              autoFocus
              aria-invalid={!!error}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { RenameDrawingDialog }
