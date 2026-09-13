# Suno V6 Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Finish and harden the premium LIL SYNN Suno V6 creator/reference platform while preserving the existing static architecture and source synchronization.

**Architecture:** Extend the existing shared Suno runtime rather than duplicating navigation or tool logic. Build-generated reference pages remain canonical-source driven; interactive surfaces remain deterministic client-side utilities. The public site exposes clean `/suno/*` routes and never exposes the canonical GitHub guide as a destination.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node.js build scripts, `marked`, Vercel static deployment.

**Spec:** `docs/superpowers/specs/2026-09-13-suno-v6-platform-design.md`

## Global Constraints
- LIL SYNN visual identity uses black, gold, and white with premium editorial typography.
- Public Suno navigation must not send visitors to GitHub for guide content.
- Forum destination is `https://suno-forum.base44.app` and opens in a new tab.
- Donation destination is `https://cash.app/$lilsynnofficial`.
- Interactive tools must remain deterministic and must not fabricate Suno generation results.
- Existing clean routes and generated source pages must remain intact.
- Vercel production deployment is deferred while the daily deployment quota is exhausted.

---

### Task 1: Harden shared navigation and Forum integration

**Files:**
- Modify: `Suno/js/suno.js`
- Modify: `Suno/command-center.html` only if shared-runtime fallback cannot cover its static header
- Modify: `scripts/audit-suno-site.mjs`

**Interfaces:**
- `Suno/js/suno.js` owns the shared public navigation.
- `scripts/audit-suno-site.mjs` must reject missing Forum navigation and incorrect external attributes.

- [ ] Add a `FORUM ↗` external navigation item to the injected navigation with `href="https://suno-forum.base44.app"`, `target="_blank"`, and `rel="noopener noreferrer"`.
- [ ] Add a runtime fallback that finds an existing `.site-nav` and appends the same Forum item when a page already has a static header.
- [ ] Ensure the fallback is idempotent by checking for `.nav-forum` before insertion.
- [ ] Style `.nav-forum` consistently with the premium navigation and gold emphasis.
- [ ] Extend the audit to require the Forum URL, new-tab attributes, and Forum class in the runtime.
- [ ] Commit as `feat: add Suno forum navigation`.

### Task 2: Validate the complete existing platform architecture

**Files:**
- Inspect: `Suno/Suno_Guide.html`
- Inspect: `Suno/js/suno-tools.js`
- Inspect: `scripts/build-suno-topics.mjs`
- Inspect: `scripts/build-suno-index.mjs`
- Inspect: `scripts/sync-suno-guide.mjs`
- Inspect: `Suno/manifest.json`
- Modify: only files required to repair a failing contract

**Interfaces:**
- Build scripts produce generated topic/source/index/manifest assets.
- Audit script validates the complete public contract.

- [ ] Confirm all sixteen core topics, seven deep dives, seven tool surfaces, and the complete guide are generated from the current source architecture.
- [ ] Confirm the search index has 38 entries and the manifest counts match 16/7/8/7/7/38.
- [ ] Confirm complete/deep pages have TOCs, internal navigation, source status, and no Markdown links.
- [ ] Repair any stale generated artifact or build-script mismatch discovered by the contract audit.
- [ ] Commit only if repairs are needed.

### Task 3: Harden interactive creator tools

**Files:**
- Inspect/modify: `Suno/js/suno-tools.js`
- Inspect/modify: `Suno/css/tools.css`
- Inspect/modify: six tool HTML surfaces under `Suno/`
- Modify: `scripts/audit-suno-site.mjs`

**Interfaces:**
- Tool pages expose `copy-output` and `reset-tool` actions.
- `suno-tools.js` provides deterministic builders identified by `promptArchitect`, `styleBuilder`, `lyricsBuilder`, `controls`, `troubleshoot`, and `workflow`.

- [ ] Verify each tool has useful inputs, deterministic output, copy, reset, and links to relevant guide content.
- [ ] Verify output is escaped/safely rendered where applicable and remains usable without network access after page load.
- [ ] Verify reset returns every control to its documented initial state.
- [ ] Add targeted audit checks for tool identifiers and required controls where absent.
- [ ] Commit repairs as `fix: harden Suno creator tools` if needed.

### Task 4: Premium UX and responsive navigation polish

**Files:**
- Modify: `Suno/css/suno.css`
- Modify: `Suno/css/command-center.css` if required
- Modify: `Suno/css/tools.css` if required
- Modify: `Suno/js/suno.js`

**Interfaces:**
- Shared visual tokens live in `Suno/css/suno.css`.
- Command Center and tools inherit shared identity and only override surface-specific layout.

- [ ] Keep the hero artwork constrained rather than oversized.
- [ ] Preserve high-contrast keyboard focus, readable body text, and touch-sized mobile controls.
- [ ] Make Forum visible in both desktop and mobile navigation.
- [ ] Ensure dropdown menus do not overflow the viewport and Escape closes them.
- [ ] Ensure tool cards, guide cards, search overlays, and live panels remain usable at mobile widths.
- [ ] Commit visual repairs as `style: polish Suno platform UX` if needed.

### Task 5: Source integrity, search, and live-knowledge validation

**Files:**
- Inspect/modify: `scripts/sync-suno-guide.mjs`
- Inspect/modify: `scripts/build-suno-index.mjs`
- Inspect/modify: `Suno/js/suno.js`
- Modify: `scripts/audit-suno-site.mjs`

**Interfaces:**
- Canonical source synchronization produces generated HTML.
- Search index is consumed from `/suno/search-index.json`.
- Live metadata is consumed from `/suno/manifest.json`.

- [ ] Verify all eight canonical source documents remain enumerated.
- [ ] Verify GitHub canonical guide links are rewritten to `/suno` and raw GitHub links are removed.
- [ ] Verify search covers the full indexed platform and exposes no source-repository URL leakage.
- [ ] Verify manifest data is displayed only when valid JSON is available and cannot break page rendering when unavailable.
- [ ] Commit source-integrity repairs if needed.

### Task 6: Automated audit and local build verification

**Files:**
- Modify only failing implementation/test files.

**Interfaces:**
- `npm run build` is the complete generation + audit command.
- `npm run test:suno` runs the Suno contract audit.

- [ ] Run `npm run build` from the repository root.
- [ ] Require the audit to report PASS for required routes/assets, 16 core topics, 8 full-source pages, 7 tools, 7 reference terms, 38 indexed entries, and no canonical GitHub leakage.
- [ ] If the build fails, fix the smallest root cause and rerun until the local contract passes.
- [ ] Commit the final verified implementation state.

### Task 7: Production deployment handoff and QA

**Files:**
- No source changes unless production QA exposes a real defect.

**Interfaces:**
- Vercel production serves `lilsynn.com` and the clean `/suno/*` routes.

- [ ] Do not trigger repeated deployments while the account is blocked by the daily quota.
- [ ] After quota reset, verify a deployment is created from the latest `main` commit.
- [ ] Browser-check `/suno`, `/suno/v6`, `/suno/complete`, `/suno/command-center`, one tool page, Forum navigation, donation CTA, global search, and mobile navigation.
- [ ] Verify Forum opens externally and does not route through `/suno`.
- [ ] Verify no production page exposes canonical GitHub guide links.
- [ ] Only claim production completion after these checks pass.
