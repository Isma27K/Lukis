"use client"

import {
  ChevronsUpDownIcon,
  CircleUserRoundIcon,
  LogOutIcon,
  ShieldIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { useLogOut } from "@/components/auth/use-log-out"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/user-avatar"
import type { User } from "@/lib/auth"
import { avatarUrl } from "@/lib/avatar"

function UserMenu({ user }: { user: User }) {
  const router = useRouter()
  const { logOut, pending } = useLogOut()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
            <UserAvatar
              name={user.name}
              picture={avatarUrl(user.id, user.avatar_version)}
            />
            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-(--anchor-width) min-w-56"
          >
            <DropdownMenuItem onClick={() => router.push("/account")}>
              <CircleUserRoundIcon />
              Your account
            </DropdownMenuItem>
            {user.site_owner && (
              <DropdownMenuItem onClick={() => router.push("/admin")}>
                <ShieldIcon />
                Site settings
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={logOut} disabled={pending}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { UserMenu }
