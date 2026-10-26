"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { useLogOut } from "@/components/auth/use-log-out"
import { Button } from "@/components/ui/button"
import { apiFetch, errorMessage } from "@/lib/api"
import type { Workspace } from "@/lib/types"

function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function accept() {
    startTransition(async () => {
      try {
        const workspace = await apiFetch<Workspace>(
          `/invites/${token}/accept`,
          { method: "POST" }
        )
        router.push(`/w/${workspace.id}`)
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <Button size="lg" className="w-full" onClick={accept} disabled={pending}>
      Join workspace
    </Button>
  )
}

// Logs out and comes back to the invite after logging in as someone else.
function SwitchAccountButton({ token }: { token: string }) {
  const { logOut, pending } = useLogOut(`/invite/${token}`)

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      onClick={logOut}
      disabled={pending}
    >
      Log in with another account
    </Button>
  )
}

export { AcceptInviteButton, SwitchAccountButton }
