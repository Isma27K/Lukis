import type { Metadata } from "next"

import { DrawingThumbnail } from "@/components/dashboard/drawing-thumbnail"
import {
  DeleteForeverButton,
  RestoreDrawingButton,
} from "@/components/dashboard/trash-controls"
import { EmptyState } from "@/components/empty-state"
import { EmptyTrash } from "@/components/illustrations/spots"
import { PageHeader } from "@/components/workspace/page-header"
import { PageHero } from "@/components/workspace/page-hero"
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
      <PageHeader
        crumbs={[
          { label: workspace.name, href: `/w/${workspace.id}` },
          { label: "Trash" },
        ]}
      />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8">
        <PageHero title="Trash">
          <span>
            Drawings here are hidden from everyone in {workspace.name}.
            Restoring one brings it back as it was.
            {!canManage &&
              " Only owners and admins can delete drawings or restore them."}
          </span>
        </PageHero>
        {drawings.length === 0 ? (
          <EmptyState
            illustration={<EmptyTrash className="w-64" />}
            title="The trash is empty"
          />
        ) : (
          <ul className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card shadow-paper">
            {drawings.map((drawing) => (
              <li
                key={drawing.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2.5"
              >
                <DrawingThumbnail
                  drawing={drawing}
                  className="w-24 shrink-0 rounded-sm border opacity-75 grayscale"
                />
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
                  <div className="flex items-center gap-2">
                    <RestoreDrawingButton drawing={drawing} />
                    <DeleteForeverButton drawing={drawing} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
