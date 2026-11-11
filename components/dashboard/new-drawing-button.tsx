"use client"

import { PlusIcon } from "lucide-react"

import { useNewDrawing } from "@/components/dashboard/use-new-drawing"
import { Button } from "@/components/ui/button"

function NewDrawingButton({
  workspaceId,
  className,
}: {
  workspaceId: string
  className?: string
}) {
  const { open, pending } = useNewDrawing(workspaceId)

  return (
    <Button onClick={open} disabled={pending} className={className}>
      <PlusIcon data-icon="inline-start" />
      New drawing
    </Button>
  )
}

export { NewDrawingButton }
