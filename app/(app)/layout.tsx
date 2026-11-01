import type { Metadata } from "next"

import { requireUser } from "@/lib/dal"

// Everything in here is behind a login; none of it belongs in search results.
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireUser()
  return children
}
