import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE } from "@/lib/auth"

// Pages that work without a session: the login pages and links opened from
// emails.
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]
// Public links to drawings: /s/<token>.
const PUBLIC_PREFIXES = ["/s/"]

// A cheap first pass: sends visitors with no session cookie to /login before
// anything renders. Whether the session is valid is checked by getCurrentUser
// in lib/dal.ts.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    request.cookies.has(SESSION_COOKIE)
  ) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  if (pathname !== "/") {
    loginUrl.searchParams.set("next", pathname + search)
  }
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|fonts|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|manifest.webmanifest).*)",
  ],
}
