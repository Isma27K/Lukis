"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { apiFetch, errorMessage } from "@/lib/api"

// Logs one other device out.
function EndSessionButton({
  sessionId,
  label,
}: {
  sessionId: string
  // The device, for screen readers: "Log out Firefox on Linux".
  label: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function end() {
    startTransition(async () => {
      try {
        await apiFetch(`/account/sessions/${encodeURIComponent(sessionId)}`, {
          method: "DELETE",
        })
        toast.success("Logged that device out")
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={end}
      disabled={pending}
      aria-label={`Log out ${label}`}
    >
      Log out
    </Button>
  )
}

// Logs out everywhere except here.
function EndOtherSessionsButton({ disabled }: { disabled: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        Log out all other devices
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Log out everywhere else?"
        description="Every other device has to log in again. You stay logged in here."
        confirmLabel="Log out other devices"
        onConfirm={async () => {
          await apiFetch("/account/sessions", { method: "DELETE" })
          toast.success("Logged out everywhere else")
          router.refresh()
        }}
      />
    </>
  )
}

export { EndOtherSessionsButton, EndSessionButton }
