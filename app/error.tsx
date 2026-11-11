"use client"

import Link from "next/link"

import { Smudge } from "@/components/illustrations/spots"
import { StatusPage } from "@/components/status-page"
import { Button, buttonVariants } from "@/components/ui/button"

// Server errors are already logged by instrumentation.ts.
export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <StatusPage
      illustration={<Smudge className="w-60" />}
      title="Something smudged."
      actions={
        <>
          <Button onClick={() => retry()}>Try again</Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Your drawings
          </Link>
        </>
      }
    >
      This page hit an error. Your drawings are saved; try again, or head back
      and pick up from there.
    </StatusPage>
  )
}
