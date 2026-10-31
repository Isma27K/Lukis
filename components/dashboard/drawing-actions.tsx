"use client"

import {
  CopyIcon,
  EllipsisIcon,
  FolderInputIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { TextInputDialog } from "@/components/text-input-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiFetch, errorMessage } from "@/lib/api"
import type { DrawingSummary, Workspace } from "@/lib/types"

// The "…" menu for a drawing (rename, duplicate, move, trash) and its
// dialogs. Only rendered for people who can edit.
function DrawingActions({
  drawing,
  canDelete,
  moveTargets,
  className,
}: {
  drawing: DrawingSummary
  // Moving to the trash takes an admin; see canDeleteDrawings.
  canDelete: boolean
  // Other workspaces the user can add drawings to.
  moveTargets: Workspace[]
  className?: string
}) {
  const router = useRouter()
  const [dialog, setDialog] = useState<"rename" | "delete" | null>(null)

  async function run(action: () => Promise<unknown>, success?: string) {
    try {
      await action()
      if (success) {
        toast.success(success)
      }
      router.refresh()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  function setDialogOpen(name: "rename" | "delete") {
    return (open: boolean) => setDialog(open ? name : null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label={`Actions for ${drawing.title}`}
              className={className}
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto min-w-44">
          <DropdownMenuItem onClick={() => setDialog("rename")}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              run(() =>
                apiFetch(`/drawings/${drawing.id}/duplicate`, {
                  method: "POST",
                })
              )
            }
          >
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          {moveTargets.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderInputIcon />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {moveTargets.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() =>
                      run(
                        () =>
                          apiFetch(`/drawings/${drawing.id}/move`, {
                            method: "POST",
                            body: { workspace_id: workspace.id },
                          }),
                        `Moved to ${workspace.name}`
                      )
                    }
                  >
                    {workspace.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDialog("delete")}
              >
                <Trash2Icon />
                Move to trash
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <TextInputDialog
        open={dialog === "rename"}
        onOpenChange={setDialogOpen("rename")}
        title="Rename drawing"
        label="Title"
        defaultValue={drawing.title}
        maxLength={120}
        submitLabel="Save"
        onSubmit={async (title) => {
          await apiFetch(`/drawings/${drawing.id}`, {
            method: "PATCH",
            body: { title },
          })
          router.refresh()
        }}
      />
      <ConfirmDialog
        open={dialog === "delete"}
        onOpenChange={setDialogOpen("delete")}
        title={`Move “${drawing.title}” to the trash?`}
        description="It will be hidden from this workspace for everyone. You can restore it from the trash."
        confirmLabel="Move to trash"
        onConfirm={async () => {
          await apiFetch(`/drawings/${drawing.id}`, { method: "DELETE" })
          router.refresh()
        }}
      />
    </>
  )
}

export { DrawingActions }
