import { MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react"

import { Pill } from "@/components/account/pill"
import {
  EndOtherSessionsButton,
  EndSessionButton,
} from "@/components/account/session-controls"
import { timeAgo } from "@/lib/format"
import type { Session } from "@/lib/types"
import { describeDevice, type DeviceKind } from "@/lib/user-agent"

const ICONS: Record<DeviceKind, typeof MonitorIcon> = {
  desktop: MonitorIcon,
  phone: SmartphoneIcon,
  tablet: TabletIcon,
}

// Where the user is logged in, this device first. Rendered on the server, so
// the relative times don't change during hydration.
function SessionList({ sessions }: { sessions: Session[] }) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y">
        {sessions.map((session) => {
          const { label, kind } = describeDevice(session.user_agent)
          const Icon = ICONS[kind]
          const details = [
            session.current
              ? "Active now"
              : `Active ${timeAgo(session.last_used_at)}`,
            session.ip,
            `logged in ${timeAgo(session.created_at)}`,
          ]
          return (
            <li key={session.id} className="flex items-center gap-3 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-medium">{label}</span>
                  {session.current && <Pill tone="green">This device</Pill>}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {details.filter(Boolean).join(" · ")}
                </span>
              </div>
              {!session.current && (
                <EndSessionButton sessionId={session.id} label={label} />
              )}
            </li>
          )
        })}
      </ul>
      <div>
        <EndOtherSessionsButton disabled={sessions.length < 2} />
      </div>
    </div>
  )
}

export { SessionList }
