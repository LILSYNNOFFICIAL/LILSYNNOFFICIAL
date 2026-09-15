# Suno V6 Rendered Guide Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/suno/` into a polished documentation website that renders the complete Suno V6 guide and all addendums as organized categories, sections, and subsections while prominently surfacing the exact V6 Audio Fix and New Sliders content.

**Architecture:** Keep the existing remote Markdown synchronization as the source-of-truth ingestion layer, but replace the current one-document-per-route shortcut with a section-aware content model. Preserve every raw source document in `/Suno/library/`, assemble canonical topic pages from the actual parsed Markdown sections, render Markdown faithfully, and generate navigation/search metadata from those canonical pages. Keep the homepage focused on discovery and the two requested featured modules.

**Tech Stack:** Node.js ESM build script (`suno-build.mjs`), static HTML/CSS/JS under `/Suno`, GitHub raw/API source ingestion, existing Suno stylesheet and browser QA workflow.

**Spec:** `docs/superpowers/specs/2026-09-14-suno-v6-featured-fix-and-consolidated-sliders-design.md`

## Global Constraints

- **The guide and addendums are the actual website content; do not reduce them to summaries.**
- Preserve every source document in the Source Library.
- Render Markdown structure instead of flattening it into plain text.
- Preserve unique details from addendums, expansions, audits, and gap-closure material.
- Do not invent Suno functionality, controls, settings, ranges, or claims absent from the source corpus/evidence.
- Do not alter the exact V6 Audio Fix prompt or settings.
- `[SND]` must not be presented as official Suno programming syntax.
- Long prompts and code blocks must be fully readable/copyable and never clipped.
- `/suno/` must prominently advertise **V6 AUDIO FIX** and **NEW SLIDERS**.
- Mobile and desktop must avoid horizontal overflow caused by the Suno content.
- Build output, indexes, routes, and browser QA must be verified before completion claims.

---

## File/Component Map

- `suno-build.mjs` — fetches the complete source tree, parses Markdown into reusable sections, assembles canonical topic pages, renders the raw library, generates search/manifest metadata, and validates corpus coverage.
- `Suno/index.html` — homepage discovery layer with prominent V6 Audio Fix and New Sliders features plus category navigation.
- `Suno/css/suno.css` — existing shared Suno styling; extend only for reusable documentation components, navigation, featured modules, responsive tables/code blocks, and overflow-safe content.
- `Suno/js/suno.js` (if present) or the existing Suno page script location — copy-to-clipboard/search/navigation interactions only where the existing project pattern supports them.
- `Suno/<category>/index.html` — generated canonical category landing pages and section pages where required by the source corpus.
- `Suno/library/` — generated full-fidelity raw source-document pages; never replace with summaries.
- `Suno/search-index.json` — generated index containing canonical topic sections plus source-library entries.
- `Suno/manifest.json` — generated corpus/route metadata.
- `.github/workflows/admin-visual-qa.yml` — use existing browser QA path; modify only if Suno-specific route assertions are needed and fit the existing workflow.
- `docs/superpowers/specs/2026-09-14-suno-v6-featured-fix-and-consolidated-sliders-design.md` — approved design authority; implementation must conform to it.

---

### Task 1: Inventory and section-aware source model

**Files:**
- Modify: `suno-build.mjs`
- Test: add a focused Node test/script under the repository's existing test convention if one exists; otherwise add `scripts/test-suno-build.mjs` as a standalone build-model regression test.

**Interfaces:**
- Consumes: complete Markdown file list from the guide repository.
- Produces: normalized document objects containing source path, title, Markdown, rendered HTML, and section blocks with stable IDs/topics/provenance.

- [ ] **Step 1: Inspect the complete source tree and existing project test conventions.**
  - Enumerate every `.md` source file from `LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide` during the build.
  - Confirm the existing build's document object shape and route generation behavior before changing it.
  - Record source-document count and paths in the generated manifest so missing files can be detected.

- [ ] **Step 2: Write a failing regression test for section extraction.**
  - Feed representative Markdown containing H1/H2/H3 headings, paragraphs, lists, tables, blockquotes, and fenced code to the section parser.
  - Assert that headings begin distinct sections, fenced blocks remain intact, and each section retains its original Markdown/body content and source path.
  - Assert that the exact V6 Audio Fix prompt survives extraction byte-for-byte.

- [ ] **Step 3: Implement section parsing without mutating source Markdown.**
  - Add a parser that splits Markdown on headings while preserving heading levels and all lines belonging to each section.
  - Store both original Markdown and rendered HTML; never use rendered text as the source for later assembly.
  - Generate deterministic anchor IDs from headings and disambiguate repeated IDs within a document.

