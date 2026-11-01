"use client"

import Link from "next/link"

import { OAuthButtons } from "@/components/auth/oauth-buttons"
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
import type { OAuthProvider } from "@/lib/types"

function LoginForm({
  next,
  canResetPassword,
  canRegister,
  providers,
  invite,
  oauthError,
}: {
  next: string
  // Resetting needs email, which the server may not have set up.
  canResetPassword: boolean
  // False while sign-up is invite-only, unless an invite brought them here.
  canRegister: boolean
  // Google, GitHub, Microsoft: whichever the server has set up.
  providers: OAuthProvider[]
  // The invite that brought them here, so a first login with a provider can
  // sign them up with it.
  invite: string | null
  // Why logging in with a provider didn't work, from ?oauth_error=.
  oauthError?: string
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
      <CardContent className="flex flex-col gap-4">
        <OAuthButtons
          providers={providers}
          next={next}
          invite={invite}
          page="login"
          error={oauthError}
        />
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
      {canRegister && (
        <CardFooter className="text-muted-foreground">
          No account yet?&nbsp;
          <Link href={registerHref} className="text-foreground underline">
            Create one
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

export { LoginForm }
