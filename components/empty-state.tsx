import { Doodle } from "@/components/brand/doodle"

// A sketch and a hand-lettered line for lists with nothing in them.
function EmptyState({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <Doodle className="w-32" />
      <p className="font-hand text-2xl">{title}</p>
      {children}
    </div>
  )
}

export { EmptyState }
