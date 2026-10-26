"use client"

import { useId, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { errorMessage } from "@/lib/api"

// A dialog that asks for one line of text, e.g. a name.
function TextInputDialog({
  open,
  onOpenChange,
  title,
  label,
  defaultValue,
  maxLength,
  submitLabel,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  label: string
  defaultValue?: string
  maxLength?: number
  submitLabel: string
  // Closes the dialog when it resolves; a thrown error shows under the field.
  onSubmit: (value: string) => Promise<void>
}) {
  const inputId = useId()
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = String(new FormData(event.currentTarget).get("value"))
    startTransition(async () => {
      try {
        await onSubmit(value)
        onOpenChange(false)
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
        <form onSubmit={submit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
            <Input
              id={inputId}
              name="value"
              defaultValue={defaultValue}
              required
              maxLength={maxLength}
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
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { TextInputDialog }
