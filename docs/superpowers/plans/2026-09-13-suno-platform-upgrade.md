# Suno Platform Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, interactive Suno V6 creator platform on top of the existing living knowledge base.

**Architecture:** Preserve the static Vercel architecture and canonical-source synchronization. Add a reusable command-center UI, six deterministic client-side creator tools, expanded search metadata, and production-grade audits/route verification.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js build scripts, marked, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-13-suno-platform-design.md`

## Global Constraints
- Black / gold / white LIL SYNN visual language.
- No visitor-facing GitHub/source-repository links.
- No fabricated Suno API execution or unsupported claims.
- No new paid runtime dependencies.
- Existing source-derived pages remain generated from the canonical eight-document source set.
- All clean Suno routes must be internally linked and auditable.

---

### Task 1: Build the shared command-center shell
**Files:** `Suno/command-center.html`, `Suno/css/command-center.css`, `Suno/js/suno.js`, `Suno/Suno_Guide.html`, `vercel.json`

- [x] Add responsive command-center layout, global navigation, tool launcher cards, core-topic shortcuts, live source status, and search entry.
- [x] Add clean routes for command center and tools.
- [x] Add landing-page CTA and navigation entry.
- [x] Verify static route targets and asset paths.

### Task 2: Implement Prompt Architect and Style Builder
**Files:** `Suno/prompt-architect.html`, `Suno/style-builder.html`, `Suno/js/suno-tools.js`, `Suno/css/command-center.css`

- [x] Implement structured prompt inputs and deterministic output assembly.
- [x] Implement style builder with genre, era, mood, vocals, instrumentation, arrangement, production, and texture inputs.
- [x] Add copy/reset/feedback controls.
- [x] Add links to prompting/styles/V6 reference pages.

### Task 3: Implement Lyrics/Tag Builder and Controls Assistant
**Files:** `Suno/lyrics-builder.html`, `Suno/controls.html`, `Suno/js/suno-tools.js`

- [x] Implement section/tag builder with common song structures and editable section rows.
- [x] Implement control strategy assistant using goal, predictability, experimentation, and repair inputs.
- [x] Add validation for missing structure and contradictory selections.
- [x] Add related guide links and copy/reset behavior.

### Task 4: Implement Troubleshooter and Workflow Wizard
**Files:** `Suno/troubleshooter.html`, `Suno/workflow.html`, `Suno/js/suno-tools.js`

- [x] Implement symptom-driven troubleshooting matrix.
- [x] Implement ordered workflow stages from concept through release/QC.
- [x] Add targeted guide links based on selected problem/stage.
- [x] Add restart/reset behavior.

### Task 5: Upgrade search and knowledge integration
**Files:** `scripts/build-suno-index.mjs`, `Suno/js/suno.js`, `Suno/manifest.json`

- [x] Add tool and terminology entries to search index.
- [x] Distinguish GUIDE vs TOOL in search results.
- [x] Add terminology aliases and cross-links.
- [x] Ensure all tool surfaces are discoverable without leaving LILSYNN.COM.

### Task 6: Upgrade visual system and mobile UX
**Files:** `Suno/css/suno.css`, `Suno/css/command-center.css`, `Suno/css/tools.css`, `Suno/js/suno.js`

- [x] Add consistent premium visual tokens, tool cards, panels, forms, result surfaces, focus states, and mobile breakpoints.
- [x] Remove overflow/spacing defects and ensure touch targets are usable.
- [x] Add reduced-motion handling where animations are used.

### Task 7: Harden build and automated audit
**Files:** `scripts/audit-suno-site.mjs`, `package.json`, `scripts/build-suno-index.mjs`, `scripts/upgrade-suno-shell.mjs`, `scripts/upgrade-suno-tools.mjs`

- [x] Audit all new routes, files, navigation links, tool IDs, search entries, and manifest counts.
- [x] Fail builds on source-link leakage, missing clean routes, empty tool surfaces, or inconsistent index metadata.
- [x] Build pipeline updated to run source sync, topic generation, shell/tool upgrades, indexing, copy to public, and audit.

### Task 8: Production deployment and browser verification
- [ ] Deploy the final verified commit to Vercel.
- [ ] Verify production HTTP 200 for landing, command center, every tool, representative core topics, and complete guide.
- [ ] Verify search, tool generation, copy/reset, navigation, and mobile behavior with browser automation.
- [ ] Verify deployment is READY and custom-domain routes resolve correctly.
