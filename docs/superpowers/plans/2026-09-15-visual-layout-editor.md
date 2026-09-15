# LIL SYNN Visual Layout Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a simple Dreamweaver-style visual editor for the real LIL SYNN homepage with drag/resize/inspect tools and authenticated GitHub persistence.

**Architecture:** A standalone static editor at `/command/designer.html` uses a sandboxed iframe for the real `/index.html`, an editor overlay for selection/drag/resize, and a right-side inspector. A small client-side state engine serializes stable selector/property patches; `/api/admin` validates and commits those patches server-side so credentials never reach the browser.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, iframe/postMessage bridge, existing Vercel serverless `/api/admin`, GitHub Contents API, localStorage.

**Spec:** `docs/superpowers/specs/2026-09-15-visual-layout-editor-design.md`

## Global Constraints
- Visual editor chrome: dark blue/nearly black with neon gold primary accents.
- Edit only the real `/index.html` front page; never modify `/Suno`.
- Reuse existing authenticated Command Center session.
- Never expose `GITHUB_TOKEN`, `VERCEL_TOKEN`, or admin secrets to client code.
- Saved edits are normal Git commits; never rewrite Git history.
- Keep editor simple by default; advanced controls are collapsible.

---

### Task 1: Editor shell and page stage

**Files:**
- Create: `command/designer.html`
- Create: `command/designer.css`
- Create: `command/designer.js`

**Interfaces:**
- `designer.html` exposes `#stage`, `#pageFrame`, `#layers`, `#inspector`, `#status`, `#viewportSelect`, `#zoom`, and toolbar buttons.
- `designer.js` owns `EditorState`, selection, viewport, and command history.

- [ ] **Step 1: Write the failing smoke assertions**
Create a lightweight browser-checkable contract in `command/designer.js` by exporting `window.LSDesignerTestHooks` with `requiredIds` and `version`, then use a Node syntax check in CI/local verification to ensure the script parses.

- [ ] **Step 2: Run syntax check to verify the initial contract is absent**
Run: `node --check command/designer.js`
Expected: FAIL before implementation because the file does not exist.

- [ ] **Step 3: Implement the shell**
Create the three files. The page stage loads `/index.html` in an iframe, uses the navy/gold editor chrome, and includes toolbar buttons for Select, Hand, Undo, Redo, Preview, Save Draft, Save to GitHub, and Reset. Include desktop/tablet/mobile viewport presets and zoom controls.

- [ ] **Step 4: Run syntax verification**
Run: `node --check command/designer.js`
Expected: PASS.

- [ ] **Step 5: Commit**
Commit message: `feat: add visual editor shell`

### Task 2: Selection, drag, resize, and layers

**Files:**
- Modify: `command/designer.js`
- Modify: `command/designer.css`

**Interfaces:**
- `selectElement(selector)` selects an iframe element.
- `beginDrag(pointer)`, `updateDrag(pointer)`, `endDrag()` mutate editor state.
- `beginResize(handle,pointer)`, `updateResize(pointer)`, `endResize()` mutate dimensions.
- `renderLayers()` renders the page outline/layer tree.

- [ ] **Step 1: Add state-level assertions for immutable history**
Implement `pushHistory(snapshot)` and test it through `window.LSDesignerTestHooks.historyRoundTrip()` so a state snapshot can be pushed, undone, and redone without aliasing.

- [ ] **Step 2: Run syntax check**
Run: `node --check command/designer.js`
Expected: PASS.

- [ ] **Step 3: Implement pointer editing**
Inject an editor bridge stylesheet into the iframe and draw an overlay around the selected element. Pointer movement changes `transform: translate(...)` in editor state rather than permanently changing the page DOM. Add eight resize handles, center guides, grid snapping, arrow-key nudging, duplicate, delete, hide, lock, and layer reorder.

- [ ] **Step 4: Run syntax check and inspect selectors**
Run: `node --check command/designer.js`
Expected: PASS. Confirm the editor only selects elements inside the iframe and never the editor chrome.

- [ ] **Step 5: Commit**
Commit message: `feat: add visual selection and layout manipulation`

### Task 3: Dreamweaver-style inspector

**Files:**
- Modify: `command/designer.html`
- Modify: `command/designer.js`
- Modify: `command/designer.css`

**Interfaces:**
- `readComputedStyle(element)` returns editable style fields.
- `applyStylePatch(selector, patch)` updates the current draft.
- `renderInspector()` synchronizes controls with the selected element.

- [ ] **Step 1: Add inspector field contract**
Define the editable property allowlist: position, inset, width, height, margin, padding, display, flex, grid, gap, font family/size/weight/line-height/letter-spacing/alignment, color, background, border, radius, box-shadow, opacity, transform, z-index, overflow, and visibility.

- [ ] **Step 2: Run syntax check**
Run: `node --check command/designer.js`
Expected: PASS.

- [ ] **Step 3: Implement inspector panels**
Build collapsible Layout, Type, Color, Border, Effects, Responsive, and Advanced panels with plain-English labels, sliders where useful, numeric inputs where precision matters, and reset controls. Every control updates the selected element immediately and pushes one undoable state.

- [ ] **Step 4: Verify state serialization**
Use `window.LSDesignerTestHooks.serialize()` and confirm all serialized properties are strings/numbers/booleans and match the allowlist.

- [ ] **Step 5: Commit**
Commit message: `feat: add visual editor inspector`

