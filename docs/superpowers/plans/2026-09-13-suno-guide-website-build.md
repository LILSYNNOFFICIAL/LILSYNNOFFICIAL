# LIL SYNN Suno V6 Guide Website Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved premium, responsive, searchable Suno V6 documentation website inside `Suno/`, with `Suno/Suno_Guide.html` as the flagship landing page.

**Architecture:** Dependency-light static HTML/CSS/vanilla JavaScript. The website is a curated presentation layer over the canonical Suno V6 repository, with source links back to the canonical Markdown and official Suno documentation.

**Tech Stack:** Semantic HTML5, CSS3, vanilla JavaScript, existing repository assets, no build dependency.

**Spec:** `docs/superpowers/specs/2026-09-13-suno-guide-website-design.md`

## Global Constraints

- Keep the canonical knowledge source in `LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide`.
- Use existing LIL SYNN artwork from `assets/`; do not generate replacement artwork.
- Landing page must be `Suno/Suno_Guide.html`.
- Use a premium black-and-gold editorial visual system.
- Do not fabricate Suno features, settings, or guarantees.
- Keep the site dependency-light and deployable as static files.
- Include responsive navigation, client-side search/filtering, reduced-motion support, keyboard-visible focus, source attribution, and valid external links.

## File Structure

- Create: `Suno/Suno_Guide.html` — flagship landing page and searchable guide directory.
- Create: `Suno/css/suno.css` — shared visual system, responsive layout, cards, navigation, accessibility states.
- Create: `Suno/js/suno.js` — mobile nav, search, filters, accordions, current-year/footer behavior.
- Create: `Suno/guides/*.html` — practical guide pages grouped by core workflow.
- Create: `Suno/deep-dives/*.html` — pages corresponding to the seven canonical expansion files.
- Create: `Suno/README.md` — site map and maintenance/source notes.
- Modify only if needed: existing repository files that conflict with the new `Suno/` site.

### Task 1: Establish shared shell and design system

**Files:**
- Create: `Suno/css/suno.css`
- Create: `Suno/js/suno.js`
- Modify: `Suno/Suno_Guide.html`

**Interfaces:**
- `suno.css` exposes reusable classes for shell, cards, badges, grids, navigation, search, accordions, source panels, and responsive states.
- `suno.js` initializes `.site-nav`, `#guide-search`, `.filter-chip`, `.accordion-trigger`, and `.back-to-top` elements when present.

- [ ] **Step 1:** Write the landing-page shell with semantic header, navigation, hero, search, category filters, content cards, deep-dive cards, source panel, footer, and back-to-top control.
- [ ] **Step 2:** Implement the gold/black design system with CSS custom properties, responsive breakpoints, visible `:focus-visible`, and `prefers-reduced-motion` handling.
- [ ] **Step 3:** Implement vanilla JavaScript for mobile navigation, live search/filtering, accordions, active filter state, Escape-to-close, and reduced-motion-safe scrolling.
- [ ] **Step 4:** Verify the landing page loads without JavaScript console errors and that all interactive controls remain keyboard reachable.
- [ ] **Step 5:** Commit the shell as `feat: establish Suno guide website shell`.

### Task 2: Build the core guide library

**Files:**
- Create: `Suno/guides/v6.html`
- Create: `Suno/guides/prompting.html`
- Create: `Suno/guides/lyrics.html`
- Create: `Suno/guides/styles.html`
- Create: `Suno/guides/sliders.html`
- Create: `Suno/guides/voices.html`
- Create: `Suno/guides/editing.html`
- Create: `Suno/guides/audio.html`
- Create: `Suno/guides/stems.html`
- Create: `Suno/guides/studio.html`
- Create: `Suno/guides/midi.html`
- Create: `Suno/guides/effects.html`
- Create: `Suno/guides/automation.html`
- Create: `Suno/guides/production.html`
- Create: `Suno/guides/troubleshooting.html`
- Create: `Suno/guides/rights.html`

**Interfaces:**
- Every guide page uses the same shared header/footer and links to `../css/suno.css` and `../js/suno.js`.
- Every guide page has a title, summary, tags, breadcrumb, source panel, and previous/next navigation where applicable.

- [ ] **Step 1:** Build the common guide-page structure and navigation pattern.
- [ ] **Step 2:** Populate each page from the canonical README and relevant expansion material without inventing unsupported claims.
- [ ] **Step 3:** Add official Suno documentation links to the relevant pages.
- [ ] **Step 4:** Add source links back to the canonical GitHub Markdown files.
- [ ] **Step 5:** Verify every guide page has semantic heading order and valid relative asset/script/style paths.
- [ ] **Step 6:** Commit the core guide library as `feat: add Suno V6 core guide library`.

