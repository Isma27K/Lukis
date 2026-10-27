"use client"

import Link from "next/link"
import { useActionState } from "react"

import { TextField } from "@/components/auth/text-field"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldError, FieldGroup } from "@/components/ui/field"
import { ApiError, apiFetch, errorMessage } from "@/lib/api"

type State = { done?: boolean; error?: string; passwordError?: string }

function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    async (_state: State, formData: FormData): Promise<State> => {
      try {
        await apiFetch("/auth/password-reset/confirm", {
          method: "POST",
          body: { token, password: formData.get("password") },
        })
        return { done: true }
      } catch (error) {
        if (error instanceof ApiError && error.fieldErrors.password) {
          return { passwordError: error.fieldErrors.password }
        }
        return { error: errorMessage(error) }
      }
    },
    {}
  )

  if (state.done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Password changed</CardTitle>
          <CardDescription>
            You&apos;ve been logged out everywhere. Log in with your new
            password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href="/login"
            className={buttonVariants({ size: "lg", className: "w-full" })}
          >
            Log in
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>
          This logs you out on every device where you&apos;re logged in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <TextField
              label="New password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              description="At least 8 characters."
              error={state.passwordError}
            />
            {state.error && <FieldError>{state.error}</FieldError>}
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "Saving…" : "Change password"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      {state.error && (
        <CardFooter className="text-muted-foreground">
          <Link href="/forgot-password" className="text-foreground underline">
            Get a new link
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

export { ResetPasswordForm }
