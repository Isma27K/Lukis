import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import { SESSION_COOKIE, type User } from "@/lib/auth"
import { backendUrl } from "@/lib/backend"

// The real auth check (proxy.ts only looks for the cookie). Cached per render,
// so layouts and pages can all call it.
const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) {
    return null
  }

  const response = await fetch(`${backendUrl}/auth/me`, {
    headers: { cookie: `${SESSION_COOKIE}=${token}` },
    cache: "no-store",
  })
  if (response.status === 401) {
    return null
  }
  if (!response.ok) {
    throw new Error(`GET /auth/me failed with ${response.status}`)
  }
  return response.json()
})

// For pages that only make sense when logged in.
const requireUser = cache(async (): Promise<User> => {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
})

export { getCurrentUser, requireUser }
