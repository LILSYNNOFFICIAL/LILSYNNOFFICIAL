# LIL SYNN Suno Guide Website Redesign

## Goal
Turn `/Suno` from a GitHub-style single-document reader into a professional black-and-silver multi-page Suno V6 reference website while preserving the complete guide material.

## Requirements

- `/Suno/` must resolve to `/Suno/index.html` and become the visual hub.
- Remove GitHub-style badges from the public website UI.
- Keep the existing `FIX AUDIO QUALITY` callout on the main Suno landing page; its destination remains `/Suno/audio_fix_v6/` and its substantive content is intentionally left unchanged for the user to supply later.
- Use a horizontal navigation bar instead of a hamburger/drawer as the primary navigation.
- Top navigation categories: Create, Control, Produce, Fix/Test, Research, plus Master Guide.
- Use professional black/silver visual language with the existing strong display typography direction retained.
- Main page uses organized square/rectangular panels, including a portrait pulled from `/assets/img/`.
- Break the complete current master guide into category pages with detailed content sourced from the existing master guide rather than inventing or summarizing away material.
- Category pages must have links back to `/Suno/` and the top-level navigation.
- Main page must include a link to `https://suno.com` and a link back to `https://lilsynn.com`.
- Main page footer must include Cash App donation link `https://cash.app/$lilsynnofficial` and a link to the complete Master Guide.
- Keep a Master Guide page containing the full guide material, without GitHub badges.
- Do not modify the substantive `audio_fix_v6` content yet.
- Part 1 must not redesign the unrelated `index2` page. The only `index2` change in this pass is removing the WebM background animations, so they can be restored correctly later.

## Content grouping

### Create
V6 fundamentals/model family, creation architecture, Simple vs Custom Mode, prompt engineering, lyrics engineering, Style Box engineering, structure/meta tags, creative sliders, Advanced Options/Max Mode, references and multimodal creation, audio uploads, voices, custom models, My Taste, Inspire, Sounds, Sample & Mashup.

### Control
Editing/Extend/Crop/Replace/Reuse/Adjust, Song Editor and natural-language editing, Add Vocals, Remaster, Stem Separation, Studio 2.0, Studio Chat, Studio MIDI, Wavetable Synth.

### Produce
Effects and custom plugins, automation, recording/editing/take lanes, Library/Workspaces, Studio Export, production vocabulary, vocal engineering, arrangement engineering.

### Fix / Test
Audio/Mix/Master quality, repeatability/same chorus, failure modes, scientific testing, production rescue, Suno + ChatGPT workflow, Genre Cookbook, troubleshooting.

### Research
Plans/Credits/Downloads/Rights, Mobile/Web ecosystem, Master Workflow, Official Resource Library, Ultimate Control & Production Addendum, Current Coverage Audit, Current Gaps Closure, Gap Closure All Remaining Current, Additional Current Details, Final Current Expansion, Everything Expansion, Accuracy Policy.

## Implementation shape

- Shared Suno-specific stylesheet for the new visual system.
- Shared topic-page script that loads the existing generated master guide and extracts the requested H2 sections into a category page. This keeps one authoritative copy of the full guide content while providing real multi-page navigation.
- Shared navigation markup across landing/category/master pages.
- Six public page surfaces: landing, Create, Control, Produce, Fix/Test, Research, and Master Guide.
- Existing content files remain the source of truth.
- Use relative paths within `/Suno` so the pages work correctly as a GitHub Pages project site under `/LILSYNNOFFICIAL/`.

## Acceptance criteria

- `/Suno/` visibly presents a polished black/silver dashboard rather than a GitHub README reader.
- No badge strip is visible on the landing page or Master Guide page.
- Horizontal navigation is visible and usable on desktop; on mobile it remains a horizontal, scrollable navigation rather than collapsing into a hamburger.
- Each top-level category opens its own page and displays detailed guide sections.
- Every category page has a clear return-to-main link.
- Portrait is loaded from the existing `/assets/img/` collection.
- `FIX AUDIO QUALITY` remains prominent and links to the existing placeholder page.
- Master Guide exposes the complete guide material.
- `index2` only loses the WebM background animations in this pass.
- Pages use relative paths and do not depend on Vercel-specific routing.
