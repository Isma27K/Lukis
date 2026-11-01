import type { Metadata, Viewport } from "next"
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DESCRIPTION, indexable, SITE_NAME, siteUrl, TAGLINE } from "@/lib/site"
import { cn } from "@/lib/utils"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// The editor's hand-drawn font, for the wordmark and titles only. A copy of
// its Latin subset lives here so pages don't depend on the editor build.
const fontHand = localFont({
  src: "./fonts/excalifont-latin.woff2",
  variable: "--font-hand",
  display: "swap",
})

// Pages override the title, description and canonical address; the share
// image comes from opengraph-image.tsx. Search engines are kept out unless
// this is the real site (PUBLIC_URL set).
export async function generateMetadata(): Promise<Metadata> {
  const [base, index] = await Promise.all([siteUrl(), indexable()])
  return {
    metadataBase: base,
    title: {
      default: `${SITE_NAME}: ${TAGLINE.toLowerCase()}`,
      template: `%s · ${SITE_NAME}`,
    },
    description: DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title: `${SITE_NAME}: ${TAGLINE}`,
      description: DESCRIPTION,
    },
    twitter: { card: "summary_large_image" },
    robots: index ? undefined : { index: false, follow: false },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1b201e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        fontHand.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
