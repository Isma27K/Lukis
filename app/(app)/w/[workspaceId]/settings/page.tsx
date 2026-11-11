import type { Metadata } from "next"

import { Solo } from "@/components/illustrations/spots"
import { SectionNav } from "@/components/section-nav"
import { SettingsLayout, SettingsSection } from "@/components/settings-section"
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
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 sm:px-8 sm:py-10">
        <PageHero title={shared ? "Members & settings" : "Settings"}>
          <span>{workspace.name}</span>
          <span aria-hidden>·</span>
          <RoleBadge role={workspace.role} />
        </PageHero>

        <SettingsLayout nav={<SectionNav sections={sections} />}>
          <SettingsSection
            id="general"
            title="General"
            description="The workspace's name, as everyone in it sees it."
          >
            <WorkspaceNameForm workspace={workspace} canEdit={isAdmin} />
          </SettingsSection>

          {shared ? (
            <SettingsSection
              id="members"
              title="Members"
              description="Owners and admins manage members. Editors can change drawings; viewers can only look."
            >
              <ul className="-my-2 flex flex-col divide-y">
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
            </SettingsSection>
          ) : (
            <SettingsSection id="members" title="Members">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                <Solo name={user.name} className="w-44 shrink-0" />
                <div className="flex flex-col items-center gap-3 sm:items-start">
                  <p className="font-display text-lg font-semibold">
                    Just you in here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your personal workspace is only visible to you. To draw with
                    others, create a workspace, invite them and move drawings
                    into it.
                  </p>
                  <CreateWorkspaceButton label="Create a team workspace" />
                </div>
              </div>
            </SettingsSection>
          )}

          {canInvite && (
            <SettingsSection
              id="invite"
              title="Invite people"
              description="Each link is for one email address. It works once and expires after 7 days."
            >
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
            </SettingsSection>
          )}

          {canDelete && (
            <SettingsSection
              id="danger"
              title="Danger zone"
              description="Deleting the workspace removes it and its drawings for every member."
              danger
            >
              <div>
                <DeleteWorkspaceButton workspace={workspace} />
              </div>
            </SettingsSection>
          )}
        </SettingsLayout>
      </main>
    </>
  )
}
