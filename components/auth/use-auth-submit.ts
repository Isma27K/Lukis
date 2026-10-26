"use client"

import { useRouter } from "next/navigation"
import { useActionState } from "react"

import { ApiError, apiFetch } from "@/lib/api"

type AuthFormState = {
  // Either a form-wide error or per-field ones, never both.
  error?: string
  fieldErrors?: Record<string, string>
  // What was typed (minus the password), so a failed submit doesn't wipe it.
  values?: Record<string, string>
}

// Posts the form's fields as JSON to an /auth endpoint, which sets the session
// cookie, then moves on to `next`.
function useAuthSubmit(path: "/auth/login" | "/auth/register", next: string) {
  const router = useRouter()

  return useActionState(
    async (
      _state: AuthFormState,
      formData: FormData
    ): Promise<AuthFormState> => {
      const body = Object.fromEntries(formData) as Record<string, string>
      try {
        await apiFetch(path, { method: "POST", body })
      } catch (error) {
        const values = { ...body }
        delete values.password
        if (error instanceof ApiError) {
          return Object.keys(error.fieldErrors).length > 0
            ? { fieldErrors: error.fieldErrors, values }
            : { error: error.message, values }
        }
        return { error: "Couldn't reach the server. Please try again.", values }
      }
      router.replace(next)
      router.refresh()
      return {}
    },
    {}
  )
}

export { useAuthSubmit }
