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

function PublicLinksSwitch({ on }: { on: boolean }) {
  const router = useRouter()
  // Flips straight away, and back if saving fails.
  const [checked, setChecked] = useState(on)
  const [pending, startTransition] = useTransition()

  function change(value: boolean) {
    setChecked(value)
    startTransition(async () => {
      try {
        const settings = await apiFetch<SiteSettings>("/site/settings", {
          method: "PATCH",
          body: { public_links: value },
        })
        toast.success(
          settings.public_links
            ? "Drawings can be shared through public links"
            : "Public links are off everywhere"
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
        <FieldLabel htmlFor="public-links">Public links</FieldLabel>
        <FieldDescription>
          Lets people share a drawing with anyone who has its link, no account
          needed. Turning this off stops every public link working at once;
          turning it back on brings back the ones that were on.
        </FieldDescription>
      </FieldContent>
      {/* A native button, so the sibling label above names it. */}
      <Switch
        id="public-links"
        nativeButton
        render={<button type="button" />}
        checked={checked}
        onCheckedChange={change}
        disabled={pending}
      />
    </Field>
  )
}

export { PublicLinksSwitch }
