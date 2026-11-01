import "server-only"

import type { Metadata } from "next"
import { connection } from "next/server"

// The public site: its address, name and the wording search engines and
// link previews show. Copy rules: never call Lukis free, and never pitch
// self-hosting or open source (it's closed source, used only through this
// website).

const SITE_NAME = "Lukis"
const TAGLINE = "The hand-drawn whiteboard for teams"
const DESCRIPTION =
  "Lukis is a hand-drawn whiteboard for teams. Sketch ideas, diagrams and plans together with live cursors, version history and share links, and no AI reading your drawings."

// Who runs Lukis, for the footer and the legal pages.
// TODO(owner): fill these in, and have Privacy and Terms reviewed, before
// launch.
const OPERATOR_NAME = "Lukis"
const CONTACT_EMAIL = "binhelati@gmail.com"
const JURISDICTION = "MY"
// Shown on the legal pages and in the sitemap; bump when they change.
const LEGAL_UPDATED = "2026-11-01"
const MARKETING_UPDATED = "2026-11-01"

// Read when a request comes in, not at build time: CI builds the Docker
// image before anyone knows the domain it'll serve.
async function siteUrl(): Promise<URL> {
  await connection()
  return new URL(process.env.PUBLIC_URL || "http://localhost:3000")
}

// Only the real site, which sets PUBLIC_URL, is open to search engines;
// development and staging copies stay out of them.
async function indexable(): Promise<boolean> {
  await connection()
  return Boolean(process.env.PUBLIC_URL)
}

// /pricing stays a 404 for everyone but the site owner until this is set.
function pricingPublic(): boolean {
  return process.env.PRICING_PAGE === "public"
}

// The image app/opengraph-image.tsx draws. A page that sets `openGraph`
// replaces the inherited one, image included, so it's named here again.
const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Lukis: sketch together",
}

// Title, description, canonical address and link preview for a public page.
function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string
  description: string
  path: string
}): Metadata {
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: ${TAGLINE}`,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: [SHARE_IMAGE.url],
    },
  }
}

export {
  CONTACT_EMAIL,
  DESCRIPTION,
  JURISDICTION,
  LEGAL_UPDATED,
  MARKETING_UPDATED,
  OPERATOR_NAME,
  SITE_NAME,
  TAGLINE,
  indexable,
  pageMetadata,
  pricingPublic,
  siteUrl,
}
