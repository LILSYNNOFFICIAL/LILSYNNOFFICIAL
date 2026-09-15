# Unified Main + Suno README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the main README with an accurate unified project reference that incorporates the complete `/Suno` knowledge-base architecture while preserving the existing Main Surface QA anti-recursion contract.

**Architecture:** `README.md` remains the canonical top-level repository document. `Suno/README.md` will be a concise navigation/index document pointing back to the canonical Suno section in the root README while documenting the live Suno route tree and source ownership. No site code, routing, QA workflow, or application behavior changes are part of this task.

**Tech Stack:** Markdown, GitHub repository contents API, existing static HTML/JavaScript site, existing GitHub Actions QA.

**Spec:** User-approved request in conversation: fully update/rewrite the main README, put `/Suno` README material there, preserve the existing Main Surface QA anti-recursion system, and accurately document the current production index swap.

## Global Constraints

- Preserve the Main Surface QA marker block and its anti-recursion explanation.
- Preserve `paths-ignore: README.md` semantics; do not edit `.github/workflows/main-surface-qa.yml`.
- Do not modify application code, Vercel routing, Suno HTML/JS/CSS, or QA behavior.
- `index.html` is the current new homepage design formerly held by `index2.html`.
- `index3.html` is the preserved previous homepage design.
- `index2.html` is no longer present.
- `/Suno/` is the current Suno guide entry point.
- Root README is authoritative for the combined project and Suno documentation.
- Documentation must distinguish repository/source QA from authenticated production verification.

---

### Task 1: Rewrite the root README

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: current repository architecture, existing QA contract, current homepage state, existing Suno guide structure.
- Produces: one complete root README covering the main site and `/Suno` knowledge base.

- [ ] **Step 1:** Preserve the existing `MAIN-SURFACE-QA` marker block verbatim in structure and preserve its anti-recursion explanation.
- [ ] **Step 2:** Update the project overview and current-state section so `index.html` is explicitly the promoted new design, `index3.html` is the previous design, and `index2.html` is absent.
- [ ] **Step 3:** Document main-site architecture, global shell ownership, canonical release architecture, visuals, Signal/Universe, THE CALM, deployment topology, cache/versioning, and Site Doctor.
- [ ] **Step 4:** Add a complete `/Suno` section covering Create, Control, Produce, Fix/Test, Research, 00 Master, Audio Quality, current model-family documentation, experimentation/evidence, and source/routing ownership.
- [ ] **Step 5:** Add a route/file map for the important Suno directories and canonical entry points.
- [ ] **Step 6:** Add maintenance rules explaining source-of-truth discipline, official-source priority, evidence boundaries, and repository QA versus real production verification.
- [ ] **Step 7:** Ensure the resulting Markdown has no stale statement claiming that `index2.html` is the production homepage or that the QA workflow has never executed.

---

### Task 2: Add the Suno README navigation document

**Files:**
- Create: `Suno/README.md`

**Interfaces:**
- Consumes: root README Suno section and current `/Suno` directory structure.
- Produces: concise Suno-specific entry document with navigation and source-of-truth rules.

- [ ] **Step 1:** Create `Suno/README.md` identifying `/Suno/` as the live guide entry point.
- [ ] **Step 2:** Document the six major guide areas and priority Audio Quality module.
- [ ] **Step 3:** List canonical route families and key source directories.
- [ ] **Step 4:** Link readers to the root README's unified Suno section and the live site path.

---

### Task 3: Verify documentation integrity

**Files:**
- Read/verify: `README.md`
- Read/verify: `Suno/README.md`
- Read/verify: `.github/workflows/main-surface-qa.yml`

- [ ] **Step 1:** Fetch both README files from `main` and confirm they contain the intended current-state language.
- [ ] **Step 2:** Confirm the QA workflow still contains `paths-ignore: README.md` and no workflow edits occurred.
- [ ] **Step 3:** Confirm the current root and Suno entry files remain unchanged by this documentation task.
- [ ] **Step 4:** Confirm the final commit contains documentation-only changes plus this implementation plan, with no application behavior changes.
