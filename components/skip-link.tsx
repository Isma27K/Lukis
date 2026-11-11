// The first stop for keyboard users: jumps past the navigation to the page.
function SkipLink({ href = "#content" }: { href?: string }) {
  return (
    <a
      href={href}
      className="fixed top-3 left-3 z-[60] -translate-y-16 rounded-md border bg-card px-3 py-2 text-sm font-medium shadow-paper-lg transition-transform focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  )
}

export { SkipLink }
