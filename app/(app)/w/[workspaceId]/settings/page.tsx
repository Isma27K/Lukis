import type { Metadata } from "next"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { WorkspaceNameForm } from "@/components/workspace/workspace-name-form"
import { getInvites, getMembers, getWorkspace, requireUser } from "@/lib/dal"
import { initials, timeAgo } from "@/lib/format"
import { ROLE_LABELS, assignableRoles, atLeast, canManage } from "@/lib/roles"

type Props = { params: Promise<{ workspaceId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workspaceId } = await params
  return { title: `${(await getWorkspace(workspaceId)).name} settings` }
}

export default async function Page({ params }: Props) {
  const { workspaceId } = await params
  const [user, workspace] = await Promise.all([
    requireUser(),
    getWorkspace(workspaceId),
  ])
  const isAdmin = atLeast(workspace.role, "admin")
  const shared = !workspace.personal
  const [members, invites] = await Promise.all([
    shared ? getMembers(workspaceId) : [],
    shared && isAdmin ? getInvites(workspaceId) : [],
  ])
  const roles = assignableRoles(workspace.role)

  return (
    <>
      <PageHeader title={shared ? "Members & settings" : "Settings"} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkspaceNameForm workspace={workspace} canEdit={isAdmin} />
          </CardContent>
        </Card>

        {!shared && (
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Your personal workspace is only visible to you. To work with
                others, create a workspace from the switcher in the sidebar and
                move drawings into it.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {shared && (
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Owners and admins manage members. Editors can change drawings;
                viewers can only look.
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
                      className="flex items-center gap-3 py-2"
                    >
                      <Avatar>
                        <AvatarFallback>{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-xs font-medium">
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
                        <Badge variant="secondary">
                          {ROLE_LABELS[member.role]}
                        </Badge>
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
        )}

        {shared && isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Invite people</CardTitle>
              <CardDescription>
                Each link is for one email address. It works once and expires
                after 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <InviteForm workspaceId={workspace.id} roles={roles} />
              {invites.length > 0 && (
                <div className="flex flex-col gap-1">
                  <h3 className="text-xs font-medium">Pending invites</h3>
                  <ul className="flex flex-col divide-y">
                    {invites.map((invite) => (
                      <li
                        key={invite.id}
                        className="flex items-center gap-3 py-2"
                      >
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-xs">
                            {invite.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Expires {timeAgo(invite.expires_at)}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {ROLE_LABELS[invite.role]}
                        </Badge>
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

        {shared && workspace.role === "owner" && (
          <Card>
            <CardHeader>
              <CardTitle>Delete workspace</CardTitle>
              <CardDescription>
                Removes the workspace and its drawings for every member.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteWorkspaceButton workspace={workspace} />
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
