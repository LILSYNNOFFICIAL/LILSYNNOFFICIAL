# LIL SYNN Visual Layout Editor Design

## Goal
Build a simple, dark-blue/nearly-black and neon-gold Dreamweaver-style visual editor at `/command/designer.html` for editing the real LIL SYNN front page without changing `/Suno` or unrelated routes.

## Product principles
- Visual first: click, drag, resize, rotate, and inspect real page elements.
- Simple language: plain-English controls, sensible defaults, advanced controls hidden behind expandable sections.
- Persistent output: edits become a saved layout patch that can be reviewed and applied to `index.html` through the authenticated admin API.
- Safe editing: preview changes locally in the editor before saving; undo/redo; reset; no destructive Git history operations.
- Responsive: desktop/tablet/mobile viewport presets.
- Dark nearly-black/navy canvas chrome with neon-gold primary controls and restrained supporting neutrals.

## Editor capabilities
1. Element selection and drag/drop positioning.
2. Resize handles and numeric X/Y/W/H controls.
3. Rotation, opacity, z-index, transform origin, and visibility.
4. Position mode controls for static/relative/absolute/fixed/sticky where applicable.
5. Spacing controls for margin and padding.
6. Typography controls for family, size, weight, line-height, letter spacing, alignment, casing, and text color.
7. Background, border, radius, shadow, and gradient controls.
8. Flex/grid alignment helpers and gap controls.
9. Layer panel with reorder, lock, hide, rename, and search.
10. Duplicate, delete, copy/paste style, copy/paste element settings.
11. Snap-to-grid, guides, center lines, and smart alignment indicators.
12. Responsive breakpoint overrides with inherited values and per-breakpoint edits.
13. Undo/redo history and reset-to-loaded-state.
14. Inspector/code views showing generated CSS for the selected element.
15. Page outline/DOM tree and quick-jump selection.
16. Asset picker for existing `/assets/img` files.
17. Preview mode that hides editor chrome and shows the page as a visitor sees it.
18. Save draft locally and load draft locally.
19. Authenticated "Save to GitHub" action that sends a validated layout patch to the existing `/api/admin` control plane.

## Persistence model
The editor must not attempt to rewrite arbitrary HTML in the browser. It serializes stable element selectors plus property changes into a JSON patch. The server validates the selector/property allowlist and applies the patch to the front-page stylesheet/marked editor block, then commits the resulting `index.html` to `main`. If a patch cannot be safely applied, the server rejects it without changing Git.

## Scope protection
- Do not modify `/Suno`.
- Do not restore or introduce the legacy universal `site-global.js` shell on the homepage.
- Do not change Vercel routing except where required to expose `/command/designer`.
- Do not expose GitHub or Vercel tokens to the browser.
- Reuse the existing authenticated Command Center session model.

## UI layout
- Top bar: project name, current route, breakpoint, save status, undo/redo, preview.
- Left rail: select, hand/pan, element tree, layers, assets.
- Center stage: live iframe of `/index.html` with editor overlay and rulers/guides.
- Right inspector: tabs for Layout, Type, Color, Border, Effects, Responsive, Advanced.
- Bottom bar: zoom, viewport size, grid/snap, CSS/code toggle, draft/save state.

## Accessibility and safety
- Keyboard equivalents for selection, nudge, delete, duplicate, undo/redo, and save.
- Visible focus states.
- Editor controls must remain usable at narrow widths.
- Save requires authenticated session; destructive page changes are represented as a normal commit and never rewrite history.

## Acceptance criteria
- `/command/designer.html` loads authenticated editor UI and displays the real front page in a preview stage.
- A user can select a page element, drag it, resize it, and see the change immediately.
- Inspector changes update the selected element immediately.
- Undo/redo reliably restores prior editor states.
- Desktop/tablet/mobile presets alter the stage viewport.
- Draft can be saved/reloaded locally.
- Save-to-GitHub is authenticated and server-validated.
- A saved patch produces a normal Git commit to `main` containing only the intended front-page layout changes.
- Existing `/Suno` route and Command Center admin routes continue to load unchanged.
