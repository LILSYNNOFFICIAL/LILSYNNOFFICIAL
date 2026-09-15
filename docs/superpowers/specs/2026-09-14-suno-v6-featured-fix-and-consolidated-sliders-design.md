# Suno V6 Guide Website — Rendered Guide + Addenda Design

## Goal
Turn `/suno/` into a complete website version of the Suno V6 guide and its addendums, expansions, audits, and gap-closure material. The source Markdown is the content. The website is the rendered, organized presentation of that content.

The experience should feel like a polished Suno V6 documentation/reference website with categories, sections, subsections, search, navigation, and readable Markdown-style formatting—not like a homepage that summarizes a collection of documents.

## Core rule: source content becomes the website

**The guide and addendums are not merely references for generating summaries. They are the actual body of knowledge that `/suno/` presents.**

The implementation must:
- Copy/render the substantive content of the complete source corpus into the website.
- Preserve the source Markdown's headings, subheadings, paragraphs, lists, tables, emphasis, links, blockquotes, code/preformatted material, examples, warnings, recipes, evidence labels, and other meaningful details.
- Organize that content into sensible website categories and sections based on topic and user intent.
- Allow content to be moved or repeated into logical sections when necessary for usability, but never discard unique information merely because it appears in an addendum or audit.
- Never replace a detailed source section with a short summary such as “see the guide,” “see the addendum,” or a link to another giant document.
- Never silently shorten operational instructions, examples, prompts, recipes, tables, or troubleshooting material.
- Keep the complete original source documents available in the Source Library as a preservation/provenance layer.

This is a **rendering and information-architecture project**, not a rewrite of the guide.

## 1. Front-page featured content

The `/suno/` index will prominently feature two modules near the top of the experience.

### V6 AUDIO FIX

Use the exact rescue recipe and do not shorten, paraphrase, normalize, alter, or truncate the Style-box prompt.

Exact Style-box prompt:

```text
recreate the original audio exactly as sung and performed, identical vocal timbre phrasing dynamics intensity and emotion, identical instrument playing style technique feel and arrangement, identical overall musical energy and mood, ultra-professional studio mastering, lossless hi-fi, reference-grade mix, 24-bit digital clean, dynamic range 12dB+, wide cinematic stereo imaging, crystal-clear highs, high quality bass, perfectly balanced mids, zero mud, zero muddiness, zero low-end buildup, zero artifacts, zero compression artifacts, zero digital hiss, zero clipping, no frequency pollution, no resonance, no phase issues, fully transparent final master, radio broadcast quality, concert hall clarity, warm analog depth + razor-sharp digital precision, present lead vocals, wide and airy soundstage, high-fidelity studio production, crisp transients, layered instruments with clear separation, stable tonal balance and loudness
```

Exact Lyrics-box direction:

```text
[SND]
recreate the original audio exactly as sung and performed, identical vocal timbre phrasing dynamics intensity and emotion, identical instrument playing style technique feel and arrangement
```

Exact controlled settings:
- **Model: V6 Mini — REQUIRED. Do not use V6, V6 Wild, or another model for this rescue workflow.**
- Operation / Mode: Cover
- Sample/source: select the entire song
- Weirdness: 0%
- Style Influence: **85%**
- Audio Influence: **85%**
- Max Mode: **ON**
- Personalize: **OFF**
- Other options: nothing else enabled
- Vocal gender: select male/female as required

The front-page feature must be clearly labeled **V6 AUDIO FIX**, include the complete prompt and settings, provide a copy-friendly presentation, and link directly to the complete Audio Quality section. The page must make the exact placement unmistakable: `[SND]` direction in the **Lyrics box**; the long audio-quality prompt in the **Style box**.

Important evidence boundary: `[SND]` is an operational prompting/structure technique, not presented as an officially documented Suno programming command. Descriptive mastering/audio terms are desired-result instructions, not guaranteed technical export specifications.

### NEW SLIDERS

A second prominent front-page feature must be labeled **NEW SLIDERS** and link directly to the Controls/Sliders section.

The destination must contain the **actual detailed slider/control material from the guide and addendums**, rendered on-site. It must not be a short marketing summary or a page that merely says to consult another document.

## 2. Website information architecture

The website organizes the source material by topic and user goal while retaining the underlying source content.

Top-level sections:

