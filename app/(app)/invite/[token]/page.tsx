import type { Metadata } from "next"
import Link from "next/link"

import { ResendVerificationButton } from "@/components/auth/verify-email"
import { AuthShell } from "@/components/brand/auth-shell"
import { CollabScene } from "@/components/illustrations/collab-scene"
import { InviteScene } from "@/components/illustrations/invite-scene"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AcceptInviteButton,
  SwitchAccountButton,
} from "@/components/workspace/invite-response"
import { getFeatures, getInvitePreview, requireUser } from "@/lib/dal"
import { ROLE_LABELS } from "@/lib/roles"

export const metadata: Metadata = {
  title: "Invitation",
  robots: { index: false, follow: false },
}

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const [user, invite, features] = await Promise.all([
    requireUser(),
    getInvitePreview(token),
    getFeatures(),
  ])
  // Joining takes a confirmed address, but only where email is set up.
  const mustConfirmEmail = features.email && !user.email_verified

  return (
    <AuthShell
      scene={
        invite ? (
          <InviteScene
            workspace={invite.workspace_name}
            inviter={invite.invited_by}
          />
        ) : (
          <CollabScene />
        )
      }
      heading={invite ? "Come draw with us." : undefined}
      blurb={
        invite
          ? `${invite.invited_by} saved you a seat in ${invite.workspace_name}.`
          : undefined
      }
    >
      <Card>
        {!invite ? (
          <>
            <CardHeader>
              <CardTitle>Invite not found</CardTitle>
              <CardDescription>
                This link is invalid, was already used, or has expired. Ask
                whoever sent it for a new one.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/" className="text-sm underline">
                Go to your drawings
              </Link>
            </CardFooter>
          </>
        ) : invite.email !== user.email ? (
          <>
            <CardHeader>
              <CardTitle>This invite is for someone else</CardTitle>
              <CardDescription>
                It was sent to {invite.email}, but you&apos;re logged in as{" "}
                {user.email}.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <SwitchAccountButton token={token} />
            </CardFooter>
          </>
        ) : mustConfirmEmail ? (
          <>
            <CardHeader>
              <CardTitle>Confirm your email to join</CardTitle>
              <CardDescription>
                {invite.invited_by} invited you to {invite.workspace_name}.
                First open the link we emailed to {user.email}; it brings you
                back here.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <ResendVerificationButton
                next={`/invite/${token}`}
                className="w-full"
              />
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Join {invite.workspace_name}</CardTitle>
              <CardDescription>
                {invite.invited_by} invited you to join as{" "}
                {ROLE_LABELS[invite.role].toLowerCase()}.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <AcceptInviteButton token={token} />
            </CardFooter>
          </>
        )}
      </Card>
    </AuthShell>
  )
}
