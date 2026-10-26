import type { NextConfig } from "next"

import { backendUrl } from "./lib/backend"

const nextConfig: NextConfig = {
  // The browser only ever talks to this origin, so the backend's session
  // cookie is first-party and no CORS is needed.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }]
  },
}

export default nextConfig
