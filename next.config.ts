import type { NextConfig } from "next"

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

const nextConfig: NextConfig = {
  // The browser only ever talks to this origin, so the backend's session
  // cookie is first-party and no CORS is needed.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }]
  },
}

export default nextConfig
