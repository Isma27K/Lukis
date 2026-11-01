"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiFetch, errorMessage } from "@/lib/api"

// Asks for the password (or, for accounts without one, the email address
// typed out), then deletes the account for good. The backend refuses while
// the user is the last owner of a workspace others are in, and says which.
function DeleteAccountButton({
  disabled,
  hasPassword,
  email,
}: {
  disabled: boolean
  hasPassword: boolean
  email: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const confirmation = new FormData(event.currentTarget).get("confirmation")
    startTransition(async () => {
      try {
        await apiFetch("/account/delete", {
          method: "POST",
          body: hasPassword
            ? { password: confirmation }
            : { email: confirmation },
        })
      } catch (error) {
        setError(errorMessage(error))
        return
      }
      toast.success("Your account was deleted")
      router.replace("/login")
      router.refresh()
    })
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        Delete account
      </Button>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setError(undefined)
          setOpen(open)
        }}
      >
        <DialogContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                Your personal drawings and workspaces only you are in are
                deleted for good. This can&apos;t be undone.
              </DialogDescription>
            </DialogHeader>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="delete-confirmation">
                {hasPassword ? (
                  "Enter your password to confirm"
                ) : (
                  <span>
                    Type <span className="font-semibold">{email}</span> to
                    confirm
                  </span>
                )}
              </FieldLabel>
              <Input
                id="delete-confirmation"
                name="confirmation"
                type={hasPassword ? "password" : "text"}
                autoComplete={hasPassword ? "current-password" : "off"}
                spellCheck={false}
                required
                maxLength={hasPassword ? 128 : 320}
                autoFocus
                aria-invalid={!!error}
              />
              {error && <FieldError>{error}</FieldError>}
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Keep my account
              </DialogClose>
              <Button type="submit" variant="destructive" disabled={pending}>
                {pending ? "Deleting…" : "Delete my account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { DeleteAccountButton }
