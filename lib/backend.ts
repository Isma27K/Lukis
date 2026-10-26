// Where server code (and the /api rewrite in next.config.ts) reaches FastAPI.
// The browser never uses it directly; it goes through /api on this origin.
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

// Live collaboration normally goes through the /api rewrite too, which keeps
// the backend private. Set REALTIME_URL to the backend's public address only
// if something in front of Next.js can't pass WebSockets through. Read at
// request time and handed to the editor as a prop.
const realtimeUrl = process.env.REALTIME_URL ?? ""

export { backendUrl, realtimeUrl }
