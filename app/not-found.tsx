import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Erased } from "@/components/illustrations/spots"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-4 bg-dot-grid p-6 text-center">
      <Link href="/" aria-label="Lukis home" className="absolute top-6 left-6">
        <Logo />
      </Link>
      <Erased className="w-72" />
      <h1 className="font-hand text-4xl">This page got erased.</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The link may be wrong, or it points into a workspace you&apos;re not
        part of.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-2" })}>
        Back to Lukis
      </Link>
    </main>
  )
}
