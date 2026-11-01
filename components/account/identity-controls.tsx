"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { apiFetch, errorMessage } from "@/lib/api"
import { PROVIDER_LABELS } from "@/lib/oauth"
import type { OAuthProvider } from "@/lib/types"

// Sends the browser to the provider to pick an account. It comes back to
// /account?connected=<provider>, or ?oauth_error= (see OAuthNotice).
function ConnectButton({ provider }: { provider: OAuthProvider }) {
  const [pending, startTransition] = useTransition()
  const [leaving, setLeaving] = useState(false)

  // Coming back with the browser's Back button restores this page as it was
  // left, still "Opening…".
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setLeaving(false)
      }
    }
    window.addEventListener("pageshow", reset)
    return () => window.removeEventListener("pageshow", reset)
  }, [])

  function connect() {
    startTransition(async () => {
      try {
        const { url } = await apiFetch<{ url: string }>(
          `/auth/oauth/${provider}/link`,
          { method: "POST" }
        )
        setLeaving(true)
        window.location.assign(url)
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={connect}
      disabled={pending || leaving}
      aria-label={`Connect ${PROVIDER_LABELS[provider]}`}
    >
      {pending || leaving ? "Opening…" : "Connect"}
    </Button>
  )
}

function DisconnectButton({
  provider,
  disabled,
}: {
  provider: OAuthProvider
  // When it's the only way left to log in.
  disabled: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const name = PROVIDER_LABELS[provider]

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={disabled}
        aria-label={`Disconnect ${name}`}
      >
        Disconnect
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Disconnect ${name}?`}
        description={`You won't be able to log in with this ${name} account any more. You can connect it again later.`}
        confirmLabel="Disconnect"
        onConfirm={async () => {
          await apiFetch(`/account/identities/${provider}`, {
            method: "DELETE",
          })
          toast.success(`Disconnected ${name}`)
          router.refresh()
        }}
      />
    </>
  )
}

export { ConnectButton, DisconnectButton }
