import Link from "next/link"

import { LogoutButton } from "@/components/auth/logout-button"
import type { User } from "@/lib/auth"

function AppHeader({ user }: { user: User }) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <Link href="/" className="text-sm font-medium">
        Lukis
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{user.email}</span>
        <LogoutButton />
      </div>
    </header>
  )
}

export { AppHeader }
