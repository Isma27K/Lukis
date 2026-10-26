import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/workspace/app-sidebar"
import { getWorkspace, getWorkspaces, requireUser } from "@/lib/dal"

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ workspaceId: string }>
}) {
  const { workspaceId } = await params
  const [user, workspaces, workspace] = await Promise.all([
    requireUser(),
    getWorkspaces(),
    getWorkspace(workspaceId),
  ])
  // The sidebar remembers being collapsed in this cookie.
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar user={user} workspaces={workspaces} current={workspace} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
