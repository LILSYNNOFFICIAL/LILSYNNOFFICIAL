# Suno Guide Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/Suno` as a professional black/silver multi-page Suno V6 reference site while preserving the complete guide material.

**Architecture:** Keep the existing generated master guide as the single content source. Add a shared Suno design system and a shared topic-page renderer that extracts selected H2 sections into real category pages; build the landing page as a visual dashboard and keep a separate Master Guide page for the unbroken complete reference. Remove only the WebM backgrounds from `index2` in this pass.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, existing generated Suno guide HTML, GitHub Pages static hosting.

**Spec:** `docs/superpowers/specs/2026-09-15-suno-site-redesign.md`

## Global Constraints

- No GitHub badge strip in the public Suno UI.
- Horizontal navigation is the primary navigation; no hamburger replacement on mobile.
- Black/silver visual system with the current strong display typography direction.
- `FIX AUDIO QUALITY` remains prominent and its substantive page content is not invented.
- Preserve the full guide material.
- Use relative `/Suno` paths so GitHub Pages project hosting works.
- Do not redesign `index2` beyond removing its WebM background animations.

---

### Task 1: Build shared Suno design system

**Files:**
- Create: `Suno/assets/suno.css`
- Create: `Suno/assets/suno-topic.js`

**Interfaces:**
- `suno.css` supplies the shared black/silver navigation, panels, cards, typography, responsive grid, content typography, and footer.
- `suno-topic.js` reads `window.SUNO_TOPIC_CONFIG.sections`, fetches `../content/master-guide.html`, extracts matching H2 sections and renders them into `#topicContent`.

- [ ] **Step 1: Add shared CSS and topic extraction behavior.**
- [ ] **Step 2: Verify the scripts contain no root-absolute `/Suno` asset dependencies from category pages.**
- [ ] **Step 3: Commit the shared system.**

---

### Task 2: Replace the `/Suno` landing page

**Files:**
- Modify: `Suno/index.html`

**Interfaces:**
- Uses `Suno/assets/suno.css` and `Suno/assets/suno-topic.js` only where needed.
- Links to category pages, Master Guide, audio-fix placeholder, Suno official site, and lilsynn.com.

- [ ] **Step 1: Replace the drawer/reader layout with horizontal navigation and dashboard panels.**
- [ ] **Step 2: Add the existing portrait from `../assets/img/Image 2 - About page portrait.png`.**
- [ ] **Step 3: Add category panels matching Create, Control, Produce, Fix/Test, Research, and the 00 Master reference.**
- [ ] **Step 4: Keep `FIX AUDIO QUALITY` as a dedicated high-priority panel.**
- [ ] **Step 5: Add footer navigation, donation link, Suno link, main-site link, and Master Guide link.**
- [ ] **Step 6: Verify all internal paths are relative to `/Suno/`.**
- [ ] **Step 7: Commit the landing page.**

---

### Task 3: Add the five detailed category pages

**Files:**
- Create: `Suno/create/index.html`
- Create: `Suno/control/index.html`
- Create: `Suno/produce/index.html`
- Create: `Suno/fix-test/index.html`
- Create: `Suno/research/index.html`

**Interfaces:**
- Each page defines `window.SUNO_TOPIC_CONFIG = { title, kicker, description, sections[] }` before loading `../assets/suno-topic.js`.
- `sections[]` contains exact H2 titles from the current master guide so the page displays the existing detailed material.

- [ ] **Step 1: Build Create page and map all creation/model/prompt/reference topics.**
- [ ] **Step 2: Build Control page and map editing, vocals, remaster, stems, and Studio controls.**
- [ ] **Step 3: Build Produce page and map effects, automation, lanes, workspaces, export, and production engineering.**
- [ ] **Step 4: Build Fix/Test page and map quality, repeatability, failures, testing, rescue, ChatGPT workflow, cookbook, and troubleshooting.**
- [ ] **Step 5: Build Research page and map ecosystem, rights, audit/gap material, addenda, resources, and accuracy policy.**
- [ ] **Step 6: Verify each page has a main-site link and the shared horizontal menu.**
- [ ] **Step 7: Commit the category pages.**

---

### Task 4: Add the complete Master Guide page

**Files:**
- Create: `Suno/master/index.html`

**Interfaces:**
- Fetches the current `Suno/content/master-guide.html` and displays it as the complete reference.
- Removes only the GitHub badge paragraph from the imported guide content.

- [ ] **Step 1: Add Master Guide shell and navigation.**
- [ ] **Step 2: Load the complete generated master guide.**
- [ ] **Step 3: Strip the badge-only paragraph while retaining all guide content.**
- [ ] **Step 4: Add return links and footer.**
- [ ] **Step 5: Commit the Master Guide page.**

---

### Task 5: Remove only `index2` WebM background animations

**Files:**
- Modify: `index2.html`

- [ ] **Step 1: Remove the hero WebM background element and its CSS rule.**
- [ ] **Step 2: Remove the stars/background WebM element and its CSS rule.**
- [ ] **Step 3: Preserve the rest of `index2` unchanged for the later Part 2 pass.**
- [ ] **Step 4: Commit the limited `index2` change.**

---

### Task 6: Validate the public paths and content

**Files:**
- Verify: all files from Tasks 1–5

- [ ] **Step 1: Fetch every new HTML/CSS/JS file from GitHub and confirm it exists on `main`.**
- [ ] **Step 2: Check every category page points to the shared assets using correct relative paths.**
- [ ] **Step 3: Confirm `FIX AUDIO QUALITY` still points to `../audio_fix_v6/` from the category/landing context where used.**
- [ ] **Step 4: Confirm `master/index.html` references `../content/master-guide.html`.**
- [ ] **Step 5: Confirm `index2.html` no longer contains WebM background references while unrelated page behavior remains intact.**
- [ ] **Step 6: Verify the final commit set and report the exact changed files and remaining Part 2 scope.**
