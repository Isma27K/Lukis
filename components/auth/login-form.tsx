"use client"

import Link from "next/link"

import { TextField } from "@/components/auth/text-field"
import { useAuthSubmit } from "@/components/auth/use-auth-submit"
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

function LoginForm({
  next,
  canResetPassword,
}: {
  next: string
  // Resetting needs email, which the server may not have set up.
  canResetPassword: boolean
}) {
  const [state, formAction, pending] = useAuthSubmit("/auth/login", next)
  const registerHref =
    next === "/" ? "/register" : `/register?next=${encodeURIComponent(next)}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Welcome back to Lukis.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state.values?.email}
              error={state.fieldErrors?.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              error={state.fieldErrors?.password}
            />
            {canResetPassword && (
              <Link
                href="/forgot-password"
                className="-mt-3 self-end text-xs text-muted-foreground underline"
              >
                Forgot your password?
              </Link>
            )}
            {state.error && <FieldError>{state.error}</FieldError>}
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "Logging in…" : "Log in"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="text-muted-foreground">
        No account yet?&nbsp;
        <Link href={registerHref} className="text-foreground underline">
          Create one
        </Link>
      </CardFooter>
    </Card>
  )
}

export { LoginForm }
