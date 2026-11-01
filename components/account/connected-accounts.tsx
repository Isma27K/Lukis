import {
  ConnectButton,
  DisconnectButton,
} from "@/components/account/identity-controls"
import { Pill } from "@/components/account/pill"
import { ProviderIcon } from "@/components/auth/provider-icon"
import { timeAgo } from "@/lib/format"
import { PROVIDER_LABELS, PROVIDERS } from "@/lib/oauth"
import type { Identity, OAuthProvider } from "@/lib/types"

// The Google, GitHub and Microsoft accounts the user can log in with. Lists
// the providers the server has set up, plus any connected one that's since
// been switched off, so it can still be disconnected. Rendered on the
// server, so the relative times don't change during hydration.
function ConnectedAccounts({
  available,
  identities,
  hasPassword,
}: {
  available: OAuthProvider[]
  identities: Identity[]
  hasPassword: boolean
}) {
  const connected = new Map(identities.map((i) => [i.provider, i]))
  const shown = PROVIDERS.filter(
    (provider) => available.includes(provider) || connected.has(provider)
  )
  // Nobody gets to lock themselves out.
  const onlyWayIn = !hasPassword && identities.length === 1

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col divide-y">
        {shown.map((provider) => {
          const identity = connected.get(provider)
          const details = identity
            ? [identity.email, `connected ${timeAgo(identity.created_at)}`]
            : ["Not connected"]
          return (
            <li key={provider} className="flex items-center gap-3 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted">
                <ProviderIcon provider={provider} className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {PROVIDER_LABELS[provider]}
                  </span>
                  {identity && <Pill tone="green">Connected</Pill>}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {details.filter(Boolean).join(" · ")}
                </span>
              </div>
              {identity ? (
                <DisconnectButton provider={provider} disabled={onlyWayIn} />
              ) : (
                available.includes(provider) && (
                  <ConnectButton provider={provider} />
                )
              )}
            </li>
          )
        })}
      </ul>
      {onlyWayIn && (
        <p className="text-xs text-muted-foreground">
          It&apos;s the only way you can log in, so it can&apos;t be
          disconnected. Set a password above, or connect another account first.
        </p>
      )}
    </div>
  )
}

export { ConnectedAccounts }
