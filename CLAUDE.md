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
- **Editor embedding:** `components/editor/editor.tsx` loads `excalidraw-editor.tsx` through `next/dynamic` with `ssr: false`, because Excalidraw touches `window` on import. It sets `window.EXCALIDRAW_ASSET_PATH = "/"` first so fonts come from `public/fonts/`. The editor's theme follows `next-themes`.
- **Backend:** FastAPI lives in `../backend`. `next.config.ts` rewrites `/api/*` to `BACKEND_URL` (default `http://localhost:8000`), so browser code calls `/api/...` on the same origin.
- **Fonts:** `app/layout.tsx` loads Inter as `--font-sans` and Geist Mono as `--font-mono` via `next/font/google`.

## Code style

Prettier (`.prettierrc`): no semicolons, double quotes, `trailingComma: "es5"`, 80 columns, LF endings. `prettier-plugin-tailwindcss` sorts class names, including inside `cn()` and `cva()` calls, so don't hand-order Tailwind classes.
