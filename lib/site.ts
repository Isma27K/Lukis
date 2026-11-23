import "server-only"

import { connection } from "next/server"

// The name and wording that browser tabs, link previews and the install
// manifest show.

const SITE_NAME = "Lukis"
const TAGLINE = "The hand-drawn whiteboard for teams"
const DESCRIPTION =
  "Lukis is a hand-drawn whiteboard built on Excalidraw, with workspaces, live collaboration, version history and share links."

// The address link previews point at. Read when a request comes in, not at
// build time: CI builds the Docker image before anyone knows the domain it'll
// serve.
async function siteUrl(): Promise<URL> {
  await connection()
  return new URL(process.env.PUBLIC_URL || "http://localhost:3000")
}

export { DESCRIPTION, SITE_NAME, TAGLINE, siteUrl }
