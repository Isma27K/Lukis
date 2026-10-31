"use client"

import { PlusIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog"

function CreateWorkspaceButton({ label }: { label: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <PlusIcon data-icon="inline-start" />
        {label}
      </Button>
      <CreateWorkspaceDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export { CreateWorkspaceButton }
