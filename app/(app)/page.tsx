import { notFound, redirect } from "next/navigation"

import { getWorkspaces } from "@/lib/dal"

export default async function Page() {
  const workspaces = await getWorkspaces()
  // Everyone gets a personal workspace at signup.
  const home =
    workspaces.find((workspace) => workspace.personal) ?? workspaces[0]
  if (!home) {
    notFound()
  }
  redirect(`/w/${home.id}`)
}
