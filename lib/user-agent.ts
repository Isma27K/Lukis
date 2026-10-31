// A rough "Firefox on Linux" for the account page's list of devices. Good
// enough to recognize your own devices; no attempt at versions or rare
// browsers.

type DeviceKind = "desktop" | "phone" | "tablet"

// Order matters: Edge and Opera also say Chrome, and Chrome also says Safari.
const BROWSERS: [RegExp, string][] = [
  [/Edg(e|A|iOS)?\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/SamsungBrowser\//, "Samsung Internet"],
  [/Firefox\/|FxiOS\//, "Firefox"],
  [/Chrome\/|CriOS\//, "Chrome"],
  [/Safari\//, "Safari"],
]

const SYSTEMS: [RegExp, string][] = [
  [/iPhone|iPod/, "iPhone"],
  [/iPad/, "iPad"],
  [/Android/, "Android"],
  [/CrOS/, "ChromeOS"],
  [/Windows/, "Windows"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/Linux/, "Linux"],
]

function match(userAgent: string, table: [RegExp, string][]) {
  return table.find(([pattern]) => pattern.test(userAgent))?.[1]
}

function describeDevice(userAgent: string | null): {
  label: string
  kind: DeviceKind
} {
  if (!userAgent) {
    return { label: "Unknown device", kind: "desktop" }
  }
  const browser = match(userAgent, BROWSERS)
  const system = match(userAgent, SYSTEMS)
  const kind: DeviceKind =
    /iPad|Tablet/.test(userAgent) ||
    (/Android/.test(userAgent) && !/Mobile/.test(userAgent))
      ? "tablet"
      : /Mobi|iPhone|iPod/.test(userAgent)
        ? "phone"
        : "desktop"
  const label =
    browser && system
      ? `${browser} on ${system}`
      : (browser ?? system ?? "Unknown device")
  return { label, kind }
}

export { describeDevice }
export type { DeviceKind }
