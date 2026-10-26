"use client"

import {
  CopyIcon,
  EllipsisIcon,
  PencilIcon,
  ShapesIcon,
  Trash2Icon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { DeleteDrawingDialog } from "@/components/dashboard/delete-drawing-dialog"
import { RenameDrawingDialog } from "@/components/dashboard/rename-drawing-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiFetch, errorMessage } from "@/lib/api"
import type { DrawingSummary } from "@/lib/types"

function DrawingCard({
  drawing,
  editedLabel,
  canEdit,
}: {
  drawing: DrawingSummary
  // Preformatted on the server, e.g. "5 minutes ago".
  editedLabel: string
  canEdit: boolean
}) {
  const router = useRouter()
  const [dialog, setDialog] = useState<"rename" | "delete" | null>(null)

  async function duplicate() {
    try {
      await apiFetch(`/drawings/${drawing.id}/duplicate`, { method: "POST" })
      router.refresh()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  function setDialogOpen(name: "rename" | "delete") {
    return (open: boolean) => setDialog(open ? name : null)
  }

  return (
    <li className="group/drawing relative overflow-hidden rounded-lg ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/25">
      <Link href={`/d/${drawing.id}`} className="flex flex-col">
        <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
          <ShapesIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-0.5 p-3">
          <span className="truncate text-xs font-medium">{drawing.title}</span>
          <span className="text-xs text-muted-foreground">
            Edited {editedLabel}
          </span>
        </div>
      </Link>

      {canEdit && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon-sm"
                  aria-label={`Actions for ${drawing.title}`}
                  className="absolute top-2 right-2 opacity-0 group-hover/drawing:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
                />
              }
            >
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDialog("rename")}>
                <PencilIcon />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={duplicate}>
                <CopyIcon />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDialog("delete")}
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <RenameDrawingDialog
            drawing={drawing}
            open={dialog === "rename"}
            onOpenChange={setDialogOpen("rename")}
          />
          <DeleteDrawingDialog
            drawing={drawing}
            open={dialog === "delete"}
            onOpenChange={setDialogOpen("delete")}
          />
        </>
      )}
    </li>
  )
}

export { DrawingCard }
