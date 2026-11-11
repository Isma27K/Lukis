import { cn } from "cn"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CircleIcon,
  DiamondIcon,
  EraserIcon,
  HandIcon,
  ImageIcon,
  MinusIcon,
  MousePointer2Icon,
  PencilIcon,
  Share2Icon,
  SquareIcon,
  TypeIcon,
} from "lucide-react"
import Link from "next/link"

import { Strokes } from "@/components/sketch/strokes"
import { sketch } from "@/lib/sketch"
import { NOTE_BG, type NoteColor } from "@/lib/notes"

// Small building blocks shared by the public pages.

// A section title set wide, with an optional line under it. Emphasis comes
// from the type; no marker strokes on headings.
function SectionHeading({
  title,
  children,
  center = false,
  as: Heading = "h2",
  className,
}: {
  title: React.ReactNode
  children?: React.ReactNode
  center?: boolean
  as?: "h1" | "h2"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        center && "items-center text-center",
        className
      )}
    >
      <Heading className="font-display text-[clamp(2.125rem,4vw,2.75rem)] leading-[1.08] font-semibold">
        {title}
      </Heading>
      {children && (
        <p className="max-w-[34rem] text-base text-muted-foreground sm:text-lg">
          {children}
        </p>
      )}
    </div>
  )
}

// A sheet of the editor's dotted canvas, for illustrations to sit on.
function CanvasTile({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border bg-card dot-grid",
        className
      )}
    >
      {children}
    </div>
  )
}

// A handwritten note in the margin, the one place the public pages letter
// by hand. `arrow` draws a pen arrow off one side of it.
function MarginNote({
  children,
  arrow,
  className,
}: {
  children: React.ReactNode
  arrow?: "right" | "up-right"
  className?: string
}) {
  const path =
    arrow === "up-right"
      ? sketch.arrow(
          [
            [6, 40],
            [30, 30],
            [50, 8],
          ],
          { seed: 61, strokeWidth: 1.8, head: 9, disableMultiStroke: true }
        )
      : sketch.arrow(
          [
            [4, 24],
            [30, 14],
            [56, 20],
          ],
          { seed: 62, strokeWidth: 1.8, head: 9, disableMultiStroke: true }
        )
  return (
    <span
      className={cn(
        "inline-flex items-end gap-1 font-hand text-[1.3rem] leading-tight text-primary-ink",
        className
      )}
    >
      <span className="-rotate-2">{children}</span>
      {arrow && (
        <svg aria-hidden viewBox="0 0 60 48" className="w-14 shrink-0">
          <Strokes paths={path} animate delay={1.2} />
        </svg>
      )}
    </span>
  )
}

// A pen tick, for lists of promises.
function Tick({ seed, className }: { seed: number; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("mt-0.5 size-5 shrink-0 text-primary-ink", className)}
    >
      <Strokes
        paths={sketch.path("M3 13 L9 19 L21 5", {
          seed,
          strokeWidth: 2.6,
          disableMultiStroke: true,
        })}
      />
    </svg>
  )
}

// A list where every line starts with a tick.
function TickList({
  items,
  seed,
  className,
  tickClassName,
}: {
  items: React.ReactNode[]
  seed: number
  className?: string
  tickClassName?: string
}) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <Tick seed={seed + index} className={tickClassName} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// A text link with an arrow that nudges forward on hover.
function ArrowLink({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group/arrow inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline",
        className
      )}
      {...props}
    >
      {children}
      <ArrowRightIcon className="size-4 transition-transform duration-200 ease-out-expo group-hover/arrow:translate-x-0.5" />
    </Link>
  )
}

const TOOLS = [
  HandIcon,
  MousePointer2Icon,
  SquareIcon,
  DiamondIcon,
  CircleIcon,
  ArrowRightIcon,
  MinusIcon,
  PencilIcon,
  TypeIcon,
  ImageIcon,
  EraserIcon,
]

const PEOPLE: { name: string; color: NoteColor }[] = [
  { name: "Ada", color: "blue" },
  { name: "Bo", color: "green" },
]

// The editor as it looks mid-session: the title and save state on the left,
// the tools in the middle, people and Share on the right, and the canvas
// underneath. A picture of the product, so it's hidden from screen readers.
function EditorWindow({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card shadow-paper-lg",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-2.5 sm:p-3">
        <div className="flex h-9 items-center gap-1.5 rounded-lg bg-card pr-3 pl-1.5 text-sm shadow-paper ring-1 ring-border">
          <span className="grid size-7 place-items-center rounded-md text-muted-foreground">
            <ArrowLeftIcon className="size-4" />
          </span>
          <span className="h-4 w-px bg-border" />
          <span className="truncate font-semibold">{title}</span>
          <CheckIcon className="hidden size-3.5 text-chart-3 sm:block" />
        </div>
        <div className="hidden h-9 items-center gap-0.5 rounded-lg bg-card px-1 shadow-paper ring-1 ring-border md:flex">
          {TOOLS.map((Icon, index) => (
            <span
              key={index}
              className={cn(
                "grid size-7 place-items-center rounded-md text-foreground/80",
                index === 7 && "bg-highlight text-primary-ink"
              )}
            >
              <Icon className="size-[15px]" strokeWidth={1.75} />
            </span>
          ))}
        </div>
        <div className="flex h-9 items-center gap-1.5 rounded-lg bg-card px-1.5 shadow-paper ring-1 ring-border">
          <span className="flex -space-x-1.5">
            {PEOPLE.map((person) => (
              <span
                key={person.name}
                className={cn(
                  "grid size-6 place-items-center rounded-full text-[0.625rem] font-semibold text-note-ink ring-2 ring-card",
                  NOTE_BG[person.color]
                )}
              >
                {person.name[0]}
              </span>
            ))}
          </span>
          <span className="flex h-7 items-center gap-1.5 rounded-md border border-primary-edge/60 bg-primary px-2.5 text-xs font-medium text-primary-foreground dark:border-transparent">
            <Share2Icon className="size-3.5" />
            <span className="hidden sm:inline">Share</span>
          </span>
        </div>
      </div>
      <div className="dot-grid px-4 pt-16 pb-4 sm:px-8 sm:pt-20 sm:pb-6">
        {children}
      </div>
    </div>
  )
}

// Embeds structured data for search engines. `<` is escaped so nothing in
// it can close the script tag early.
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export {
  ArrowLink,
  CanvasTile,
  EditorWindow,
  JsonLd,
  MarginNote,
  SectionHeading,
  Tick,
  TickList,
}
