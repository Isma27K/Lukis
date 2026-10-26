"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiFetch, errorMessage } from "@/lib/api"
import { ROLE_LABELS } from "@/lib/roles"
import type { Member, Role } from "@/lib/types"

function MemberRoleSelect({
  workspaceId,
  member,
  roles,
}: {
  workspaceId: string
  member: Member
  // The roles the current user may hand out.
  roles: Role[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function changeRole(role: Role | null) {
    if (!role || role === member.role) {
      return
    }
    startTransition(async () => {
      try {
        await apiFetch(`/workspaces/${workspaceId}/members/${member.user_id}`, {
          method: "PATCH",
          body: { role },
        })
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <Select
      items={ROLE_LABELS}
      value={member.role}
      onValueChange={changeRole}
      disabled={pending}
    >
      <SelectTrigger
        size="sm"
        className="w-24"
        aria-label={`Role for ${member.name}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// "Remove" for someone else, "Leave" for yourself.
function RemoveMemberButton({
  workspaceId,
  workspaceName,
  member,
  isSelf,
}: {
  workspaceId: string
  workspaceName: string
  member: Member
  isSelf: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        {isSelf ? "Leave" : "Remove"}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={isSelf ? `Leave ${workspaceName}?` : `Remove ${member.name}?`}
        description={
          isSelf
            ? "You'll lose access to its drawings until someone invites you again."
            : `${member.name} will lose access to this workspace and its drawings.`
        }
        confirmLabel={isSelf ? "Leave" : "Remove"}
        onConfirm={async () => {
          await apiFetch(
            `/workspaces/${workspaceId}/members/${member.user_id}`,
            { method: "DELETE" }
          )
          if (isSelf) {
            router.push("/")
          }
          router.refresh()
        }}
      />
    </>
  )
}

export { MemberRoleSelect, RemoveMemberButton }