1. START HERE
2. CREATE
3. PROMPTS
4. LYRICS
5. CONTROLS
6. AUDIO QUALITY
7. EDITING
8. PRODUCTION
9. MULTIMODAL
10. CUSTOM MODELS
11. TROUBLESHOOTING
12. WORKFLOWS
13. SOURCE LIBRARY

Representative subsections include, but are not limited to:

- **START HERE:** V6 overview, current model family, evidence/status system, quick-start paths, important limitations.
- **CREATE:** Simple Mode, Custom Mode, model selection, references, Voices, vocal gender, generation basics.
- **PROMPTS:** Style prompts, prompt architecture, advanced prompting, constraints, examples, style engineering.
- **LYRICS:** lyric writing, structure, structure tags, `[SND]`, Lyricist, natural-language lyric editing, variations.
- **CONTROLS:** every current slider/control, Advanced Options, Max Mode, Variety, new sliders, interactions, practical recipes.
- **AUDIO QUALITY:** V6 Audio Fix, preservation, diagnosis, A/B testing, audio-quality failure modes, limitations and evidence boundaries.
- **EDITING:** Edit Lyrics, Replace Section, Extend, Crop, Remaster, Cover, Remix, localized repairs.
- **PRODUCTION:** stems, Studio, MIDI, instruments, effects, automation, Chat Bar, recording/Take Lanes, export.
- **MULTIMODAL:** audio/image/video references, sampling, isolation, mashups and reference behavior.
- **CUSTOM MODELS:** Custom Models, My Taste, Personalization, Voices, Style Personas.
- **TROUBLESHOOTING:** issue-first paths with the actual source troubleshooting procedures rendered directly on the page.
- **WORKFLOWS:** complete step-by-step recipes assembled from the source corpus, while retaining the underlying operational detail.
- **SOURCE LIBRARY:** every original Markdown source document rendered on-site and retained for completeness/auditability.

The final information architecture may add deeper categories/subsections when the source corpus requires them. Do not force unrelated material into an artificial category just to keep the list short.

## 3. Rendering the source Markdown

The site should visually behave like a polished Markdown documentation system.

Source Markdown constructs must map to appropriate website components:
- `#`, `##`, `###`, etc. → hierarchical headings.
- Paragraphs → readable documentation copy.
- Ordered/unordered lists → styled lists.
- Tables → responsive/styled tables.
- Fenced code blocks → copyable, readable preformatted panels.
- Inline code → distinct inline code treatment.
- Bold/italic → preserved emphasis.
- Blockquotes → callout/quote treatment.
- Links → functional links where appropriate.
- Evidence labels → visible badges/labels without changing their meaning.
- Long prompts → full-width copyable prompt blocks with wrapping or controlled horizontal scrolling so no text is clipped.

Do not flatten rich Markdown into plain text.

## 4. Complete source corpus

The build pipeline must ingest the complete Markdown source tree from `LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide`.

The corpus includes the master guide plus addendums, expansions, audits, additional-current-details material, current-gaps/gap-closure material, and any other Markdown documents present in the source tree.

The pipeline must:
1. Fetch every Markdown source file.
2. Preserve every source document in the raw Source Library.
3. Parse documents into sections/content blocks.
4. Classify sections by topic without deleting source text.
5. Assemble canonical topic pages from those actual source sections.
6. Preserve unique details from addendums, audits, expansions, and gap closures.
7. Preserve evidence/status labels attached to claims.
8. Keep source-document provenance available from canonical sections where practical.
9. Generate the website routes from the resulting topic structure.
10. Generate search/index data from the rendered topic corpus.
11. Validate that all source documents and substantive sections are represented somewhere in the website or explicitly retained in Source Library.

### Duplication policy

The source corpus may intentionally repeat information. The website can avoid unnecessary repetition by linking or reusing canonical rendered sections, but **deduplication must never cause unique details to disappear**.

When two source sections conflict:
- Prefer the most current/highest-authority evidence.
- Preserve the evidence/status label.
- Do not silently convert community/experimental/unknown behavior into official product behavior.
- Retain important historical/retired information where it provides useful context, clearly marked as such.

## 5. Controls / New Sliders

The Controls section is a first-class website area, not merely a link to an addendum.

