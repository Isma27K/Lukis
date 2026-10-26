import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/dal"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (await getCurrentUser()) {
    redirect("/")
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  )
}
