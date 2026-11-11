# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone who needs to sketch something out: ideas, diagrams, plans, explanations. Confirmed 2026-11-01: Lukis doesn't target one segment. Any page might be read by a student, a developer, a teacher or someone sketching alone.

It's used in these situations:

- **Alone:** a quick sketch in the personal workspace, opened again later.
- **Together, live:** one person explains while others watch the cursors or follow their view, and everyone can draw at once.
- **In a team:** a team workspace where members have roles and keep their drawings together over weeks.
- **With outsiders:** a client, classmate or anyone else opens one drawing through a share link. They pick a name and don't need an account.
- **Running the site:** the site owner (the first account) runs this copy of Lukis. They turn open sign-up on or off and send sign-up invites from `/admin`.

Open decision: the paid wedge customer has not been chosen. Engineering teams and classrooms/regional use were the candidates. That choice decides how billing is shaped. It doesn't narrow who the product is for.

## Product Purpose

Lukis is a hosted whiteboard with a hand-drawn look, built on the Excalidraw editor. Excalidraw has almost nothing on the product side, so Lukis adds it: accounts, a saved list of drawings, workspaces with roles, live collaboration, version history and share links.

Success means someone can open Lukis and start sketching right away. Their work is still there when they come back, and they can bring others in, without having to think about saving, access or losing work.

## Positioning

The headline position is **not decided** (confirmed 2026-11-01). The closest competitor is Excalidraw+. It already sells accounts, workspaces, collaboration, comments, presentations, AI and embeds.

- **Supporting point, not the headline:** no AI and private by default ("No AI. No ads." and "Your drawings stay yours" on the current site). Future work may use it but must not make it the whole pitch.
- **What Excalidraw+ doesn't list:** version history (built), templates and workspace libraries (planned), SSO (planned).
- **Identity:** the product looks and feels like a sketchbook, from the dashboard into the editor, and it's illustrated with the editor's own strokes.

Don't invent a headline position, comparison table or claim against competitors until the user picks one.

## Operating Context

- **Browser only.** The surfaces are:
  - the public site for logged-out visitors (`/`, `/features`, `/privacy`, `/terms`);
  - sign-in pages;
  - the workspace dashboard (a grid or list of drawings, the trash, settings);
  - the full-screen editor (`/d/[id]`);
  - shared drawings (`/s/[token]`);
  - account and site-admin pages.
- **No save step.** Saving is automatic and there's no save button. Live collaboration turns on when a drawing opens, with no "start session" button.
- **Live sessions:** cursors carry names and profile pictures, there's a follow mode, and a live/offline connection indicator.
- **Optional features:** email (SMTP) and each login provider (Google, GitHub, Microsoft) only exist when the server is set up for them. UI that depends on them appears only when `getFeatures()` reports them.
- **Themes:** light and dark mode both exist, including inside the editor.

## Capabilities and Constraints

**Built:**

- **Accounts:**
  - Email and password login, plus optional Google, GitHub and Microsoft login. That's at most 4 ways in, and accounts are never linked automatically by email.
  - Email verification and password reset, when email is set up.
  - An account page with name, profile picture, password, connected accounts, devices and account deletion. Profile pictures are public.
- **Workspaces:**
  - A personal workspace that can't be shared or deleted, plus team workspaces.
  - Roles rank owner > admin > editor > viewer, with invites by email or link.
  - A trash. Only admins and owners can remove drawings from a workspace.
- **Editor:**
  - Excalidraw's shapes, arrows, freehand, text and images up to 4 MB each.
  - Export to PNG and SVG.
  - Web embeds and Mermaid/text-to-diagram are turned off.
- **Collaboration and history:**
  - Live collaboration.
  - Version history: a snapshot about every 10 minutes while editing. Unnamed versions expire after 30 days, named ones are kept. Restoring can be undone.
  - Share links that allow view, or view and edit, with an optional password. They can be switched off.
  - Thumbnails in light and dark.
- **Site admin:** open sign-up or invite-only, sign-up invites, and a switch for public links.

**Roadmap, in order:**

