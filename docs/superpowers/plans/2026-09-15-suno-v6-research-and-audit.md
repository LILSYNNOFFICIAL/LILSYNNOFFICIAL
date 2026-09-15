# Suno V6 Research and Full Guide Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/Suno` into a deeply researched, evidence-ranked Suno V6 knowledge base and experimental laboratory while auditing every Suno page, script, link, asset reference, and cross-section integration without altering the locked Audio Fix V6 module.

**Architecture:** Preserve the existing `/Suno` information architecture and dynamic source/manifest loader. Research is synthesized into the appropriate Create, Control, Produce, Fix/Test, Research, and Master sections rather than creating a disconnected mega-page. Experimental findings are explicitly labeled by evidence level, and every internal/external link is validated against an actual destination or documented as intentionally external.

**Tech Stack:** Static HTML, CSS, JavaScript, JSON manifest/source documents, Python repository tests, GitHub Actions, Suno official documentation, community research including Reddit, and linked primary/secondary web sources.

**Spec:** This chat's approved design: research Suno V6 and transferable V5-and-earlier techniques extensively; massively expand Research/Experimental; audit all `/Suno` HTML/JS/CSS/link wiring; enrich every relevant category; synchronize the Master Guide; preserve exact Audio Fix V6 content/workflow.

## Global Constraints

- Do not modify `/Suno/audio_fix_v6/` unless a pure link audit proves a link outside its locked content is broken; preserve its exact workflow and prompt.
- Do not present undocumented community behavior as guaranteed Suno functionality.
- Rank evidence as official/confirmed, repeated community evidence, individually reproducible experiment, hypothesis, or experimental/novel behavior.
- Prefer current v6 evidence; retain older-version techniques only when clearly labeled and useful as transferable/legacy knowledge.
- Preserve the existing `/Suno` architecture and source/manifest loading model unless an audit proves a change necessary.
- Validate both root-relative and directory-relative URLs for GitHub Pages and Vercel behavior.
- Test before claiming completion; a failed existing test must be diagnosed rather than ignored or masked.
- Research is cumulative: every new finding must be placed in the section where a user would actually use it and cross-linked to supporting research when appropriate.

---

### Task 1: Establish the repository and current `/Suno` inventory

**Files:**
- Read: `Suno/index.html`
- Read: `Suno/research/index.html`
- Read: `Suno/content/manifest.json`
- Read: all files under `Suno/**`
- Read: all JS files under `Suno/**`
- Read: `tests/suno-central-guide.test.py`

**Interfaces:**
- Consumes: current main-branch repository tree and rendered/source document relationships.
- Produces: a verified inventory of pages, scripts, styles, manifests, links, and tests used by later audit tasks.

- [ ] **Step 1: Enumerate every file under `Suno/` and classify it as page, script, stylesheet, manifest/source, asset, or generated/rendered content.**
- [ ] **Step 2: Map every manifest document to its rendered HTML destination and confirm the file exists.**
- [ ] **Step 3: Record every JavaScript file loaded by `/Suno` pages and every JS file that creates or rewrites URLs.**
- [ ] **Step 4: Identify current navigation hubs and cross-links among Create, Control, Produce, Fix/Test, Research, Master, and Audio Fix V6.**
- [ ] **Step 5: Run the existing Suno central-guide test before edits and record the exact failure(s).**
- [ ] **Step 6: Commit only if inventory/test scaffolding must be persisted; otherwise retain findings for the next task.**

---

### Task 2: Build the external research evidence matrix

**Files:**
- Create: `Suno/content/research-evidence.md` (or an equivalent focused research source if the existing architecture has a better source location)

**Interfaces:**
- Consumes: official Suno documentation/release notes and high-signal community research.
- Produces: source-ranked research notes that can be synthesized into site sections without confusing anecdote with product documentation.

- [ ] **Step 1: Collect current official v6/v6-wild/v6-mini behavior and capabilities from Suno's v6 documentation and release material.**
- [ ] **Step 2: Collect official current documentation for Create, Custom Models, Suno Sounds, Remix/Edit, Extend, Cover, Replace Section, Song Editor, Studio 2.0, stems, MIDI, and relevant controls.**
- [ ] **Step 3: Search Reddit for high-engagement V6 prompting reports covering Styles, Lyrics, structure tags, vocal direction, arrangement, production language, sliders, reference audio, editing, and failure modes.**
- [ ] **Step 4: Search older V5/V4.5 research for techniques that appear transferable, recording the original model/version and the reason for retaining each technique.**
- [ ] **Step 5: Search specifically for experimental symbol, punctuation, Unicode, random-phrase, gibberish, fake-command, and Styles-box experiments; preserve uncertainty where evidence is weak.**
- [ ] **Step 6: Search specifically for negative/exclude prompting, contradictory prompts, prompt density, genre hierarchy, instrument-role prompting, mix language, vocal engineering, and lyric-geometry experiments.**
- [ ] **Step 7: Rank each finding by evidence level and freshness; record conflicting community reports rather than silently choosing a favorite.**
- [ ] **Step 8: Record direct source URLs so every research claim can be linked from the site where useful.**

