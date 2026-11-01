import { cn } from "cn"
import { ArrowRightIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

import { ProviderIcon } from "@/components/auth/provider-icon"
import { CollabScene } from "@/components/illustrations/collab-scene"
import {
  BlankCanvas,
  Envelope,
  Padlock,
  Rewind,
  Roles,
  ShareLink,
  Together,
} from "@/components/illustrations/spots"
import { CtaButtons } from "@/components/marketing/cta-buttons"
import {
  FeatureCard,
  SectionHeading,
  TickList,
} from "@/components/marketing/parts"
import type { Visitor } from "@/components/marketing/visitor"
import { Highlight } from "@/components/sketch/highlight"
import { StickyNote } from "@/components/sketch/sticky-note"
import { Strokes } from "@/components/sketch/strokes"
import { Tape } from "@/components/sketch/tape"
import { PROVIDER_LABELS } from "@/lib/oauth"
import { sketch } from "@/lib/sketch"
import type { OAuthProvider } from "@/lib/types"

// The sections of the home page. Copy only claims what Lukis really does,
// never calls it free, and never pitches self-hosting.

function HomeHero({ visitor }: { visitor: Visitor }) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:pt-20 lg:pb-24">
      <div className="flex flex-col items-start gap-6">
        <span className="rounded-full bg-note-green px-3 py-1 text-xs font-medium text-note-ink">
          No AI. No ads. Just your team and a pen.
        </span>
        <h1 className="font-hand text-6xl leading-[1.05] font-normal sm:text-7xl">
          <Highlight seed={8}>Sketch</Highlight> together.
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Lukis is a hand-drawn whiteboard for teams. Map out ideas, diagrams
          and plans on one canvas, watch each other&apos;s cursors move as you
          think out loud, and keep every version along the way.
        </p>
        <CtaButtons
          visitor={visitor}
          secondary={{ href: "/features", label: "See what's inside" }}
        />
        {!visitor.user && visitor.providers.length > 0 && (
          <LoginOptions providers={visitor.providers} />
        )}
      </div>
      <div className="relative lg:rotate-1">
        <Tape className="-top-2.5 left-10 -rotate-6" />
        <Tape className="-top-2.5 right-10 rotate-3" />
        <div className="rounded-2xl border bg-dot-grid p-4 shadow-paper-lg">
          <CollabScene />
        </div>
      </div>
    </section>
  )
}

function LoginOptions({ providers }: { providers: OAuthProvider[] }) {
  const names = providers.map((provider) => PROVIDER_LABELS[provider])
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        {providers.map((provider) => (
          <ProviderIcon key={provider} provider={provider} className="size-4" />
        ))}
      </span>
      Log in with your email, {formatList(names, "or")}.
    </p>
  )
}

function formatList(items: string[], joiner: "and" | "or") {
  return new Intl.ListFormat("en", {
    type: joiner === "and" ? "conjunction" : "disjunction",
  }).format(items)
}

const FEATURES = [
  {
    title: "Draw together, live",
    illustration: <Together className="w-48" />,
    body: "Everyone's cursor has a name on it, every stroke shows up as it's drawn, and you can follow whoever's explaining.",
  },
  {
    title: "Rewind any time",
    illustration: <Rewind className="w-48" />,
    body: "Lukis keeps versions as you work. Name the ones that matter and bring any of them back in one step.",
  },
  {
    title: "Workspaces for every team",
    illustration: <Roles className="w-48" />,
    body: "Give each team its own space, with owners, admins, editors and viewers who see only what they should.",
  },
  {
    title: "Share with a link",
    illustration: <ShareLink className="w-48" />,
    body: "Let anyone view or edit one drawing, add a password if you like, and switch the link off when you're done.",
  },
  {
    title: "Invite in seconds",
    illustration: <Envelope className="w-48" />,
    body: "Send an invite by email, or copy the link and drop it in your team chat.",
  },
  {
    title: "Sketchy, never sloppy",
    illustration: <BlankCanvas className="w-48" />,
    body: "Shapes, arrows, text and images on an endless canvas, all with that hand-drawn feel. Dark mode turns it into a chalkboard.",
  },
]

function FeatureGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        center
        title={
          <>
            Everything your team needs{" "}
            <Highlight seed={11}>on the board</Highlight>
          </>
        }
      >
        Lukis is built around how people actually think together: fast, messy
        and all at once.
      </SectionHeading>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            illustration={feature.illustration}
            seed={50 + index}
          >
            {feature.body}
          </FeatureCard>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/features"
          className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          See every feature
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  )
}

const PROMISES = [
  <>
    <strong className="font-semibold">No AI.</strong> Lukis has no AI features,
    and your drawings are never used to train AI models.
  </>,
  <>
    <strong className="font-semibold">No ads, no ad trackers.</strong> We
    don&apos;t sell your data or follow you around the web.
  </>,
  <>
    <strong className="font-semibold">Private until you share.</strong> Only
    people in a workspace can open its drawings. Share links are up to you, and
    you can switch them off any time.
  </>,
  <>
    <strong className="font-semibold">Gone when you go.</strong> Delete your
    account and your personal drawings are deleted with it.
  </>,
]

