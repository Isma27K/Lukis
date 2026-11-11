---
name: Lukis
description: A whiteboard your team draws on together, with nothing lost. Loose sketches on an exact sheet.
colors:
  pad-cover-orange: "#f26a21"
  cover-edge: "#c9530f"
  orange-ink: "#b3470e"
  orange-tint: "#fde3d1"
  construction-blue: "#2f86d0"
  construction-blue-soft: "#d9e9f7"
  crimson: "#b4233a"
  graphite: "#1e1e1c"
  pad-paper: "#f5f5f2"
  sheet-white: "#ffffff"
  pencil-grey: "#62625c"
  wash: "#ebebe6"
  hairline: "#e1e1db"
  control-edge: "#8f8f88"
  sidebar-paper: "#efefeb"
  sidebar-wash: "#e4e4de"
  note-yellow: "oklch(0.94 0.105 96.83)"
  note-pink: "oklch(0.883 0.062 18.39)"
  note-blue: "oklch(0.86 0.076 241.66)"
  note-green: "oklch(0.904 0.099 148.43)"
  note-violet: "oklch(0.841 0.09 296.6)"
  note-orange: "oklch(0.904 0.076 72.42)"
  board: "#1b1b1a"
  board-sheet: "#242423"
  board-chalk: "#ecece7"
  board-cover: "#f47a33"
  board-orange-ink: "#f69259"
  board-blue: "#5da8ea"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontFeature: "\"ss01\""
    fontVariation: "\"wdth\" 118"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 4vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
    fontFeature: "\"ss01\""
    fontVariation: "\"wdth\" 118"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
    fontFeature: "\"ss01\""
    fontVariation: "\"wdth\" 118"
  title-sm:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
    fontFeature: "\"ss01\""
    fontVariation: "\"wdth\" 118"
  section-title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.005em"
    fontFeature: "\"ss01\""
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"ss01\""
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "\"ss01\""
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    fontFeature: "\"ss01\""
  hand:
    fontFamily: "Excalifont, cursive"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.25
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4.8px"
  md: "6.4px"
  lg: "8px"
  xl: "11.2px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  page-gap: "28px"
  gutter: "32px"
  section: "80px"
  section-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.pad-cover-orange}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-primary-large:
    backgroundColor: "{colors.pad-cover-orange}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-ghost-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    height: "36px"
  button-link:
    textColor: "{colors.orange-ink}"
    typography: "{typography.body}"
  input:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  card-sheet:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.xl}"
    padding: "24px"
  settings-section:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.graphite}"
    typography: "{typography.section-title}"
    rounded: "{rounded.xl}"
    padding: "20px 24px"
  dialog:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.graphite}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.xl}"
    padding: "24px"
    width: "448px"
  role-chip:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "24px"
  sidebar-item-active:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    padding: "8px"
  privacy-band:
    backgroundColor: "{colors.pad-cover-orange}"
    textColor: "{colors.graphite}"
---

# Design System: Lukis

## Overview

**Creative North Star: "The Drawing Pad"**

Loose sketches on an exact sheet. The hand-drawn line belongs to the work: the drawings, the illustrations, the logo, and a few handwritten margin notes. Everything around it is a precise, printed drawing pad: bright neutral pad paper, white sheets cut clean with graphite hairlines, soft lifted shadows, a confident widened grotesk for titles, and one orange pad-cover colour that marks the action. Non-photo-blue construction lines are the only second voice, used for focus, guides and the editor's selection outlines.

