import { MailIcon } from "lucide-react"

import { ResendVerificationButton } from "@/components/auth/verify-email"

// Shown across workspace pages until the signup email's link is followed.
function VerifyEmailBanner({ email }: { email: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 border-b bg-muted/50 px-4 py-1.5 text-xs">
      <MailIcon className="size-3.5 text-muted-foreground" />
      <span>Confirm your email address with the link we sent to {email}.</span>
      <ResendVerificationButton variant="link" className="h-auto px-0" />
    </div>
  )
}

export { VerifyEmailBanner }
