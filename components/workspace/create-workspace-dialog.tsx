"use client"

import { useRouter } from "next/navigation"

import { TextInputDialog } from "@/components/text-input-dialog"
import { apiFetch } from "@/lib/api"
import type { Workspace } from "@/lib/types"

// Asks for a name, creates the workspace and goes to it.
function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  return (
    <TextInputDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create workspace"
      label="Name"
      maxLength={64}
      submitLabel="Create"
      onSubmit={async (name) => {
        const workspace = await apiFetch<Workspace>("/workspaces", {
          method: "POST",
          body: { name },
        })
        router.push(`/w/${workspace.id}`)
        router.refresh()
      }}
    />
  )
}

export { CreateWorkspaceDialog }
