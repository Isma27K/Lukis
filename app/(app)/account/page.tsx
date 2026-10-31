import type { Metadata } from "next"

import { AvatarPicker } from "@/components/account/avatar-picker"
import { DeleteAccountButton } from "@/components/account/delete-account-button"
import { PasswordForm } from "@/components/account/password-form"
import { ProfileForm } from "@/components/account/profile-form"
import { SessionList } from "@/components/account/session-list"
import { SectionNav } from "@/components/section-nav"
import { SiteHeader } from "@/components/site-header"
import { SketchFrame } from "@/components/sketch/sketch-frame"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHero } from "@/components/workspace/page-hero"
import { getFeatures, getSessions, requireUser } from "@/lib/dal"

export const metadata: Metadata = { title: "Your account" }

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "devices", label: "Devices" },
  { id: "danger", label: "Danger zone" },
]

export default async function Page() {
  const [user, features, sessions] = await Promise.all([
    requireUser(),
    getFeatures(),
    getSessions(),
  ])

  return (
    <div className="min-h-svh bg-dot-grid">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <PageHero title="Your account">
          <span>{user.name}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{user.email}</span>
        </PageHero>

        <div className="grid gap-8 lg:grid-cols-[11rem_1fr]">
          <SectionNav sections={SECTIONS} />

          <div className="flex min-w-0 flex-col gap-8">
            <Card id="profile" className="scroll-mt-20">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  How you show up for the people you draw with.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <AvatarPicker user={user} />
                <ProfileForm user={user} emailOn={features.email} />
              </CardContent>
            </Card>

            <Card id="password" className="scroll-mt-20">
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent>
                <PasswordForm email={user.email} emailOn={features.email} />
              </CardContent>
            </Card>

            <Card id="devices" className="scroll-mt-20">
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>
                  Where you&apos;re logged in. Log out anything you don&apos;t
                  recognize, then change your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionList sessions={sessions} />
              </CardContent>
            </Card>

            <section
              id="danger"
              className="relative flex scroll-mt-20 flex-col gap-3 rounded-xl p-6"
            >
              <SketchFrame seed={43} ratio={4} tone="destructive" dashed />
              <h2 className="font-hand text-3xl text-destructive">
                Danger zone
              </h2>
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
                <DeleteAccountButton disabled={user.site_owner} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
