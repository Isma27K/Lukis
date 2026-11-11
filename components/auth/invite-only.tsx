import Link from "next/link"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Shown instead of the sign-up form while only invited people can sign up.
function InviteOnly({ next, hadInvite }: { next: string; hadInvite: boolean }) {
  const loginHref =
    next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h1">Sign-up is invite-only</CardTitle>
        <CardDescription>
          {hadInvite
            ? "This link can't be used to create an account. It may have expired or been used already. "
            : "New accounts need an invite. "}
          Ask the site owner for an invite link.
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-muted-foreground">
        Already have an account?&nbsp;
        <Link href={loginHref} className="text-foreground underline">
          Log in
        </Link>
      </CardFooter>
    </Card>
  )
}

export { InviteOnly }
