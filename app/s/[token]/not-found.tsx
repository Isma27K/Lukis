import Link from "next/link"

import { Erased } from "@/components/illustrations/spots"
import { StatusPage } from "@/components/status-page"
import { buttonVariants } from "@/components/ui/button"

// A public link that doesn't work: wrong, turned off, reset or expired.
export default function NotFound() {
  return (
    <StatusPage
      illustration={<Erased className="w-60" />}
      title="This link doesn't work."
      actions={
        <Link href="/" className={buttonVariants()}>
          Go to Lukis
        </Link>
      }
    >
      Whoever shared it may have turned it off, made a new one, or let it
      expire. Ask them for a fresh link.
    </StatusPage>
  )
}
