"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { apiFetch, errorMessage } from "@/lib/api"

// Confirms the address as soon as the emailed link is opened.
function VerifyEmail({
  token,
  continueTo,
  loggedIn,
  alreadyVerified,
}: {
  token: string | null
  // Where to go next, e.g. back to an invite.
  continueTo: string
  loggedIn: boolean
  alreadyVerified: boolean
}) {
  const [status, setStatus] = useState<"verifying" | "done" | "failed">(
    alreadyVerified ? "done" : token ? "verifying" : "failed"
  )
  const [error, setError] = useState("This link is incomplete.")
  // Links work once; this stops a second request when effects run twice in
  // development.
  const sent = useRef(false)

  useEffect(() => {
    if (status !== "verifying" || sent.current) {
      return
    }
    sent.current = true
    apiFetch("/auth/verify-email", { method: "POST", body: { token } }).then(
      () => setStatus("done"),
      (reason) => {
        setError(errorMessage(reason))
        setStatus("failed")
      }
    )
  }, [status, token])

  const next = loggedIn
    ? continueTo
    : `/login?next=${encodeURIComponent(continueTo)}`

  if (status === "verifying") {
    return (
      <Card>
        <CardHeader>
          <CardTitle as="h1">Confirming your email…</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (status === "done") {
    return (
      <Card>
        <CardHeader>
          <CardTitle as="h1">Email confirmed</CardTitle>
          <CardDescription>
            Thanks! You can now join workspaces you&apos;re invited to.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href={next}
            className={buttonVariants({ size: "lg", className: "w-full" })}
          >
            Continue
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h1">That link didn&apos;t work</CardTitle>
        <CardDescription>
          {error} Links work once, for 48 hours.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        {loggedIn ? (
          <ResendVerificationButton next={continueTo} className="w-full" />
        ) : (
          <Link
            href={next}
            className={buttonVariants({ size: "lg", className: "w-full" })}
          >
            Log in to get a new link
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

function ResendVerificationButton({
  next,
  className,
  variant = "default",
}: {
  // Where the new link leads after confirming.
  next?: string
  className?: string
  variant?: "default" | "link"
}) {
  const [pending, setPending] = useState(false)

  async function resend() {
    setPending(true)
    try {
      await apiFetch("/auth/verify-email/resend", {
        method: "POST",
        body: { next },
      })
      toast.success("Sent a new link. Check your inbox.")
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={variant === "link" ? "sm" : "lg"}
      className={className}
      onClick={resend}
      disabled={pending}
    >
      {pending ? "Sending…" : "Send a new link"}
    </Button>
  )
}

export { ResendVerificationButton, VerifyEmail }
