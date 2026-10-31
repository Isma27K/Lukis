// Jump links to a settings page's sections, beside them on wide screens.
function SectionNav({
  sections,
}: {
  sections: { id: string; label: string }[]
}) {
  return (
    <nav aria-label="Settings sections" className="hidden lg:block">
      <ul className="sticky top-20 flex flex-col gap-1 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
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