- [ ] **Step 4: Add topic classification based on headings/content, not hard-coded summaries.**
  - Define a data-driven category/topic map for START HERE, CREATE, PROMPTS, LYRICS, CONTROLS, AUDIO QUALITY, EDITING, PRODUCTION, MULTIMODAL, CUSTOM MODELS, TROUBLESHOOTING, WORKFLOWS, and SOURCE LIBRARY.
  - Classify each source section into one or more canonical topics using source headings/keywords and explicit source-document rules where necessary.
  - Keep unmatched sections available under Source Library and a catch-all reference area rather than dropping them.

- [ ] **Step 5: Run the focused parser test.**
  - Verify all assertions pass and confirm no source Markdown is modified by parsing.

- [ ] **Step 6: Commit the source-model change.**
  - Commit with a message such as `feat(suno): build section-aware source corpus`.

---

### Task 2: Faithful Markdown rendering and complete raw library

**Files:**
- Modify: `suno-build.mjs`
- Modify: `Suno/css/suno.css` if shared rendering styles are required.
- Test: the source-model/render regression test from Task 1.

**Interfaces:**
- Consumes: section/document model from Task 1.
- Produces: full-fidelity HTML pages for every source Markdown document and reusable rendered section fragments.

- [ ] **Step 1: Write failing renderer assertions.**
  - Assert headings, ordered/unordered lists, tables, blockquotes, inline code, emphasis, links, and fenced code are represented by their corresponding HTML structures.
  - Assert fenced code uses `white-space: pre-wrap` or an equivalent overflow-safe strategy and is not placed in a fixed-height clipping container.
  - Assert the exact V6 Audio Fix Style-box prompt appears in full and ends with `stable tonal balance and loudness`.

- [ ] **Step 2: Replace the minimal Markdown renderer with a robust renderer suitable for the corpus.**
  - Preserve code fences as code blocks before inline transformations.
  - Handle Markdown tables without treating separator rows as content.
  - Preserve nested/list continuation content where present in the source.
  - Escape HTML-sensitive source content safely.
  - Preserve source links and map internal `.md` links to `/suno/library/.../` routes where possible.
  - Strip visitor-facing GitHub/raw-host links only where the existing site policy requires it; do not strip ordinary source links.

- [ ] **Step 3: Render every raw source document from the same renderer.**
  - Keep `/Suno/library/<source-slug>/` pages complete.
  - Include source title, source path/provenance, breadcrumbs, and navigation without replacing source content.

- [ ] **Step 4: Style documentation components.**
  - Ensure headings, paragraphs, lists, tables, blockquotes, code, callouts/evidence labels, and copyable prompts match the existing LIL SYNN visual language.
  - Make tables responsive and prevent page-wide overflow.

- [ ] **Step 5: Run the renderer regression suite and inspect generated HTML for the exact prompt.**

- [ ] **Step 6: Commit the renderer/library change.**
  - Commit with `feat(suno): render complete markdown library faithfully`.

---

### Task 3: Canonical category, section, and subsection pages

**Files:**
- Modify: `suno-build.mjs`
- Create/modify: generated `Suno/<category>/index.html` and deeper generated section routes.
- Test: add route/content assertions to the Suno build regression test.

**Interfaces:**
- Consumes: classified section corpus and rendered section fragments from Tasks 1–2.
- Produces: canonical topic pages where actual source sections are displayed directly, with breadcrumbs and related navigation.

- [ ] **Step 1: Write failing route/content assertions.**
  - Assert every required top-level category has a route.
  - Assert `/suno/controls/` contains actual slider/control source material rather than a pointer to one source document.
  - Assert `/suno/audio/` contains the complete V6 Audio Fix content.
  - Assert category pages include provenance for the source sections they render.

- [ ] **Step 2: Implement canonical topic assembly.**
  - Assemble pages from actual source sections, preserving each section's rendered content.
  - Use canonical section IDs to avoid duplicate content where a section is intentionally shared.
  - Where multiple source sections cover the same topic, include all substantive unique material and show provenance/evidence rather than silently deleting conflicting details.

- [ ] **Step 3: Implement category and subsection navigation.**
  - Provide category landing pages, section links, breadcrumbs, and previous/next or section-local navigation where useful.
  - Ensure no category page requires opening a giant source document to obtain operational details that are already in the corpus.

- [ ] **Step 4: Remove the current one-giant-document routeMap behavior.**
  - Do not make `/prompting/`, `/lyrics/`, `/styles/`, `/sliders/`, etc. simply render the entire same source document.
  - Routes must be generated from canonical topic sections.

