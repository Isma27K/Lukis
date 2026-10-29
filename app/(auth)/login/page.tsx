import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"
import { inviteToken, safeRedirectPath } from "@/lib/auth"
import { getFeatures } from "@/lib/dal"

export const metadata: Metadata = { title: "Log in" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const next = safeRedirectPath((await searchParams).next)
  const { email, registration } = await getFeatures()
  return (
    <LoginForm
      next={next}
      canResetPassword={email}
      // Someone sent here by an invite may be allowed to sign up with it;
      // the sign-up page checks.
      canRegister={
        registration !== "invite_only" || inviteToken(undefined, next) !== null
      }
    />
  )
}
