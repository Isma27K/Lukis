import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import {
  ClosingCta,
  Faq,
  FeatureGrid,
  HomeHero,
  HowItWorks,
  PrivacyPromise,
} from "@/components/marketing/home"
import { JsonLd } from "@/components/marketing/parts"
import { getVisitor } from "@/components/marketing/visitor"
import { getWorkspaces } from "@/lib/dal"
import { DESCRIPTION, pageMetadata, SITE_NAME, siteUrl } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  description: DESCRIPTION,
  path: "/",
})

// The front door. Logged-in people go straight to their drawings, so every
// "go home" link and redirect to / in the app still lands there; everyone
// else gets the public home page.
export default async function Page() {
  const visitor = await getVisitor()
  if (visitor.user) {
    const workspaces = await getWorkspaces()
    // Everyone gets a personal workspace at signup.
    const home =
      workspaces.find((workspace) => workspace.personal) ?? workspaces[0]
    if (!home) {
      notFound()
    }
    redirect(`/w/${home.id}`)
  }

  const url = (await siteUrl()).toString()
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${url}#organization`,
              name: SITE_NAME,
              url,
              logo: new URL("/icons/512", url).toString(),
            },
            {
              "@type": "WebSite",
              "@id": `${url}#website`,
              name: SITE_NAME,
              url,
              publisher: { "@id": `${url}#organization` },
            },
            // No `offers`: the price isn't advertised.
            {
              "@type": "WebApplication",
              name: SITE_NAME,
              url,
              description: DESCRIPTION,
              applicationCategory: "DesignApplication",
              operatingSystem: "Web",
              browserRequirements: "Requires JavaScript and a modern browser",
              publisher: { "@id": `${url}#organization` },
            },
          ],
        }}
      />
      <HomeHero visitor={visitor} />
      <FeatureGrid />
      <HowItWorks />
      <PrivacyPromise />
      <Faq visitor={visitor} />
      <ClosingCta visitor={visitor} />
    </>
  )
}
