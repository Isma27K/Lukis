import { cn } from "cn"
import {
  CheckIcon,
  CircleAlertIcon,
  CloudOffIcon,
  DotIcon,
  LoaderIcon,
} from "lucide-react"

import type { SaveStatus } from "@/components/editor/use-autosave"

const LABELS: Record<SaveStatus, [React.ReactNode, string]> = {
  saved: [<CheckIcon key="icon" />, "Saved"],
  pending: [<DotIcon key="icon" />, "Unsaved changes"],
  saving: [<LoaderIcon key="icon" className="animate-spin" />, "Saving…"],
  retrying: [<CloudOffIcon key="icon" />, "Offline, retrying…"],
  failed: [<CircleAlertIcon key="icon" />, "Not saved"],
}

// `compact` shows only the icon (the label stays for screen readers and as a
// tooltip), for tight spots like phones.
function SaveIndicator({
  status,
  compact = false,
}: {
  status: SaveStatus
  compact?: boolean
}) {
  const [icon, label] = LABELS[status]
  return (
    <span
      role="status"
      data-status={status}
      title={compact ? label : undefined}
      className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground data-[status=failed]:text-destructive [&_svg]:size-3.5"
    >
      {icon}
      <span className={cn(compact && "sr-only")}>{label}</span>
    </span>
  )
}

export { SaveIndicator }
