import Link from "next/link"
import { Fragment } from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type Crumb = { label: string; href?: string }

// The slim bar at the top of each workspace page: the sidebar toggle and
// where you are. `children` go on the right. The big title is in PageHero.
function PageHeader({
  crumbs,
  children,
}: {
  crumbs: Crumb[]
  children?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="my-3.5 mr-1" />
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-1.5 text-sm"
      >
        {crumbs.map(({ label, href }, index) => {
          const last = index === crumbs.length - 1
          return (
            <Fragment key={index}>
              {index > 0 && (
                <span aria-hidden className="text-muted-foreground/60">
                  /
                </span>
              )}
              {href && !last ? (
                <Link
                  href={href}
                  className="truncate text-muted-foreground hover:text-foreground"
                >
                  {label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "truncate",
                    last ? "font-medium" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              )}
            </Fragment>
          )
        })}
      </nav>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </header>
  )
}

export { PageHeader }
