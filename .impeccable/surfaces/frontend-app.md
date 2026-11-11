---
version: 1
slug: "frontend-app"
primary_target: "frontend/app"
related_targets: ["frontend/components"]
---

# Lukis: whole-site redesign (evolution of "Sketchbook")

## Scope and mode
Every route in `frontend/app`. Public site (`(marketing)`) is **Persuade**; sign-in pages are **Persuade/Operate**; workspace, settings, account, admin, trash, share and the editor chrome are **Operate**. One visual world across all of them, expressed at Persuade volume on the public site and with Operate restraint inside the app.

## Confirmed answers (2026-11-01)
- Evolve the incumbent Sketchbook world, don't replace it: keep the hand-drawn DNA, rebuild it to feel professional and consistent.
- Avoid: still toy-like; dark techy.
- Preserve all functionality, API calls, auth, copy rules (PRODUCT.md).

## Direction contract

THESIS: Loose sketches on an exact sheet. The hand-drawn line belongs to the work (drawings, illustrations, the logo, a few handwritten margin notes). Everything around it is a precise, printed drawing pad: crisp sheets, hairlines, a confident grotesk, one orange cover colour. Refuses the craft-project sketchbook (tape, sticky-note headings, tilted cards, sticker buttons, handwriting for every title) and the generic SaaS template (gradient hero, icon-tile grids).

OWN-WORLD: Bright neutral pad paper (not cream), white sheets with graphite hairlines and soft lifted shadows (offset plus blur, never hard offsets). Graphite ink. Pad-cover orange for primary actions, with graphite text on it, plus a darker orange for text links. Non-photo-blue construction lines for focus rings, guides and grid. Archivo at normal width for UI, semi-expanded/expanded for titles. Excalifont only for the wordmark and margin annotations. rough.js strokes only on drawn content. Dark mode is a graphite drawing board, not black and neon.

STORY: A visitor sees the actual editor at work (a canvas drawing itself, named cursors), understands "a whiteboard my team draws on together, with nothing lost", and starts drawing. Members find their drawings, settings and account in a calm, precise app that never looks like a toy.

FIRST VIEWPORT: Home: left column has the expanded-sans H1 "Sketch together.", the lede, primary orange CTA and secondary, and login options. Right column (about 55%) has an editor-window demo: a Lukis toolbar island over a dot-grid canvas where the hand-drawn diagram draws itself in, with two named cursors drifting, and an Excalifont margin note with a rough arrow pointing at it. App: a compact title row (expanded sans) with actions on the right, a toolbar row, then content. No hero banner.

FORM: Drawing pad: printed sheet plus sketch. Position 1 of the evolution options. seed: none — the direction roll was waived by the user on 2026-11-01. Asked "Keep it skipped, or roll alternatives now?", they answered "Keep it skipped" (after choosing "Evolve it" for the incumbent Sketchbook world).

Signature interaction: strokes draw themselves in (the editor's own rough.js line) the first time an illustration enters view, and focus moves as a non-photo-blue construction ring. Motion grammar: 150–220ms exponential ease-out; sheets lift 2px with a deeper soft shadow on hover; dialogs rise from 98% scale with a fade; all decorative motion off under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Headline positioning (PRODUCT.md): copy stays as written; no new claims.
