// An illustration and a short title for lists with nothing in them.
function EmptyState({
  illustration,
  title,
  children,
}: {
  illustration: React.ReactNode
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <div className="text-foreground/90">{illustration}</div>
      <p className="font-display text-lg font-semibold">{title}</p>
      {children && (
        <div className="flex max-w-sm flex-col items-center gap-4 text-sm text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  )
}

export { EmptyState }
