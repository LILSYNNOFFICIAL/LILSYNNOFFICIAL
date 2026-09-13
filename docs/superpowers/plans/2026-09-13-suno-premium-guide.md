# Premium Suno V6 Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Suno guide as a premium, compact, internally linked knowledge-base website while preserving all living-guide content.

**Architecture:** Keep static HTML/CSS/JS. The build script fetches the canonical eight Markdown documents, renders the complete source documents internally, and emits topic pages plus clean route metadata. The landing page becomes the information architecture hub; Vercel rewrites expose clean `/suno/*` URLs while retaining legacy compatibility.

**Tech Stack:** Static HTML, CSS, vanilla JS, Node.js, `marked`, Vercel rewrites.

**Spec:** `docs/superpowers/specs/2026-09-13-suno-premium-guide-design.md`

## Global Constraints
- Black/gold/white premium visual system.
- Hero artwork must be compact and never dominate the viewport.
- Desktop navigation is horizontal with grouped dropdowns; mobile navigation collapses cleanly.
- Guide content remains self-contained on LILSYNN.COM; do not link guide readers to GitHub.
- Preserve all eight canonical source documents in the internal generated complete library.
- Clean `/suno/*` routes are canonical; legacy `/Suno/*` routes remain compatible.
- Verify deployment before claiming completion.

### Task 1: Rebuild landing page information architecture
**Files:** `Suno/Suno_Guide.html`
- [ ] Replace the sparse four-link header with grouped desktop dropdown navigation and mobile menu.
- [ ] Add compact hero art treatment, About This Guide panel, scope metrics, and clear Start Exploring CTA.
- [ ] Link all core topics through canonical `/suno/<topic>` URLs.
- [ ] Keep deep dives discoverable without making them compete with the core library.

### Task 2: Upgrade shared visual system and interactions
**Files:** `Suno/css/suno.css`, `Suno/js/suno.js`
- [ ] Add premium navigation dropdown styling, compact hero artwork sizing, guide-page chrome, breadcrumb/pager styling, responsive behavior, and accessibility states.
- [ ] Add keyboard/mouse dropdown behavior, mobile menu behavior, search/filter behavior, Escape handling, and back-to-top behavior without dependencies.

### Task 3: Make generated content pages first-class website pages
**Files:** `scripts/sync-suno-guide.mjs`
- [ ] Emit shared navigation on generated complete pages.
- [ ] Replace repository-relative guide links with clean internal `/suno/*` links where the destination is known.
- [ ] Keep external official evidence links intact.
- [ ] Prevent canonical guide repository URLs from appearing in rendered guide content.

### Task 4: Add clean Vercel routing
**Files:** `vercel.json`
- [ ] Rewrite `/suno` and `/suno/` to the landing page.
- [ ] Rewrite every core topic route to its existing `Suno/guides/*.html` page.
- [ ] Rewrite deep-dive routes to internal complete pages.
- [ ] Preserve legacy `/Suno/*` routes.

### Task 5: Validate source coverage and site integrity
**Files:** all changed Suno files
- [ ] Confirm every canonical source document remains represented in generated complete pages.
- [ ] Confirm no guide links point to the canonical GitHub repository.
- [ ] Confirm every navigation destination exists.
- [ ] Confirm build/deployment succeeds.
- [ ] Verify production clean routes and the landing page before reporting completion.
