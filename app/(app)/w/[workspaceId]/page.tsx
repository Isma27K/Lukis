import type { Metadata } from "next"

import { DrawingCard } from "@/components/dashboard/drawing-card"
import { NewDrawingButton } from "@/components/dashboard/new-drawing-button"
import { PageHeader } from "@/components/workspace/page-header"
import { getDrawings, getWorkspace, getWorkspaces } from "@/lib/dal"
import { timeAgo } from "@/lib/format"
import { atLeast } from "@/lib/roles"

type Props = { params: Promise<{ workspaceId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params
  return { title: (await getWorkspace(workspaceId)).name }
}

export default async function Page({ params }: Props) {
  const { workspaceId } = await params
  const [workspaces, workspace, drawings] = await Promise.all([
    getWorkspaces(),
    getWorkspace(workspaceId),
    getDrawings(workspaceId),
  ])
  const canEdit = atLeast(workspace.role, "editor")
  const moveTargets = workspaces.filter(
    (other) => other.id !== workspace.id && atLeast(other.role, "editor")
  )

  return (
    <>
      <PageHeader title={workspace.name}>
        {canEdit && <NewDrawingButton workspaceId={workspace.id} />}
      </PageHeader>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
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
                moveTargets={moveTargets}
              />
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