- [ ] **Step 5: Run route/content tests and verify unique-source coverage.**

- [ ] **Step 6: Commit the canonical information architecture.**
  - Commit with `feat(suno): organize guide into canonical topic pages`.

---

### Task 4: Controls and NEW SLIDERS canonical experience

**Files:**
- Modify: `suno-build.mjs`
- Modify: generated `Suno/controls/index.html` and any generated slider subsection pages.
- Modify: `Suno/css/suno.css` for slider/control cards and evidence labels if needed.
- Test: Suno build regression assertions.

**Interfaces:**
- Consumes: all source sections classified as Controls, including guide/addendum/audit/gap-closure coverage.
- Produces: complete Controls/Sliders pages containing actual source detail.

- [ ] **Step 1: Write failing assertions for control completeness.**
  - Assert the canonical Controls page includes the current slider names/details discovered from the source corpus.
  - Assert source-specific recommendations, ranges, interactions, recipes, and evidence labels remain present where the source contains them.
  - Assert the New Sliders feature destination contains detailed content rather than a marketing summary.

- [ ] **Step 2: Build the controls content assembly from source sections.**
  - Group source sections by control/slider name where possible.
  - Preserve definitions, value behavior, interactions, recipes, failure modes, and evidence status from the actual corpus.
  - Do not manufacture missing ranges or behaviors.

- [ ] **Step 3: Add prominent NEW SLIDERS presentation.**
  - Make the feature link to the canonical Controls/Sliders experience.
  - Include enough source-backed detail in the destination that a visitor can use the controls without hunting through the raw documents.

- [ ] **Step 4: Run focused controls tests and verify source-to-topic coverage.**

- [ ] **Step 5: Commit with `feat(suno): surface complete slider control reference`**.

---

### Task 5: V6 AUDIO FIX feature and exact-prompt integrity

**Files:**
- Modify: `Suno/index.html`
- Modify: `suno-build.mjs` if the canonical audio page is generated from the source corpus.
- Modify: `Suno/css/suno.css` for the featured rescue module and copyable prompt treatment.
- Test: exact-string regression test in the Suno build test.

**Interfaces:**
- Consumes: exact rescue content and canonical Audio Quality sections.
- Produces: homepage feature plus complete Audio Quality route.

- [ ] **Step 1: Write failing exact-content tests.**
  - Assert the exact Style-box prompt is present as one complete string.
  - Assert the exact `[SND]` Lyrics-box direction is present.
  - Assert V6 Mini, Cover, entire song selected, Weirdness 0%, Style Influence 86%, Audio Influence 86%, nothing else enabled, Personalize OFF, and vocal gender are all present.
  - Assert the prompt ends exactly with `stable tonal balance and loudness`.

- [ ] **Step 2: Implement the homepage V6 AUDIO FIX module.**
  - Give it a prominent, unmistakable visual treatment.
  - Show the exact prompt in a copyable preformatted container with wrapping/scrolling but no clipping.
  - Show the controlled settings and link to the full Audio Quality page.

- [ ] **Step 3: Ensure the complete Audio Quality page renders the detailed source rescue/troubleshooting material.**
  - Keep evidence boundaries intact: `[SND]` is not official programming syntax; mastering terms are desired-result instructions, not guaranteed export specifications.

- [ ] **Step 4: Run exact-string tests and inspect generated output for truncation.**

- [ ] **Step 5: Commit with `feat(suno): feature exact v6 audio rescue`**.

---

### Task 6: Search, manifest, and corpus completeness validation

**Files:**
- Modify: `suno-build.mjs`
- Modify: generated `Suno/search-index.json` and `Suno/manifest.json`.
- Test: build-level search/index assertions.

**Interfaces:**
- Consumes: canonical topic corpus and raw source inventory.
- Produces: searchable canonical entries plus source-library entries and completeness metadata.

- [ ] **Step 1: Write failing index assertions.**
  - Assert searches for `audio influence`, `weirdness`, `style influence`, `SND`, `cover`, `studio`, and `remaster` resolve to canonical topic/section entries.
  - Assert every source document appears in the raw library manifest.
  - Assert every substantive source section is mapped to a canonical topic or explicitly retained as Source Library-only content.

- [ ] **Step 2: Generate section-level search entries.**
  - Index canonical section title, category, source provenance, searchable text, and route/anchor.
  - Keep source-document entries for direct library discovery.

