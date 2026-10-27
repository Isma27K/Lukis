"use client"

import Link from "next/link"
import { useActionState } from "react"

import { TextField } from "@/components/auth/text-field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldError, FieldGroup } from "@/components/ui/field"
import { apiFetch, errorMessage } from "@/lib/api"

type State = { sentTo?: string; error?: string; email?: string }

function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (_state: State, formData: FormData): Promise<State> => {
      const email = String(formData.get("email"))
      try {
        await apiFetch("/auth/password-reset", {
          method: "POST",
          body: { email },
        })
        return { sentTo: email }
      } catch (error) {
        return { error: errorMessage(error), email }
      }
    },
    {}
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          {state.sentTo
            ? `If ${state.sentTo} has a Lukis account, we've sent it a link to choose a new password. It works for 1 hour.`
            : "Enter your email and we'll send you a link to choose a new password."}
        </CardDescription>
      </CardHeader>
      {!state.sentTo && (
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={state.email}
              />
              {state.error && <FieldError>{state.error}</FieldError>}
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? "Sending…" : "Send reset link"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      )}
      <CardFooter className="text-muted-foreground">
        Remembered it?&nbsp;
        <Link href="/login" className="text-foreground underline">
          Log in
        </Link>
      </CardFooter>
    </Card>
  )
}

export { ForgotPasswordForm }