---

### Task 3: Expand the Research / Experimental laboratory

**Files:**
- Modify: `Suno/research/index.html`
- Modify: associated Research source content/manifest entries only when needed by the existing architecture
- Preserve: existing EmojiCombos and user-provided Suno example links

**Interfaces:**
- Consumes: Task 2 evidence matrix.
- Produces: a large research laboratory covering confirmed V6 behavior, community experiments, legacy techniques, controlled testing, and intentionally weird prompt experiments.

- [ ] **Step 1: Expand the evidence-policy section with the five evidence levels and explicit uncertainty language.**
- [ ] **Step 2: Add a V6 model matrix covering v6, v6-wild, and v6-mini and clearly distinguish official behavior from community observations.**
- [ ] **Step 3: Expand experimental prompting into symbol/Unicode/punctuation, random phrase, gibberish, invented syntax, contradiction, whitespace, capitalization, repetition, and density experiments.**
- [ ] **Step 4: Add Styles-box research covering genre identity, hierarchy, instrumentation, vocal character, arrangement, production, mix language, negative/exclude strategies, and prompt overload.**
- [ ] **Step 5: Add Lyrics-box research covering structure, section cues, vocal performance, backing vocals, ad-libs, pauses, line geometry, syllable density, repetition, and lyric-level experimentation.**
- [ ] **Step 6: Add a structure-tag laboratory with known/common section tags, enriched bracket cues, combined-vs-stacked cue observations, and an explicit non-deterministic warning.**
- [ ] **Step 7: Add slider research for Weirdness, Style Influence, Audio Influence, Variety, Max Mode, My Taste/Personalize where currently applicable, with evidence-ranked reports instead of universal “sweet spots.”**
- [ ] **Step 8: Add reference-audio, Cover, Extend, Replace Section, Remaster, and editing experiments, including failure modes and recovery workflows.**
- [ ] **Step 9: Add controlled experiment templates and repeatability logging fields.**
- [ ] **Step 10: Preserve and prominently link the user's exact EmojiCombos and two exact Suno experimental examples.**
- [ ] **Step 11: Add source links near claims rather than creating an orphan bibliography.**

---

### Task 4: Upgrade Create content and Prompt Lab

**Files:**
- Modify: `Suno/create/index.html`
- Modify: `Suno/create/prompt-lab.html`
- Modify: relevant Create source content if used by the loader

**Interfaces:**
- Consumes: Task 2/3 prompt and structure research.
- Produces: practical prompt construction guidance and a stronger deterministic Prompt Lab that reflects evidence-ranked V6 techniques.

- [ ] **Step 1: Add a V6 prompt architecture explaining genre identity, groove/rhythm, instrumentation, vocal performance, arrangement arc, emotional target, and production language.**
- [ ] **Step 2: Add good/better/over-prompted examples and V5-to-V6 translations where supported by evidence.**
- [ ] **Step 3: Expand structure-tag examples and section-level performance cues without claiming undocumented syntax is guaranteed.**
- [ ] **Step 4: Add lyric-geometry and vocal-direction recipes.**
- [ ] **Step 5: Expand Prompt Lab inputs/outputs to cover structure, emotional arc, vocal behavior, instrumentation, mix direction, experimental variants, and evidence-safe guidance.**
- [ ] **Step 6: Test all generated Prompt Lab links and copy actions.**

---

### Task 5: Upgrade Control content

**Files:**
- Modify: `Suno/control/index.html`
- Modify: relevant Control source documents if used by the loader

**Interfaces:**
- Consumes: current official V6 editing capabilities plus research on editing/reference workflows.
- Produces: complete practical guidance for Extend, Crop, Replace, Reuse, Adjust, Song Editor, Add Vocals, Remaster, Stem Separation, Studio, Studio Chat, Studio MIDI, and Wavetable Synth as applicable to the current product.

- [ ] **Step 1: Verify every current feature against official documentation/release notes.**
- [ ] **Step 2: Add V6 plain-language editing and single-lyric update guidance.**
- [ ] **Step 3: Add workflow decision trees for when to edit, replace, extend, cover, remaster, or regenerate.**
- [ ] **Step 4: Add known failure modes and recovery strategies from high-signal community evidence.**
- [ ] **Step 5: Validate every Control link and destination.**

---

### Task 6: Upgrade Produce content

**Files:**
- Modify: `Suno/produce/index.html`
- Modify: relevant Produce source documents if used by the loader

**Interfaces:**
- Consumes: current Studio 2.0/stems/MIDI/product research and production-engineering findings.
- Produces: robust production workflows from generation through export.

- [ ] **Step 1: Verify current Studio 2.0 capabilities and recent updates.**
- [ ] **Step 2: Expand effects/custom plugins, automation, recording/editing/take lanes, library/workspaces, export, production vocabulary, vocal engineering, and arrangement engineering.**
- [ ] **Step 3: Integrate stem-separation limitations and use cases, including the current up-to-12-stem workflow where officially supported.**
- [ ] **Step 4: Add practical post-generation production decision trees.**
- [ ] **Step 5: Validate every Produce link and destination.**

