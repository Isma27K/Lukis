import { cn } from "cn"
import type { Metadata } from "next"

import { ProviderIcon } from "@/components/auth/provider-icon"
import {
  BlankCanvas,
  Rewind,
  Roles,
  ShareLink,
  Together,
} from "@/components/illustrations/spots"
import { CtaButtons } from "@/components/marketing/cta-buttons"
import { ClosingCta, PrivacyPromise } from "@/components/marketing/home"
import { SectionHeading, TickList } from "@/components/marketing/parts"
import { getVisitor } from "@/components/marketing/visitor"
import { Highlight } from "@/components/sketch/highlight"
import { Tape } from "@/components/sketch/tape"
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
      title: (
        <>
          Draw together, <Highlight seed={21}>live</Highlight>
        </>
      ),
      intro:
        "Real-time collaboration that feels like standing at the same whiteboard.",
      illustration: <Together className="w-full" />,
      points: [
        "See everyone's cursor, with their name and picture on it.",
        "Follow whoever's explaining, and your view moves with theirs.",
        "Draw at the same time without overwriting each other's work.",
        "Everything saves as you go. There's no save button to forget.",
      ],
    },
    {
      id: "canvas",
      title: (
        <>
          A whiteboard that feels like <Highlight seed={22}>paper</Highlight>
        </>
      ),
      intro:
        "An endless canvas with a hand-drawn look, so ideas stay loose and easy to change.",
      illustration: <BlankCanvas className="w-full" />,
      points: [
        "Shapes, arrows, lines, freehand drawing and text.",
        "Drop in images and screenshots, up to 4 MB each.",
        "Warm paper by day, a chalkboard in dark mode.",
        "Search the canvas, or jump anywhere with the command palette.",
      ],
    },
    {
      id: "history",
      title: (
        <>
          Go back to <Highlight seed={23}>any version</Highlight>
        </>
      ),
      intro: "Try the wild idea. You can always get back to how it was.",
      illustration: <Rewind className="w-full" />,
      points: [
        "While a drawing is being edited, Lukis keeps a version of it about every ten minutes.",
        "Give a version a name to keep it for good.",
        "Preview any version before you restore it.",
        "Restoring is a single step you can undo.",
      ],
    },
    {
      id: "workspaces",
      title: (
        <>
          Workspaces with the <Highlight seed={24}>right roles</Highlight>
        </>
      ),
      intro: "Keep each team's drawings together, and decide who can do what.",
      illustration: <Roles className="w-full" />,
      points: [
        "A personal workspace for your own sketches.",
        "Team workspaces with owners, admins, editors and viewers.",
        "Invite people by email or with a link.",
        "Deleted drawings wait in the trash until an admin removes them.",
      ],
    },
    {
      id: "sharing",
      title: (
        <>
          Share a drawing with <Highlight seed={25}>anyone</Highlight>
        </>
      ),
      intro:
        "Bring in a client, a classmate or the whole internet, one drawing at a time.",
      illustration: <ShareLink className="w-full" />,
      points: [
        "Make a link that lets people view, or view and edit.",
        "Guests don't need an account; they just pick a name.",
        "Add a password for extra peace of mind.",
        "Switch the link off whenever you like.",
      ],
    },
    {
      id: "accounts",
      title: (
        <>
          Log in your way, <Highlight seed={26}>stay in control</Highlight>
        </>
      ),
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
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 pt-16 pb-8 text-center sm:px-6 lg:pt-20">
        <h1 className="font-hand text-6xl leading-[1.05] font-normal sm:text-7xl">
          Everything <Highlight seed={20}>on the board</Highlight>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Lukis is an online whiteboard for teams who think out loud.
          Here&apos;s what&apos;s in the box.
        </p>
        <CtaButtons visitor={visitor} />
      </section>

      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="mx-auto grid w-full max-w-6xl scroll-mt-20 items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-16"
        >
          <div
            className={cn("flex justify-center", index % 2 && "md:order-last")}
          >
            <div
              className={cn(
                "relative w-full max-w-sm rounded-2xl border bg-card p-8 shadow-paper",
                index % 2 ? "md:rotate-1" : "md:-rotate-1"
              )}
            >
              <Tape className="-top-2.5 left-1/2 -translate-x-1/2 rotate-2" />
              {section.illustration}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading title={section.title}>
              {section.intro}
            </SectionHeading>
            <TickList items={section.points} seed={500 + index * 10} />
          </div>
        </section>
      ))}

      <PrivacyPromise />
      <ClosingCta visitor={visitor} />
    </>
  )
}

// A little login screen, drawn as paper buttons.
function LoginCard({ providers }: { providers: OAuthProvider[] }) {
  return (
    <div aria-hidden className="flex flex-col gap-3 py-2">
      <span className="font-hand text-3xl">Log in</span>
      {providers.map((provider) => (
        <span
          key={provider}
          className="flex h-10 items-center justify-center gap-2.5 rounded-md border-[1.5px] border-ink bg-card text-sm font-medium shadow-sticker dark:border-foreground/50"
        >
          <ProviderIcon provider={provider} className="size-4" />
          Continue with {PROVIDER_LABELS[provider]}
        </span>
      ))}
      <span className="flex h-10 items-center rounded-md border px-3 text-sm text-muted-foreground">
        you@example.com
      </span>
      <span className="flex h-10 items-center justify-center rounded-md border-[1.5px] border-ink bg-primary text-sm font-medium text-primary-foreground shadow-sticker">
        Log in
      </span>
    </div>
  )
}
