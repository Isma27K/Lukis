import { UserPlusIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import {
  DrawingGrid,
  type DrawingSort,
  type DrawingView,
} from "@/components/dashboard/drawing-grid"
import { buttonVariants } from "@/components/ui/button"
import { AvatarStack } from "@/components/user-avatar"
import { PageHeader } from "@/components/workspace/page-header"
import { PageHero } from "@/components/workspace/page-hero"
import {
  getDrawings,
  getFeatures,
  getMembers,
  getWorkspace,
  getWorkspaces,
  requireUser,
} from "@/lib/dal"
import { timeAgo } from "@/lib/format"
import { atLeast, canDeleteDrawings } from "@/lib/roles"

type Props = {
  params: Promise<{ workspaceId: string }>
  searchParams: Promise<{ sort?: string | string[]; view?: string | string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params
  return { title: (await getWorkspace(workspaceId)).name }
}

function count(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

export default async function Page({ params, searchParams }: Props) {
  const { workspaceId } = await params
  const { sort, view } = await searchParams
  const [user, workspaces, workspace, drawings, features] = await Promise.all([
    requireUser(),
    getWorkspaces(),
    getWorkspace(workspaceId),
    getDrawings(workspaceId),
    getFeatures(),
  ])
  const members = workspace.personal ? [] : await getMembers(workspaceId)
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
      <PageHeader crumbs={[{ label: workspace.name }]} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <PageHero
          title={workspace.name}
          actions={
            !workspace.personal && (
              <>
                <AvatarStack
                  people={members.map((m) => ({ id: m.user_id, name: m.name }))}
                />
                {atLeast(workspace.role, "admin") && (
                  <Link
                    href={`/w/${workspace.id}/settings#invite`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <UserPlusIcon data-icon="inline-start" />
                    Invite
                  </Link>
                )}
              </>
            )
          }
        >
          <span>{count(drawings.length, "drawing", "drawings")}</span>
          <span aria-hidden>·</span>
          <span>
            {workspace.personal
              ? "Only you"
              : count(members.length, "person", "people")}
          </span>
        </PageHero>
        <DrawingGrid
          workspaceId={workspace.id}
          drawings={drawings.map((drawing) => ({
            ...drawing,
            editedLabel: timeAgo(drawing.updated_at),
          }))}
          currentUserId={user.id}
          canEdit={canEdit}
          canDelete={canDelete}
          moveTargets={moveTargets}
          publicLinks={features.public_links}
          initialSort={
            sort === "name" || sort === "created"
              ? sort
              : ("edited" as DrawingSort)
          }
          initialView={view === "list" ? "list" : ("grid" as DrawingView)}
        />
      </main>
    </>
  )
}
