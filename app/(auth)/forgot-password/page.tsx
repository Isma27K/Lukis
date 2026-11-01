import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { getFeatures } from "@/lib/dal"

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
}

export default async function Page() {
  // The reset link goes out by email, so there's nothing to offer without it.
  if (!(await getFeatures()).email) {
    redirect("/login")
  }
  return <ForgotPasswordForm />
}