---

### Task 7: Upgrade Fix/Test without touching Audio Fix V6

**Files:**
- Modify: `Suno/fix-test/index.html`
- Modify: relevant Fix/Test source documents if used by the loader
- Do not modify: `Suno/audio_fix_v6/index.html` content/workflow

**Interfaces:**
- Consumes: audio-quality, repeatability, failure-mode, and experimental-method research.
- Produces: a diagnostic/testing playbook.

- [ ] **Step 1: Expand audio/mix/master diagnostics around common V6 artifacts and inconsistent results.**
- [ ] **Step 2: Add repeatability and same-chorus testing methodologies.**
- [ ] **Step 3: Add failure-mode matrix mapping symptoms to prompt, model, edit, and production interventions.**
- [ ] **Step 4: Add scientific-testing methodology with controlled variables and repeat counts.**
- [ ] **Step 5: Cross-link the locked Audio Fix V6 module without altering its exact prompt or workflow.**

---

### Task 8: Upgrade Master Guide and synchronize all cross-references

**Files:**
- Modify: `Suno/master/index.html`
- Modify: relevant master/source documents
- Modify: `Suno/content/manifest.json` only if source/render relationships change

**Interfaces:**
- Consumes: all upgraded category content.
- Produces: canonical synthesis of the complete V6 workflow with links to deeper sections.

- [ ] **Step 1: Audit Master Guide headings against all category pages and source documents.**
- [ ] **Step 2: Add current V6 model guidance, prompting, editing, production, testing, and experimental methodology.**
- [ ] **Step 3: Replace stale deep-dive links with actual rendered destinations.**
- [ ] **Step 4: Add cross-links into Research where claims are experimental.**
- [ ] **Step 5: Verify every Master Guide link.**

---

### Task 9: Perform the full `/Suno` URL and asset audit

**Files:**
- Read/modify: all `Suno/**/*.html`
- Read/modify: all `Suno/**/*.js`
- Read/modify: all `Suno/**/*.css` only when a URL or asset reference is wrong
- Read: `Suno/content/manifest.json`
- Read: `tests/suno-central-guide.test.py`

**Interfaces:**
- Consumes: complete repository tree and upgraded pages.
- Produces: zero known broken internal links, missing local assets, stale rendered/source references, or malformed JS-generated destinations.

- [ ] **Step 1: Extract all literal HTML `href`, `src`, `action`, media URLs, and CSS `url(...)` references.**
- [ ] **Step 2: Extract URL-like strings from every `/Suno` JavaScript file, including dynamically generated links.**
- [ ] **Step 3: Resolve relative links against their actual source file directory, not the site root.**
- [ ] **Step 4: Confirm every local destination exists and every intentional external URL is well-formed.**
- [ ] **Step 5: Check fragment targets for internal `#anchor` links.**
- [ ] **Step 6: Check `.md`/`.html` mismatches and directory-index assumptions.**
- [ ] **Step 7: Check GitHub Pages path rewriting compatibility and Vercel root-relative behavior.**
- [ ] **Step 8: Fix broken links in focused commits and never “fix” a link by pointing it at an unrelated page.**

---

### Task 10: Strengthen automated audit tests

**Files:**
- Modify: `tests/suno-central-guide.test.py`
- Create if appropriate: `tests/suno-link-audit.test.py`

**Interfaces:**
- Consumes: repository tree and link-resolution rules from Task 9.
- Produces: repeatable tests that prevent future Suno navigation/link regressions.

- [ ] **Step 1: Remove stale assertions that no longer match the current homepage implementation only when verified against current source.**
- [ ] **Step 2: Add tests that every manifest document maps to an existing rendered HTML file.**
- [ ] **Step 3: Add tests for Research experimental links and Prompt Lab links.**
- [ ] **Step 4: Add a local-link resolver that checks HTML and JS references across `/Suno`.**
- [ ] **Step 5: Add fragment-target validation for internal anchors.**
- [ ] **Step 6: Run tests and intentionally confirm a clean failure before any test implementation change where TDD is applicable.**
- [ ] **Step 7: Run the complete test suite after implementation and record results.**

---

### Task 11: Final verification and evidence review

**Files:**
- Read: all changed files
- Read: generated test outputs

**Interfaces:**
- Consumes: all implementation tasks.
- Produces: verified final state suitable for claiming completion.

- [ ] **Step 1: Re-run all Suno tests.**
- [ ] **Step 2: Re-scan all `/Suno` links and assets after the final edits.**
- [ ] **Step 3: Verify the Audio Fix V6 file is unchanged except for explicitly approved external-link fixes, if any.**
- [ ] **Step 4: Verify all user-provided experimental links remain exact and clickable.**
- [ ] **Step 5: Verify current official V6 claims have current source links.**
- [ ] **Step 6: Verify experimental/community claims carry evidence labels.**
- [ ] **Step 7: Inspect the final diff for accidental content loss, duplicated sections, malformed HTML, or stale references.**
- [ ] **Step 8: Report exact commits, tests, remaining uncertainties, and any source claims that could not be independently verified.**