function PrivacyPromise() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="relative grid items-center gap-10 rounded-2xl border bg-card p-8 shadow-paper sm:p-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex justify-center">
          <Padlock className="w-64" />
        </div>
        <div className="flex flex-col gap-6">
          <SectionHeading
            title={
              <>
                Your drawings <Highlight seed={9}>stay yours</Highlight>
              </>
            }
          >
            Half-finished ideas deserve a quiet place. Lukis keeps out of the
            way.
          </SectionHeading>
          <TickList items={PROMISES} seed={300} />
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Read the privacy policy
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    title: "Make a workspace",
    body: "Start in your personal space, or make one for your team.",
    color: "yellow",
    tilt: "md:-rotate-2",
  },
  {
    title: "Invite your team",
    body: "Send invites by email or link, and pick who edits and who just looks.",
    color: "pink",
    tilt: "md:rotate-1",
  },
  {
    title: "Draw together",
    body: "Everyone sees every stroke as it happens. Lukis saves as you go.",
    color: "blue",
    tilt: "md:-rotate-1",
  },
] as const

function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        center
        title={
          <>
            From blank page to <Highlight seed={12}>big picture</Highlight>
          </>
        }
      />
      <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-16">
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative">
            <StickyNote
              color={step.color}
              className={cn("flex min-h-44 flex-col gap-2", step.tilt)}
            >
              <span aria-hidden className="font-hand text-4xl leading-none">
                {index + 1}
              </span>
              <h3 className="font-hand text-2xl font-normal">{step.title}</h3>
              <p className="text-sm">{step.body}</p>
            </StickyNote>
            {index < STEPS.length - 1 && <StepArrow seed={400 + index} />}
          </li>
        ))}
      </ol>
    </section>
  )
}

function StepArrow({ seed }: { seed: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 32"
      className="absolute top-1/2 -right-14 hidden w-12 -translate-y-1/2 text-primary md:block"
    >
      <Strokes
        paths={sketch.arrow(
          [
            [4, 20],
            [24, 8],
            [44, 18],
          ],
          { seed, strokeWidth: 2.2, head: 8, disableMultiStroke: true }
        )}
      />
    </svg>
  )
}

function Faq({ visitor }: { visitor: Visitor }) {
  const providers = visitor.providers.map((p) => PROVIDER_LABELS[p])
  const questions = [
    {
      question: "Does Lukis use AI?",
      answer:
        "No. There are no AI features, nothing you draw is sent to an AI service, and your drawings are never used to train AI models.",
    },
    {
      question: "Who can see my drawings?",
      answer:
        "Drawings live in workspaces. Your personal workspace is just yours; a team workspace is open to the people invited to it, with the role they were given. A drawing is only visible to anyone else if you make a share link for it, and you can switch that link off any time.",
    },
    {
      question: "Can I get my drawings out?",
      answer:
        "Yes. Save any drawing as a PNG or SVG image from the editor's menu, with or without its background.",
    },
    {
      question: "How do I log in?",
      answer:
        providers.length > 0
          ? `With your email address and a password, or with ${formatList(providers, "or")}. You can connect more than one on your account page.`
          : "With your email address and a password.",
    },
    {
      question: "Can people outside my team join in?",
      answer:
        "Make a share link for a drawing and anyone with it can look, or draw along if you allow editing. They don't need an account.",
    },
    {
      question: "What happens if I delete my account?",
      answer:
        "Your personal workspace and the workspaces only you are in are deleted with their drawings. Drawings in workspaces you share with others stay with those workspaces.",
    },
  ]

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6"
    >
      <SectionHeading
        center
        title={
          <>
            Questions, <Highlight seed={14}>answered</Highlight>
          </>
        }
      />
      <div className="mt-10 divide-y rounded-xl border bg-card shadow-paper">
        {questions.map(({ question, answer }) => (
          <details key={question} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              <h3>{question}</h3>
              <PlusIcon
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45 motion-reduce:transition-none"
              />
            </summary>
            <p className="pt-3 text-sm text-muted-foreground">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function ClosingCta({ visitor }: { visitor: Visitor }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-8 pb-20 sm:px-6">
      <div className="relative flex flex-col items-center gap-5 rounded-2xl bg-note-yellow px-6 py-14 text-center text-note-ink shadow-note">
        <Tape className="-top-2.5 left-1/2 -translate-x-1/2 -rotate-2" />
        <h2 className="font-hand text-5xl font-normal sm:text-6xl">
          Grab a pen.
        </h2>
        <p className="max-w-md">
          Your team&apos;s next big idea starts as a scribble. Give it somewhere
          to land.
        </p>
        <CtaButtons visitor={visitor} />
      </div>
    </section>
  )
}

export { ClosingCta, Faq, FeatureGrid, HomeHero, HowItWorks, PrivacyPromise }