Every slider/control topic should present all relevant source information available, including where supported:
- Definition and purpose
- What increasing the value does
- What decreasing the value does
- Practical ranges and known recommended values
- What the control affects
- What it does not affect
- Interactions with other controls
- Generation recipes/use cases
- Audio-preservation implications
- Troubleshooting and failure modes
- Related controls and workflows
- Evidence/status label

The page must include the current/new slider details found in the source guide and addendums. Do not invent slider names, ranges, behavior, or recommendations that are not in the corpus.

Known evidence labels remain meaningful:
- OFFICIAL
- RELEASE NOTE
- REPRODUCIBLE
- COMMUNITY
- EXPERIMENTAL
- UNKNOWN
- HISTORICAL/RETIRED

## 6. Search and navigation

Search must operate across the rendered topic corpus as well as the Source Library.

Search results should identify the relevant category/section so users can jump directly to the actual content. Queries such as `audio influence`, `weirdness`, `style influence`, `SND`, `cover`, `studio`, or `remaster` should lead to useful canonical sections rather than forcing users to open multiple overlapping source documents.

Primary navigation should expose the category hierarchy clearly, with section-level navigation where appropriate.

## 7. UI and interaction requirements

- Preserve the existing LIL SYNN/Suno visual language.
- Make the site feel like a real documentation/reference product, not a raw GitHub Markdown mirror.
- Keep the source wording/content intact while improving presentation.
- Make **V6 AUDIO FIX** visually dominant near the front of `/suno/`.
- Give **NEW SLIDERS** a separate prominent feature treatment.
- Provide copy controls for important prompts and code/preformatted material where useful.
- Long prompts must remain fully readable and copyable.
- No prompt or source section may be clipped by fixed-height containers.
- Mobile layout must remain usable.
- Avoid page-wide horizontal overflow.
- Make category → section → subsection hierarchy obvious.
- Provide breadcrumbs or equivalent context on deeper pages.
- Avoid forcing users through giant documents to find one answer.

## 8. Acceptance criteria

The implementation is accepted only when all of the following are true:

1. `/suno/` visibly advertises **V6 AUDIO FIX** near the front of the experience.
2. `/suno/` visibly advertises **NEW SLIDERS** near the front of the experience.
3. The exact Style-box prompt is present in full and ends with `stable tonal balance and loudness`.
4. The exact `[SND]` Lyrics-box direction is present in full.
5. The exact rescue settings are preserved: **V6 Mini, Cover, entire song from Sample, Weirdness 0%, Style Influence 85%, Audio Influence 85%, Max Mode ON, Personalize OFF, and no other options enabled.**
6. The complete guide/addenda source corpus is represented as rendered website content.
7. The website has clear categories, sections, and subsections rather than only source-document pages.
8. Detailed source material is displayed directly on relevant pages; it is not summarized away or replaced with “see source” links.
9. Unique addendum/audit/expansion/gap-closure details are not lost.
10. Raw source documents remain available in Source Library.
11. Search can find and route to rendered topic content.
12. Markdown formatting is visibly rendered as website UI rather than flattened text.
13. Long prompt/code blocks do not visually truncate or break the page.
14. Mobile and desktop layouts have no horizontal overflow caused by the new content.
15. Build output completes successfully.
16. Generated indexes/routes are internally consistent.
17. Automated browser QA verifies key Suno routes, no console errors, no failed requests, no horizontal overflow, and visibility of the two featured modules.
18. The final implementation is verified from the actual built/deployed output before claiming completion.

## Files/components expected to participate

- `Suno/index.html` — homepage, featured V6 Audio Fix/New Sliders modules, category navigation.
- `suno-build.mjs` — complete source ingestion, Markdown parsing/rendering, topic assembly, search/index generation.
- `Suno/` topic/category routes and supporting generated content as needed.
- `Suno/library/` — complete rendered raw source library.
- `Suno/search-index.json` and `Suno/manifest.json` — regenerated from the complete rendered corpus.
- Supporting Suno CSS/JS only where required for navigation, rendering, search, copy controls, featured modules, and responsive behavior.

## Non-goals

- Do not delete or hide source documents.
- Do not invent Suno functionality, controls, settings, or claims absent from the source corpus/evidence.
- Do not turn `[SND]` into a claim of official Suno syntax.
- Do not alter the exact V6 Audio Fix prompt or settings.
- Do not perform unrelated redesign work outside the Suno knowledge experience.
- Do not reduce the source corpus to a summary or abstract knowledge base.
