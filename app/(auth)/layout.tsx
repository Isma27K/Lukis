import { redirect } from "next/navigation"

import { PaperPage } from "@/components/brand/paper-page"
import { getCurrentUser } from "@/lib/dal"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (await getCurrentUser()) {
    redirect("/")
  }

  return <PaperPage>{children}</PaperPage>
}
