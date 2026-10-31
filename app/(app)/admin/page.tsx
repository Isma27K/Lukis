import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { PublicLinksSwitch } from "@/components/site/public-links-switch"
import { RegistrationSwitch } from "@/components/site/registration-switch"
import {
  RevokeSignupInviteButton,
  SignupInviteForm,
} from "@/components/site/signup-invite-controls"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <div className="min-h-svh bg-dot-grid">
      <header className="flex h-16 items-center gap-4 border-b bg-background/85 px-6 backdrop-blur-sm">
        <Link href="/" aria-label="Lukis home">
          <Logo />
        </Link>
        <Link
          href="/"
          className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to your drawings
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8">
        <PageHero title="Site settings">
          <span>Only you see this page, as the person who set Lukis up.</span>
        </PageHero>

        <Card>
          <CardHeader>
            <CardTitle>Sign-up</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistrationSwitch open={settings.registration_open} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <PublicLinksSwitch on={settings.public_links} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite people to sign up</CardTitle>
            <CardDescription>
              While sign-up is off, an invite from you is the only way to create
              an account. That includes the workspace invites you send; other
              members&apos; workspace invites only work for people who already
              have an account. Each link is for one email address, works once
              and expires after 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
