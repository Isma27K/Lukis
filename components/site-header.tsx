import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"

// The top bar of pages outside the workspace sidebar, like site settings and
// the account page.
function SiteHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/85 px-6 backdrop-blur-sm">
      <Link href="/" aria-label="Lukis home">
        <Logo />
      </Link>
      <Link
        href="/"
        className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to your drawings
      </Link>
    </header>
  )
}

export { SiteHeader }
