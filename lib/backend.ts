// Where server code (and the /api rewrite in next.config.ts) reaches FastAPI.
// The browser never uses it directly; it goes through /api on this origin.
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

export { backendUrl }
