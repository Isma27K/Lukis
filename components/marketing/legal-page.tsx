import { Highlight } from "@/components/sketch/highlight"

// A long-form page (privacy policy, terms) on a sheet of paper, with plain
// HTML inside: h2, p, ul, a, strong.
function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  // YYYY-MM-DD.
  updated: string
  children: React.ReactNode
}) {
  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(updated))

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <header className="flex flex-col gap-3 pb-8">
        <h1 className="font-hand text-5xl leading-tight font-normal sm:text-6xl">
          <Highlight seed={31}>{title}</Highlight>
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated <time dateTime={updated}>{date}</time>
        </p>
      </header>
      <div className="rounded-2xl border bg-card p-6 text-[15px] leading-relaxed shadow-paper sm:p-10 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_li]:mt-1.5 [&_p]:mt-3 [&_pre]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:whitespace-pre-wrap [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  )
}

export { LegalPage }
