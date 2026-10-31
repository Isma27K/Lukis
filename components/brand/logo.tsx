import { cn } from "cn"

import { LogoMark } from "@/components/brand/logo-mark"

const SIZES = {
  sm: { mark: "size-9", text: "text-3xl", gap: "gap-1.5" },
  lg: { mark: "size-16", text: "text-6xl", gap: "gap-3" },
}

// The mark and the "lukis" wordmark in the editor's hand-drawn font.
function Logo({
  size = "sm",
  animate = false,
  className,
}: {
  size?: keyof typeof SIZES
  animate?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-hand leading-none text-foreground",
        SIZES[size].gap,
        SIZES[size].text,
        className
      )}
    >
      <LogoMark animate={animate} className={SIZES[size].mark} />
      <span className="-mt-[0.1em]">lukis</span>
    </span>
  )
}

export { Logo }
