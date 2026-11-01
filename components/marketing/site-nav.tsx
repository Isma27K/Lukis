import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { getVisitor } from "@/components/marketing/visitor"
import { buttonVariants } from "@/components/ui/button"

// The public site's top bar. On phones it keeps just the logo and the
// buttons.
async function SiteNav() {
  const visitor = await getVisitor()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link href="/" aria-label="Lukis home" className="shrink-0">
          <Logo />
        </Link>
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-sm sm:flex"
        >
          <Link
            href="/features"
            className="text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#faq"
            className="text-muted-foreground hover:text-foreground"
          >
            FAQ
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {visitor.user ? (
            <Link href="/" className={buttonVariants()}>
              Open your drawings
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
              >
                Log in
              </Link>
              {visitor.canRegister && (
                <Link href="/register" className={buttonVariants()}>
                  Start drawing
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export { SiteNav }
