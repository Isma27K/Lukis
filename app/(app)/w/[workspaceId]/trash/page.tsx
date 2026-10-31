import type { Metadata } from "next"

import {
  DeleteForeverButton,
  RestoreDrawingButton,
} from "@/components/dashboard/trash-controls"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/workspace/page-header"
import { getTrash, getWorkspace } from "@/lib/dal"
import { timeAgo } from "@/lib/format"
import { canDeleteDrawings } from "@/lib/roles"

type Props = { params: Promise<{ workspaceId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params
  return { title: `${(await getWorkspace(workspaceId)).name} trash` }
}

export default async function Page({ params }: Props) {
  const { workspaceId } = await params
  const [workspace, drawings] = await Promise.all([
    getWorkspace(workspaceId),
    getTrash(workspaceId),
  ])
  const canManage = canDeleteDrawings(workspace.role)

  return (
    <>
      <PageHeader title="Trash" />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <p className="text-sm text-muted-foreground">
          Drawings moved to the trash are hidden from everyone in{" "}
          {workspace.name}. Restoring one brings it back as it was.
          {!canManage &&
            " Only owners and admins can delete drawings or restore them."}
        </p>
        {drawings.length === 0 ? (
          <EmptyState title="The trash is empty" />
        ) : (
          <ul className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card shadow-paper">
            {drawings.map((drawing) => (
              <li
                key={drawing.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold">
                    {drawing.title}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Deleted {timeAgo(drawing.deleted_at)}
                    {drawing.deleted_by && ` by ${drawing.deleted_by}`}
                  </span>
                </div>
                {canManage && (
                  <>
                    <RestoreDrawingButton drawing={drawing} />
                    <DeleteForeverButton drawing={drawing} />
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
