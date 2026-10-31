import "server-only"

import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"

import { SESSION_COOKIE, type User } from "@/lib/auth"
import { backendUrl } from "@/lib/backend"
import type {
  Drawing,
  Features,
  Invite,
  InvitePreview,
  ListedDrawing,
  Member,
  Scene,
  ShareInfo,
  SignupInvite,
  SignupInvitePreview,
  SiteSettings,
  TrashedDrawing,
  Workspace,
} from "@/lib/types"

// What this server has switched on. Public, so pages for logged-out visitors
// can use it too.
const getFeatures = cache(async (): Promise<Features> => {
  const response = await fetch(`${backendUrl}/features`, { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`GET /features failed with ${response.status}`)
  }
  return response.json()
})

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
// with `orNull`, a 404 comes back as null instead of rendering the not-found
// page.
async function backendGet<T>(path: string): Promise<T>
async function backendGet<T>(
  path: string,
  options: { orNull: true }
): Promise<T | null>
async function backendGet<T>(path: string, { orNull = false } = {}) {
  const response = await fetch(`${backendUrl}${path}`, {
    headers: await sessionHeaders(),
    cache: "no-store",
  })
  if (response.status === 401) {
    redirect("/login")
  }
  if (response.status === 404) {
    return orNull ? null : notFound()
  }
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`)
  }
  return (await response.json()) as T
}

const getWorkspaces = cache(() => backendGet<Workspace[]>("/workspaces"))

// One of the current user's workspaces, or the not-found page.
const getWorkspace = cache(async (workspaceId: string) => {
  const workspace = (await getWorkspaces()).find(({ id }) => id === workspaceId)
  if (!workspace) {
    notFound()
  }
  return workspace
})

const getMembers = cache((workspaceId: string) =>
  backendGet<Member[]>(`/workspaces/${encodeURIComponent(workspaceId)}/members`)
)

// Admins and owners only; anyone else gets a 403.
function getInvites(workspaceId: string) {
  return backendGet<Invite[]>(
    `/workspaces/${encodeURIComponent(workspaceId)}/invites`
  )
}

// Null when the link is invalid, used up or expired.
function getInvitePreview(token: string) {
  return backendGet<InvitePreview>(`/invites/${encodeURIComponent(token)}`, {
    orNull: true,
  })
}

// Null when the link can't be used to sign up: invalid, used up, expired, or
// a workspace invite from someone other than the site owner. Works logged out.
function getSignupInvitePreview(token: string) {
  return backendGet<SignupInvitePreview>(
    `/auth/signup-invites/${encodeURIComponent(token)}`,
    { orNull: true }
  )
}

// The site owner only; anyone else gets a 403.
function getSiteSettings() {
  return backendGet<SiteSettings>("/site/settings")
}

// The site owner only, likewise.
function getSignupInvites() {
  return backendGet<SignupInvite[]>("/site/invites")
}

const getDrawings = cache((workspaceId: string) =>
  backendGet<ListedDrawing[]>(
    `/workspaces/${encodeURIComponent(workspaceId)}/drawings`
  )
)

function getTrash(workspaceId: string) {
  return backendGet<TrashedDrawing[]>(
    `/workspaces/${encodeURIComponent(workspaceId)}/trash`
  )
}

const getDrawing = cache((drawingId: string) =>
  backendGet<Drawing>(`/drawings/${encodeURIComponent(drawingId)}`)
)

function getScene(drawingId: string) {
  return backendGet<Scene>(`/drawings/${encodeURIComponent(drawingId)}/scene`)
}

// The cookies that unlock password-protected public links; matches
// GRANT_COOKIE_PREFIX in the backend's function/share.py.
const SHARE_GRANT_COOKIE_PREFIX = "lukis_share_"

// Public link pages read as the visitor: their session, if any (so members
// can be sent to the full editor), plus the cookies that unlock links.
async function visitorHeaders(): Promise<HeadersInit | undefined> {
  const forwarded = (await cookies())
    .getAll()
    .filter(
      ({ name }) =>
        name === SESSION_COOKIE || name.startsWith(SHARE_GRANT_COOKIE_PREFIX)
    )
  if (forwarded.length === 0) {
    return undefined
  }
  return {
    cookie: forwarded.map(({ name, value }) => `${name}=${value}`).join("; "),
  }
}

// Like backendGet, but for pages that work logged out: never sends anyone to
// /login. A link that doesn't work (any more) is the not-found page.
async function shareGet<T>(path: string): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    headers: await visitorHeaders(),
    cache: "no-store",
  })
  if (response.status === 404) {
    notFound()
  }
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`)
  }
  return (await response.json()) as T
}

const getShareInfo = cache((token: string) =>
  shareGet<ShareInfo>(`/share/${encodeURIComponent(token)}`)
)

// Only once getShareInfo says the link is unlocked.
function getSharedScene(token: string) {
  return shareGet<Scene>(`/share/${encodeURIComponent(token)}/scene`)
}

export {
  getCurrentUser,
  getDrawing,
  getDrawings,
  getFeatures,
  getInvitePreview,
  getInvites,
  getMembers,
  getScene,
  getSharedScene,
  getShareInfo,
  getSignupInvitePreview,
  getSignupInvites,
  getSiteSettings,
  getTrash,
  getWorkspace,
  getWorkspaces,
  requireUser,
}
