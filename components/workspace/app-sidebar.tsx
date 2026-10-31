"use client"

import { SettingsIcon, ShapesIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { Scribble } from "@/components/brand/scribble"
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
        <Link href="/" aria-label="Lukis home" className="w-fit px-2 pt-2 pb-1">
          <Logo />
        </Link>
        <WorkspaceSwitcher workspaces={workspaces} current={current} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={active}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span className="relative pb-1">
                      {label}
                      {active && (
                        // The button sizes every icon inside it; the stroke opts out.
                        <Scribble className="absolute bottom-0 left-0 h-1.5! w-full!" />
                      )}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
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
