import Link from "next/link"

import { Logo } from "@/components/brand/logo"

// A whole-page message on the canvas: not found, a dead link, an error. An
// illustration, a title, a sentence or two and what to do next.
function StatusPage({
  illustration,
  title,
  children,
  actions,
}: {
  illustration: React.ReactNode
  title: string
  children: React.ReactNode
  actions: React.ReactNode
}) {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center dot-grid px-4 py-24 text-center">
      <Link
        href="/"
        aria-label="Lukis home"
        className="absolute top-5 left-5 sm:top-6 sm:left-8"
      >
        <Logo />
      </Link>
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border bg-card px-6 py-10 shadow-paper-lg motion-safe:animate-rise sm:px-10">
        <div className="text-foreground">{illustration}</div>
        <h1 className="font-display text-2xl leading-tight font-semibold">
          {title}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">{children}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {actions}
        </div>
      </div>
    </main>
  )
}

export { StatusPage }
