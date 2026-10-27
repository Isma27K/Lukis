"use client"

import { SettingsIcon, ShapesIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserMenu } from "@/components/workspace/user-menu"
import { WorkspaceSwitcher } from "@/components/workspace/workspace-switcher"
import type { User } from "@/lib/auth"
import type { Workspace } from "@/lib/types"

function AppSidebar({
  user,
  workspaces,
  current,
}: {
  user: User
  workspaces: Workspace[]
  current: Workspace
}) {
  const pathname = usePathname()
  const base = `/w/${current.id}`
  const links = [
    { href: base, label: "Drawings", icon: ShapesIcon },
    { href: `${base}/trash`, label: "Trash", icon: Trash2Icon },
    {
      href: `${base}/settings`,
      label: current.personal ? "Settings" : "Members & settings",
      icon: SettingsIcon,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces} current={current} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  isActive={pathname === href}
                  render={<Link href={href} />}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export { AppSidebar }
