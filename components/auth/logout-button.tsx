"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"

function LogoutButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function logOut() {
    startTransition(async () => {
      await apiFetch("/auth/logout", { method: "POST" })
      router.replace("/login")
      router.refresh()
    })
  }

  return (
    <Button variant="outline" onClick={logOut} disabled={pending}>
      Log out
    </Button>
  )
}

export { LogoutButton }
