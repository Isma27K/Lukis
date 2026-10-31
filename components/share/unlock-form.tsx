"use client"

import { useRouter } from "next/navigation"
import { useId, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiFetch, errorMessage } from "@/lib/api"

// Asks for a public link's password. The backend answers with a cookie that
// keeps this browser unlocked, so the page just loads again.
function UnlockForm({ token }: { token: string }) {
  const router = useRouter()
  const inputId = useId()
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const password = String(new FormData(event.currentTarget).get("password"))
    startTransition(async () => {
      try {
        await apiFetch(`/share/${encodeURIComponent(token)}/unlock`, {
          method: "POST",
          body: { password },
        })
        router.refresh()
      } catch (error) {
        setError(errorMessage(error))
      }
    })
  }

  return (
    // POST even before the page's script runs, so a password typed early
    // never ends up in the URL.
    <form method="post" onSubmit={submit} className="flex flex-col gap-4">
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={inputId}>Password</FieldLabel>
        <Input
          id={inputId}
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="off"
          maxLength={128}
          aria-invalid={!!error}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
      <Button type="submit" disabled={pending}>
        Open the drawing
      </Button>
    </form>
  )
}

export { UnlockForm }
