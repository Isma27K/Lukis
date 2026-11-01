import type { MetadataRoute } from "next"

import {
  indexable,
  LEGAL_UPDATED,
  MARKETING_UPDATED,
  pricingPublic,
  siteUrl,
} from "@/lib/site"

type Page = {
  path: string
  updated: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [base, index] = await Promise.all([siteUrl(), indexable()])
  if (!index) {
    return []
  }
  const pages: Page[] = [
    {
      path: "/",
      updated: MARKETING_UPDATED,
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      path: "/features",
      updated: MARKETING_UPDATED,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    // Kept out until the owner publishes it (see lib/site.ts).
    ...(pricingPublic()
      ? [
          {
            path: "/pricing",
            updated: MARKETING_UPDATED,
            priority: 0.7,
            changeFrequency: "monthly" as const,
          },
        ]
      : []),
    {
      path: "/register",
      updated: MARKETING_UPDATED,
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      path: "/login",
      updated: MARKETING_UPDATED,
      priority: 0.4,
      changeFrequency: "yearly",
    },
    {
      path: "/privacy",
      updated: LEGAL_UPDATED,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      path: "/terms",
      updated: LEGAL_UPDATED,
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ]
  return pages.map(({ path, updated, priority, changeFrequency }) => ({
    url: new URL(path, base).toString(),
    lastModified: new Date(updated),
    changeFrequency,
    priority,
  }))
}
