import { cn } from "cn"

// One section of a settings page: a white sheet with its title and a line
// of explanation above a hairline, then its controls. `danger` marks the
// section that deletes things.
function SettingsSection({
  id,
  title,
  description,
  danger = false,
  className,
  children,
}: {
  id?: string
  title: string
  description?: React.ReactNode
  danger?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn(
        "scroll-mt-20 overflow-hidden rounded-xl border bg-card shadow-paper",
        danger && "border-destructive/35",
        className
      )}
    >
      <header
        className={cn(
          "flex flex-col gap-1 border-b px-5 py-4 sm:px-6",
          danger && "border-destructive/20 bg-destructive/[0.04]"
        )}
      >
        <h2
          id={id ? `${id}-title` : undefined}
          className={cn(
            "text-[0.9375rem] leading-snug font-semibold",
            danger && "text-destructive"
          )}
        >
          {title}
        </h2>
        {description && (
          <div className="max-w-prose text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </header>
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">{children}</div>
    </section>
  )
}

// The layout around settings sections: jump links beside a column of them.
function SettingsLayout({
  nav,
  children,
}: {
  nav: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid max-w-5xl gap-8 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12">
      {nav}
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </div>
  )
}

export { SettingsLayout, SettingsSection }
