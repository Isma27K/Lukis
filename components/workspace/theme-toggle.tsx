"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

function subscribe() {
  return () => {}
}

// Light, dark or follow the system. The `d` key also flips light and dark.
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // The saved theme is only known in the browser, so nothing is pressed in
  // the server render.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex rounded-lg border bg-sidebar-accent/60 p-0.5"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const pressed = mounted && theme === value
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={pressed}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-7 flex-1 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4",
              pressed && "bg-card text-foreground shadow-paper"
            )}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}

export { ThemeToggle }
