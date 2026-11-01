import type { OAuthProvider } from "@/lib/types"

const PROVIDERS: OAuthProvider[] = ["google", "github", "microsoft"]

const PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: "Google",
  github: "GitHub",
  microsoft: "Microsoft",
}

function isProvider(value: unknown): value is OAuthProvider {
  return PROVIDERS.includes(value as OAuthProvider)
}

// The page that starts logging in with a provider. A plain <a>, never
// next/link: prefetching it would start a login. Problems come back to
// `page` as ?oauth_error=, keeping `next` and `invite`.
function oauthStartHref(
  provider: OAuthProvider,
  {
    next,
    invite,
    page,
  }: { next: string; invite?: string | null; page: "login" | "register" }
) {
  const params = new URLSearchParams()
  if (next !== "/") {
    params.set("next", next)
  }
  if (invite) {
    params.set("invite", invite)
  }
  if (page === "register") {
    params.set("page", page)
  }
  const query = params.size ? `?${params}` : ""
  return `/api/auth/oauth/${provider}/start${query}`
}

// What went wrong, from the codes the backend sends back
// (OAuthErrorCode in ../backend/function/oauth.py). Only codes come in the
// URL, so a crafted link can't put its own words on the page.
function oauthErrorMessage(
  code: string | string[] | undefined,
  provider: string | string[] | undefined
) {
  if (typeof code !== "string" || !code) {
    return undefined
  }
  const name = isProvider(provider) ? PROVIDER_LABELS[provider] : "that account"
  const connectLater = `Log in with your password, then connect ${name} under Your account.`
  const messages: Record<string, string> = {
    unavailable: `Logging in with ${name} isn't set up on this server.`,
    denied: `Logging in with ${name} was cancelled.`,
    expired:
      "That took too long, or finished in a different browser. Please try again.",
    rate_limited: "Too many attempts. Wait a few minutes, then try again.",
    no_email: `Your ${name} account has no verified email address to sign up with.`,
    email_taken: `There's already a Lukis account with your ${name} email address. ${connectLater}`,
    setup:
      "Lukis isn't set up yet. Create the first account with an email, a password and the setup code.",
    invite_only: `No Lukis account uses this ${name} account, and sign-up is invite-only. Already have an account? ${connectLater}`,
    invite_mismatch: `This invite is for a different email address than your ${name} account's.`,
    linked_elsewhere: `That ${name} account is already connected to a different Lukis account.`,
    already_linked: `You've already connected a different ${name} account. Disconnect it first.`,
  }
  return messages[code] ?? `Couldn't log you in with ${name}. Please try again.`
}

export {
  PROVIDER_LABELS,
  PROVIDERS,
  isProvider,
  oauthErrorMessage,
  oauthStartHref,
}
