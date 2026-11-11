import { cn } from "cn"
import {
  ArrowRightIcon,
  BookmarkIcon,
  BookmarkPlusIcon,
  ChevronDownIcon,
  CircleIcon,
  CopyIcon,
  DiamondIcon,
  ImageIcon,
  Link2Icon,
  PencilIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react"

import { NOTE_BG, type NoteColor } from "@/lib/notes"

// Small, faithful pictures of Lukis's own panels for the public pages. The
// names and times in them are sample content, and every vignette is hidden
// from screen readers: the copy beside it says what it shows.

function Face({ name, color }: { name: string; color: NoteColor }) {
  return (
    <span
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full text-[0.6875rem] font-semibold text-note-ink",
        NOTE_BG[color]
      )}
    >
      {name[0]}
    </span>
  )
}

function Panel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-full max-w-sm rounded-xl border bg-card text-left text-sm shadow-paper-lg select-none",
        className
      )}
    >
      {children}
    </div>
  )
}

const VERSIONS = [
  { time: "10:42 AM", who: "Ada", color: "blue" as NoteColor },
  { time: "10:31 AM", who: "Bo", color: "green" as NoteColor, selected: true },
  { time: "9:58 AM", who: "Ada", color: "blue" as NoteColor },
]

// The editor's version history sidebar, one version selected for preview.
function HistoryVignette({ className }: { className?: string }) {
  return (
    <Panel className={className}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="font-semibold">Version history</span>
      </div>
      <div className="flex flex-col gap-3 p-3">
        <span className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-input bg-card text-[0.8125rem] font-medium">
          <BookmarkPlusIcon className="size-3.5" />
          Save this version
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="px-2 pb-1 text-xs font-medium text-muted-foreground">
            Today
          </span>
          {VERSIONS.map((version) => (
            <span
              key={version.time}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5",
                version.selected && "bg-highlight"
              )}
            >
              <Face name={version.who} color={version.color} />
              <span className="flex flex-col leading-tight">
                <span className="font-medium tabular-nums">{version.time}</span>
                <span className="text-xs text-muted-foreground">
                  by {version.who}
                </span>
              </span>
              {version.selected && (
                <span className="ml-auto rounded-md border border-primary-edge/60 bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  Restore
                </span>
              )}
            </span>
          ))}
          <span className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
            Monday
          </span>
          <span className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <span className="grid size-7 place-items-center rounded-full bg-muted">
              <BookmarkIcon className="size-3.5 text-primary-ink" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-medium">Kickoff board</span>
              <span className="text-xs text-muted-foreground">
                Named · kept for good
              </span>
            </span>
          </span>
        </div>
      </div>
    </Panel>
  )
}

const MEMBERS = [
  { name: "Ada", color: "blue" as NoteColor, role: "Owner", dot: "bg-primary" },
  { name: "Bo", color: "green" as NoteColor, role: "Admin", dot: "bg-guide" },
  {
    name: "Chen",
    color: "violet" as NoteColor,
    role: "Editor",
    dot: "bg-chart-3",
  },
  {
    name: "Dewi",
    color: "pink" as NoteColor,
    role: "Viewer",
    dot: "bg-muted-foreground/60",
  },
]

// A workspace's members with their roles.
function MembersVignette({ className }: { className?: string }) {
  return (
    <Panel className={className}>
      <div className="border-b px-4 py-3">
        <span className="font-semibold">Members</span>
      </div>
      <ul className="flex flex-col divide-y px-4">
        {MEMBERS.map((member) => (
          <li key={member.name} className="flex items-center gap-3 py-2.5">
            <Face name={member.name} color={member.color} />
            <span className="flex-1 font-medium">{member.name}</span>
            <span className="flex h-7 items-center gap-1.5 rounded-md border border-input bg-card pr-1.5 pl-2.5 text-xs font-medium">
              <span className={cn("size-1.5 rounded-full", member.dot)} />
              {member.role}
              <ChevronDownIcon className="size-3.5 text-muted-foreground" />
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "flex h-[18px] w-8 shrink-0 items-center rounded-full border p-px",
        on ? "border-primary-edge/60 bg-primary" : "border-input bg-input/50"
      )}
    >
      <span
        className={cn(
          "size-3.5 rounded-full bg-white shadow-[0_1px_2px_oklch(0_0_0/25%)]",
          on && "ml-auto"
        )}
      />
    </span>
  )
}

// The share dialog with a public link switched on.
function ShareVignette({ className }: { className?: string }) {
  return (
    <Panel className={className}>
      <div className="flex flex-col gap-4 p-4">
        <span className="font-display text-base font-semibold">
          Share “Launch plan”
        </span>
        <span className="flex items-start justify-between gap-4">
          <span className="flex flex-col leading-tight">
            <span className="font-medium">Public link</span>
            <span className="text-xs text-muted-foreground">
              Anyone with the link can open this drawing.
            </span>
          </span>
          <Toggle on />
        </span>
        <span className="flex gap-2">
          <span className="flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-input bg-card px-2.5 text-xs text-muted-foreground">
            <Link2Icon className="size-3.5 shrink-0" />
            <span className="truncate">…/s/k7Qe2pXw</span>
          </span>
          <span className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-card px-2.5 text-xs font-medium">
            <CopyIcon className="size-3.5" />
            Copy
          </span>
        </span>
        <span className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            People with the link
          </span>
          <span className="flex h-7 items-center gap-1.5 rounded-md border border-input bg-card pr-1.5 pl-2.5 text-xs font-medium">
            Can edit
            <ChevronDownIcon className="size-3.5 text-muted-foreground" />
          </span>
        </span>
        <span className="flex items-center justify-between gap-4 border-t pt-3">
          <span className="font-medium">Require a password</span>
          <Toggle on={false} />
        </span>
      </div>
    </Panel>
  )
}

// The editor following someone: their color around the view, their name on
// top. `children` is the canvas.
function FollowFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-xl border bg-card dot-grid p-6 pt-12 shadow-paper-lg",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-1.5 rounded-lg border-2 border-note-blue" />
      <span className="absolute top-1.5 left-1/2 -translate-x-1/2 rounded-b-md bg-note-blue px-2.5 py-1 text-xs font-semibold text-note-ink">
        Following Ada
      </span>
      {children}
    </div>
  )
}

const TOOLS = [
  SquareIcon,
  DiamondIcon,
  CircleIcon,
  ArrowRightIcon,
  PencilIcon,
  TypeIcon,
  ImageIcon,
]

// A patch of canvas with the editor's tools floating over it. `children` is
// what's drawn on it.
function CanvasVignette({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-xl border bg-card dot-grid px-8 pt-16 pb-8 shadow-paper-lg",
        className
      )}
    >
      <span className="absolute top-3 left-1/2 flex h-9 -translate-x-1/2 items-center gap-0.5 rounded-lg bg-card px-1 shadow-paper ring-1 ring-border">
        {TOOLS.map((Icon, index) => (
          <span
            key={index}
            className={cn(
              "grid size-7 place-items-center rounded-md text-foreground/80",
              index === 4 && "bg-highlight text-primary-ink"
            )}
          >
            <Icon className="size-[15px]" strokeWidth={1.75} />
          </span>
        ))}
      </span>
      {children}
    </div>
  )
}

export {
  CanvasVignette,
  FollowFrame,
  HistoryVignette,
  MembersVignette,
  ShareVignette,
}
