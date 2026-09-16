# LIL SYNN Site Shell Phases 11-20 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the canonical LIL SYNN site-shell consolidation by hardening the existing Spotify, Signal, Artist, popup, page-shell, authentication, regression, and production flows without changing `/Suno` and with all commits made directly to `main`.

**Architecture:** Preserve the existing canonical `site-shell.js`/`site-shell.css` shared layer and the existing `index-enhancements.js` enhancement layer. Recover working behavior from `index.html` and `index3.html` before adding code, consolidate floating UI into body-level foreground layers, and use the existing `release-catalog.json` as the release source of truth. Authentication will be diagnosed with safe boolean/status instrumentation only; no secrets, hashes, tokens, or cookies will be exposed.

**Tech Stack:** Static HTML/CSS/JavaScript, GitHub Actions, Node-based regression tests, Vercel production deployment.

**Spec:** The approved LIL SYNN FULL SITE TEMPLATE / UI / AUTH UPDATE WORKFLOW supplied in chat, Phases 11-20.

## Global Constraints

- All implementation commits go directly to `main`; never create a development branch.
- `/Suno` remains isolated and must not be modified by generic shell automation.
- `LS_BG_STARS.webm` is the shared fixed viewport background for regular pages and Vote.
- The old global header/injection system must not return.
- No passwords, password hashes, salts, session secrets, tokens, or cookies may be exposed or committed.
- Archive ordering remains the release source of truth; index displays only the first eight newest unique releases.
- Production claims require direct GitHub/Vercel verification.

---

### Task 1: Audit existing Phase 11-14 implementations

**Files:**
- Read: `index.html`, `index3.html`, `index-enhancements.js`, `site-shell.js`, `site-shell.css`
- Read: `release-catalog.json`, `archive.html`, existing modal/player-related scripts and styles

**Interfaces:**
- Consumes: current `main` tree and existing implementations.
- Produces: an evidence-based list of reusable Spotify, Signal, Artist, and popup behavior and any missing requirements.

- [ ] Step 1: Inspect current Spotify trigger, player dock/embed, close control, and responsive rules.
- [ ] Step 2: Inspect `index3.html` Signal form/backend markup and compare it to `index-enhancements.js`.
- [ ] Step 3: Inspect all six Artist categories and modal text in `index3.html` and current enhancement code.
- [ ] Step 4: Inspect current MORE portal and any other floating-window implementations for duplicate layers.
- [ ] Step 5: Inspect Archive/release catalog ordering and index release rendering.

### Task 2: Harden the unified floating-window layer

**Files:**
- Modify: `index-enhancements.js`
- Modify: `site-shell.js`
- Modify: `site-shell.css`
- Test: `scripts/test-site-shell.mjs`

**Interfaces:**
- Consumes: existing `#utilityDropdown`, Spotify trigger/player, Signal form, Artist modal.
- Produces: body-level foreground UI with deterministic z-index, focus/close behavior, viewport-safe positioning, and no clipping by page content.

- [ ] Step 1: Add regression assertions for body-level MORE, Artist modal, Spotify player, and close controls.
- [ ] Step 2: Ensure each floating layer is attached outside clipping/transforming content containers.
- [ ] Step 3: Normalize z-index hierarchy and fixed positioning without relying on descendant stacking contexts.
- [ ] Step 4: Preserve Escape/outside-click/ARIA behavior and ensure only one modal-style window is active where appropriate.
- [ ] Step 5: Add mobile viewport bounds and internal scrolling for long Artist content.
- [ ] Step 6: Run the shell regression suite and repair failures.

### Task 3: Finish Spotify floating player

**Files:**
- Modify: `index.html` or existing enhancement asset only if the recovered implementation requires it
- Modify: `index-enhancements.js`
- Modify: `scripts/test-site-shell.mjs`

**Interfaces:**
- Consumes: existing `#featureSpotify` and `.orbit-stage .core` trigger.
- Produces: responsive floating Spotify player with close control and current LIL SYNN material.

- [ ] Step 1: Verify the existing Spotify embed URI/iframe and identify the current featured material.
- [ ] Step 2: Add a failing assertion that the orbit core opens the player without navigation.
- [ ] Step 3: Implement only missing trigger/open/close/focus behavior.
- [ ] Step 4: Add responsive assertions for the player dock.
- [ ] Step 5: Run tests.

### Task 4: Finish Join the Signal

**Files:**
- Modify: `index-enhancements.js`
- Modify: `scripts/test-site-shell.mjs`

**Interfaces:**
- Consumes: existing Signal section and Buttondown form endpoint from the recovered `index3.html` implementation.
- Produces: inline email subscription form with browser validation and visible success/error-safe status handling.

- [ ] Step 1: Add assertions for email input, POST form method, endpoint, submit button, and live status.
- [ ] Step 2: Preserve the working backend action and hidden embed/tag fields.
- [ ] Step 3: Ensure the form replaces the redundant navigation CTA without leaving index.
- [ ] Step 4: Add non-blocking submission status behavior and mobile layout.
- [ ] Step 5: Run tests.

### Task 5: Finish condensed About / Artist windows

**Files:**
- Modify: `index-enhancements.js`
- Modify: `scripts/test-site-shell.mjs`

