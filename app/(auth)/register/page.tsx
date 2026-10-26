import type { Metadata } from "next"

import { RegisterForm } from "@/components/auth/register-form"
import { safeRedirectPath } from "@/lib/auth"

export const metadata: Metadata = { title: "Create account" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  return <RegisterForm next={safeRedirectPath(next)} />
}
