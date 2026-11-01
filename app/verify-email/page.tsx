import type { Metadata } from "next"

import { VerifyEmail } from "@/components/auth/verify-email"
import { AuthShell } from "@/components/brand/auth-shell"
import { Envelope } from "@/components/illustrations/spots"
import { safeRedirectPath } from "@/lib/auth"
import { getCurrentUser } from "@/lib/dal"

// Opened from an emailed link with a token in it.
export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
}

// Opened from the email sent at signup, logged in or not, so it sits outside
// both the (auth) and (app) groups.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string | string[]
    next?: string | string[]
  }>
}) {
  const { token, next } = await searchParams
  const user = await getCurrentUser()

  return (
    <AuthShell
      scene={<Envelope className="mx-auto w-96" />}
      heading="Almost there."
      blurb="One click on the link we emailed you and you're in."
    >
      <VerifyEmail
        token={typeof token === "string" && token ? token : null}
        continueTo={safeRedirectPath(next)}
        loggedIn={user !== null}
        alreadyVerified={user?.email_verified ?? false}
      />
    </AuthShell>
  )
}
