"use client"

import { useEffect } from "react"
import { toast } from "sonner"

// Says how connecting an account went, once, when the provider sends the
// browser back (?connected= or ?oauth_error=), then tidies the URL so a
// reload doesn't say it again.
function OAuthNotice({ success, error }: { success?: string; error?: string }) {
  useEffect(() => {
    if (!success && !error) {
      return
    }
    // The id keeps React's double effects in development from showing two.
    if (error) {
      toast.error(error, { id: "oauth-result" })
    } else if (success) {
      toast.success(success, { id: "oauth-result" })
    }
    const url = new URL(window.location.href)
    for (const key of ["connected", "oauth_error", "provider"]) {
      url.searchParams.delete(key)
    }
    window.history.replaceState(window.history.state, "", url)
  }, [success, error])

  return null
}

export { OAuthNotice }
