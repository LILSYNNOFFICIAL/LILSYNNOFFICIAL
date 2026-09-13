# Suno Complete Audit and Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit, harden, and verify the LIL SYNN Suno V6 site so every planned route, navigation path, content surface, search behavior, responsive interaction, source-sync path, and production deployment is reliable and self-contained.

**Architecture:** Keep the existing static HTML architecture and Vercel build-time synchronization. Strengthen shared navigation/search behavior in `Suno/js/suno.js`, shared presentation in `Suno/css/suno.css`, route/build integrity in `vercel.json` and `scripts/sync-suno-guide.mjs`, and add an automated audit script that validates generated output and internal-link integrity without introducing a runtime backend.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js, `marked`, Vercel, GitHub Actions/Contents API for repository changes.

**Spec:** Existing approved Suno premium-site architecture and the current Suno landing/guide implementation.

## Global Constraints

- User-facing Suno pages must not link visitors back to the canonical GitHub repository.
- Canonical source remains `LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide` and is synchronized at build time.
- Core routes use `/suno/...` clean URLs.
- Visual system remains premium black/gold/white with restrained hero artwork.
- The guide remains usable without a client-side framework or server runtime.
- Every changed behavior must be verified against generated output and production where applicable.

---

### Task 1: Repository and production audit

**Files:**
- Read: `vercel.json`
- Read: `package.json`
- Read: `scripts/sync-suno-guide.mjs`
- Read: `Suno/Suno_Guide.html`
- Read: `Suno/css/suno.css`
- Read: `Suno/js/suno.js`
- Inspect: `Suno/guides/*.html`, `Suno/complete/*.html`

**Interfaces:**
- Produces: an evidence-based defect list covering routes, links, source leakage, content coverage, JS behavior, and build integrity.

- [ ] **Step 1: Enumerate every planned clean route and corresponding static target.**
- [ ] **Step 2: Scan Suno source files for canonical GitHub links, raw GitHub links, `.md` navigation targets, and broken relative paths.**
- [ ] **Step 3: Compare the 16 core topics plus master guide and seven deep dives against navigation and landing-page cards.**
- [ ] **Step 4: Record concrete defects and only repair defects that affect the approved scope.**

---

### Task 2: Build an automated Suno integrity audit

**Files:**
- Create: `scripts/audit-suno-site.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: a zero-exit audit when generated Suno output is structurally valid; non-zero exit with named failures otherwise.

- [ ] **Step 1: Add an audit script that checks required files, clean-route mappings, internal `/suno` links, absence of canonical GitHub links in generated HTML, and presence of all eight synchronized source documents.**
- [ ] **Step 2: Add a `test:suno` npm script invoking the audit.**
- [ ] **Step 3: Run the audit against the current repository and use failures to drive targeted fixes.**

---

### Task 3: Harden the shared navigation and search UX

**Files:**
- Modify: `Suno/js/suno.js`
- Modify: `Suno/css/suno.css`
- Modify: `Suno/Suno_Guide.html` if landing-page markup needs stable hooks

**Interfaces:**
- Consumes: existing `.site-header`, `.site-nav`, `.nav-group`, `.nav-trigger`, `.guide-card`, `#guide-search`, and `.filter-chip` markup.
- Produces: keyboard-safe dropdowns, predictable mobile navigation, active route indication, robust search/filter behavior, and accessible empty-state behavior.

- [ ] **Step 1: Add route-aware active navigation state without changing clean URLs.**
- [ ] **Step 2: Make dropdown interaction deterministic for mouse, keyboard Escape, and mobile menu state.**
- [ ] **Step 3: Improve search so it searches all visible library metadata and resets correctly when filters change.**
- [ ] **Step 4: Add accessible labels/status updates where the current static markup supports them.**
- [ ] **Step 5: Run syntax/build/audit verification.**

---

### Task 4: Harden source synchronization and internal linking

**Files:**
- Modify: `scripts/sync-suno-guide.mjs`
- Modify: `Suno/guides/*.html` only when source hygiene requires committed-source repair

**Interfaces:**
- Consumes: eight canonical Markdown documents.
- Produces: complete HTML pages plus sanitized internal links and deterministic generated metadata.

- [ ] **Step 1: Make canonical GitHub and raw-GitHub URL sanitization comprehensive for the generated documents.**
- [ ] **Step 2: Rewrite known canonical Markdown deep-dive links to clean website routes during generation.**
- [ ] **Step 3: Preserve ordinary external official Suno/help links rather than stripping unrelated references.**
- [ ] **Step 4: Ensure the synchronization command fails loudly on any missing source document or failed fetch.**
- [ ] **Step 5: Run the build and inspect generated output for all eight source documents.**

---

### Task 5: Add and verify a complete-guide navigation layer

**Files:**
- Modify: `scripts/sync-suno-guide.mjs`
- Modify: `Suno/css/suno.css`
- Modify: `Suno/js/suno.js`

**Interfaces:**
- Consumes: generated complete-guide pages.
- Produces: consistent breadcrumbs, reader navigation, and internal movement between the master reference and focused topic pages without exposing GitHub.

- [ ] **Step 1: Add previous/next reader links to generated deep-dive/master pages where order is deterministic.**
- [ ] **Step 2: Add a compact “jump to topic” path from complete-guide pages to core routes.**
- [ ] **Step 3: Ensure the generated reader controls remain usable on narrow screens.**
- [ ] **Step 4: Verify every generated reader link resolves to an existing clean route.**

---

### Task 6: Add lightweight “What’s New” source metadata

**Files:**
- Modify: `scripts/sync-suno-guide.mjs`
- Modify: `Suno/Suno_Guide.html`
- Modify: `Suno/css/suno.css`

**Interfaces:**
- Produces: a visible source/update indicator based on the build date and synchronized source set, without inventing per-document change claims.

- [ ] **Step 1: Replace hard-coded generated reference dates with the build date.**
- [ ] **Step 2: Add a compact update panel on the landing page that states the source set and synchronization date.**
- [ ] **Step 3: Keep update copy factual and avoid claiming specific source changes unless the build can prove them.**
- [ ] **Step 4: Verify the generated date is deterministic for the build and renders correctly.**

---

### Task 7: Production route, content, and browser verification

**Files:**
- Read: production deployment and generated output

**Interfaces:**
- Produces: evidence for all planned production routes, key interactions, and absence of GitHub leakage.

- [ ] **Step 1: Run the complete local build and audit.**
- [ ] **Step 2: Deploy the verified repository state to Vercel.**
- [ ] **Step 3: Verify `/suno`, all 16 core routes, `/suno/complete`, and all seven deep-dive routes return HTTP 200.**
- [ ] **Step 4: Verify representative production HTML contains internal links, expected content, and no canonical GitHub links.**
- [ ] **Step 5: Verify the production deployment reports READY and inspect build logs for failures.**

---

### Task 8: Final verification and integration

**Files:**
- Read: `docs/superpowers/plans/2026-09-13-suno-complete-audit-and-hardening.md`
- Read: changed source files

**Interfaces:**
- Produces: final evidence-backed status and a clean repository state on `main`.

- [ ] **Step 1: Re-run the full build from the final repository state.**
- [ ] **Step 2: Re-run `npm run test:suno`.**
- [ ] **Step 3: Re-check all requirements line-by-line against production evidence.**
- [ ] **Step 4: Inspect the final commit/deployment metadata before reporting status.**
