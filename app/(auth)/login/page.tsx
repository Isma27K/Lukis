import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"
import { inviteToken, safeRedirectPath } from "@/lib/auth"
import { getFeatures } from "@/lib/dal"
import { oauthErrorMessage } from "@/lib/oauth"

export const metadata: Metadata = { title: "Log in" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[]
    invite?: string | string[]
    oauth_error?: string | string[]
    provider?: string | string[]
  }>
}) {
  const params = await searchParams
  const next = safeRedirectPath(params.next)
  const invite = inviteToken(params.invite, next)
  const { email, registration, oauth_providers } = await getFeatures()
  return (
    <LoginForm
      next={next}
      canResetPassword={email}
      // Someone sent here by an invite may be allowed to sign up with it;
      // the sign-up page checks.
      canRegister={registration !== "invite_only" || invite !== null}
      // Before the site owner exists there's nobody to log in as.
      providers={registration === "setup" ? [] : oauth_providers}
      invite={invite}
      oauthError={oauthErrorMessage(params.oauth_error, params.provider)}
    />
  )
}