1. Live embeds
2. Comments
3. Templates and workspace libraries
4. Present from frames
5. Billing and plan limits, or SSO and an audit log, once a wedge is chosen

**Constraints:**

- Closed source and hosted only. People use Lukis only through its website, and self-hosting isn't offered. `backend/deploy` is only the operator's own production stack.
- No AI features. Don't propose them.
- Pricing isn't decided. `/pricing` is a 404 for everyone except the site owner until `PRICING_PAGE=public`. It's noindexed and nothing links to it. The service costs nothing right now, but it is never advertised as free.
- English only for now (confirmed 2026-11-01).
- The backend enforces roles and access. The UI only hides controls that would fail.
- Editor changes can't be patched into `excalidraw/`. CI builds the editor from upstream at `.excalidraw-ref`, so features get turned off through props or CSS.
- There are three separate repos: `frontend/` (Next.js 16), `backend/` (FastAPI and MongoDB) and `excalidraw/` (the editor clone). This file lives in `frontend/`, next to `DESIGN.md` and the design brief in `.impeccable/`, and covers the whole product.

**Terms:**

- A **drawing** is never called a "session" or "board". "Session" means a login session.
- **Workspace**, **personal workspace**.
- The **site owner** runs the instance and isn't the same as a workspace **owner**.
- The roles are **owner, admin, editor, viewer**.
- **Share link**, **version** / **named version**, **trash**.

## Brand Commitments

- **Name:** Lukis, which is Malay/Indonesian for "draw". The tagline in use is "The hand-drawn whiteboard for teams" (`lib/site.ts`).
- **Voice:** plain and warm, in short concrete sentences with a little playfulness ("Grab a pen.", "Sketchy, never sloppy").
- **Copy rules:**
  - Never "free", "free forever", "get started free" or "$0", and no `offers` in JSON-LD.
  - Never pitch self-hosting or open source.
  - Privacy claims must match what the code does.
  - Don't link to `/pricing`.
- **Assets:**
  - The logo mark: `LOGO_MARK` in `components/brand/logo-mark.tsx`. The favicon, app icons and link-preview image are drawn from it.
  - The hand-lettering font, Excalifont (OFL, `app/fonts/`).
  - Illustrations drawn with rough.js in `components/illustrations/`.
- **Visual identity:** "Drawing pad" (2026-11-01), an evolution of the earlier "Sketchbook, drawn in Lukis" look: loose hand-drawn sketches on a precise printed sheet, with one pad-cover orange. It is recorded in `DESIGN.md` and summarised in `CLAUDE.md`. The user asked that it never feel toy-like or dark and techy.

## Evidence on Hand

- A working product, and public pages that only describe built features:
  - `components/marketing/home.tsx`
  - `app/(marketing)/features/page.tsx`
- Illustrations for features, empty states and errors: `components/illustrations/`.
- Product vignettes (version history, members, share panel) with sample names, for the public pages: `components/marketing/vignettes.tsx`.
- Draft legal pages. The operator name, contact and jurisdiction (MY) in `lib/site.ts` are placeholders, waiting for review before launch.
- A draft pricing page whose prices say "To be decided".
- **There are none of these:** customers, testimonials, usage numbers, customer logos, press, case studies or benchmarks. Don't make them up.

## Product Principles

1. **Sketching comes first.** Opening a canvas and drawing should be immediate. Accounts, saving and sharing stay out of the way.
2. **Nothing gets lost.** Autosave, merged edits, version history, trash and undoable restores mean people can try wild ideas safely.
3. **Private until shared.** Access is explicit. Drawings stay inside their workspace until someone makes a share link. No AI and no ads are product commitments, even if they aren't the headline.
4. **Claim only what's real.** Copy matches the code, optional features appear only when they're set up, and no proof or prices are invented.
5. **Open to anyone who sketches.** Don't narrow the product, its copy or its examples to one segment until a wedge is chosen. Guests need no account.

## Accessibility & Inclusion

- Every text/background token pair is at least 4.5:1, in both themes (rule set 2026-10-31).
- All decorative motion is off under `prefers-reduced-motion`.
- No formal standard has been adopted. The 4.5:1 rule matches WCAG AA text contrast.
