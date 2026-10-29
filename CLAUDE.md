# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev         # next dev (also re-syncs the managed block in AGENTS.md)
npm run build       # production build
npm run lint        # eslint (flat config: next core-web-vitals + typescript)
npx eslint app/page.tsx   # lint a single file
npm run typecheck   # tsc --noEmit
npm run format      # prettier --write on **/*.{ts,tsx} only
npx shadcn@latest add <component>   # add a shadcn/ui component into components/ui/
npm run excalidraw:build   # rebuild the editor from ../excalidraw and reinstall it
```

There is no test framework set up yet.

## Stack and architecture

- **Next.js 16 App Router + React 19.** No `src/` directory: routes live in `app/`, and the `@/*` alias maps to the repo root (`@/components`, `@/lib`, `@/hooks`). The Next.js docs for this exact version are in `node_modules/next/dist/docs/` (`01-app/` covers the App Router). Check them before relying on remembered APIs (see AGENTS.md).
- **shadcn/ui, `base-mira` style** (`components.json`). Components are built on **Base UI (`@base-ui/react`), not Radix**, so composition and props follow Base UI conventions (for example the `render` prop instead of Radix's `asChild`). Base UI's docs are bundled at `node_modules/@base-ui/react/docs/` (start at `index.md`). Components generated into `components/ui/` are owned source and can be edited. Icons come from `lucide-react`.
- **Class merging uses the `cn` npm package** (shadcn's compiled stand-in for clsx + tailwind-merge). `lib/utils.ts` just re-exports it, so `@/lib/utils` and `"cn"` are interchangeable. Variants use `class-variance-authority` (`cva`).
- **Tailwind CSS v4, CSS-first.** There is no `tailwind.config`. All theme tokens are CSS variables in `app/globals.css`: light values on `:root`, dark values on `.dark`, exposed to Tailwind through `@theme inline`. Add or change design tokens there.
- **Theming:** `components/theme-provider.tsx` wraps `next-themes` with `attribute="class"`, so dark mode is the `.dark` class (`@custom-variant dark`). It also registers a global `d` hotkey that toggles light/dark. The hotkey is ignored while typing in inputs and for key events from inside `.excalidraw`, where `d` is the diamond tool. The root layout sets `suppressHydrationWarning` on `<html>` for this.
- **Excalidraw editor comes from the local clone at `../excalidraw`, not npm.** `scripts/build-excalidraw.sh` builds its packages, packs them into `vendor/excalidraw/*.tgz`, copies the editor fonts into `public/fonts/`, and installs the tarballs. Both output folders are gitignored, so a fresh checkout needs `npm run excalidraw:build` before `npm install` will work. The `@excalidraw/*` deps point at those tarballs, and the `overrides` in `package.json` make the editor's pinned internal versions (which aren't published on npm) resolve to them. Don't switch to `file:` directory links: the clone ships its own React and you'd get two copies. Make editor changes in `../excalidraw`, then rerun the script.
- **Editor embedding:** `components/editor/editor.tsx` loads `drawing-editor.tsx` through `next/dynamic` with `ssr: false`, because Excalidraw touches `window` on import. It sets `window.EXCALIDRAW_ASSET_PATH = "/"` first so fonts come from `public/fonts/`. The editor's theme follows `next-themes` (`theme` + `onThemeChange`). Check Excalidraw's API in `../excalidraw/packages/excalidraw` (`types.ts`, `index.tsx`), not from memory: this build is ahead of npm (for example it uses `onExcalidrawAPI`, not `excalidrawAPI`).
- **Saving drawings:**
  - `components/editor/use-autosave.ts` sends only the elements whose `version` changed since the last successful save, plus the editor's database app state when that changes.
  - It saves 1 s after the last change (at most every 5 s while drawing), and also on tab hide, page close and unmount.
  - The backend merges the sent elements into the stored scene using Excalidraw's own reconcile rule, so partial or concurrent saves never drop elements.
  - Deletions are sent as `isDeleted` tombstones; don't filter deleted elements out of saves.
- **Backend:** FastAPI lives in `../backend`. `next.config.ts` rewrites `/api/*` to `BACKEND_URL` (default `http://localhost:8000`), so browser code calls `/api/...` on the same origin. Rewrites are baked in at build time, while server components read `BACKEND_URL` at runtime, so set it for `next build` as well as `next start`.
- **Auth:**
  - The backend owns accounts and sets an httpOnly `lukis_session` cookie.
  - Browser code calls the backend through `apiFetch` (`lib/api.ts`). It always sends a JSON content type, because the backend rejects non-JSON mutations as a CSRF guard.
  - `proxy.ts` only checks that the cookie exists. The real check is `getCurrentUser` / `requireUser` in `lib/dal.ts`: server-only, cached per render, calling `/auth/me` with the cookie.
  - Server components read backend data through the other `lib/dal.ts` getters. These forward the cookie, send a 401 to `/login`, and turn a 404 into `notFound()`. The backend answers 404, not 403, for things in workspaces you aren't a member of.
  - The first account is the **site owner** (`user.site_owner`), which is separate from a workspace's `owner` role.
    - On a fresh install it needs a one-time setup code from the backend's logs (`registration: "setup"` in `getFeatures()`).
    - Only the owner sees `/admin` (Site settings), which switches open sign-up on or off and makes sign-up invites.
    - While sign-up is off (`registration: "invite_only"`), `/register` needs an invite link: `?invite=<token>` from a sign-up invite, or a workspace invite from the site owner, which arrives as `next=/invite/<token>` (`inviteToken` in `lib/auth.ts`).
    - The backend enforces all of it; the pages only hide what would fail.
  - Pages under `app/(auth)` are for logged-out users; pages under `app/(app)` require a session. `/verify-email` is outside both groups because it's opened from an email, logged in or not. Pages that work without a session must also be listed in `PUBLIC_PATHS` in `proxy.ts`.
  - Email is optional. The backend has it only when `SMTP_HOST` is set, and reports that through the public `GET /features` endpoint, read with `getFeatures()` in `lib/dal.ts`.
    - Without email, the features below are hidden and their endpoints answer 404. Invites are shared as links only.
    - Gate any new email-dependent UI on `getFeatures()` the same way.
  - Email verification (only with email):
    - Signing up emails a single-use link to `/verify-email`. It carries an optional `next` path, so an invitee lands back on their invite.
    - Accepting an invite requires a verified email. Until then the workspace layout shows `VerifyEmailBanner`.
  - Password reset (only with email) runs `/forgot-password` → emailed link → `/reset-password`. Resetting ends every session of the account.
  - The backend rate-limits logins, sign-ups and every action that sends email, answering 429 with a readable `detail`. `apiFetch` shows it like any other error.
- **Live collaboration:**
  - `components/editor/collab/collaboration.ts` is a trimmed port of Excalidraw's own `excalidraw-app/collab` client. Each open editor holds a plain WebSocket to the backend's relay (`../backend/function/realtime.py`), with automatic reconnects.
  - The socket goes through the `/api` rewrite (`/api/drawings/{id}/live`); Next.js forwards WebSocket upgrades on rewrites, so the backend never has to be public. `REALTIME_URL` (`lib/backend.ts`) is only an override for setups that can't carry WebSockets through Next.
  - Updates carry only elements whose `version` changed. Incoming elements go through `restoreElements` → `reconcileElements` → `updateScene` with `CaptureUpdateAction.NEVER`.
  - Every client still autosaves through REST; the server merge makes the duplicate saves harmless.
  - Follow mode is host-controlled: the `userToFollow` prop is set from `onUserFollow`.
  - `drawing-editor.tsx` hands the editor API to each helper from `onExcalidrawAPI` (`collaboration.attach`, `images.attach`), and fans `onChange` out to all of them.
- **Images:**
  - Image bytes live in S3-compatible storage (RustFS) behind the backend (`../backend/utils/storage.py`), keyed `drawings/{id}/files/{fileId}`. Scene elements only carry the `fileId`, which Excalidraw makes a SHA-1 of the file, so the first upload of an id wins.
  - The browser never talks to the storage server: uploads are JSON data URLs to `PUT /drawings/{id}/files/{fileId}`, downloads come from `GET` on the same path.
  - `components/editor/image-files.ts` ports Excalidraw's `FileManager`, driven entirely by `onChange` (which also fires for remote changes). Editors upload files the server lacks, then flip the image's `status` from `"pending"` to `"saved"`. That edit tells everyone else to download it. Failed transfers are retried with backoff.
  - The editor's 4 MB `imageOptions.maxFileSizeBytes` matches the backend's `MAX_FILE_BYTES`; change both together.
- **Thumbnails:** `components/editor/use-thumbnail.ts` renders the scene with `exportScene` (640×360, `fit: "contain"`) in both the light and dark themes. It runs after saves (at most every 15 s), on leaving the editor, and once for older drawings that lack one. The dashboard (`drawing-thumbnail.tsx`) shows the version matching the page theme from `/api/drawings/{id}/thumbnail/{theme}?v={thumbnail_version}`, as a plain `<img>`: the image optimizer can't send the session cookie. Lazy loading means the hidden theme's thumbnail is never fetched.
- **Trash:**
  - Deleting a drawing only sets `deleted_at`, and `/w/[id]/trash` lists trashed drawings.
  - Only admins and owners can do anything that removes a drawing from its workspace: trash it, restore it, delete it forever, or move it out. Editors only change content. This is `REMOVE_ROLE` in the backend and `canDeleteDrawings` in the UI.
  - Deleting forever (`DELETE /drawings/{id}/permanent`) also clears the drawing's storage prefix.
- **Workspaces and roles:**
  - `app/(app)/w/[workspaceId]/layout.tsx` wraps workspace pages in the sidebar (workspace switcher, navigation, user menu). The editor (`/d/[id]`) and the invite page (`/invite/[token]`) sit outside it.
  - Roles rank owner > admin > editor > viewer. The backend enforces them; `lib/roles.ts` mirrors the rules only to hide controls that would fail, so change both together.
  - Personal workspaces can't be shared or deleted; to collaborate you create a workspace and move drawings into it.
- **Deployment:**
  - `Dockerfile` builds Next's standalone server. `next.config.ts` only enables `output: "standalone"` when `NEXT_OUTPUT=standalone`, which the Dockerfile sets, because `next start` warns about it otherwise.
  - The image installs the editor from `vendor/excalidraw/*.tgz`, so run `npm run excalidraw:build` before `docker build`.
  - The compose stack (Caddy → Next → FastAPI → Mongo, plus daily backups to object storage) and its README are in `../backend/deploy`.
  - Server errors are logged as JSON lines by `instrumentation.ts` (`onRequestError`), matching the backend's logs.
- **CI** (`.github/workflows/ci.yml`):
  - It checks out `excalidraw/excalidraw` at the commit in `.excalidraw-ref` and builds the editor.
  - Then it runs lint, prettier, build and typecheck.
  - On pushes to `main` that pass, the same job builds the Docker image and pushes it to `ghcr.io/isma27k/lukis-frontend` (private, tagged `latest` and `sha-<commit>`), which `../backend/deploy/compose.yaml` pulls. The backend repo publishes `lukis-backend` the same way.
  - `scripts/build-excalidraw.sh` rewrites `.excalidraw-ref` on every run, so commit it together with `package-lock.json`.
- **Typecheck:** `tsc` reads generated route types from `.next/types`. After adding or removing pages, run `npm run build` (or `next dev`) first, or typecheck reports errors about stale routes.
- **Fonts:** `app/layout.tsx` loads Inter as `--font-sans` and Geist Mono as `--font-mono` via `next/font/google`.

## Code style

Prettier (`.prettierrc`, checked in CI): no semicolons, double quotes, `trailingComma: "es5"`, 80 columns, LF endings. `prettier-plugin-tailwindcss` sorts class names, including inside `cn()` and `cva()` calls, so don't hand-order Tailwind classes.
