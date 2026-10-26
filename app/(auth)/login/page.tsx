import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"
import { safeRedirectPath } from "@/lib/auth"

export const metadata: Metadata = { title: "Log in" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  return <LoginForm next={safeRedirectPath(next)} />
}
