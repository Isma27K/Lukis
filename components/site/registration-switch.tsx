"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { apiFetch, errorMessage } from "@/lib/api"
import type { SiteSettings } from "@/lib/types"

function RegistrationSwitch({ open }: { open: boolean }) {
  const router = useRouter()
  // Flips straight away, and back if saving fails.
  const [checked, setChecked] = useState(open)
  const [pending, startTransition] = useTransition()

  function change(value: boolean) {
    setChecked(value)
    startTransition(async () => {
      try {
        const settings = await apiFetch<SiteSettings>("/site/settings", {
          method: "PATCH",
          body: { registration_open: value },
        })
        toast.success(
          settings.registration_open
            ? "Anyone can sign up now"
            : "Sign-up is invite-only now"
        )
        router.refresh()
      } catch (error) {
        setChecked(!value)
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor="registration-open">Anyone can sign up</FieldLabel>
        <FieldDescription>
          When off, new accounts need an invite from you. People who already
          have an account can still log in.
        </FieldDescription>
      </FieldContent>
      {/* A native button, so the sibling label above names it. */}
      <Switch
        id="registration-open"
        nativeButton
        render={<button type="button" />}
        checked={checked}
        onCheckedChange={change}
        disabled={pending}
      />
    </Field>
  )
}

export { RegistrationSwitch }
