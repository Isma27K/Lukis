"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiFetch, errorMessage } from "@/lib/api"
import { ROLE_LABELS } from "@/lib/roles"
import type { CreatedInvite, Role } from "@/lib/types"

function InviteForm({
  workspaceId,
  roles,
  emailed,
}: {
  workspaceId: string
  // The roles the current user may hand out.
  roles: Role[]
  // Whether the server emails invites; otherwise the link is the only way.
  emailed: boolean
}) {
  const router = useRouter()
  const [role, setRole] = useState<Role>("editor")
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
        const invite = await apiFetch<CreatedInvite>(
          `/workspaces/${workspaceId}/invites`,
          { method: "POST", body: { email, role } }
        )
        setCreated({
          email: invite.email,
          link: `${window.location.origin}/invite/${invite.token}`,
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
        <Select
          items={ROLE_LABELS}
          value={role}
          onValueChange={(value: Role | null) => value && setRole(value)}
        >
          <SelectTrigger className="sm:w-28" aria-label="Role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={pending}>
          {emailed ? "Send invite" : "Create invite link"}
        </Button>
      </form>
      {created && <InviteLink {...created} />}
    </div>
  )
}

// The link to pass on, also when it was emailed, for sending it another way.
function InviteLink({
  email,
  link,
  emailed,
}: {
  email: string
  link: string
  emailed: boolean
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      toast.error("Couldn't copy. Select the link and copy it instead.")
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md bg-muted p-3">
      <p className="text-xs">
        {emailed ? "We emailed this link to " : "Send this link to "}
        <span className="font-medium">{email}</span>
        {emailed ? ". You can also send it yourself." : "."} It works once, for
        that email only, and expires in 7 days.
      </p>
      <div className="flex gap-2">
        <Input
          readOnly
          value={link}
          aria-label="Invite link"
          onFocus={(event) => event.currentTarget.select()}
        />
        <Button variant="outline" onClick={copy}>
          {copied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  )
}

function RevokeInviteButton({
  workspaceId,
  inviteId,
}: {
  workspaceId: string
  inviteId: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function revoke() {
    startTransition(async () => {
      try {
        await apiFetch(`/workspaces/${workspaceId}/invites/${inviteId}`, {
          method: "DELETE",
        })
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

export { InviteForm, RevokeInviteButton }
