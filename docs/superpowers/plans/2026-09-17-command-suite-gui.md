# Command Suite GUI Makeover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the LIL SYNN command/admin/designer surfaces as a large cinematic control suite with a real multi-file designer and working visual QA.

**Architecture:** Keep the existing `/api/admin` authentication and privileged operations intact. Add a narrowly scoped authenticated file-workspace API for the designer, then rebuild the three front-end surfaces around shared visual patterns and preserve existing admin action endpoints.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Vercel serverless Node API, GitHub Actions + Playwright.

**Spec:** `docs/superpowers/specs/2026-09-17-command-suite-design.md`

## Global Constraints

- Never expose secret values.
- Preserve existing admin authentication/session behavior.
- Restrict designer file access to safe repository paths/extensions.
- Keep destructive actions guarded by confirmation and re-authentication.
- Canonical homepage route is `/`, not `/index2`.

---

### Task 1: Add authenticated multi-file designer API

**Files:**
- Create: `api/admin-files.js`
- Test: `tools/test-admin-files-api.mjs`

- [ ] Write tests for cookie validation, path allowlisting, list/read/save behavior.
- [ ] Verify the tests fail before implementation.
- [ ] Implement session-cookie validation compatible with `ls_admin_session` and `ADMIN_SESSION_SECRET`.
- [ ] Implement `list`, `read`, and `save` actions using the existing GitHub token.
- [ ] Allow HTML/CSS/JS/JSON and selected text configuration files while rejecting traversal and arbitrary binary paths.
- [ ] Run tests and verify they pass.

### Task 2: Rebuild Designer workspace

**Files:**
- Modify: `command/designer.html`
- Modify: `command/designer.css`
- Modify: `command/designer.js` and supporting designer scripts as needed

- [ ] Add a prominent workspace/file picker with multi-select.
- [ ] Add open-file tabs and dirty-state indicators.
- [ ] Add source editor pane plus live preview for HTML routes.
- [ ] Preserve visual editing controls and responsive viewport controls.
- [ ] Add save-selected/save-all operations through the new API.
- [ ] Add refresh/reload and clear save/error feedback.
- [ ] Give mobile users a usable stacked workspace.
- [ ] Verify the existing designer login continues to work.

### Task 3: Command Center GUI makeover

**Files:**
- Modify: `command/index.html`
- Modify: `command/admin/admin.js`
- Modify: `command/admin/admin.css`

- [ ] Add large system-status hero and quick-action tiles.
- [ ] Add richer telemetry summaries, recent activity, deployment health, QA, and navigation.
- [ ] Add designer shortcut and useful route shortcuts.
- [ ] Make all controls touch-friendly and visually prominent.
- [ ] Preserve existing dashboard/admin API behavior.

### Task 4: Admin operations expansion

**Files:**
- Modify: `command/admin/admin.js`
- Modify: `command/admin/admin.css`

- [ ] Expand deployment, Git, asset, environment, audit, QA, and danger-zone views.
- [ ] Add refresh controls and clearer asynchronous states.
- [ ] Add visual QA route/viewport selection and results-oriented messaging.
- [ ] Keep destructive controls guarded.

### Task 5: Repair visual QA workflow

**Files:**
- Modify: `.github/workflows/admin-visual-qa.yml`

- [ ] Change default route from `/index2` to `/`.
- [ ] Support desktop/tablet/mobile presets.
- [ ] Improve route handling for directory pages.
- [ ] Improve overflow/off-screen checks and HTTP failure reporting.
- [ ] Always upload result JSON and screenshot artifacts.
- [ ] Verify the workflow syntax and browser script locally where possible.

### Task 6: Integrated verification

**Files:**
- Modify: `tools/test-admin-files-api.mjs` or add focused smoke tests as needed.

- [ ] Run static syntax checks over changed JavaScript.
- [ ] Run focused API tests.
- [ ] Verify authenticated route behavior does not regress.
- [ ] Verify canonical QA routes exist in source.
- [ ] Review the final diff for accidental auth/security changes.
- [ ] Verify deployment/CI status before claiming completion.
