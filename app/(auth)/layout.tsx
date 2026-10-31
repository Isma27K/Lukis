import { redirect } from "next/navigation"

import { AuthShell } from "@/components/brand/auth-shell"
import { CollabScene } from "@/components/illustrations/collab-scene"
import { getCurrentUser } from "@/lib/dal"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (await getCurrentUser()) {
    redirect("/")
  }

  return <AuthShell scene={<CollabScene />}>{children}</AuthShell>
}
