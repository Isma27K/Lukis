import type { Instrumentation } from "next"

// Server errors as one JSON line each, matching the backend's logs, so
// `docker compose logs` can be searched and parsed the same way.
export const onRequestError: Instrumentation.onRequestError = (
  error,
  request,
  context
) => {
  const err = error instanceof Error ? error : new Error(String(error))
  console.error(
    JSON.stringify({
      time: new Date().toISOString(),
      level: "error",
      logger: "lukis.frontend",
      message: err.message,
      // Shown to the user on the error page, so reports can be matched up.
      digest: (error as { digest?: string }).digest,
      method: request.method,
      path: request.path,
      route: context.routePath,
      kind: context.routeType,
      error: err.stack,
    })
  )
}
