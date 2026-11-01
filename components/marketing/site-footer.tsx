import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { getVisitor } from "@/components/marketing/visitor"
import { CONTACT_EMAIL, OPERATOR_NAME, TAGLINE } from "@/lib/site"

async function SiteFooter() {
  const visitor = await getVisitor()
  const product = [
    { href: "/features", label: "Features" },
    { href: "/#faq", label: "FAQ" },
    ...(visitor.user
      ? [{ href: "/", label: "Your drawings" }]
      : [
          { href: "/login", label: "Log in" },
          ...(visitor.canRegister
            ? [{ href: "/register", label: "Create an account" }]
            : []),
        ]),
  ]
  const company = [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: `mailto:${CONTACT_EMAIL}`, label: "Contact" },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-[1.6fr_1fr_1fr] sm:px-6">
        <div className="flex flex-col items-start gap-3">
          <Link href="/" aria-label="Lukis home">
            <Logo />
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">{TAGLINE}.</p>
        </div>
        <FooterLinks title="Product" links={product} />
        <FooterLinks title="Company" links={company} />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-2 border-t px-4 py-6 text-xs text-muted-foreground sm:px-6">
        <span>
          © {new Date().getFullYear()} {OPERATOR_NAME}
        </span>
        <span>Built on the Excalidraw editor.</span>
      </div>
    </footer>
  )
}

function FooterLinks({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <h2 className="font-semibold">{title}</h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { SiteFooter }
