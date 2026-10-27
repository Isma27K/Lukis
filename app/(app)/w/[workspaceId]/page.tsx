import type { Metadata } from "next"

import { DrawingGrid } from "@/components/dashboard/drawing-grid"
import { NewDrawingButton } from "@/components/dashboard/new-drawing-button"
import { PageHeader } from "@/components/workspace/page-header"
import { getDrawings, getWorkspace, getWorkspaces } from "@/lib/dal"
import { timeAgo } from "@/lib/format"
import { atLeast, canDeleteDrawings } from "@/lib/roles"

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
  const canDelete = canDeleteDrawings(workspace.role)
  // Moving a drawing out counts as removing it from this workspace.
  const moveTargets = canDelete
    ? workspaces.filter(
        (other) => other.id !== workspace.id && atLeast(other.role, "editor")
      )
    : []

  return (
    <>
      <PageHeader title={workspace.name}>
        {canEdit && <NewDrawingButton workspaceId={workspace.id} />}
      </PageHeader>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
        <DrawingGrid
          drawings={drawings.map((drawing) => ({
            ...drawing,
            editedLabel: timeAgo(drawing.updated_at),
          }))}
          canEdit={canEdit}
          canDelete={canDelete}
          moveTargets={moveTargets}
        />
      </main>
    </>
  )
}
