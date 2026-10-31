"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Pill } from "@/components/account/pill"
import { ResendVerificationButton } from "@/components/auth/verify-email"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiFetch, errorMessage } from "@/lib/api"
import type { User } from "@/lib/auth"

// The name others see, and the email the account logs in with.
function ProfileForm({ user, emailOn }: { user: User; emailOn: boolean }) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [pending, startTransition] = useTransition()
  const unchanged = !name.trim() || name.trim() === user.name

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      try {
        await apiFetch("/account", { method: "PATCH", body: { name } })
        toast.success("Name saved")
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <form onSubmit={save} className="flex items-end gap-2">
        <Field>
          <FieldLabel htmlFor="profile-name">Name</FieldLabel>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={64}
            autoComplete="name"
          />
        </Field>
        <Button type="submit" disabled={pending || unchanged}>
          Save
        </Button>
      </form>

      <Field>
        <FieldTitle>Email</FieldTitle>
        <div className="flex flex-wrap items-center gap-2">
          <span className="min-w-0 truncate text-sm">{user.email}</span>
          {emailOn &&
            (user.email_verified ? (
              <Pill tone="green">Confirmed</Pill>
            ) : (
              <Pill tone="yellow">Not confirmed</Pill>
            ))}
        </div>
        <FieldDescription>
          You log in with it
          {emailOn && ", and it's where Lukis sends links and notices"}.
        </FieldDescription>
        {emailOn && !user.email_verified && (
          // Field stretches its direct children; the link stays its own size.
          <div>
            <ResendVerificationButton variant="link" className="h-auto px-0" />
          </div>
        )}
      </Field>
    </div>
  )
}

export { ProfileForm }
