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

function SaveIndicator({ status }: { status: SaveStatus }) {
  const [icon, label] = LABELS[status]
  return (
    <span
      role="status"
      data-status={status}
      className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground data-[status=failed]:text-destructive [&_svg]:size-3.5"
    >
      {icon}
      {label}
    </span>
  )
}

export { SaveIndicator }
