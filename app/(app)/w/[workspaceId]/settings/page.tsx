import type { Metadata } from "next"

import { Solo } from "@/components/illustrations/spots"
import { SectionNav } from "@/components/section-nav"
import { SketchFrame } from "@/components/sketch/sketch-frame"
import { StickyNote } from "@/components/sketch/sticky-note"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { CreateWorkspaceButton } from "@/components/workspace/create-workspace-button"
import { DeleteWorkspaceButton } from "@/components/workspace/delete-workspace-button"
import {
  InviteForm,
  RevokeInviteButton,
} from "@/components/workspace/invite-controls"
import {
  MemberRoleSelect,
  RemoveMemberButton,
} from "@/components/workspace/member-controls"
import { PageHeader } from "@/components/workspace/page-header"
import { PageHero } from "@/components/workspace/page-hero"
import { RoleBadge } from "@/components/workspace/role-badge"
import { WorkspaceNameForm } from "@/components/workspace/workspace-name-form"
import {
  getFeatures,
  getInvites,
  getMembers,
  getWorkspace,
  requireUser,
} from "@/lib/dal"
import { avatarUrl } from "@/lib/avatar"
import { timeAgo } from "@/lib/format"
import { assignableRoles, atLeast, canManage } from "@/lib/roles"

type Props = { params: Promise<{ workspaceId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params
  return { title: `${(await getWorkspace(workspaceId)).name} settings` }
}

export default async function Page({ params }: Props) {
  const { workspaceId } = await params
  const [user, workspace, features] = await Promise.all([
    requireUser(),
    getWorkspace(workspaceId),
    getFeatures(),
  ])
  const isAdmin = atLeast(workspace.role, "admin")
  const shared = !workspace.personal
  const [members, invites] = await Promise.all([
    shared ? getMembers(workspaceId) : [],
    shared && isAdmin ? getInvites(workspaceId) : [],
  ])
  const roles = assignableRoles(workspace.role)
  const canInvite = shared && isAdmin
  const canDelete = shared && workspace.role === "owner"
  const sections = [
    { id: "general", label: "General" },
    { id: "members", label: "Members" },
    ...(canInvite ? [{ id: "invite", label: "Invite people" }] : []),
    ...(canDelete ? [{ id: "danger", label: "Danger zone" }] : []),
  ]

  return (
    <>
      <PageHeader
        crumbs={[
          { label: workspace.name, href: `/w/${workspace.id}` },
          { label: shared ? "Members & settings" : "Settings" },
        ]}
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <PageHero title={shared ? "Members & settings" : "Settings"}>
          <span>{workspace.name}</span>
          <span aria-hidden>·</span>
          <RoleBadge role={workspace.role} />
        </PageHero>

        <div className="grid gap-8 lg:grid-cols-[11rem_1fr]">
          <SectionNav sections={sections} />

          <div className="flex min-w-0 flex-col gap-8">
            <Card id="general" className="scroll-mt-20">
              <CardHeader>
                <CardTitle>General</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkspaceNameForm workspace={workspace} canEdit={isAdmin} />
              </CardContent>
            </Card>

            {shared ? (
              <Card id="members" className="scroll-mt-20">
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                  <CardDescription>
                    Owners and admins manage members. Editors can change
                    drawings; viewers can only look.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col divide-y">
                    {members.map((member) => {
                      const isSelf = member.user_id === user.id
                      const manageable = canManage(workspace.role, member.role)
                      return (
                        <li
                          key={member.user_id}
                          className="flex items-center gap-3 py-3"
                        >
                          <UserAvatar
                            name={member.name}
                            picture={avatarUrl(
                              member.user_id,
                              member.avatar_version
                            )}
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium">
                              {member.name}
                              {isSelf && " (you)"}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {member.email}
                            </span>
                          </div>
                          {manageable ? (
                            <MemberRoleSelect
                              workspaceId={workspace.id}
                              member={member}
                              roles={roles}
                            />
                          ) : (
                            <RoleBadge role={member.role} />
                          )}
                          {(isSelf || manageable) && (
                            <RemoveMemberButton
                              workspaceId={workspace.id}
                              workspaceName={workspace.name}
                              member={member}
                              isSelf={isSelf}
                            />
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card id="members" className="scroll-mt-20">
                <CardContent className="flex flex-col items-center gap-4 py-4 text-center sm:flex-row sm:text-left">
                  <Solo name={user.name} className="w-48 shrink-0" />
                  <div className="flex flex-col items-center gap-3 sm:items-start">
                    <p className="font-hand text-3xl">Just you in here</p>
                    <p className="text-sm text-muted-foreground">
                      Your personal workspace is only visible to you. To draw
                      with others, create a workspace, invite them and move
                      drawings into it.
                    </p>
                    <CreateWorkspaceButton label="Create a team workspace" />
                  </div>
                </CardContent>
              </Card>
            )}

            {canInvite && (
              <Card
                id="invite"
                className="relative scroll-mt-20 overflow-visible pt-10"
              >
                <StickyNote
                  color="yellow"
                  className="absolute -top-4 left-5 -rotate-2 px-4 py-2"
                >
                  <span className="font-hand text-2xl">Invite people</span>
                </StickyNote>
                <CardHeader>
                  <CardDescription>
                    Each link is for one email address. It works once and
                    expires after 7 days.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <InviteForm
                    workspaceId={workspace.id}
                    roles={roles}
                    emailed={features.email}
                  />
                  {invites.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium">Pending invites</h3>
                      <ul className="flex flex-col divide-y">
                        {invites.map((invite) => (
                          <li
                            key={invite.id}
                            className="flex items-center gap-3 py-2.5"
                          >
                            <UserAvatar name={invite.email} size="sm" />
                            <div className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-sm">
                                {invite.email}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Expires {timeAgo(invite.expires_at)}
                              </span>
                            </div>
                            <RoleBadge role={invite.role} />
                            <RevokeInviteButton
                              workspaceId={workspace.id}
                              inviteId={invite.id}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {canDelete && (
              <section
                id="danger"
                className="relative flex scroll-mt-20 flex-col gap-3 rounded-xl p-6"
              >
                <SketchFrame seed={41} ratio={4} tone="destructive" dashed />
                <h2 className="font-hand text-3xl text-destructive">
                  Danger zone
                </h2>
                <p className="text-sm text-muted-foreground">
                  Deleting the workspace removes it and its drawings for every
                  member.
                </p>
                <div>
                  <DeleteWorkspaceButton workspace={workspace} />
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
