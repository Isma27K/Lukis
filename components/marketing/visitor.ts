import "server-only"

import { cache } from "react"

import { getCurrentUser, getFeatures } from "@/lib/dal"

// Who's looking at a public page. These pages must still render while the
// backend is down, so a failure counts as a logged-out visitor on a site
// that's open for sign-up.
const getVisitor = cache(async () => {
  const [user, features] = await Promise.all([
    getCurrentUser().catch(() => null),
    getFeatures().catch(() => null),
  ])
  return {
    user,
    // While sign-up is invite-only, "Start drawing" would lead nowhere.
    canRegister: features?.registration !== "invite_only",
    providers: features?.oauth_providers ?? [],
  }
})

type Visitor = Awaited<ReturnType<typeof getVisitor>>

export { getVisitor }
export type { Visitor }
