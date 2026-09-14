# Complete Suno Website Content and Route Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/suno` a complete, self-contained Suno V6 knowledge site containing the full Markdown corpus from the guide repository, with correct Audio Quality guidance and no broken/white routes.

**Architecture:** At build time, synchronize every Markdown document from the dedicated Suno guide repository into `/Suno/library/<document>/index.html`, preserving full document content and converting document links to local site links. The public Suno routes point to real local pages/tools and never send visitors to GitHub. The homepage is a curated entry point that highlights the full Audio Quality workflow and exposes the complete library.

**Tech Stack:** Static HTML/CSS/JS, Node.js build script, Vercel static deployment, GitHub source repository for build-time Markdown synchronization.

**Spec:** User-approved requirements in the conversation: full Markdown content on-site; no GitHub visitor handoff; Audio Quality featured on `/suno`; SAMPLE terminology; working Custom Models and tool routes; no white/404 pages; production verification required before completion.

## Global Constraints

- All Markdown documents in the source guide repository must be rendered in full on the website.
- GitHub must not be presented as the visitor reading destination or linked from rendered guide content.
- Audio Quality uses **SAMPLE**, not COVER.
- Audio Quality prompt must appear in full in the Style box section.
- Audio Quality settings must appear in full and exactly as specified.
- `/suno/customs/models`, `/suno/lyrics-builder`, `/suno/controls`, `/suno/style-photos`, and `/suno/prompt-architect` must resolve to real styled pages.
- Document aliases must resolve locally without guessed missing slugs.
- Production is not considered complete until the deployed site and key routes are verified.

---

### Task 1: Make the Markdown synchronizer authoritative

**Files:**
- Modify: `suno-build.mjs`

**Interfaces:**
- Consumes: the complete recursive Markdown tree of `LIL-SYNN-s-Complete-Suno-V6-Guide`.
- Produces: `/Suno/library/**/index.html` for every `.md` source and a complete local library index.

- [ ] Preserve every Markdown file, including nested `docs/**/*.md`, as a rendered local page.
- [ ] Improve Markdown rendering so headings, lists, tables, blockquotes, fenced code, links, inline code, emphasis, and common HTML survive without collapsing large documents into summaries.
- [ ] Convert relative Markdown document links to local `/suno/library/.../` routes.
- [ ] Remove GitHub repository URLs from final rendered HTML rather than merely handling Markdown links.
- [ ] Keep all source text in the rendered page; do not summarize or truncate.
- [ ] Make the library index enumerate every rendered Markdown document.

### Task 2: Replace fragile route rewrites

**Files:**
- Modify: `vercel.json`

**Interfaces:**
- Consumes: generated `/Suno/library`, `/Suno/guides`, and tool pages.
- Produces: deterministic `/suno/*` routing without guessed document targets.

- [ ] Remove rewrites that force `/suno/prompting`, `/lyrics`, `/styles`, `/audio`, `/sliders`, `/voices`, `/editing`, `/stems`, `/studio`, `/midi`, `/effects`, `/automation`, `/production`, and `/rights` to guessed source filenames.
- [ ] Route those public paths to their actual local `/Suno/<route>/` pages.
- [ ] Keep explicit deep-dive routes only where the corresponding generated document is guaranteed to exist.
- [ ] Preserve `/suno` and `/suno/` -> `/Suno/home/`.
- [ ] Preserve existing non-Suno rewrites.

### Task 3: Correct and strengthen the homepage Audio Quality feature

**Files:**
- Modify: `Suno/home/index.html`

**Interfaces:**
- Produces: `/suno` as the primary entry point.

- [ ] Replace the incorrect `Cover` terminology with `SAMPLE`.
- [ ] Keep the complete supplied Style-box prompt verbatim.
- [ ] Keep the complete settings workflow visible rather than hiding it behind a link.
- [ ] Make the Audio Quality section visually prominent and immediately discoverable.
- [ ] Make the homepage library/tool links point only to local routes.

### Task 4: Guarantee the named tool routes are real pages

**Files:**
- Create or modify: `Suno/prompt-architect/index.html`
- Create or modify: `Suno/lyrics-builder/index.html`
- Create or modify: `Suno/controls/index.html`
- Create or modify: `Suno/style-photos/index.html`
- Create or modify: `Suno/customs/models/index.html`

**Interfaces:**
- Produces: styled, navigable pages for each named route.

- [ ] Ensure every page uses the Suno site shell/CSS and is not a bare white document.
- [ ] Ensure every page has a useful local navigation path back to `/suno` and the complete library.
- [ ] Where the complete guide contains relevant source material, surface it on the page and link to the full local document.
- [ ] Never use GitHub as the fallback target.

### Task 5: Verify generated corpus and routes

**Files:**
- No source changes unless verification exposes a defect.

- [ ] Build the site from a clean checkout.
- [ ] Confirm the build reports the expected number of Markdown documents and generates each corresponding HTML page.
- [ ] Confirm `/suno`, `/suno/library/`, `/suno/customs/models/`, `/suno/lyrics-builder/`, `/suno/controls/`, `/suno/style-photos/`, and `/suno/prompt-architect/` return successful pages.
- [ ] Check representative addenda and README pages for substantial/full content rather than teaser copy.
- [ ] Search rendered output for `github.com` and ensure no visitor-facing GitHub links remain.
- [ ] Verify the Audio Quality page contains `SAMPLE`, the complete prompt, and the specified settings.

### Task 6: Deploy and production-verify

**Files:**
- No source changes unless deployment exposes a defect.

- [ ] Deploy the current main project to Vercel.
- [ ] Inspect deployment/build logs if the build fails.
- [ ] Verify the deployed `/suno` routes through the production deployment URL.
- [ ] Verify no 404/white-page failures remain for the named routes.
- [ ] Only then report the Suno project as complete.
