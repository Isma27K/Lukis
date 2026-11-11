import { Skeleton } from "@/components/ui/skeleton"

// Blank sheets while a workspace page loads; the sidebar stays put.
export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-20 sm:px-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-9 w-72" />
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="overflow-hidden rounded-xl border bg-card shadow-paper"
          >
            <Skeleton className="aspect-video rounded-none" />
            <div className="flex flex-col gap-2 px-3.5 py-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
