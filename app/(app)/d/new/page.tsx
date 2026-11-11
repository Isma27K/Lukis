import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { Editor } from "@/components/editor/editor"
import { realtimeUrl } from "@/lib/backend"
import { getFeatures, getWorkspace } from "@/lib/dal"
import { atLeast } from "@/lib/roles"

type Props = { searchParams: Promise<{ w?: string | string[] }> }

export const metadata: Metadata = { title: "Untitled" }

// A blank canvas in workspace `w`. It isn't a drawing yet: the editor saves
// it on its first change and moves to /d/<id>, so opening one and leaving
// adds nothing to the workspace.
export default async function Page({ searchParams }: Props) {
  const { w: workspaceId } = await searchParams
  if (typeof workspaceId !== "string") {
    redirect("/")
  }
  const [workspace, features] = await Promise.all([
    getWorkspace(workspaceId),
    getFeatures(),
  ])
  if (!atLeast(workspace.role, "editor")) {
    redirect(`/w/${workspace.id}`)
  }

  return (
    <div className="h-svh">
      <Editor
        source={{
          kind: "new",
          workspaceId: workspace.id,
          role: workspace.role,
          publicLinks: features.public_links,
        }}
        scene={{ elements: [], app_state: {}, rev: 0 }}
        realtimeUrl={realtimeUrl}
      />
    </div>
  )
}
