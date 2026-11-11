import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteNav } from "@/components/marketing/site-nav"
import { SkipLink } from "@/components/skip-link"

// The public site: the home page, features, legal pages. Open to everyone,
// logged in or not (see PUBLIC_PATHS in proxy.ts).
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SkipLink />
      <SiteNav />
      <main
        id="content"
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
