import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Highlight } from "@/components/sketch/highlight"
import { Tape } from "@/components/sketch/tape"

// The signed-out pages, email confirmation and invites: a drawn scene with a
// tagline on dotted paper, and one taped-down card beside it. On small
// screens the scene gives way to the wordmark. Card titles are hand-lettered.
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
    <main className="grid min-h-svh lg:grid-cols-[1.15fr_1fr]">
      <section className="relative hidden flex-col gap-8 overflow-hidden border-r bg-dot-grid p-10 lg:flex">
        <Link href="/" aria-label="Lukis home" className="w-fit">
          <Logo animate />
        </Link>
        <div className="mx-auto flex w-full max-w-2xl flex-1 items-center">
          {scene}
        </div>
        <div className="max-w-lg">
          <h2 className="font-hand text-5xl leading-tight">
            <Highlight seed={8}>{heading}</Highlight>
          </h2>
          <p className="mt-3 text-muted-foreground">{blurb}</p>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-8 bg-dot-grid p-6 lg:bg-background lg:bg-none">
        <div className="flex flex-col items-center gap-3 lg:hidden">
          <Logo size="lg" animate />
          <p className="text-sm text-muted-foreground">{heading}</p>
        </div>
        <div className="relative w-full max-w-sm [&_[data-slot=card-title]]:font-hand [&_[data-slot=card-title]]:text-3xl [&_[data-slot=card-title]]:font-normal [&_[data-slot=card]]:shadow-paper-lg">
          <Tape className="-top-2.5 left-1/2 -translate-x-1/2 -rotate-3" />
          {children}
        </div>
      </section>
    </main>
  )
}

export { AuthShell }
