import Link from "next/link"

import { Logo } from "@/components/brand/logo"

// The signed-out pages, email confirmation and invites. On wide screens a
// canvas sheet with a drawn scene sits beside the form; on small screens
// the scene gives way to the wordmark. The form is a plain white sheet.
function AuthShell({
  scene,
  heading = "Sketch together.",
  blurb = "Whiteboards for your team. Draw, think out loud and watch each other's cursors move, live.",
  children,
}: {
  scene: React.ReactNode
  heading?: string
  blurb?: string
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <section className="hidden p-3 lg:flex">
        <div className="relative flex flex-1 flex-col gap-8 overflow-hidden rounded-2xl border bg-card dot-grid p-10 shadow-paper">
          <Link href="/" aria-label="Lukis home" className="w-fit">
            <Logo animate />
          </Link>
          <div className="mx-auto flex w-full max-w-xl flex-1 items-center">
            {scene}
          </div>
          <div className="max-w-md">
            <p className="font-display text-[clamp(2.125rem,4vw,2.75rem)] leading-[1.05] font-semibold">
              {heading}
            </p>
            <p className="mt-3 text-[0.9375rem] text-muted-foreground">
              {blurb}
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-2 lg:hidden">
          <Link href="/" aria-label="Lukis home">
            <Logo size="lg" animate />
          </Link>
          <p className="text-sm text-muted-foreground">{heading}</p>
        </div>
        <div className="w-full max-w-sm motion-safe:animate-rise [&_[data-slot=card-title]]:font-display [&_[data-slot=card-title]]:text-2xl [&_[data-slot=card-title]]:leading-tight [&_[data-slot=card]]:shadow-paper-lg">
          {children}
        </div>
      </section>
    </main>
  )
}

export { AuthShell }
