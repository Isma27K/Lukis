"use client"

import { PlusIcon, SettingsIcon, ShapesIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Logo } from "@/components/brand/logo"
import { NewDrawingButton } from "@/components/dashboard/new-drawing-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog"
import { ThemeToggle } from "@/components/workspace/theme-toggle"
import { UserMenu } from "@/components/workspace/user-menu"
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar"
import type { User } from "@/lib/auth"
import { atLeast } from "@/lib/roles"
import type { Workspace } from "@/lib/types"

function AppSidebar({
  user,
  workspaces,
  current,
  trashCount,
}: {
  user: User
  workspaces: Workspace[]
  current: Workspace
  trashCount: number
}) {
  const pathname = usePathname()
  const [creating, setCreating] = useState(false)
  const base = `/w/${current.id}`
  const links = [
    { href: base, label: "Drawings", icon: ShapesIcon, count: 0 },
    {
      href: `${base}/trash`,
      label: "Trash",
      icon: Trash2Icon,
      count: trashCount,
    },
    {
      href: `${base}/settings`,
      label: current.personal ? "Settings" : "Members & settings",
      icon: SettingsIcon,
      count: 0,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="gap-4 px-3 pt-4">
        <Link href="/" aria-label="Lukis home" className="w-fit">
          <Logo />
        </Link>
        {atLeast(current.role, "editor") && (
          <NewDrawingButton workspaceId={current.id} className="w-full" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map(({ href, label, icon: Icon, count }) => {
              const active = pathname === href
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={active}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                  {count > 0 && <SidebarMenuBadge>{count}</SidebarMenuBadge>}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupAction
            title="Create workspace"
            onClick={() => setCreating(true)}
          >
            <PlusIcon />
            <span className="sr-only">Create workspace</span>
          </SidebarGroupAction>
          <SidebarMenu>
            {workspaces.map((workspace) => (
              <SidebarMenuItem key={workspace.id}>
                <SidebarMenuButton
                  isActive={workspace.id === current.id}
                  render={<Link href={`/w/${workspace.id}`} />}
                  className="data-active:bg-sidebar-accent data-active:shadow-none"
                >
                  <WorkspaceAvatar
                    name={workspace.name}
                    className="size-5 rounded-sm text-[0.625rem]"
                  />
                  <span>{workspace.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <CreateWorkspaceDialog open={creating} onOpenChange={setCreating} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-3">
        <ThemeToggle />
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export { AppSidebar }
