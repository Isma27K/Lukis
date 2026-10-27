import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = { title: "Choose a new password" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>
}) {
  const { token } = await searchParams
  if (typeof token !== "string" || !token) {
    redirect("/forgot-password")
  }
  return <ResetPasswordForm token={token} />
}
