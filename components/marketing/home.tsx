import { PlusIcon } from "lucide-react"
import Link from "next/link"

import { ProviderIcon } from "@/components/auth/provider-icon"
import { LogoMark } from "@/components/brand/logo-mark"
import { CollabScene } from "@/components/illustrations/collab-scene"
import { Padlock } from "@/components/illustrations/spots"
import { CtaButtons } from "@/components/marketing/cta-buttons"
import {
  ArrowLink,
  CanvasTile,
  EditorWindow,
  MarginNote,
  SectionHeading,
  TickList,
} from "@/components/marketing/parts"
import { HistoryVignette } from "@/components/marketing/vignettes"
import type { Visitor } from "@/components/marketing/visitor"
import { Strokes } from "@/components/sketch/strokes"
import { PROVIDER_LABELS } from "@/lib/oauth"
import { sketch } from "@/lib/sketch"
import type { OAuthProvider } from "@/lib/types"

// The sections of the home page. Copy only claims what Lukis really does,
// never calls it free, and never pitches self-hosting.

function HomeHero({ visitor }: { visitor: Visitor }) {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-x-14 gap-y-12 px-4 pt-10 pb-20 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:pt-16 lg:pb-28">
      <div className="flex flex-col items-start gap-7">
        <h1 className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.98] font-semibold">
          Sketch together.
        </h1>
        <p className="max-w-[31rem] text-lg leading-relaxed text-muted-foreground">
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
      <div className="relative">
        <EditorWindow title="Launch plan">
          <CollabScene />
        </EditorWindow>
        <MarginNote
          arrow="up-right"
          className="mt-4 ml-2 lg:absolute lg:-bottom-14 lg:-left-6 lg:mt-0 lg:ml-0"
        >
          No AI. No ads.
          <br />
          Just your team and a pen.
        </MarginNote>
      </div>
    </section>
  )
}

function LoginOptions({ providers }: { providers: OAuthProvider[] }) {
  const names = providers.map((provider) => PROVIDER_LABELS[provider])
  return (
    <Link
      href="/login"
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
    >
      <span className="flex items-center gap-1.5">
        {providers.map((provider) => (
          <ProviderIcon key={provider} provider={provider} className="size-4" />
        ))}
      </span>
      Log in with your email, {formatList(names, "or")}.
    </Link>
  )
}

function formatList(items: string[], joiner: "and" | "or") {
  return new Intl.ListFormat("en", {
    type: joiner === "and" ? "conjunction" : "disjunction",
  }).format(items)
}

// The feature the section leads with, shown as the panel itself.
const LEAD = {
  title: "Rewind any time",
  body: "Lukis keeps versions as you work. Name the ones that matter and bring any of them back in one step.",
}

const FEATURES = [
  {
    title: "Draw together, live",
    body: "Everyone's cursor has a name on it, every stroke shows up as it's drawn, and you can follow whoever's explaining.",
  },
  {
    title: "Workspaces for every team",
    body: "Give each team its own space, with owners, admins, editors and viewers who see only what they should.",
  },
  {
    title: "Share with a link",
    body: "Let anyone view or edit one drawing, add a password if you like, and switch the link off when you're done.",
  },
  {
    title: "Invite in seconds",
    body: "Send an invite by email, or copy the link and drop it in your team chat.",
  },
  {
    title: "Sketchy, never sloppy",
    body: "Shapes, arrows, text and images on an endless canvas, all with that hand-drawn feel. Dark mode turns it into a graphite drawing board.",
  },
]

// What's in the box: one feature shown as the real panel, then the rest as a
// ruled spec list.
function FeatureGrid() {
  return (
    <section className="border-y bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col items-start gap-8">
            <SectionHeading title="Everything your team needs on the board">
              Lukis is built around how people actually think together: fast,
              messy and all at once.
            </SectionHeading>
            <div className="flex max-w-md flex-col gap-2 border-t pt-6">
              <h3 className="text-xl font-semibold">{LEAD.title}</h3>
              <p className="text-muted-foreground">{LEAD.body}</p>
            </div>
            <ArrowLink href="/features">See every feature</ArrowLink>
          </div>
          <CanvasTile className="bg-background px-5 py-10 sm:px-12 sm:py-14">
            <HistoryVignette />
          </CanvasTile>
        </div>
        <dl className="mt-16 divide-y border-y lg:mt-24">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="grid gap-1.5 py-5 sm:grid-cols-[17rem_minmax(0,1fr)] sm:gap-10 sm:py-6"
            >
              <dt className="text-lg font-semibold">{feature.title}</dt>
              <dd className="max-w-2xl text-muted-foreground">
                {feature.body}
              </dd>
            </div>
          ))}
        </dl>
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

