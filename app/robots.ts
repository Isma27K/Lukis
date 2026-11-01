import type { MetadataRoute } from "next"

import { indexable, siteUrl } from "@/lib/site"

// The app itself is behind a login, so crawlers only get the public pages.
// Pages that need a token (shared links, password resets, email links) stay
// crawlable but say noindex themselves, which only works if crawlers can
// read them. /pricing isn't listed either: naming it here would advertise
// it, and it's a 404 to them anyway.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const [base, index] = await Promise.all([siteUrl(), indexable()])
  if (!index) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/w/", "/d/", "/account", "/admin", "/invite/"],
    },
    sitemap: new URL("/sitemap.xml", base).toString(),
  }
}
