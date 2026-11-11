import type { Metadata } from "next"

import { AvatarPicker } from "@/components/account/avatar-picker"
import { ConnectedAccounts } from "@/components/account/connected-accounts"
import { DeleteAccountButton } from "@/components/account/delete-account-button"
import { OAuthNotice } from "@/components/account/oauth-notice"
import { PasswordForm } from "@/components/account/password-form"
import { ProfileForm } from "@/components/account/profile-form"
import { SessionList } from "@/components/account/session-list"
import { SectionNav } from "@/components/section-nav"
import { SettingsLayout, SettingsSection } from "@/components/settings-section"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/workspace/page-hero"
import { getFeatures, getIdentities, getSessions, requireUser } from "@/lib/dal"
import { isProvider, oauthErrorMessage, PROVIDER_LABELS } from "@/lib/oauth"

export const metadata: Metadata = { title: "Your account" }

export default async function Page({
  searchParams,
}: {
  // Set when a provider sends the browser back after connecting an account.
  searchParams: Promise<{
    connected?: string | string[]
    oauth_error?: string | string[]
    provider?: string | string[]
  }>
}) {
  const [params, user, features, sessions, identities] = await Promise.all([
    searchParams,
    requireUser(),
    getFeatures(),
    getSessions(),
    getIdentities(),
  ])
  // Shown while any provider is set up, or one is still connected.
  const showConnected =
    features.oauth_providers.length > 0 || identities.length > 0
  const sections = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    ...(showConnected
      ? [{ id: "connected", label: "Connected accounts" }]
      : []),
    { id: "devices", label: "Devices" },
    { id: "danger", label: "Danger zone" },
  ]

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
        <PageHero title="Your account">
          <span>{user.name}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{user.email}</span>
        </PageHero>

        <OAuthNotice
          success={
            isProvider(params.connected)
              ? `Connected ${PROVIDER_LABELS[params.connected]}. You can log in with it now.`
              : undefined
          }
          error={oauthErrorMessage(params.oauth_error, params.provider)}
        />

        <SettingsLayout nav={<SectionNav sections={sections} />}>
          <SettingsSection
            id="profile"
            title="Profile"
            description="How you show up for the people you draw with."
          >
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <AvatarPicker user={user} />
              <ProfileForm user={user} emailOn={features.email} />
            </div>
          </SettingsSection>

          <SettingsSection
            id="password"
            title="Password"
            description={
              user.has_password
                ? undefined
                : `You log in with a connected account. Add a password to also log in with ${user.email}.`
            }
          >
            <PasswordForm
              email={user.email}
              emailOn={features.email}
              hasPassword={user.has_password}
            />
          </SettingsSection>

          {showConnected && (
            <SettingsSection
              id="connected"
              title="Connected accounts"
              description="Log in with one click instead of your password."
            >
              <ConnectedAccounts
                available={features.oauth_providers}
                identities={identities}
                hasPassword={user.has_password}
              />
            </SettingsSection>
          )}

          <SettingsSection
            id="devices"
            title="Devices"
            description="Where you're logged in. Log out anything you don't recognize, then change your password."
          >
            <SessionList sessions={sessions} />
          </SettingsSection>

          <SettingsSection id="danger" title="Danger zone" danger>
            {user.site_owner ? (
              <p className="text-sm text-muted-foreground">
                You set this Lukis site up, so your account can&apos;t be
                deleted from here. To hand the site to someone else, run{" "}
                <code className="rounded bg-muted px-1 font-mono text-xs">
                  python -m scripts.site set-owner &lt;email&gt;
                </code>{" "}
                on the server first.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Deleting your account removes your personal workspace,
                workspaces only you are in, their drawings, and your picture.
                Drawings in shared workspaces stay with those workspaces. If
                you&apos;re the last owner of a workspace others are in, make
                someone else an owner first.
              </p>
            )}
            <div>
              <DeleteAccountButton
                disabled={user.site_owner}
                hasPassword={user.has_password}
                email={user.email}
              />
            </div>
          </SettingsSection>
        </SettingsLayout>
      </main>
    </div>
  )
}
