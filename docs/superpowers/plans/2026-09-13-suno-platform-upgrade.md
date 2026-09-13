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
**Files:**
- Create: `Suno/command-center.html`
- Create: `Suno/css/command-center.css`
- Modify: `Suno/js/suno.js`
- Modify: `Suno/Suno_Guide.html`
- Modify: `vercel.json`

- [ ] Add responsive command-center layout, global navigation, tool launcher cards, core-topic shortcuts, live source status, and search entry.
- [ ] Add clean routes for command center and tools.
- [ ] Add landing-page CTA and navigation entry.
- [ ] Verify static route targets and asset paths.

### Task 2: Implement Prompt Architect and Style Builder
**Files:**
- Create: `Suno/prompt-architect.html`
- Create: `Suno/style-builder.html`
- Create: `Suno/js/suno-tools.js`
- Modify: `Suno/css/command-center.css`

- [ ] Implement structured prompt inputs and deterministic output assembly.
- [ ] Implement style builder with genre, era, mood, vocals, instrumentation, arrangement, production, and texture inputs.
- [ ] Add copy/reset/feedback controls.
- [ ] Add links to prompting/styles/V6 reference pages.

### Task 3: Implement Lyrics/Tag Builder and Controls Assistant
**Files:**
- Create: `Suno/lyrics-builder.html`
- Create: `Suno/controls.html`
- Modify: `Suno/js/suno-tools.js`

- [ ] Implement section/tag builder with common song structures and editable section rows.
- [ ] Implement control strategy assistant using goal, predictability, experimentation, and repair inputs.
- [ ] Add validation for missing structure and contradictory selections.
- [ ] Add related guide links and copy/reset behavior.

### Task 4: Implement Troubleshooter and Workflow Wizard
**Files:**
- Create: `Suno/troubleshooter.html`
- Create: `Suno/workflow.html`
- Modify: `Suno/js/suno-tools.js`

- [ ] Implement symptom-driven troubleshooting matrix.
- [ ] Implement ordered workflow stages from concept through release/QC.
- [ ] Add targeted guide links based on selected problem/stage.
- [ ] Add restart/reset behavior.

### Task 5: Upgrade search and knowledge integration
**Files:**
- Modify: `scripts/build-suno-index.mjs`
- Modify: `Suno/js/suno.js`
- Modify: `Suno/manifest.json` through build output

- [ ] Add tool and terminology entries to search index.
- [ ] Distinguish GUIDE vs TOOL in search results.
- [ ] Add terminology aliases and cross-links.
- [ ] Ensure all tool surfaces are discoverable without leaving LILSYNN.COM.

### Task 6: Upgrade visual system and mobile UX
**Files:**
- Modify: `Suno/css/suno.css`
- Modify: `Suno/css/command-center.css`
- Modify: `Suno/js/suno.js`
- Modify: all new tool HTML surfaces as needed

- [ ] Add consistent premium visual tokens, tool cards, panels, forms, result surfaces, focus states, and mobile breakpoints.
- [ ] Remove overflow/spacing defects and ensure touch targets are usable.
- [ ] Add reduced-motion handling where animations are used.

### Task 7: Harden build and automated audit
**Files:**
- Modify: `scripts/audit-suno-site.mjs`
- Modify: `package.json`
- Modify: `scripts/build-suno-index.mjs`

- [ ] Audit all new routes, files, navigation links, tool IDs, search entries, and manifest counts.
- [ ] Fail builds on source-link leakage, missing clean routes, empty tool surfaces, or inconsistent index metadata.
- [ ] Run `npm run build` and `npm run test:suno`.

### Task 8: Production deployment and browser verification
**Files:**
- No source changes unless verification exposes a defect.

- [ ] Deploy the verified commit to Vercel.
- [ ] Verify production HTTP 200 for landing, command center, every tool, representative core topics, and complete guide.
- [ ] Verify search, tool generation, copy/reset, navigation, and mobile behavior with browser automation.
- [ ] Verify deployment is READY and custom-domain routes resolve correctly.