This is an evolution of the earlier "Sketchbook" look, not a replacement. The hand-drawn DNA stays (rough.js strokes drawn with the editor's own engine, Excalifont, named cursors, the dotted canvas), but it is confined to content, so the product reads as a calm professional tool rather than a craft project. The public site speaks at Persuade volume (large widened titles, the editor window demo, one full-bleed orange band); the app uses the same world at Operate restraint (compact title rows, sheets, hairlines, no hero banners).

Dark mode is a graphite drawing board: warm near-black board, slightly lifted graphite sheets, chalk-white text, a brighter cover orange and a lighter construction blue. It is never black and neon. Two confirmed anti-references bound the world: the craft-project sketchbook (tape, sticky-note headings, tilted cards, sticker buttons, handwriting for every title) and the generic SaaS template (gradient hero, icon-tile grids).

**Key Characteristics:**
- Bright neutral pad paper (not cream) under white sheets with graphite hairlines.
- One pad-cover orange for primary actions, always with graphite lettering on it.
- Non-photo-blue construction lines for focus rings, guides and selection.
- Archivo widened toward a title-block stroke for titles; normal width for the interface.
- Hand-drawn strokes (rough.js) and Excalifont only on drawn content and margin notes.
- Soft lifted shadows (offset plus blur), never hard offset blocks.
- Every text/background pair at least 4.5:1, in both themes.

## Colors

A near-achromatic graphite-and-paper pad with one warm cover colour and one cool construction line.

### Primary
- **Pad-Cover Orange** (`pad-cover-orange`): primary buttons, the Share button in the editor, the owner role dot, the logo mark's note, chart 1 and the home page's single full-bleed privacy band. Text on it is always graphite (5.45:1), never white.
- **Cover Edge** (`cover-edge`): the printed edge of the cover: the 60%-opacity border on primary buttons, the editor's own primary colour, and the pricing note's border. A non-text edge at 3:1 on paper.
- **Orange Ink** (`orange-ink`): orange used as text: links, the `link` button, margin notes, pen ticks, the active sidebar icon, the caret colour, and hover accents on tiles. 5.0:1 on paper.
- **Orange Tint** (`orange-tint`): the highlight wash; text selection, the pricing notice, the editor's primary containers.

### Secondary
- **Construction Blue** (`construction-blue`): the `--ring` and `--guide` token. Every keyboard focus ring (2px solid, 2px offset), focused field borders with a 25% ring, the editor's selection outlines, the admin role dot, chart 2. 3.5:1 on paper, used as a non-text indicator only.
- **Construction Blue Soft** (`construction-blue-soft`): faint guide fills behind construction marks.

### Tertiary
- **Crimson** (`crimson`): destructive actions and the danger settings section's edge and title. Kept away from the cover orange on purpose; destructive buttons are a 10% crimson wash with crimson text, not a solid fill.
- **Note pastels** (`note-yellow`, `note-pink`, `note-blue`, `note-green`, `note-violet`, `note-orange`): the editor's sticky-note colours, used for avatars, collaborator cursors and workspace avatars, hashed from a name. They are paper in both themes, so anything on them is graphite (`--note-ink`).

### Neutral
- **Graphite** (`graphite`): all body text and headings, primary-button lettering. 15.3:1 on paper.
- **Pad Paper** (`pad-paper`): the page background behind everything.
- **Sheet White** (`sheet-white`): cards, settings sections, dialogs, popovers, inputs, outline buttons, the active sidebar item.
- **Pencil Grey** (`pencil-grey`): secondary text, descriptions, meta lines, placeholders. 5.6:1 on paper, 6.1:1 on white.
- **Wash** (`wash`): muted, secondary and accent surfaces; ghost-button hover, skeletons, code blocks.
- **Hairline** (`hairline`): every border and divider; the default border colour for all elements.
- **Control Edge** (`control-edge`): borders on inputs, selects and outline buttons, so controls are findable (3.25:1 on white).
- **Sidebar Paper / Sidebar Wash** (`sidebar-paper`, `sidebar-wash`): the workspace sidebar's slightly deeper paper and its hover.
- **Board, Board Sheet, Board Chalk, Board Cover, Board Orange Ink, Board Blue**: the dark-mode counterparts on `.dark` (graphite board, lifted sheet, chalk text, brighter cover with board-coloured lettering, lighter orange ink, lighter construction blue).

### Named Rules
**The One Cover Rule.** Orange is the pad cover: it marks the primary action and appears as one full-bleed field at most per page (the home privacy band). Everything else is graphite on paper.

**The Graphite Lettering Rule.** Text on orange is graphite in light mode and board-dark in dark mode. Never white on orange.

**The Ink Versus Cover Rule.** Orange as text is always Orange Ink, never the cover orange; the cover is too light to read as text on paper.

**The Construction Line Rule.** Blue means "the tool is pointing at this": focus, guides, selection. It never decorates and never marks an action.

## Typography

**Display Font:** Archivo (variable, with its `wdth` axis), widened to 118% by the display utility, `ss01` on, -0.025em tracking.
**Body Font:** Archivo at normal width, `ss01` on.
**Label/Mono Font:** Geist Mono, for code and technical strings only.
**Hand Font:** Excalifont, the editor's own hand-drawn face.

**Character:** A confident grotesk widened toward a title-block stroke gives titles their emphasis, so headings need no marker strokes; the same family at normal width keeps the interface quiet and dense. Excalifont is the pen in the margin, not a heading face.

### Hierarchy
- **Display** (600, 3.5rem rising to 4.75rem and 5.5rem, 0.98): the home hero H1 only; the features hero sits at 3.25rem to 4.5rem.
- **Headline** (600, `clamp(2.125rem, 4vw, 2.75rem)`, 1.08): public-site section headings, legal page titles and the sign-in panel line.
- **Title** (600, 1.75rem to 2rem, 1.15): the app's page-title row (`PageHero`), widened.
- **Title Small** (600, 1.25rem to 1.5rem, 1.25): dialog, alert-dialog and auth card titles, widened.
- **Section Title** (600, 0.9375rem, 1.375): card titles and settings-section titles, normal width.
- **Lead** (400, 1rem to 1.125rem): ledes under headings, capped at about 34rem.
- **Body** (400, 0.875rem, 1.43): the interface default; inputs are 1rem on phones to avoid zoom, 0.875rem from md.
- **Label** (500, 0.75rem): chips, meta lines, footer.
- **Hand** (400, about 1.3rem): margin notes, the wordmark, text inside drawn illustrations; set in Orange Ink with a slight natural slant.

### Named Rules
**The Widened Title Rule.** Page titles, section headings, dialog and auth card titles are widened Archivo at 600. Emphasis comes from the width and weight, never from underlines, swashes or highlight strokes.

**The Margin-Only Hand Rule.** Excalifont appears only in the wordmark, margin notes (the public site's `MarginNote`, the dashboard's "start here") and inside drawn illustrations. Never for titles, buttons or body text.

**The No-Kicker Rule.** Headings stand alone: no eyebrow or kicker labels above them.

## Layout

Pages sit in a centred container up to 80rem (`max-w-7xl`) with 16px gutters on phones and 32px from `sm`; settings and account columns cap at 64rem (`max-w-5xl`). App pages run a slim sticky header bar (sidebar trigger plus crumbs), then a compact title row with actions on the right, a toolbar row, then content, separated by a 28px rhythm; there is no hero banner inside the app. Settings-style pages pair a 10rem jump-link rail with a column of section sheets 24px apart (48px column gap from `lg`).

The public site uses two-column splits that stack on phones (the hero is about 0.85fr text to 1.15fr editor window), section padding of 80px rising to 112px at `lg`, and a sticky 64px nav on 95% paper with a backdrop blur; on phones the links move into a top sheet. The dotted canvas grid (20px pitch) appears only where a surface stands for a canvas: the auth scene panel, the hero editor window, the blank-canvas tile, illustration tiles and status pages; never behind ordinary app pages.

## Elevation & Depth

Depth is paper on paper: white sheets lift off the pad with a soft two-part shadow (a tight 1-2px contact shadow plus a long blurred, negatively spread fall), tinted from graphite rather than pure black. Shadows deepen on hover together with a 2px rise, and popups and dialogs sit on the larger lift. Controls carry only a 1px contact shadow (outline buttons, selects) or a 1px inset (inputs, so fields read as cut into the sheet). Hairline borders do most of the separating work; shadows confirm that something is a sheet.

### Shadow Vocabulary
- **Paper** (`box-shadow: 0 1px 2px var(--paper-shadow), 0 6px 16px -8px var(--paper-shadow-far)`): cards, settings sections, drawing cards, sheets at rest.
- **Lift** (`box-shadow: 0 2px 4px var(--paper-shadow), 0 14px 28px -12px var(--paper-shadow-far)`): hovered drawing cards and tiles, paired with a 2px rise under `motion-safe`.
- **Paper Large** (`box-shadow: 0 2px 4px var(--paper-shadow), 0 22px 44px -18px var(--paper-shadow-far)`): dialogs, alert dialogs, dropdown and select popups, auth cards.
- **Contact** (`box-shadow: 0 1px 2px var(--paper-shadow)`): outline buttons, select triggers.
- **Inset Field** (`box-shadow: inset 0 1px 2px var(--paper-shadow)`): text inputs.
- **Cover Sheen** (`box-shadow: inset 0 1px 0 oklch(1 0 0 / 28%), 0 1px 2px var(--paper-shadow)`): the primary button's printed top light.

### Named Rules
**The Soft Lift Rule.** Every shadow is an offset plus a blur, tinted graphite. Never a hard, unblurred offset block.

## Shapes

Gently rounded, printed corners from one 8px base radius: controls at 6.4px, cards, sheets and dialogs at 11.2px, chips and avatars fully round. Edges are 1px hairlines; the only heavier edges are the cover orange's printed border and the 2px construction-blue focus outline offset 2px off the edge. Interface chrome is geometric CSS; the rough, wobbling line is reserved for drawn content (illustrations, ticks, arrows, the logo, `SketchFrame` around drawn pictures), each stroke drawn with a fixed seed so the wobble is stable.

## Components

### Buttons
Printed and quiet; the cover button is the only loud one.
- **Shape:** gently rounded (6.4px), 36px tall (32px small, 44px large), 14px horizontal padding, 500 weight.
- **Primary:** pad-cover orange with graphite lettering, a 60% cover-edge border and the cover sheen; hover mixes 9% graphite into the orange and lengthens the shadow; press moves down 1px and drops the shadow. In dark mode the border disappears and hover lightens 10%.
- **Hover / Focus:** 150ms ease-out colour, border and shadow transitions; focus is the 2px construction-blue outline offset 2px.
- **Outline:** a white sheet with the control edge and contact shadow; hover darkens the edge and adds a wash.
- **Secondary / Ghost:** wash fill, or transparent with a wash on hover.
- **Destructive:** 10% crimson wash with crimson text; focus outline turns crimson.
- **Link:** Orange Ink text, underline on hover.
- **Disabled primary:** falls back to a wash with pencil-grey text and a hairline, no shadow.

### Chips
- **Style:** the role chip is a 24px white pill with a hairline, 12px medium graphite text and a 6px dot coloured by role (owner orange, admin blue, editor green, viewer grey). The account page's pills share the shape.
- **State:** static labels; no selected state.

### Cards / Containers
- **Corner Style:** 11.2px.
- **Background:** sheet white on pad paper.
- **Shadow Strategy:** Paper at rest, Lift on hover where the card is a link (see Elevation & Depth).
- **Border:** 1px hairline; the danger settings section takes a 35% crimson edge, a faint crimson header wash and a crimson title.
- **Internal Padding:** 24px (16px small); settings sections use 20px by 24px with their title and description above a hairline.

### Inputs / Fields
- **Style:** white field, control-edge border, 6.4px corners, 36px tall, inset field shadow; in dark mode a translucent board fill.
- **Focus:** the border turns construction blue with a 3px 25% blue ring.
- **Error / Disabled:** crimson border with a 20% crimson ring; disabled at 50% opacity.

### Navigation
- **Public nav:** sticky 64px bar on 95% pad paper with a hairline under it and a backdrop blur; 14px medium links in pencil grey turning graphite on hover; the primary CTA on the right; on phones the links collapse into a top sheet.
- **Workspace sidebar:** sidebar paper, items 8px padded with 6.4px corners; hover is the sidebar wash; the active item is a white sheet with a hairline ring, a contact shadow, medium weight and an Orange Ink icon. No scribble under the active item.
- **Section rail:** jump links beside settings sections.

### Dialogs
A white sheet on a 25% ink backdrop with a 2px blur; 11.2px corners, 24px padding, 448px wide from `sm`; widened title; Paper Large shadow. Rises in from 98% scale with a fade over 200ms on the exponential ease-out; no motion under reduced motion.

### Drawing Card
The dashboard's signature sheet: thumbnail on top over a hairline, the title (14px semibold) and "You · 2 hours ago" meta inside. One link covers the whole card; hover rises 2px with the Lift shadow and a darker hairline over 200ms; the actions button appears on hover or focus (always visible on coarse pointers).

### Editor Window and Margin Note
On the public site, the product shows its real UI: an editor window with a toolbar island over the dotted canvas where the diagram draws itself in and named cursors drift. A margin note in Excalifont and Orange Ink, with a rough pen arrow, annotates it.

### Motion
Interface motion is 150 to 220ms on an exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`). Strokes draw themselves in once (dash offset from 1 to 0, 0.7s), fills fade in, cursors drift and the hero bobs, all only under `prefers-reduced-motion: no-preference` or `motion-safe`.

## Do's and Don'ts

### Do:
- **Do** put graphite (#1e1e1c) lettering on the pad-cover orange (5.45:1); never white.
- **Do** use Orange Ink (#b3470e) whenever orange is text, including links and accents.
- **Do** mark every keyboard focus with the 2px construction-blue (#2f86d0) outline, offset 2px.
- **Do** set page titles, section headings, dialog and auth card titles in widened Archivo (118% width, 600, -0.025em).
- **Do** build interface chrome (cards, buttons, frames around controls) in CSS, and draw only content (illustrations, ticks, arrows, the logo) with rough.js using a fixed seed.
- **Do** use the soft two-part paper shadows: Paper at rest, Lift on hover with a 2px rise, Paper Large for popups and dialogs.
- **Do** keep every text/background pair at 4.5:1 or more in both themes when adding or changing tokens.
- **Do** put graphite text on the note pastels in both themes; they are paper, not themed surfaces.
- **Do** keep decorative and interface motion behind reduced-motion switches, at 150 to 220ms with the exponential ease-out.
- **Do** show Lukis's real panels and editor rather than an illustration floating in an empty sheet.

### Don't:
- **Don't** use tape strips, sticky-note headings, tilted cards, or sticker buttons with hard offset shadows; the Sketchbook props were removed on purpose.
- **Don't** put marker swashes, scribbles or highlight strokes under or behind headings, or a scribble under the active sidebar link.
- **Don't** use hard, unblurred offset shadows anywhere.
- **Don't** set titles, buttons or body text in Excalifont.
- **Don't** place eyebrow or kicker labels above headings.
- **Don't** put the dotted canvas grid behind ordinary app pages; it marks surfaces that stand for a canvas.
- **Don't** use spiral-binding rings or other repeating decorative patterns that can be read as text.
- **Don't** reach for gradient heroes or icon-tile grids.
- **Don't** make dark mode black and neon; it is a graphite drawing board.
- **Don't** use blue for actions or decoration, or orange for focus.
