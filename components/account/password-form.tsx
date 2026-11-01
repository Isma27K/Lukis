"use client"

import { useRouter } from "next/navigation"
import { useActionState, useState } from "react"
import { toast } from "sonner"

import { TextField } from "@/components/auth/text-field"
import { Button } from "@/components/ui/button"
import { FieldError, FieldGroup } from "@/components/ui/field"
import { ApiError, apiFetch, errorMessage } from "@/lib/api"

type State = { error?: string; currentError?: string; newError?: string }

// Changing the password logs out every other device; this one carries on.
// Accounts made with Google and the like set their first one without
// entering a current one.
function PasswordForm({
  email,
  emailOn,
  hasPassword,
}: {
  email: string
  emailOn: boolean
  hasPassword: boolean
}) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    async (_state: State, formData: FormData): Promise<State> => {
      try {
        await apiFetch("/account/password", {
          method: "POST",
          body: {
            current_password: formData.get("current_password") ?? undefined,
            new_password: formData.get("new_password"),
          },
        })
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) {
          return { currentError: error.message }
        }
        if (error instanceof ApiError && error.fieldErrors.new_password) {
          return { newError: error.fieldErrors.new_password }
        }
        return { error: errorMessage(error) }
      }
      toast.success(
        hasPassword
          ? "Password changed. Other devices were logged out."
          : "Password set. You can log in with your email now too."
      )
      router.refresh()
      return {}
    },
    {}
  )

  return (
    <form action={formAction}>
      <FieldGroup>
        {/* Lets password managers file the new password under this account. */}
        <input
          type="email"
          name="username"
          autoComplete="username"
          value={email}
          readOnly
          hidden
        />
        {hasPassword && (
          <TextField
            label="Current password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
            error={state.currentError}
          />
        )}
        <TextField
          label={hasPassword ? "New password" : "Password"}
          name="new_password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          description="At least 8 characters. Other devices are logged out."
          error={state.newError}
        />
        {state.error && <FieldError>{state.error}</FieldError>}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : hasPassword
                ? "Change password"
                : "Set password"}
          </Button>
          {emailOn && hasPassword && <ResetLinkButton email={email} />}
        </div>
      </FieldGroup>
    </form>
  )
}

// For when the current password is forgotten: the usual emailed reset.
function ResetLinkButton({ email }: { email: string }) {
  const [pending, setPending] = useState(false)

  async function send() {
    setPending(true)
    try {
      await apiFetch("/auth/password-reset", {
        method: "POST",
        body: { email },
      })
      toast.success(`Sent a reset link to ${email}.`)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="link"
      className="h-auto px-0"
      onClick={send}
      disabled={pending}
    >
      {pending ? "Sending…" : "Forgot it? Email me a reset link"}
    </Button>
  )
}

export { PasswordForm }
