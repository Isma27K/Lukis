import type { Metadata } from "next"
import Link from "next/link"

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
import { getInvitePreview, requireUser } from "@/lib/dal"
import { ROLE_LABELS } from "@/lib/roles"

export const metadata: Metadata = { title: "Invitation" }

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const [user, invite] = await Promise.all([
    requireUser(),
    getInvitePreview(token),
  ])

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
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
              <Link href="/" className="text-xs underline">
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
    </main>
  )
}
