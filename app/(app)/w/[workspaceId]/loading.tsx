import { Skeleton } from "@/components/ui/skeleton"

// Blank sheets while a workspace page loads; the sidebar stays put.
export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className="flex flex-col gap-3">
            <div className="rounded-lg bg-card p-2 shadow-paper">
              <Skeleton className="aspect-video rounded-sm" />
            </div>
            <Skeleton className="h-4 w-2/3" />
          </li>
        ))}
      </ul>
    </main>
  )
}
