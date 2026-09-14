# Suno Full Audit and QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit, repair, and verify the isolated `/Suno` project across structure, routes, content, tools, V6 guidance, accessibility, responsiveness, search, and regression health without modifying unrelated main-site files.

**Architecture:** Treat `/Suno` as a self-contained static application with its own scripts, tests, content, assets, and doctor. Prefer static repository inspection plus executable tests where the connected environment supports execution; never claim runtime success without actual execution evidence.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js ESM audit/test scripts, GitHub repository contents API.

**Spec:** User-approved full Suno regression/audit pass in chat on 2026-09-14.

## Global Constraints

- Modify only files under `/Suno/**` for Suno work.
- Main-site Suno health signaling remains warning-only and must not become a blocking dependency.
- Do not restore root Suno build scripts, package files, rewrites, or workflows.
- Preserve existing public Suno content and functionality unless an audit finding requires a repair.
- Separate verified Suno behavior from unsupported assumptions in documentation.
- Do not claim npm/CI/browser execution passed unless execution evidence exists.

---

### Task 1: Repository inventory and route/content audit

**Files:**
- Read: all `/Suno/**` HTML, CSS, JS, README, package and script files.
- Modify: only files with confirmed audit defects.

- [ ] Enumerate `/Suno` files and nested directories.
- [ ] Inspect all HTML navigation, stylesheet, script, image, internal-page, and tool references.
- [ ] Verify every documented public route has a corresponding implementation or explicit route strategy inside the isolated project.
- [ ] Record broken, missing, duplicate, or suspicious references.
- [ ] Repair confirmed broken references inside `/Suno`.
- [ ] Re-scan the affected references.

### Task 2: Suno doctor and test hardening

**Files:**
- Modify: `Suno/scripts/suno-site-doctor.mjs`
- Modify: `Suno/scripts/suno-site-doctor.test.mjs`
- Modify: `Suno/scripts/suno-isolation.test.mjs`
- Modify: `Suno/package.json` only if a verified command contract is missing.

- [ ] Review doctor coverage against the full audit scope.
- [ ] Add deterministic checks for every confirmed recurring defect class.
- [ ] Keep tests independent of repository working directory.
- [ ] Add regression assertions before implementation fixes when a new behavior is required.
- [ ] Execute available Node tests when an actual shell/runtime is available; otherwise report execution as unavailable.

### Task 3: Interactive tool QA and persistence

**Files:**
- Read/modify: `Suno/js/*.js` and all root-level tool HTML pages.

- [ ] Trace each tool's inputs, generation path, output rendering, copy/export behavior, and error handling.
- [ ] Verify draft/autosave keys and restore behavior are consistent.
- [ ] Repair confirmed tool defects without introducing external dependencies.
- [ ] Add regression checks for deterministic logic where practical.

### Task 4: V6 controls, audio guidance, and content consistency

**Files:**
- Read/modify: `Suno/guides/*.html`, `Suno/deep-dives/*`, `Suno/Suno_Guide.html`, `Suno/README.md`.

- [ ] Audit model names, sliders, controls, audio/reference behavior, editing workflows, and terminology for internal consistency.
- [ ] Preserve the V6 audio-quality rescue recipe and its explicit caveat that engineering targets are not guarantees.
- [ ] Identify unsupported claims and label or remove them rather than presenting guesses as facts.
- [ ] Repair stale, duplicated, or contradictory guidance found by the audit.

### Task 5: Search/index integrity

**Files:**
- Read/modify: `Suno/js/*`, search/index assets, and relevant HTML pages.

- [ ] Verify every guide, deep dive, and tool intended for discovery is indexed.
- [ ] Verify search result URLs resolve within `/Suno`.
- [ ] Repair stale or missing index entries.
- [ ] Add a doctor assertion for any invariant discovered during the audit.

### Task 6: Accessibility and responsive static QA

**Files:**
- Read/modify: `Suno/css/*`, shared HTML, and shared JS only when needed.

- [ ] Check semantic landmarks, labels, keyboard focus, interactive control semantics, reduced-motion handling, and obvious contrast hazards.
- [ ] Check responsive structures for overflow-prone tables, code blocks, controls, and navigation.
- [ ] Repair confirmed implementation defects with minimal CSS/HTML changes.

### Task 7: Final isolation and production audit

**Files:**
- Read: all `/Suno/**`.
- Modify: only `/Suno/**` if final findings remain.

- [ ] Verify no Suno build/test/doctor dependency escaped into root tooling.
- [ ] Verify main-site integration remains non-blocking at the approved boundary.
- [ ] Re-run static audits after repairs.
- [ ] Check final changed-file scope and report any execution limitations honestly.

---
