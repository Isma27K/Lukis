import type { Metadata } from "next"

import { VerifyEmail } from "@/components/auth/verify-email"
import { safeRedirectPath } from "@/lib/auth"
import { getCurrentUser } from "@/lib/dal"

export const metadata: Metadata = { title: "Confirm your email" }

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
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <VerifyEmail
          token={typeof token === "string" && token ? token : null}
          continueTo={safeRedirectPath(next)}
          loggedIn={user !== null}
          alreadyVerified={user?.email_verified ?? false}
        />
      </div>
    </main>
  )
}
