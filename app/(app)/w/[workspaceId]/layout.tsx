import { cookies } from "next/headers"

import { VerifyEmailBanner } from "@/components/auth/verify-email-banner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/workspace/app-sidebar"
import {
  getFeatures,
  getTrash,
  getWorkspace,
  getWorkspaces,
  requireUser,
} from "@/lib/dal"

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ workspaceId: string }>
}) {
  const { workspaceId } = await params
  const [user, workspaces, workspace, features, trash] = await Promise.all([
    requireUser(),
    getWorkspaces(),
    getWorkspace(workspaceId),
    getFeatures(),
    getTrash(workspaceId),
  ])
  // The sidebar remembers being collapsed in this cookie.
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar
        user={user}
        workspaces={workspaces}
        current={workspace}
        trashCount={trash.length}
      />
      <SidebarInset className="bg-dot-grid">
        {features.email && !user.email_verified && (
          <VerifyEmailBanner email={user.email} />
        )}
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
