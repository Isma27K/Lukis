import { WifiOffIcon } from "lucide-react"

import type { ConnectionStatus } from "@/components/editor/collab/collaboration"

const LABELS: Partial<Record<ConnectionStatus, string>> = {
  offline: "Reconnecting…",
  unavailable: "Live updates off",
}

// Only shown when live updates are down; saving keeps working regardless.
function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const label = LABELS[status]
  if (!label) {
    return null
  }
  return (
    <span
      role="status"
      title="You won't see other people's changes until this clears. Your own changes are still saved."
      className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground [&_svg]:size-3.5"
    >
      <WifiOffIcon />
      {label}
    </span>
  )
}

export { ConnectionIndicator }
