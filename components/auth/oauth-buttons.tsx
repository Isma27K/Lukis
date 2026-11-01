import { cn } from "cn"

import { ProviderIcon } from "@/components/auth/provider-icon"
import { Strokes } from "@/components/sketch/strokes"
import { buttonVariants } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { oauthStartHref, PROVIDER_LABELS } from "@/lib/oauth"
import { sketch } from "@/lib/sketch"
import type { OAuthProvider } from "@/lib/types"

// "Continue with Google" and the rest, above the email form. Plain links:
// the backend sends the browser on to the provider and back, and a problem
// comes back as ?oauth_error=, shown here as `error`.
function OAuthButtons({
  providers,
  next,
  invite,
  page,
  error,
}: {
  providers: OAuthProvider[]
  next: string
  invite?: string | null
  page: "login" | "register"
  error?: string
}) {
  if (providers.length === 0) {
    // Say why, even if the provider has been switched off since.
    return error ? <FieldError role="alert">{error}</FieldError> : null
  }
  return (
    <div className="flex flex-col gap-3">
      {error && <FieldError role="alert">{error}</FieldError>}
      {providers.map((provider) => (
        <a
          key={provider}
          href={oauthStartHref(provider, { next, invite, page })}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full gap-2.5"
          )}
        >
          <ProviderIcon provider={provider} className="size-[1.125rem]" />
          Continue with {PROVIDER_LABELS[provider]}
        </a>
      ))}
      <OrDivider />
    </div>
  )
}

const LEFT = sketch.line([2, 5], [98, 4], { seed: 71, strokeWidth: 1.5 })
const RIGHT = sketch.line([2, 4], [98, 5], { seed: 72, strokeWidth: 1.5 })

// Two pencil lines with "or" between them.
function OrDivider() {
  return (
    <div className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
      <PencilLine paths={LEFT} />
      <span>or use your email</span>
      <PencilLine paths={RIGHT} />
    </div>
  )
}

function PencilLine({ paths }: { paths: typeof LEFT }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 9"
      preserveAspectRatio="none"
      fill="none"
      className="h-2.5 flex-1 text-muted-foreground/40"
    >
      <Strokes paths={paths} nonScaling />
    </svg>
  )
}

export { OAuthButtons }
