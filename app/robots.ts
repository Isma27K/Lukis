import type { MetadataRoute } from "next"

// Everything is behind a login or a private link, so crawlers get nothing.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } }
}
