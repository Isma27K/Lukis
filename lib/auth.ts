// Set and cleared by the backend. It's httpOnly, so only server code and
// proxy.ts ever see it.
const SESSION_COOKIE = "lukis_session"

type User = {
  id: string
  email: string
  name: string
  // Whether they followed the link emailed at signup; joining workspaces
  // needs it.
  email_verified: boolean
  // Whether they run the whole site (the first account), as opposed to
  // owning a workspace. Only they see /admin.
  site_owner: boolean
  // Changes with every new profile picture; null without one (see avatarUrl).
  avatar_version: number | null
  // False for accounts made with Google, GitHub or Microsoft until they set
  // one; they set it without a current password, and can't log in with one.
  has_password: boolean
}

// Only allows paths on this site, so a crafted ?next= can't send people
// elsewhere after they log in.
function safeRedirectPath(next: string | string[] | undefined) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return "/"
  }
  return next
}

// The token of an invite link someone is signing up through: `?invite=` from
// a sign-up invite, or the workspace invite they were sent to log in for.
function inviteToken(invite: string | string[] | undefined, next: string) {
  if (typeof invite === "string" && invite) {
    return invite
  }
  return /^\/invite\/([\w-]+)$/.exec(next)?.[1] ?? null
}

export { SESSION_COOKIE, inviteToken, safeRedirectPath }
export type { User }
