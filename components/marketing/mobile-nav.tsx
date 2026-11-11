"use client"

import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// The public site's menu on phones, where the links don't fit in the bar.
function MobileNav({
  links,
  actions,
}: {
  links: { href: string; label: string }[]
  actions: { href: string; label: string; primary?: boolean }[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="sm:hidden">
            <MenuIcon />
            <span className="sr-only">Menu</span>
          </Button>
        }
      />
      <SheetContent side="top" className="gap-0 pb-6">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-sm font-medium text-muted-foreground">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Main" className="flex flex-col px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b py-3.5 text-lg font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 px-4 pt-5">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => setOpen(false)}
              className={buttonVariants({
                variant: action.primary ? "default" : "outline",
                size: "lg",
              })}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