**Interfaces:**
- Consumes: six category bodies from `index3.html`.
- Produces: condensed index Artist panel plus one body-level, scrollable information dialog positioned near its triggering button.

- [ ] Step 1: Add assertions for all six button labels and six corresponding content keys.
- [ ] Step 2: Verify each button opens exactly one dialog and replaces the previous active content.
- [ ] Step 3: Keep dialog position within viewport and prefer below-trigger placement, falling above when necessary.
- [ ] Step 4: Preserve Escape, backdrop click, close button, keyboard activation, and `aria-modal` behavior.
- [ ] Step 5: Run tests.

### Task 6: Complete regular-page shell normalization

**Files:**
- Modify: regular HTML pages identified by the audit
- Modify: `site-shell.js`, `site-shell.css` only when shared behavior is missing
- Modify: `.github/workflows/fix-homepage.yml` only when automation can still regress the shell

**Interfaces:**
- Consumes: canonical shell and each page's existing content.
- Produces: current shell + preserved page-specific content for every regular page, with Vote on its dedicated current shell and Suno untouched.

- [ ] Step 1: Enumerate regular HTML pages and classify standalone content versus shared shell.
- [ ] Step 2: Remove remaining legacy shell markup/references from affected pages.
- [ ] Step 3: Ensure shared BG_STARS, nav, hamburger, MORE, and footer are present or injected by the canonical system.
- [ ] Step 4: Verify Contact routes to `/#contact` or `index.html#contact`, never `/vote#contact` or `/index.html/contact`.
- [ ] Step 5: Verify `/vote` and `/archive` preserve their page-specific content.
- [ ] Step 6: Confirm `/Suno` is excluded from generic shell mutation.

### Task 7: Authentication production investigation

**Files:**
- Read: Command/Admin/Designer login pages and `/api/admin` implementation
- Modify: auth code only if a demonstrated defect is found
- Modify: `scripts/test-site-shell.mjs` or add a focused auth test only if required

**Interfaces:**
- Consumes: actual production login request/response/session flow.
- Produces: verified diagnosis and, only when supported by evidence, a minimal auth repair.

- [ ] Step 1: Trace client form submission, fetch URL/method, credentials mode, response parsing, and redirect handling.
- [ ] Step 2: Trace `/api/admin` authentication and session creation/rejection logic.
- [ ] Step 3: Check production runtime behavior using safe status/boolean observations only.
- [ ] Step 4: Verify cookie presence/attributes only as non-secret booleans/metadata; never print cookie values.
- [ ] Step 5: Perform at most one controlled authentication test and account for rate limiting.
- [ ] Step 6: Change code only if evidence identifies a code defect; otherwise document the production/configuration diagnosis.

### Task 8: Rate-limit-safe verification

**Files:**
- Read/Modify: auth implementation only if required by evidence
- Test: focused auth regression coverage

**Interfaces:**
- Consumes: existing rate-limit behavior.
- Produces: deterministic, low-volume verification procedure that does not hammer login endpoints.

- [ ] Step 1: Inspect rate-limit thresholds/window/reset behavior.
- [ ] Step 2: Ensure tests do not repeatedly submit real credentials to production.
- [ ] Step 3: Use one controlled live request only when necessary.
- [ ] Step 4: Record only status-class/session-state booleans.

### Task 9: Strengthen regression protection

**Files:**
- Modify: `scripts/test-site-shell.mjs`
- Modify: `.github/workflows/fix-homepage.yml`

**Interfaces:**
- Consumes: canonical shell files and all regular-page HTML.
- Produces: CI checks that fail if the old shell, bad Contact routes, broken release source, popup clipping risk, missing Signal/Artist/Spotify hooks, or Suno mutation reappears.

- [ ] Step 1: Add assertions for every required shell component and legacy-shell absence.
- [ ] Step 2: Add assertions for fixed BG_STARS and pointer-events-disabled geometry.
- [ ] Step 3: Add assertions for release-catalog newest-first first-eight selection.
- [ ] Step 4: Add assertions for Signal, Artist, Spotify, and foreground popup hooks.
- [ ] Step 5: Add assertions preventing generic workflows from touching `/Suno`.
- [ ] Step 6: Run the complete test suite.

### Task 10: GitHub and Vercel production verification

**Files:**
- Read: GitHub `main` history/workflow runs
- Read: Vercel project/deployments

**Interfaces:**
- Consumes: final `main` commit and Vercel deployment metadata.
- Produces: verified production state with no false deployment claims.

- [ ] Step 1: Verify every implementation commit is on `main` and no new development branch was created.
- [ ] Step 2: Verify workflow status and final regression tests.
- [ ] Step 3: Confirm no secret files or secret values were changed.
- [ ] Step 4: Trigger/observe Vercel production deployment only after `main` is verified.
- [ ] Step 5: Confirm deployment is READY and tied to the expected `main` commit.
- [ ] Step 6: Verify production routes `/`, `/vote`, `/archive`, `/releases`, `/gallery`, `/videos`, `/universe`, and other regular pages for canonical shell markers.
- [ ] Step 7: If Vercel build/rate limiting blocks deployment, report that exact state and do not claim the new code is live.
