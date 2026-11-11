import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AuthShell } from "@/components/brand/auth-shell"
import { CollabScene } from "@/components/illustrations/collab-scene"
import { SharedDrawing } from "@/components/share/shared-drawing"
import { UnlockForm } from "@/components/share/unlock-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { realtimeUrl } from "@/lib/backend"
import { getSharedScene, getShareInfo } from "@/lib/dal"

type Props = { params: Promise<{ token: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const info = await getShareInfo(token)
  return {
    title: info.title ?? "Shared drawing",
    // Shared links are for the people they're sent to, not search engines.
    robots: { index: false, follow: false },
  }
}

// A drawing's public link. Works logged out (see PUBLIC_PREFIXES in proxy.ts).
export default async function Page({ params }: Props) {
  const { token } = await params
  const info = await getShareInfo(token)
  if (info.member_drawing_id) {
    redirect(`/d/${info.member_drawing_id}`)
  }

  if (!info.unlocked) {
    return (
      <AuthShell
        scene={<CollabScene />}
        heading="Someone shared a drawing."
        blurb="It's behind a password. Enter it once and this browser remembers it for a week."
      >
        <Card>
          <CardHeader>
            <CardTitle as="h1">Password, please</CardTitle>
            <CardDescription>
              Whoever shared this drawing protected it with a password. Ask them
              for it if you don&apos;t have it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnlockForm token={token} />
          </CardContent>
        </Card>
      </AuthShell>
    )
  }

  const scene = await getSharedScene(token)
  return (
    <div className="h-svh">
      <SharedDrawing
        token={token}
        info={info}
        scene={scene}
        realtimeUrl={realtimeUrl}
      />
    </div>
  )
}