### Task 4: Responsive editing, drafts, and code view

**Files:**
- Modify: `command/designer.js`
- Modify: `command/designer.css`

**Interfaces:**
- `setViewport(name)` selects desktop/tablet/mobile.
- `saveDraft()` stores the current patch in localStorage.
- `loadDraft()` restores the stored patch.
- `exportPatch()` returns the validated JSON patch.

- [ ] **Step 1: Add round-trip assertions**
Implement `window.LSDesignerTestHooks.draftRoundTrip()` and `patchRoundTrip()` against an in-memory sample patch before wiring localStorage.

- [ ] **Step 2: Run syntax check**
Run: `node --check command/designer.js`
Expected: PASS.

- [ ] **Step 3: Implement responsive overrides**
Give each breakpoint its own override map with inheritance from desktop. Add viewport presets, live dimension display, rulers/guides, zoom, preview mode, and a CSS/code tab that shows the generated editor block for the current draft.

- [ ] **Step 4: Implement local drafts**
Store drafts under a versioned localStorage key. Provide Save Draft, Load Draft, Clear Draft, and Reset buttons. Never silently overwrite a draft after a page reload.

- [ ] **Step 5: Commit**
Commit message: `feat: add responsive drafts and code view`

### Task 5: Secure server-side persistence

**Files:**
- Modify: `api/admin.js`
- Modify: `command/designer.js`

**Interfaces:**
- Client sends `POST /api/admin?action=save-layout` with `{confirmation:"SAVE LAYOUT",baseSha,patch}`.
- Server returns `{ok:true,sha,commitUrl}` on success.
- Server rejects unauthenticated requests, invalid selectors, invalid properties, malformed values, and stale `baseSha` without changing Git.

- [ ] **Step 1: Add validation tests as pure server helpers**
Factor `validateLayoutPatch(payload)` into `api/admin.js` and expose it only under a non-production test guard. Assert that allowed selector/property/value combinations pass and script injection, path traversal, arbitrary Git paths, and unapproved CSS properties fail.

- [ ] **Step 2: Run syntax check**
Run: `node --check api/admin.js`
Expected: PASS.

- [ ] **Step 3: Implement save-layout**
Require the existing admin session, fetch the current `index.html`, compare its blob SHA with `baseSha`, validate every patch entry, update only the marked `/* LS-DESIGNER:START */` through `/* LS-DESIGNER:END */` CSS block, and commit the resulting `index.html` through the GitHub Contents API. Return the new SHA and commit URL. If the SHA changed, return a conflict and leave Git untouched.

- [ ] **Step 4: Add the marked editor block to the homepage without changing existing visual content**
Insert an empty, clearly delimited editor CSS block into `index.html`; all initial visual values remain unchanged until the editor saves a patch.

- [ ] **Step 5: Run syntax checks**
Run: `node --check api/admin.js` and `node --check command/designer.js`
Expected: PASS.

- [ ] **Step 6: Commit**
Commit message: `feat: persist visual editor layouts through admin API`

### Task 6: Asset picker and editor quality tools

**Files:**
- Modify: `command/designer.html`
- Modify: `command/designer.js`
- Modify: `command/designer.css`

**Interfaces:**
- `loadAssets()` reads the existing authenticated asset inventory endpoint or safe public GitHub asset listing.
- `insertAsset(url)` applies a validated asset URL to the selected image/background control.
- `toggleTool(name)` enables hand, snap, guides, rulers, grid, and preview modes.

- [ ] **Step 1: Add tool registry assertions**
Define a registry containing `select`, `hand`, `grid`, `snap`, `guides`, `rulers`, `layers`, `assets`, `preview`, and `code` and assert each has a handler.

- [ ] **Step 2: Implement tools**
Add asset thumbnails, search, drag-to-place, rulers, alignment guides, snap settings, zoom presets, keyboard shortcuts, contextual toolbar, copy/paste style, copy/paste element settings, and a friendly status bar.

- [ ] **Step 3: Run syntax check**
Run: `node --check command/designer.js`
Expected: PASS.

- [ ] **Step 4: Commit**
Commit message: `feat: add visual editor quality tools`

### Task 7: Routing, documentation, and verification

**Files:**
- Modify: `vercel.json` only if the existing clean-URL routing does not serve `command/designer.html` directly.
- Create: `command/README.md`
- Modify: relevant CI workflow only if a syntax/browser smoke check is already appropriate.

- [ ] **Step 1: Verify direct routing assumptions**
Confirm `/command/designer.html` maps to the created file without changing `/command`, `/command/admin`, `/Suno`, or the homepage routes.

- [ ] **Step 2: Add concise usage documentation**
Document how to select, drag, resize, inspect, switch breakpoints, save drafts, preview, and save to GitHub. Explain that Save to GitHub creates a normal front-page commit.

- [ ] **Step 3: Run all available static checks**
Run: `node --check command/designer.js && node --check api/admin.js`
Expected: PASS.

- [ ] **Step 4: Run browser verification when a deployment/dev server is available**
Open `/command/designer.html`, verify the editor loads, the iframe renders `/index.html`, selection works, drag/resize works, inspector changes render, undo/redo works, mobile/desktop presets work, and preview hides editor chrome. Verify `/Suno/` and `/command/admin/` still load.

- [ ] **Step 5: Commit**
Commit message: `test: verify visual editor routing and smoke behavior`
