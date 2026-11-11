// Jump links to a settings page's sections, beside them on wide screens.
function SectionNav({
  sections,
}: {
  sections: { id: string; label: string }[]
}) {
  return (
    <nav aria-label="Settings sections" className="hidden lg:block">
      <ul className="sticky top-20 flex flex-col border-l text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { SectionNav }