- [ ] **Step 3: Generate manifest coverage metadata.**
  - Include source document count, source paths, canonical category counts, and any unmatched-source-section count.
  - Fail the build if a fetched source document disappears from output unexpectedly.

- [ ] **Step 4: Run build and index tests.**

- [ ] **Step 5: Commit with `feat(suno): index canonical guide sections`**.

---

### Task 7: Responsive UI, copy controls, and homepage navigation polish

**Files:**
- Modify: `Suno/css/suno.css`
- Modify: `Suno/index.html`
- Modify: existing Suno JS file if the project already has one; otherwise create the smallest dedicated `Suno/js/suno-docs.js` needed for copy controls/search interactions.
- Test: browser QA and responsive DOM checks.

**Interfaces:**
- Consumes: generated canonical pages and featured content.
- Produces: usable desktop/mobile documentation UI.

- [ ] **Step 1: Write failing browser assertions for the two featured modules and overflow behavior.**
  - Assert `V6 AUDIO FIX` and `NEW SLIDERS` are visible near the top of `/suno/`.
  - Assert the exact prompt container has all text available and is not clipped.
  - Assert no horizontal page overflow on representative mobile and desktop viewports.

- [ ] **Step 2: Implement responsive documentation styling.**
  - Use fluid typography and content widths.
  - Keep code/prompt blocks contained to their parent width.
  - Make tables horizontally scroll inside their own wrapper rather than expanding the page.
  - Ensure navigation collapses or wraps cleanly on small screens.

- [ ] **Step 3: Add copy-to-clipboard behavior for the exact audio prompt and other important preformatted blocks.**
  - Copy the underlying raw text, not the HTML-rendered markup.
  - Provide accessible success/failure feedback without blocking the page.

- [ ] **Step 4: Run browser checks locally against representative Suno routes.**

- [ ] **Step 5: Commit with `feat(suno): polish responsive documentation experience`**.

---

### Task 8: Full build, automated browser QA, and final source-integrity audit

**Files:**
- Modify: `.github/workflows/admin-visual-qa.yml` only if Suno-specific assertions must be added to the existing QA workflow.
- Generated: all `/Suno` output from the final build.
- Test: full build plus existing automated browser QA.

**Interfaces:**
- Consumes: completed Suno build and static output.
- Produces: verified build artifacts and QA evidence suitable for deployment review.

- [ ] **Step 1: Run the complete Suno build from a clean state.**
  - Confirm the build exits successfully.
  - Confirm all source Markdown files are fetched and rendered.
  - Confirm generated routes, search index, and manifest are internally consistent.

- [ ] **Step 2: Run exact source-integrity audit.**
  - Compare every source document's substantive section coverage against generated canonical pages plus Source Library.
  - Verify the exact V6 Audio Fix prompt, `[SND]` direction, and settings.
  - Verify no long prompt/code content was truncated by generated HTML.

- [ ] **Step 3: Run automated browser QA.**
  - Verify `/suno/`, `/suno/audio/`, `/suno/controls/`, representative category/subsection routes, `/suno/library/`, and `/suno/search-index.json`.
  - Check HTTP status, console errors, failed requests, horizontal overflow, off-screen elements, and visibility of featured modules.

- [ ] **Step 4: Run the complete test/build suite again after any QA repair.**

- [ ] **Step 5: Commit the verified final implementation.**
  - Commit with `feat(suno): complete rendered v6 guide website`.

- [ ] **Step 6: Only after verification, report exact commit/deployment state and any remaining environment limitation.**

---

## Plan Self-Review

- **Spec coverage:** Front-page V6 Audio Fix/New Sliders → Tasks 4–5; topic architecture → Task 3; faithful Markdown rendering → Task 2; complete source ingestion/preservation → Tasks 1–2/6; search → Task 6; responsive UI → Task 7; testing and deployment-readiness verification → Task 8.
- **No-summary rule:** Every canonical page is assembled from actual source sections; Source Library remains complete; no task authorizes replacing source detail with summaries.
- **Exact prompt integrity:** Task 5 tests the exact string and terminal phrase; Task 8 repeats the audit after full build.
- **Slider completeness:** Task 4 explicitly derives controls from the complete source corpus rather than inventing a list.
- **Evidence integrity:** Tasks 1–4 preserve source evidence/status labels and prohibit upgrading experimental/community claims.
- **Type/interface consistency:** Tasks consume the preceding task's document/section/canonical corpus model; no conflicting function names or data contracts are specified.
- **Placeholder scan:** No TBD/TODO implementation steps are used; each task has concrete files, interfaces, tests, implementation actions, and a commit checkpoint.
