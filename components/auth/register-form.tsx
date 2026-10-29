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

function RegisterForm({
  next,
  setupRequired,
  invite,
}: {
  next: string
  // A fresh install: the first account needs the code from the server logs,
  // and becomes the site owner.
  setupRequired: boolean
  // The invite link being signed up through, which fixes the email.
  invite?: { token: string; email: string }
}) {
  const [state, formAction, pending] = useAuthSubmit("/auth/register", next)
  const loginHref =
    next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {setupRequired ? "Set up Lukis" : "Create your account"}
        </CardTitle>
        <CardDescription>
          {setupRequired
            ? "Create the first account. It becomes the site owner, who decides who else can sign up."
            : "Start drawing in Lukis."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          {/* The confirmation email links back here, e.g. to an invite. */}
          {next !== "/" && <input type="hidden" name="next" value={next} />}
          {invite && (
            <input type="hidden" name="invite_token" value={invite.token} />
          )}
          <FieldGroup>
            <TextField
              label="Name"
              name="name"
              autoComplete="name"
              required
              maxLength={64}
              defaultValue={state.values?.name}
              error={state.fieldErrors?.name}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              readOnly={!!invite}
              defaultValue={invite?.email ?? state.values?.email}
              description={invite && "The invite is for this address only."}
              error={state.fieldErrors?.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              description="At least 8 characters."
              error={state.fieldErrors?.password}
            />
            {setupRequired && (
              <TextField
                label="Setup code"
                name="setup_code"
                autoComplete="off"
                spellCheck={false}
                required
                maxLength={64}
                defaultValue={state.values?.setup_code}
                description="Printed in the server logs when it starts. Run: docker compose logs backend"
                error={state.fieldErrors?.setup_code}
              />
            )}
            {state.error && <FieldError>{state.error}</FieldError>}
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="text-muted-foreground">
        Already have an account?&nbsp;
        <Link href={loginHref} className="text-foreground underline">
          Log in
        </Link>
      </CardFooter>
    </Card>
  )
}

export { RegisterForm }
