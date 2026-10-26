"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiFetch, errorMessage } from "@/lib/api"
import type { Workspace } from "@/lib/types"

function WorkspaceNameForm({
  workspace,
  canEdit,
}: {
  workspace: Workspace
  canEdit: boolean
}) {
  const router = useRouter()
  const [name, setName] = useState(workspace.name)
  const [pending, startTransition] = useTransition()
  const unchanged = !name.trim() || name.trim() === workspace.name

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      try {
        await apiFetch(`/workspaces/${workspace.id}`, {
          method: "PATCH",
          body: { name },
        })
        toast.success("Workspace renamed")
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  return (
    <form onSubmit={save} className="flex items-end gap-2">
      <Field>
        <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
        <Input
          id="workspace-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={64}
          disabled={!canEdit}
        />
      </Field>
      {canEdit && (
        <Button type="submit" disabled={pending || unchanged}>
          Save
        </Button>
      )}
    </form>
  )
}

export { WorkspaceNameForm }
