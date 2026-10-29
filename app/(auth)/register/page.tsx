import type { Metadata } from "next"

import { InviteOnly } from "@/components/auth/invite-only"
import { RegisterForm } from "@/components/auth/register-form"
import { inviteToken, safeRedirectPath } from "@/lib/auth"
import { getFeatures, getSignupInvitePreview } from "@/lib/dal"

export const metadata: Metadata = { title: "Create account" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[]
    invite?: string | string[]
  }>
}) {
  const params = await searchParams
  const next = safeRedirectPath(params.next)
  const token = inviteToken(params.invite, next)
  const [{ registration }, invite] = await Promise.all([
    getFeatures(),
    token ? getSignupInvitePreview(token) : null,
  ])

  // The backend refuses these sign-ups anyway; this just says so up front.
  if (registration === "invite_only" && !invite) {
    return <InviteOnly next={next} hadInvite={token !== null} />
  }
  return (
    <RegisterForm
      next={next}
      setupRequired={registration === "setup"}
      invite={token && invite ? { token, email: invite.email } : undefined}
    />
  )
}
