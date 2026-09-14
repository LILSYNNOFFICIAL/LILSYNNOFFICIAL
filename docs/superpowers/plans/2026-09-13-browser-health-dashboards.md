# Browser Health Dashboards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add mobile-first browser health dashboards for the main LIL SYNN site and isolated `/Suno` project.

**Architecture:** Each project owns a static HTML dashboard with inline browser QA logic. The dashboards crawl same-origin pages and referenced assets, expose project-specific checks, and clearly distinguish browser-verifiable health from Node/npm-only repository checks.

**Tech Stack:** Static HTML, CSS, browser Fetch API, DOMParser, existing site shell assets, existing Suno runtime assets.

**Spec:** `docs/superpowers/specs/2026-09-13-browser-health-dashboards-design.md`

## Global Constraints

- Preserve the existing main Site Doctor.
- Preserve the existing Suno Site Doctor and tests.
- Keep Suno-specific infrastructure under `/Suno/**`.
- Suno health failures must remain non-blocking to the main site.
- Dashboards must be usable on mobile.
- Never claim browser checks executed `npm` or Node-based tests.

---

### Task 1: Main-site browser health dashboard

**Files:**
- Create: `site-health.html`
- Create: `SITE-HEALTH.md`

- [ ] Build the dashboard with project summary, overall status, per-check status, timestamps, refresh control, and links to repository/runtime documentation.
- [ ] Crawl key main-site HTML entry points and discovered same-origin HTML pages while excluding `/Suno`, API endpoints, and non-HTML assets from page crawling.
- [ ] Validate referenced local assets, metadata, `<main>` landmarks, duplicate canonical/meta-description conditions, and reachable page responses.
- [ ] Add an explicit non-blocking Suno handoff linking to `/Suno/health.html`.
- [ ] Document browser-vs-Node limitations in `SITE-HEALTH.md`.

### Task 2: Suno browser health dashboard

**Files:**
- Create: `Suno/health.html`
- Create: `Suno/HEALTH.md`

- [ ] Build the dashboard entirely within `/Suno` using the existing Suno visual system.
- [ ] Seed the crawl from the Suno landing page, health page, search index, manifest, and required guide/tool/deep-dive paths.
- [ ] Validate same-origin `/Suno/**` page responses, discovered links, local assets, search-index integrity, manifest isolation, required V6/audio markers, and tool/runtime resources.
- [ ] Explicitly show that npm/Node checks are repository-only and link to the existing isolated doctor commands.
- [ ] Document the dashboard and canonical `/Suno/health.html` URL.

### Task 3: Documentation and verification

**Files:**
- Modify: `Suno/README.md`

- [ ] Add the browser dashboard to Suno project documentation without changing the existing reader/guide behavior.
- [ ] Verify created files exist and are internally referenced correctly through GitHub reads.
- [ ] Review the dashboards for syntax-sensitive inline JavaScript patterns used by the existing Site Doctors.
- [ ] Report runtime verification limits honestly because the GitHub connector does not execute `npm` or provide a live deployed browser session.
