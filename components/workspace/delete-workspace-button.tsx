"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import type { Workspace } from "@/lib/types"

function DeleteWorkspaceButton({ workspace }: { workspace: Workspace }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete workspace
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete ${workspace.name}?`}
        description="Everyone loses access to it and its drawings. This can't be undone from the app."
        confirmLabel="Delete workspace"
        onConfirm={async () => {
          await apiFetch(`/workspaces/${workspace.id}`, { method: "DELETE" })
          router.push("/")
          router.refresh()
        }}
      />
    </>
  )
}

export { DeleteWorkspaceButton }