// The pad cover: the one place the orange takes a whole band of the page.
function PrivacyPromise() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:py-28">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[clamp(2.125rem,4vw,2.75rem)] leading-[1.08] font-semibold">
              Your drawings stay yours
            </h2>
            <p className="max-w-[34rem] text-lg text-primary-foreground">
              Half-finished ideas deserve a quiet place. Lukis keeps out of the
              way.
            </p>
          </div>
          <TickList
            items={PROMISES}
            seed={300}
            className="max-w-xl"
            tickClassName="text-primary-foreground"
          />
          <ArrowLink
            href="/privacy"
            className="text-primary-foreground decoration-primary-foreground"
          >
            Read the privacy policy
          </ArrowLink>
        </div>
        <CanvasTile className="mx-auto aspect-square w-full max-w-sm border-primary-foreground/20 shadow-paper-lg">
          <Padlock className="w-60" />
        </CanvasTile>
      </div>
    </section>
  )
}

const STEPS = [
  {
    title: "Make a workspace",
    body: "Start in your personal space, or make one for your team.",
  },
  {
    title: "Invite your team",
    body: "Send invites by email or link, and pick who edits and who just looks.",
  },
  {
    title: "Draw together",
    body: "Everyone sees every stroke as it happens. Lukis saves as you go.",
  },
] as const

// Three steps on one sheet, split by hairlines and joined by pen arrows.
function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
      <SectionHeading center title="From blank page to big picture" />
      <ol className="mt-12 grid divide-y rounded-2xl border bg-card shadow-paper md:grid-cols-3 md:divide-x md:divide-y-0 lg:mt-16">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col p-7 sm:p-9 lg:p-10"
          >
            <span
              aria-hidden
              className="font-display text-5xl leading-none font-semibold text-primary-ink tabular-nums"
            >
              {index + 1}
            </span>
            <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
            <p className="mt-1.5 max-w-xs text-muted-foreground">{step.body}</p>
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
      className="absolute top-10 -right-6 z-10 hidden w-12 bg-card text-foreground/70 md:block"
    >
      <Strokes
        paths={sketch.arrow(
          [
            [4, 20],
            [24, 8],
            [44, 18],
          ],
          { seed, strokeWidth: 2, head: 8, disableMultiStroke: true }
        )}
        animate
        delay={0.6}
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
      className="mx-auto grid w-full max-w-7xl scroll-mt-20 gap-10 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-28"
    >
      <SectionHeading
        className="lg:sticky lg:top-28 lg:self-start"
        title="Questions, answered"
      />
      <div className="divide-y border-y">
        {questions.map(({ question, answer }) => (
          <details key={question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium transition-colors hover:text-primary-ink [&::-webkit-details-marker]:hidden">
              <h3>{question}</h3>
              <span className="grid size-7 shrink-0 place-items-center rounded-full border bg-card transition-[rotate,background-color] duration-200 ease-out-expo group-open:rotate-45 group-open:bg-muted motion-reduce:transition-none">
                <PlusIcon aria-hidden className="size-3.5" />
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-muted-foreground">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function ClosingCta({ visitor }: { visitor: Visitor }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-4 pb-24 sm:px-8">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border bg-card dot-grid px-6 py-16 text-center shadow-paper sm:py-20">
        <LogoMark animate className="size-16" />
        <h2 className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none font-semibold">
          Grab a pen.
        </h2>
        <p className="max-w-md text-lg text-muted-foreground">
          Your team&apos;s next big idea starts as a scribble. Give it somewhere
          to land.
        </p>
        <CtaButtons visitor={visitor} className="justify-center" />
      </div>
    </section>
  )
}

export { ClosingCta, Faq, FeatureGrid, HomeHero, HowItWorks, PrivacyPromise }
