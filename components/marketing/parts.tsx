import { cn } from "cn"

import { SketchFrame } from "@/components/sketch/sketch-frame"
import { Strokes } from "@/components/sketch/strokes"
import { sketch } from "@/lib/sketch"

// Small building blocks shared by the public pages.

// A hand-lettered section title, with an optional line under it. Put a
// <Highlight> around the word that matters.
function SectionHeading({
  title,
  children,
  center = false,
  className,
}: {
  title: React.ReactNode
  children?: React.ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        center && "items-center text-center",
        className
      )}
    >
      <h2 className="font-hand text-4xl leading-tight font-normal sm:text-5xl">
        {title}
      </h2>
      {children && (
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          {children}
        </p>
      )}
    </div>
  )
}

// A sheet of paper with a drawn border, a spot illustration on top and a
// few words under it.
function FeatureCard({
  illustration,
  title,
  seed,
  children,
}: {
  illustration: React.ReactNode
  title: string
  seed: number
  children: React.ReactNode
}) {
  return (
    <div className="relative flex flex-col gap-2 rounded-xl bg-card p-6 shadow-paper transition-transform motion-safe:hover:-rotate-1">
      <SketchFrame seed={seed} ratio={0.95} />
      <div className="mb-2 flex h-36 items-center justify-center">
        {illustration}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

// A marker tick, for lists of promises.
function Tick({ seed, className }: { seed: number; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("mt-0.5 size-5 shrink-0 text-primary", className)}
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
}: {
  items: React.ReactNode[]
  seed: number
  className?: string
}) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <Tick seed={seed + index} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
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

export { FeatureCard, JsonLd, SectionHeading, Tick, TickList }
