import { Logo } from "@/components/brand/logo"

// A single card on dotted paper under the wordmark: the sign-in pages, email
// confirmation and invites. Card titles here are hand-lettered.
function PaperPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-dot-grid p-6">
      <div className="flex flex-col items-center gap-3">
        <Logo size="lg" />
        <p className="text-sm text-muted-foreground">Sketch together.</p>
      </div>
      <div className="w-full max-w-sm [&_[data-slot=card-title]]:font-hand [&_[data-slot=card-title]]:text-3xl [&_[data-slot=card-title]]:font-normal">
        {children}
      </div>
    </main>
  )
}

export { PaperPage }
