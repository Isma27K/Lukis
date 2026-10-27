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

export { SESSION_COOKIE, safeRedirectPath }
export type { User }
