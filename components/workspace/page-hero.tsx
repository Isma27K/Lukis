import { Highlight } from "@/components/sketch/highlight"
import { seedFrom } from "@/lib/sketch"

// A page's big hand-lettered title, highlighted in marker, with a line of
// details under it (`children`) and `actions` on the right.
function PageHero({
  title,
  children,
  actions,
}: {
  title: string
  children?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="font-hand text-4xl leading-tight break-words sm:text-5xl">
          <Highlight seed={seedFrom(title)}>{title}</Highlight>
        </h1>
        {children && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {children}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </section>
  )
}

export { PageHero }
