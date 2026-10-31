"use client"

import { PlusIcon } from "lucide-react"

import { useCreateDrawing } from "@/components/dashboard/use-create-drawing"
import { Button } from "@/components/ui/button"

function NewDrawingButton({
  workspaceId,
  className,
}: {
  workspaceId: string
  className?: string
}) {
  const { create, pending } = useCreateDrawing(workspaceId)

  return (
    <Button onClick={create} disabled={pending} className={className}>
      <PlusIcon data-icon="inline-start" />
      New drawing
    </Button>
  )
}

export { NewDrawingButton }
