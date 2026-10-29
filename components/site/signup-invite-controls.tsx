"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InviteLink } from "@/components/workspace/invite-controls"
import { apiFetch, errorMessage } from "@/lib/api"
import type { CreatedSignupInvite } from "@/lib/types"

function SignupInviteForm({
  emailed,
}: {
  // Whether the server emails invites; otherwise the link is the only way.
  emailed: boolean
}) {
  const router = useRouter()
  const [created, setCreated] = useState<{
    email: string
    link: string
    emailed: boolean
  }>()
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = String(new FormData(form).get("email"))
    startTransition(async () => {
      try {
        const invite = await apiFetch<CreatedSignupInvite>("/site/invites", {
          method: "POST",
          body: { email },
        })
        const query = new URLSearchParams({ invite: invite.token })
        setCreated({
          email: invite.email,
          link: `${window.location.origin}/register?${query}`,
          emailed,
        })
        setError(undefined)
        form.reset()
        router.refresh()
      } catch (error) {
        setError(errorMessage(error))
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={submit}
        className="flex flex-col gap-2 sm:flex-row sm:items-start"
      >
        <Field data-invalid={!!error}>
          <Input
            name="email"
            type="email"
            placeholder="name@example.com"
            aria-label="Email to invite"
            required
            aria-invalid={!!error}
          />
          {error && <FieldError>{error}</FieldError>}
        </Field>
        <Button type="submit" disabled={pending}>
          {emailed ? "Send invite" : "Create invite link"}
        </Button>
      </form>
      {created && <InviteLink {...created} />}
    </div>
  )
}

function RevokeSignupInviteButton({ inviteId }: { inviteId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function revoke() {
    startTransition(async () => {
      try {
        await apiFetch(`/site/invites/${inviteId}`, { method: "DELETE" })
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={revoke} disabled={pending}>
      Revoke
    </Button>
  )
}

export { RevokeSignupInviteButton, SignupInviteForm }
