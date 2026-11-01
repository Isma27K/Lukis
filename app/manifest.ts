import type { MetadataRoute } from "next"

import { DESCRIPTION, SITE_NAME, TAGLINE } from "@/lib/site"

// Lets browsers install Lukis like an app. Colors match `viewport` in the
// root layout; the icons come from app/icons/[size].
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: ${TAGLINE}`,
    short_name: SITE_NAME,
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#faf7f2",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
