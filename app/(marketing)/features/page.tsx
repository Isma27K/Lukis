import { cn } from "cn"
import type { Metadata } from "next"

import { ProviderIcon } from "@/components/auth/provider-icon"
import { BlankCanvas, Together } from "@/components/illustrations/spots"
import { CtaButtons } from "@/components/marketing/cta-buttons"
import { ClosingCta, PrivacyPromise } from "@/components/marketing/home"
import {
  CanvasTile,
  SectionHeading,
  TickList,
} from "@/components/marketing/parts"
import {
  CanvasVignette,
  FollowFrame,
  HistoryVignette,
  MembersVignette,
  ShareVignette,
} from "@/components/marketing/vignettes"
import { getVisitor } from "@/components/marketing/visitor"
import { PROVIDER_LABELS } from "@/lib/oauth"
import { pageMetadata } from "@/lib/site"
import type { OAuthProvider } from "@/lib/types"

export const metadata: Metadata = pageMetadata({
  title: "Features",
  description:
    "An online whiteboard for real-time collaboration: live cursors, a hand-drawn canvas, version history, workspaces with roles, share links and one-click login.",
  path: "/features",
})

export default async function Page() {
  const visitor = await getVisitor()
  const logins = visitor.providers.map((p) => PROVIDER_LABELS[p])

  const sections = [
    {
      id: "collaboration",
      label: "Live collaboration",
      title: "Draw together, live",
      intro:
        "Real-time collaboration that feels like standing at the same whiteboard.",
      illustration: (
        <FollowFrame>
          <Together className="w-full" />
        </FollowFrame>
      ),
      points: [
        "See everyone's cursor, with their name and picture on it.",
        "Follow whoever's explaining, and your view moves with theirs.",
        "Draw at the same time without overwriting each other's work.",
        "Everything saves as you go. There's no save button to forget.",
      ],
    },
    {
      id: "canvas",
      label: "The canvas",
      title: "A whiteboard that feels like paper",
      intro:
        "An endless canvas with a hand-drawn look, so ideas stay loose and easy to change.",
      illustration: (
        <CanvasVignette>
          <BlankCanvas className="w-full" />
        </CanvasVignette>
      ),
      points: [
        "Shapes, arrows, lines, freehand drawing and text.",
        "Drop in images and screenshots, up to 4 MB each.",
        "Bright paper by day, a graphite drawing board in dark mode.",
        "Search the canvas, or jump anywhere with the command palette.",
      ],
    },
    {
      id: "history",
      label: "Version history",
      title: "Go back to any version",
      intro: "Try the wild idea. You can always get back to how it was.",
      illustration: <HistoryVignette />,
      points: [
        "While a drawing is being edited, Lukis keeps a version of it about every ten minutes.",
        "Give a version a name to keep it for good.",
        "Preview any version before you restore it.",
        "Restoring is a single step you can undo.",
      ],
    },
    {
      id: "workspaces",
      label: "Workspaces and roles",
      title: "Workspaces with the right roles",
      intro: "Keep each team's drawings together, and decide who can do what.",
      illustration: <MembersVignette />,
      points: [
        "A personal workspace for your own sketches.",
        "Team workspaces with owners, admins, editors and viewers.",
        "Invite people by email or with a link.",
        "Deleted drawings wait in the trash until an admin removes them.",
      ],
    },
    {
      id: "sharing",
      label: "Share links",
      title: "Share a drawing with anyone",
      intro:
        "Bring in a client, a classmate or the whole internet, one drawing at a time.",
      illustration: <ShareVignette />,
      points: [
        "Make a link that lets people view, or view and edit.",
        "Guests don't need an account; they just pick a name.",
        "Add a password for extra peace of mind.",
        "Switch the link off whenever you like.",
      ],
    },
    {
      id: "accounts",
      label: "Logging in",
      title: "Log in your way, stay in control",
      intro: "Getting in takes one click, and you can see every way in.",
      illustration: <LoginCard providers={visitor.providers} />,
      points: [
        logins.length > 0
          ? `Log in with your email and a password, or with ${new Intl.ListFormat("en", { type: "disjunction" }).format(logins)}.`
          : "Log in with your email and a password.",
        "See every device you're logged in on, and log any of them out.",
        "Passwords are stored as Argon2 hashes, never as the password itself.",
        "Delete your account yourself, any time.",
      ],
    },
  ]

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-7 px-4 pt-16 pb-10 text-center sm:px-8 lg:pt-24">
        <h1 className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.98] font-semibold">
          Everything on the board
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Lukis is an online whiteboard for teams who think out loud.
          Here&apos;s what&apos;s in the box.
        </p>
        <CtaButtons visitor={visitor} className="justify-center" />
        <nav
          aria-label="On this page"
          className="mt-4 flex max-w-3xl flex-wrap justify-center gap-2"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border bg-card px-3.5 py-1.5 text-sm text-muted-foreground shadow-[0_1px_2px_var(--paper-shadow)] transition-colors hover:border-[color-mix(in_oklch,var(--border),var(--foreground)_18%)] hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="grid scroll-mt-20 items-center gap-10 border-t py-16 md:grid-cols-2 md:gap-20 lg:py-24"
          >
            <CanvasTile
              className={cn(
                "w-full bg-background px-5 py-10 sm:px-10 sm:py-14",
                index % 2 && "md:order-last"
              )}
            >
              {section.illustration}
            </CanvasTile>
            <div className="flex flex-col gap-7">
              <SectionHeading title={section.title}>
                {section.intro}
              </SectionHeading>
              <TickList
                items={section.points}
                seed={500 + index * 10}
                className="text-lg"
              />
            </div>
          </section>
        ))}
      </div>

      <PrivacyPromise />
      <ClosingCta visitor={visitor} />
    </>
  )
}

// A little login screen, drawn as paper buttons.
function LoginCard({ providers }: { providers: OAuthProvider[] }) {
  return (
    <div
      aria-hidden
      className="flex w-full max-w-sm flex-col gap-3 rounded-xl border bg-card p-5 shadow-paper-lg"
    >
      <span className="font-display text-2xl font-semibold">Log in</span>
      {providers.map((provider) => (
        <span
          key={provider}
          className="flex h-10 items-center justify-center gap-2.5 rounded-md border border-input bg-card text-sm font-medium shadow-[0_1px_2px_var(--paper-shadow)]"
        >
          <ProviderIcon provider={provider} className="size-4" />
          Continue with {PROVIDER_LABELS[provider]}
        </span>
      ))}
      <span className="flex h-10 items-center rounded-md border px-3 text-sm text-muted-foreground">
        you@example.com
      </span>
      <span className="flex h-10 items-center justify-center rounded-md border border-primary-edge/60 bg-primary text-sm font-medium text-primary-foreground dark:border-transparent">
        Log in
      </span>
    </div>
  )
}
