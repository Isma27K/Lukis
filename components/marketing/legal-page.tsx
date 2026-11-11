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
    <article className="mx-auto w-full max-w-[46rem] px-4 py-14 sm:px-8 lg:py-20">
      <header className="flex flex-col gap-3 pb-10">
        <h1 className="font-display text-[clamp(2.125rem,4vw,2.75rem)] leading-[1.05] font-semibold">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated <time dateTime={updated}>{date}</time>
        </p>
      </header>
      <div className="rounded-2xl border bg-card p-6 text-base leading-relaxed shadow-paper sm:p-10 [&_a]:text-primary-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_li]:mt-1.5 [&_p]:mt-3 [&_pre]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:whitespace-pre-wrap [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  )
}

export { LegalPage }
