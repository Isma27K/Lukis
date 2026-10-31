import { MailIcon } from "lucide-react"

import { ResendVerificationButton } from "@/components/auth/verify-email"

// Shown across workspace pages until the signup email's link is followed.
function VerifyEmailBanner({ email }: { email: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 border-b border-note-ink/10 bg-note-yellow px-4 py-2 text-sm text-note-ink">
      <MailIcon className="size-4" />
      <span>Confirm your email address with the link we sent to {email}.</span>
      <ResendVerificationButton
        variant="link"
        className="h-auto px-0 text-note-ink underline"
      />
    </div>
  )
}

export { VerifyEmailBanner }
