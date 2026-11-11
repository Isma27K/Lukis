import { cn } from "cn"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { MobileNav } from "@/components/marketing/mobile-nav"
import { getVisitor } from "@/components/marketing/visitor"
import { buttonVariants } from "@/components/ui/button"

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
]

// The public site's top bar. On phones the links and buttons move into a
// menu, leaving the logo and the main button.
async function SiteNav() {
  const visitor = await getVisitor()
  const actions = visitor.user
    ? [{ href: "/", label: "Open your drawings", primary: true }]
    : [
        ...(visitor.canRegister
          ? [{ href: "/register", label: "Start drawing", primary: true }]
          : []),
        { href: "/login", label: "Log in", primary: !visitor.canRegister },
      ]
  const main = actions.find((action) => action.primary)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:gap-10 sm:px-8">
        <Link href="/" aria-label="Lukis home" className="shrink-0">
          <Logo />
        </Link>
        <nav
          aria-label="Main"
          className="hidden items-center gap-7 text-sm font-medium sm:flex"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {visitor.user ? (
            <Link href="/" className={buttonVariants()}>
              Open your drawings
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden sm:inline-flex"
                )}
              >
                Log in
              </Link>
              {main && main.href !== "/login" && (
                <Link href={main.href} className={buttonVariants()}>
                  {main.label}
                </Link>
              )}
              {!visitor.canRegister && (
                <Link
                  href="/login"
                  className={buttonVariants({ className: "sm:hidden" })}
                >
                  Log in
                </Link>
              )}
            </>
          )}
          <MobileNav links={LINKS} actions={actions} />
        </div>
      </div>
    </header>
  )
}

export { SiteNav }
