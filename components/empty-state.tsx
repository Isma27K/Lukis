// An illustration and a hand-lettered line for lists with nothing in them.
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
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      {illustration}
      <p className="font-hand text-3xl">{title}</p>
      {children}
    </div>
  )
}

export { EmptyState }
