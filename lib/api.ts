class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    // Validation errors from FastAPI, keyed by field name.
    readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message)
  }
}

type FastApiValidationError = { loc: (string | number)[]; msg: string }

async function toApiError(response: Response) {
  const body = await response.json().catch(() => null)
  const detail: unknown = body?.detail

  if (Array.isArray(detail)) {
    const fieldErrors: Record<string, string> = {}
    for (const { loc, msg } of detail as FastApiValidationError[]) {
      fieldErrors[String(loc.at(-1))] ??= msg
    }
    return new ApiError(response.status, "Please check the form.", fieldErrors)
  }
  if (typeof detail === "string") {
    return new ApiError(response.status, detail)
  }
  return new ApiError(
    response.status,
    "Something went wrong. Please try again."
  )
}

// Browser-side calls to the backend, through the /api rewrite.
async function apiFetch<T = void>(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {}
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    // The backend refuses non-JSON mutations as a CSRF guard, even bodyless ones.
    headers:
      method === "GET" ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!response.ok) {
    throw await toApiError(response)
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

export { ApiError, apiFetch }
