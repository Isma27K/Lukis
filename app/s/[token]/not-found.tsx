import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Erased } from "@/components/illustrations/spots"
import { buttonVariants } from "@/components/ui/button"

// A public link that doesn't work: wrong, turned off, reset or expired.
export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-4 bg-dot-grid p-6 text-center">
      <Link href="/" aria-label="Lukis home" className="absolute top-6 left-6">
        <Logo />
      </Link>
      <Erased className="w-72" />
      <h1 className="font-hand text-4xl">This link doesn&apos;t work.</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Whoever shared it may have turned it off, made a new one, or let it
        expire. Ask them for a fresh link.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-2" })}>
        Go to Lukis
      </Link>
    </main>
  )
}
