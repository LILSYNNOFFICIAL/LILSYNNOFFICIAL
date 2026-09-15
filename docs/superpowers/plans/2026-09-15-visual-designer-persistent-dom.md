# Visual Designer Persistent DOM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist safe designer-created DOM and destructive visibility changes into `index.html`.

**Architecture:** Add a small client persistence layer beside the existing designer scripts. Add a server-side `save-dom` action that validates a compact operation payload, merges a generated DOM block into `index.html`, and records visibility changes as CSS patches. Keep existing CSS patch saving intact.

**Tech Stack:** Static HTML, browser JavaScript, Node/Vercel serverless API, GitHub Contents API, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-15-visual-designer-persistent-dom.md`

## Global Constraints
- Only `index.html` is structurally modified.
- Never modify `/Suno` as part of this feature.
- Text is escaped; arbitrary HTML is never accepted from the browser.
- Structural payloads are authenticated and SHA-conflict checked.
- Generated elements are limited to safe tags and bounded inline styles.

---

### Task 1: Add persistence contract tests
**Files:**
- Modify: `command/designer.test.js`

- [ ] Add tests for stable generated-element IDs, text escaping, serialization, and safe payload shape.
- [ ] Add tests for the API source exposing `save-dom` and validation helpers.
- [ ] Run `node command/designer.test.js` and confirm the new assertions fail before implementation.

### Task 2: Implement server-side DOM persistence
**Files:**
- Modify: `api/admin.js`

- [ ] Add strict DOM payload validation.
- [ ] Add HTML escaping and generated-block replacement helpers.
- [ ] Add authenticated `save-dom` action with current-main conflict detection.
- [ ] Preserve existing layout-saving behavior.
- [ ] Run the designer contract tests.

### Task 3: Implement browser serialization and editing
**Files:**
- Create: `command/designer-persist.js`
- Modify: `command/designer.html`

- [ ] Give designer-created elements stable IDs.
- [ ] Add inline text editing without `innerHTML` input.
- [ ] Serialize created elements and persisted hide/delete operations.
- [ ] Add Save DOM action and status feedback.
- [ ] Rehydrate created elements after iframe reload.
- [ ] Run the designer contract tests.

### Task 4: Integrate asset tools
**Files:**
- Modify: `command/designer-assets.js`

- [ ] Register inserted assets with the persistence layer.
- [ ] Ensure duplicate DOM gets a distinct stable ID.
- [ ] Ensure deletion is represented persistently for created elements.

### Task 5: Verification and workflow
**Files:**
- Modify: `.github/workflows/designer-smoke.yml`

- [ ] Add syntax checks for the persistence script.
- [ ] Run the full local contract test if the environment permits.
- [ ] Push and inspect the GitHub Actions result.
- [ ] Inspect the final diff to ensure only intended designer/API/docs files changed.