### Task 3: Build deep-dive collection

**Files:**
- Create: `Suno/deep-dives/ultimate-control.html`
- Create: `Suno/deep-dives/everything-expansion.html`
- Create: `Suno/deep-dives/final-current-expansion.html`
- Create: `Suno/deep-dives/coverage-audit.html`
- Create: `Suno/deep-dives/gaps-closure.html`
- Create: `Suno/deep-dives/gap-closure-all-remaining.html`
- Create: `Suno/deep-dives/additional-current-details.html`

**Interfaces:**
- Each page corresponds one-to-one with a named canonical `SUNO-V6-*.md` document.
- Each page uses the shared guide shell and clearly identifies its source document.

- [ ] **Step 1:** Map each seven canonical files to a stable web slug.
- [ ] **Step 2:** Build the seven deep-dive pages with concise navigation summaries and section indexes.
- [ ] **Step 3:** Include source links to the exact canonical Markdown document for each page.
- [ ] **Step 4:** Link each deep-dive page from the landing page and at least one relevant core guide.
- [ ] **Step 5:** Verify no deep-dive source mapping is ambiguous.
- [ ] **Step 6:** Commit as `feat: add Suno V6 deep-dive library`.

### Task 4: Asset integration and LIL SYNN branding

**Files:**
- Modify: `Suno/Suno_Guide.html`
- Modify: `Suno/css/suno.css`

**Interfaces:**
- Landing hero references an existing local image under `../assets/` or the correct relative path from `Suno/`.
- LIL SYNN site CTA points to `https://lilsynn.com`.

- [ ] **Step 1:** Inspect existing asset filenames and identify the most suitable existing LIL SYNN image using repository evidence.
- [ ] **Step 2:** Add the selected image with meaningful alt text and responsive object-fit behavior.
- [ ] **Step 3:** Add understated LIL SYNN branding that complements rather than overwhelms the Suno knowledge-base identity.
- [ ] **Step 4:** Verify the image path exists and the landing page does not request a missing asset.
- [ ] **Step 5:** Commit as `feat: integrate LIL SYNN artwork and branding`.

### Task 5: Search, filters, navigation, and accessibility verification

**Files:**
- Modify: `Suno/Suno_Guide.html`
- Modify: `Suno/js/suno.js`
- Modify: `Suno/css/suno.css`

- [ ] **Step 1:** Add searchable metadata to all guide and deep-dive cards.
- [ ] **Step 2:** Implement category filtering without page reloads.
- [ ] **Step 3:** Ensure mobile navigation closes on selection and Escape.
- [ ] **Step 4:** Verify keyboard focus visibility, heading hierarchy, labels, button semantics, and reduced-motion behavior.
- [ ] **Step 5:** Verify no JavaScript errors occur during search, filtering, navigation, or accordion use.
- [ ] **Step 6:** Commit as `feat: polish Suno guide interactions and accessibility`.

### Task 6: Site map and maintenance documentation

**Files:**
- Create: `Suno/README.md`

- [ ] **Step 1:** Document the public entry point, directory structure, source-of-truth repository, and asset conventions.
- [ ] **Step 2:** Document how core guides map to canonical source material.
- [ ] **Step 3:** Document the deep-dive mapping table.
- [ ] **Step 4:** Commit as `docs: document Suno guide website structure`.

### Task 7: Whole-site verification

**Files:**
- Verify: all `Suno/**/*.html`, `Suno/css/suno.css`, `Suno/js/suno.js`, and referenced assets.

- [ ] **Step 1:** Enumerate all created HTML pages and local links.
- [ ] **Step 2:** Verify every local link resolves to a file in the repository.
- [ ] **Step 3:** Verify external URLs are syntactically valid and point to intended sources.
- [ ] **Step 4:** Run browser verification against the landing page and representative guide/deep-dive pages.
- [ ] **Step 5:** Check desktop and mobile navigation behavior, search/filtering, focus states, and console output.
- [ ] **Step 6:** Review the final GitHub commit/diff and changed-file set.
- [ ] **Step 7:** Commit any verification fixes as `fix: resolve Suno guide website verification issues`.

## Completion Criteria

The build is complete only when `Suno/Suno_Guide.html` is populated, the shared design system and interactions work, core and deep-dive pages are present and source-mapped, an existing LIL SYNN asset is used, navigation/search/accessibility checks pass, and the final GitHub state has been independently verified.
