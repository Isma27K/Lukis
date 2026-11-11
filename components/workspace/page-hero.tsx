// A page's title row: the widened title with a line of details under it
// (`children`) and `actions` on the right.
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
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-display text-[2rem] leading-[1.15] font-semibold break-words">
          {title}
        </h1>
        {children && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {children}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </section>
  )
}

export { PageHero }
