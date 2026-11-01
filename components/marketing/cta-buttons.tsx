import { cn } from "cn"
import Link from "next/link"

import type { Visitor } from "@/components/marketing/visitor"
import { buttonVariants } from "@/components/ui/button"

// The main call to action, which depends on who's looking: their drawings
// if they're logged in, otherwise sign-up (or just logging in while sign-up
// is invite-only). `secondary` adds an outline button beside it.
function CtaButtons({
  visitor,
  secondary,
  className,
}: {
  visitor: Visitor
  secondary?: { href: string; label: string }
  className?: string
}) {
  const primary = visitor.user
    ? { href: "/", label: "Open your drawings" }
    : visitor.canRegister
      ? { href: "/register", label: "Start drawing" }
      : { href: "/login", label: "Log in" }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link
        href={primary.href}
        className={buttonVariants({ size: "lg", className: "px-5" })}
      >
        {primary.label}
      </Link>
      {secondary && (
        <Link
          href={secondary.href}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "px-5",
          })}
        >
          {secondary.label}
        </Link>
      )}
    </div>
  )
}

export { CtaButtons }
