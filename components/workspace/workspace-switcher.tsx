"use client"

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { TextInputDialog } from "@/components/text-input-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar"
import { apiFetch } from "@/lib/api"
import { ROLE_LABELS } from "@/lib/roles"
import type { Workspace } from "@/lib/types"

function WorkspaceSwitcher({
  workspaces,
  current,
}: {
  workspaces: Workspace[]
  current: Workspace
}) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
            <WorkspaceAvatar name={current.name} />
            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium">{current.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {current.personal ? "Only you" : ROLE_LABELS[current.role]}
              </span>
            </span>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--anchor-width) min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => router.push(`/w/${workspace.id}`)}
                >
                  <WorkspaceAvatar name={workspace.name} className="size-5" />
                  <span className="truncate">{workspace.name}</span>
                  {workspace.id === current.id && (
                    <CheckIcon className="ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCreating(true)}>
              <PlusIcon />
              Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TextInputDialog
          open={creating}
          onOpenChange={setCreating}
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
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { WorkspaceSwitcher }
