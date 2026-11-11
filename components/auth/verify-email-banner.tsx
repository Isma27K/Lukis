import { MailIcon } from "lucide-react"

import { ResendVerificationButton } from "@/components/auth/verify-email"

// Shown across workspace pages until the signup email's link is followed.
function VerifyEmailBanner({ email }: { email: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b bg-highlight px-4 py-2 text-sm text-foreground sm:px-8">
      <MailIcon className="size-4 text-primary-ink" />
      <span>Confirm your email address with the link we sent to {email}.</span>
      <ResendVerificationButton
        variant="link"
        className="h-auto px-0 text-foreground underline"
      />
    </div>
  )
}

export { VerifyEmailBanner }
