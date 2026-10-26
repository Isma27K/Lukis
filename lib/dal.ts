import "server-only"

import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"

import { SESSION_COOKIE, type User } from "@/lib/auth"
import { backendUrl } from "@/lib/backend"
import type { Drawing, DrawingSummary, Scene, Workspace } from "@/lib/types"

async function sessionHeaders(): Promise<HeadersInit | undefined> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return token ? { cookie: `${SESSION_COOKIE}=${token}` } : undefined
}

// The real auth check (proxy.ts only looks for the cookie). Cached per render,
// so layouts and pages can all call it.
const getCurrentUser = cache(async (): Promise<User | null> => {
  const headers = await sessionHeaders()
  if (!headers) {
    return null
  }

  const response = await fetch(`${backendUrl}/auth/me`, {
    headers,
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

// Reads from the backend as the current user. A lost session goes to /login;
// anything the user can't see renders the not-found page.
async function backendGet<T>(path: string): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    headers: await sessionHeaders(),
    cache: "no-store",
  })
  if (response.status === 401) {
    redirect("/login")
  }
  if (response.status === 404) {
    notFound()
  }
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`)
  }
  return response.json()
}

const getWorkspaces = cache(() => backendGet<Workspace[]>("/workspaces"))

const getDrawings = cache((workspaceId: string) =>
  backendGet<DrawingSummary[]>(
    `/workspaces/${encodeURIComponent(workspaceId)}/drawings`
  )
)

const getDrawing = cache((drawingId: string) =>
  backendGet<Drawing>(`/drawings/${encodeURIComponent(drawingId)}`)
)

function getScene(drawingId: string) {
  return backendGet<Scene>(`/drawings/${encodeURIComponent(drawingId)}/scene`)
}

export {
  getCurrentUser,
  getDrawing,
  getDrawings,
  getScene,
  getWorkspaces,
  requireUser,
}
