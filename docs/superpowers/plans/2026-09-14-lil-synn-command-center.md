# LIL SYNN Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, read-only `/admin/` command center that aggregates trustworthy main-site, Suno, GitHub, and repository-health signals without becoming a dependency of the systems it monitors.

**Architecture:** Static browser UI under `/admin/`, with focused CSS/JS and a small normalized signal model. Existing health pages remain authoritative. GitHub data is read-only and source-linked; unavailable data is explicitly `UNKNOWN` rather than fabricated.

**Tech Stack:** HTML, CSS, vanilla JavaScript, browser Fetch API, existing site assets/patterns, GitHub REST/public web surfaces where safely accessible.

**Spec:** `docs/superpowers/specs/2026-09-14-lil-synn-command-center-design.md`

## Global Constraints

- Main site remains independent of Command Center.
- Suno remains isolated under `/Suno/**` and is not modified for Command Center internals.
- Command Center is read-only.
- Never expose secrets, tokens, credentials, or private repository data.
- Never invent telemetry; use `UNKNOWN` when authoritative data is unavailable.
- Preserve mobile-first responsive behavior and accessibility.
- Use black/obsidian + metallic-gold visual language without sacrificing status semantics.
- Do not alter unrelated root site behavior.

---

### Task 1: Create Command Center shell and visual system

**Files:**
- Create: `/admin/index.html`
- Create: `/admin/admin.css`

**Interfaces:**
- Produces the semantic page shell and visual tokens consumed by later JS.

- [ ] **Step 1: Add failing static expectations to the Command Center test harness.**
- [ ] **Step 2: Implement the page shell with header, system state, subsystem cards, activity panels, diagnostics, and documentation links.**
- [ ] **Step 3: Implement the black/gold responsive design system with accessible focus states and reduced-motion support.**
- [ ] **Step 4: Verify markup contains a single main landmark, descriptive title, status text, and mobile-safe layout.**

### Task 2: Build normalized browser health model

**Files:**
- Create: `/admin/admin.js`
- Modify: `/admin/index.html`

**Interfaces:**
- `normalizeSignal(name, state, detail, source)` returns a normalized signal object.
- `renderSignal(signal)` renders one subsystem signal.
- `runLocalHealthChecks()` returns browser-verifiable local checks.

- [ ] **Step 1: Add tests for PASS/WARN/FAIL/UNKNOWN normalization and escaping.**
- [ ] **Step 2: Implement local browser checks against existing main and Suno health entry points.**
- [ ] **Step 3: Render system summary and subsystem status cards from normalized signals.**
- [ ] **Step 4: Verify unknown/unavailable data never becomes an invented PASS.**

### Task 3: Add GitHub read-only intelligence

**Files:**
- Modify: `/admin/admin.js`
- Modify: `/admin/index.html`

**Interfaces:**
- `loadGitHubSignals()` returns read-only workflow/repository signals.
- Each remote signal includes source URL and freshness metadata.

- [ ] **Step 1: Add tests for successful, unavailable, and rate-limited GitHub responses.**
- [ ] **Step 2: Implement safe public GitHub reads without embedding credentials.**
- [ ] **Step 3: Add recent workflow/run/commit summaries and authoritative GitHub links.**
- [ ] **Step 4: Verify no write/destructive API methods or credential fields exist in the frontend.**

### Task 4: Add diagnostics and activity presentation

**Files:**
- Modify: `/admin/index.html`
- Modify: `/admin/admin.css`
- Modify: `/admin/admin.js`

**Interfaces:**
- `renderActivity(events)` renders recent source-backed events.
- `renderDiagnostics(signals)` renders actionable but non-destructive diagnostics.

- [ ] **Step 1: Add tests for event ordering, timestamp formatting, and unknown states.**
- [ ] **Step 2: Implement activity timeline and diagnostics drawer/panel.**
- [ ] **Step 3: Add links to Main Site Health, Suno Health, repository, and relevant GitHub sources.**
- [ ] **Step 4: Verify narrow mobile layout and keyboard interaction.**

### Task 5: Add lightweight browser regression harness

**Files:**
- Create: `/admin/admin.test.mjs`
- Modify: `/admin/index.html` only if required for test hooks

- [ ] **Step 1: Test that required Command Center files exist and are isolated to `/admin/**`.**
- [ ] **Step 2: Test that source contains no secret-like credential literals and no destructive GitHub endpoint usage.**
- [ ] **Step 3: Test that required links point to authoritative health pages and GitHub sources.**
- [ ] **Step 4: Run the harness and record failures before claiming completion.**

### Task 6: Production verification and documentation

**Files:**
- Create: `/admin/README.md`
- Modify: `/site-health.html` only if a single safe link to Command Center is needed.

- [ ] **Step 1: Document architecture, data boundaries, read-only guarantees, and unavailable-data behavior.**
- [ ] **Step 2: Verify the Command Center is not imported or required by the main site or Suno.**
- [ ] **Step 3: Run repository-side checks available in the environment.**
- [ ] **Step 4: Perform browser-level verification of the deployed/static surface where available.**
- [ ] **Step 5: Review the diff for accidental unrelated changes.**

## Completion Gate

Do not claim the Command Center is production-ready until repository tests and available browser verification have actually been run and their results are reported.
