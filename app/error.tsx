"use client"

import Link from "next/link"

import { Smudge } from "@/components/illustrations/spots"
import { Button, buttonVariants } from "@/components/ui/button"

// Server errors are already logged by instrumentation.ts.
export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-dot-grid p-6 text-center">
      <Smudge className="w-72" />
      <h1 className="font-hand text-4xl">Something smudged.</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This page hit an error. Your drawings are saved; try again, or head back
        and pick up from there.
      </p>
      <div className="mt-2 flex gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Your drawings
        </Link>
      </div>
    </main>
  )
}
