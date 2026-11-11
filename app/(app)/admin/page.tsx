import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PublicLinksSwitch } from "@/components/site/public-links-switch"
import { RegistrationSwitch } from "@/components/site/registration-switch"
import {
  RevokeSignupInviteButton,
  SignupInviteForm,
} from "@/components/site/signup-invite-controls"
import { SiteHeader } from "@/components/site-header"
import { SettingsSection } from "@/components/settings-section"
import { UserAvatar } from "@/components/user-avatar"
import { PageHero } from "@/components/workspace/page-hero"
import {
  getFeatures,
  getSignupInvites,
  getSiteSettings,
  requireUser,
} from "@/lib/dal"
import { timeAgo } from "@/lib/format"

export const metadata: Metadata = { title: "Site settings" }

// Settings for the whole site. Only the site owner (the first account) gets
// here; the backend checks that again on every call.
export default async function Page() {
  const user = await requireUser()
  if (!user.site_owner) {
    notFound()
  }
  const [settings, invites, features] = await Promise.all([
    getSiteSettings(),
    getSignupInvites(),
    getFeatures(),
  ])

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
        <PageHero title="Site settings">
          <span>Only you see this page, as the person who set Lukis up.</span>
        </PageHero>

        <div className="flex flex-col gap-6">
          <SettingsSection title="Sign-up">
            <RegistrationSwitch open={settings.registration_open} />
          </SettingsSection>

          <SettingsSection title="Sharing">
            <PublicLinksSwitch on={settings.public_links} />
          </SettingsSection>

          <SettingsSection
            title="Invite people to sign up"
            description={
              <>
                While sign-up is off, an invite from you is the only way to
                create an account. That includes the workspace invites you send;
                other members&apos; workspace invites only work for people who
                already have an account. Each link is for one email address,
                works once and expires after 7 days.
              </>
            }
          >
            <SignupInviteForm emailed={features.email} />
            {invites.length > 0 && (
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium">Pending invites</h3>
                <ul className="flex flex-col divide-y">
                  {invites.map((invite) => (
                    <li
                      key={invite.id}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <UserAvatar name={invite.email} size="sm" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm">{invite.email}</span>
                        <span className="text-xs text-muted-foreground">
                          Expires {timeAgo(invite.expires_at)}
                        </span>
                      </div>
                      <RevokeSignupInviteButton inviteId={invite.id} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </SettingsSection>
        </div>
      </main>
    </div>
  )
}
