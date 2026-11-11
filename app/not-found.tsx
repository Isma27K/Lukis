import Link from "next/link"

import { Erased } from "@/components/illustrations/spots"
import { StatusPage } from "@/components/status-page"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <StatusPage
      illustration={<Erased className="w-60" />}
      title="This page got erased."
      actions={
        <Link href="/" className={buttonVariants()}>
          Back to Lukis
        </Link>
      }
    >
      The link may be wrong, or it points into a workspace you&apos;re not part
      of.
    </StatusPage>
  )
}
