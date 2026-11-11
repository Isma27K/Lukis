import { cn } from "cn"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CtaButtons } from "@/components/marketing/cta-buttons"
import { TickList } from "@/components/marketing/parts"
import { getVisitor } from "@/components/marketing/visitor"
import { pageMetadata, pricingPublic } from "@/lib/site"

// Not decided yet, so not advertised: only the site owner can open this
// until PRICING_PAGE=public, and search engines are told to skip it. Nothing
// links here, and it's left out of the sitemap and robots.txt.
export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMetadata({
      title: "Pricing",
      description:
        "Plans for individuals, teams and organizations using Lukis.",
      path: "/pricing",
    }),
    ...(!pricingPublic() && { robots: { index: false, follow: false } }),
  }
}

// A draft to decide on. Prices are placeholders; "Planned" marks what isn't
// built yet.
const PLANS = [
  {
    name: "Personal",
    price: "To be decided",
    blurb: "For your own sketches and the odd shared drawing.",
    points: [
      "Your personal workspace",
      "Version history",
      "Share links to view or edit",
      "Export to PNG and SVG",
    ],
  },
  {
    name: "Team",
    price: "To be decided, per member",
    blurb: "For teams who draw together every week.",
    points: [
      "Everything in Personal",
      "Team workspaces with roles",
      "Invites by email or link",
      "Live collaboration for the whole team",
    ],
    featured: true,
  },
  {
    name: "Organization",
    price: "Talk to us",
    blurb: "For companies and schools with their own rules.",
    points: [
      "Everything in Team",
      "Single sign-on (planned)",
      "Audit log (planned)",
      "Priority support",
    ],
  },
]

export default async function Page() {
  const visitor = await getVisitor()
  const isPublic = pricingPublic()
  if (!isPublic && !visitor.user?.site_owner) {
    notFound()
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-14 sm:px-8 lg:py-20">
      {!isPublic && (
        <p className="mx-auto max-w-xl rounded-lg border border-primary-edge/40 bg-highlight px-4 py-3 text-sm">
          <strong className="font-semibold">
            Draft, only you can see this.
          </strong>{" "}
          It&apos;s hidden from everyone else and from search engines. Set{" "}
          <code className="font-mono text-xs">PRICING_PAGE=public</code> on the
          frontend to publish it, then link it from the menu.
        </p>
      )}
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.98] font-semibold">
          Pricing
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Plans for individuals, teams and whole organizations.
        </p>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-3">
        {PLANS.map((plan, index) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col gap-4 overflow-hidden rounded-xl border bg-card p-6 shadow-paper",
              plan.featured && "border-primary-edge/60 shadow-paper-lg md:-mt-3"
            )}
          >
            {plan.featured && (
              <span
                aria-hidden
                className="-mx-6 -mt-6 mb-2 block h-2 bg-primary"
              />
            )}
            <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
            <p className="font-semibold">{plan.price}</p>
            <p className="text-sm text-muted-foreground">{plan.blurb}</p>
            <TickList
              items={plan.points}
              seed={700 + index * 10}
              className="border-t pt-4 text-sm"
            />
          </div>
        ))}
      </div>
      <CtaButtons visitor={visitor} className="justify-center" />
    </section>
  )
}
