import type { NextConfig } from "next"

import { backendUrl } from "./lib/backend"

const nextConfig: NextConfig = {
  // A self-contained server in .next/standalone, for the Docker image (which
  // sets NEXT_OUTPUT). Off otherwise, since `next start` warns about it.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  // `next dev` only: lets the app load from 127.0.0.1 too. Cookies are kept
  // per host name, so that's a logged-out browser for trying public links
  // (the backend's FRONTEND_ORIGIN needs it as well, for live editing).
  allowedDevOrigins: ["127.0.0.1"],
  // The browser only ever talks to this origin, so the backend's session
  // cookie is first-party and no CORS is needed.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }]
  },
}

export default nextConfig
