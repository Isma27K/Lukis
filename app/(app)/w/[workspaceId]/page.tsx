import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppHeader } from "@/components/app-header"
import { DrawingCard } from "@/components/dashboard/drawing-card"
import { NewDrawingButton } from "@/components/dashboard/new-drawing-button"
import { getDrawings, getWorkspaces, requireUser } from "@/lib/dal"
import { timeAgo } from "@/lib/format"

type Props = { params: Promise<{ workspaceId: string }> }

async function getWorkspace(workspaceId: string) {
  const workspaces = await getWorkspaces()
  const workspace = workspaces.find(({ id }) => id === workspaceId)
  if (!workspace) {
    notFound()
  }
  return workspace
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params
  return { title: (await getWorkspace(workspaceId)).name }
}

export default async function Page({ params }: Props) {
  const { workspaceId } = await params
  const [user, workspace, drawings] = await Promise.all([
    requireUser(),
    getWorkspace(workspaceId),
    getDrawings(workspaceId),
  ])
  const canEdit = workspace.role !== "viewer"

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium">{workspace.name}</h1>
          {canEdit && <NewDrawingButton workspaceId={workspace.id} />}
        </div>
        {drawings.length === 0 ? (
          <p className="py-16 text-center text-xs text-muted-foreground">
            No drawings yet.
            {canEdit && " Create one to get started."}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drawings.map((drawing) => (
              <DrawingCard
                key={drawing.id}
                drawing={drawing}
                editedLabel={timeAgo(drawing.updated_at)}
                canEdit={canEdit}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
