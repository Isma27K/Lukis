"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { apiFetch } from "@/lib/api"

// Ends the session, then goes to /login (and on to `next` after logging in).
function useLogOut(next?: string) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function logOut() {
    startTransition(async () => {
      await apiFetch("/auth/logout", { method: "POST" })
      router.replace(
        next ? `/login?next=${encodeURIComponent(next)}` : "/login"
      )
      router.refresh()
    })
  }

  return { logOut, pending }
}

export { useLogOut }
