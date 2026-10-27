import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"
import { safeRedirectPath } from "@/lib/auth"
import { getFeatures } from "@/lib/dal"

export const metadata: Metadata = { title: "Log in" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  const { email } = await getFeatures()
  return <LoginForm next={safeRedirectPath(next)} canResetPassword={email} />
}
