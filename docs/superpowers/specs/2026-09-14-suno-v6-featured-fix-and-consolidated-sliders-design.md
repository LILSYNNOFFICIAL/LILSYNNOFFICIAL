# Suno V6 Featured Fix and Consolidated Sliders Design

## Goal
Make `/suno/` immediately surface the V6 Audio Fix and New Sliders, while consolidating the complete slider/control knowledge from the master guide, addenda, expansions, audits, and gap-closure material into topic-first sections so visitors never need to hunt across overlapping source documents.

## Scope
This change covers the public Suno knowledge experience under `/Suno`, its generated content pipeline, and the source-to-topic organization needed to keep the content complete. The existing raw Markdown source library remains intact as an archive/evidence layer; the primary experience becomes topic/workflow oriented.

## 1. Front-page featured content

The `/suno/` index will contain two prominent feature modules near the top of the page:

### V6 AUDIO FIX

Use the exact user-supplied rescue recipe and do not shorten, paraphrase, normalize, or truncate the Style-box prompt.

Exact Style-box prompt:

> recreate the original audio exactly as sung and performed, identical vocal timbre phrasing dynamics intensity and emotion, identical instrument playing style technique feel and arrangement, identical overall musical energy and mood, ultra-professional studio mastering, lossless hi-fi, reference-grade mix, 24-bit digital clean, dynamic range 12dB+, wide cinematic stereo imaging, crystal-clear highs, high quality bass, perfectly balanced mids, zero mud, zero muddiness, zero low-end buildup, zero artifacts, zero compression artifacts, zero digital hiss, zero clipping, no frequency pollution, no resonance, no phase issues, fully transparent final master, radio broadcast quality, concert hall clarity, warm analog depth + razor-sharp digital precision, present lead vocals, wide and airy soundstage, high-fidelity studio production, crisp transients, layered instruments with clear separation, stable tonal balance and loudness

Exact Lyrics-box direction:

```text
[SND]
recreate the original audio exactly as sung and performed, identical vocal timbre phrasing dynamics intensity and emotion, identical instrument playing style technique feel and arrangement, identical overall musical energy and mood
```

Exact controlled settings:
- Model: V6 Mini
- Operation: use the song as Cover
- Sample/source: select the entire song
- Weirdness: 0%
- Style Influence: 86%
- Audio Influence: 86%
- Other options: nothing else enabled
- Personalize: OFF
- Vocal gender: select male/female as required

The front-page feature must visibly identify this as the V6 Audio Fix and provide a direct route to the detailed audio-quality section. It must warn users not to shorten the preservation prompt.

Important evidence boundary: `[SND]` is an operational prompting/structure technique, not presented as an officially documented Suno programming command. Descriptive mastering/audio terms are desired-result instructions, not guaranteed technical export specifications.

### NEW SLIDERS

A second equally prominent front-page feature will advertise the current/new slider and control knowledge. It links directly to the consolidated Controls/Sliders area, where all applicable information from the complete source corpus is merged.

## 2. Topic-first information architecture

The primary navigation will organize information by what the visitor is trying to accomplish, not by which source Markdown file originally contained it.

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

Representative subsections:

- CREATE: Simple Mode, Custom Mode, model selection, references, Voices, vocal gender.
- PROMPTS: Style prompts, prompt architecture, advanced prompting, constraints, examples.
- LYRICS: lyric writing, structure, structure tags, `[SND]`, Lyricist, natural-language editing, variations.
- CONTROLS: every current slider/control, Advanced Options, Max Mode, Variety, generation recipes, interactions.
- AUDIO QUALITY: rescue, preservation, diagnosis, A/B testing, limits and failure boundaries.
- EDITING: Edit Lyrics, Replace Section, Extend, Crop, Remaster, Cover, Remix, localized repairs.
- PRODUCTION: stems, Studio, MIDI, instruments, effects, automation, Chat Bar, export.
- MULTIMODAL: audio/image/video references, sampling, isolation, mashups and reference behavior.
- CUSTOM MODELS: Custom Models, My Taste, Personalization, Voices, Style Personas.
- TROUBLESHOOTING: issue-first paths that route directly to the relevant fix.
- WORKFLOWS: step-by-step recipes such as making a song, preserving/recreating audio, fixing V6 audio, repairing one lyric, replacing one section, building a custom model, working from references, mashups, Studio production and final export.
- SOURCE LIBRARY: every original Markdown source document rendered on-site and retained for completeness/auditability.

## 3. Consolidated slider/control content

Every slider/control topic must merge relevant material across the complete guide and all addenda/expansions/audits/gap-closure documents. A visitor must be able to understand the control without opening another source document.

Each control topic should include, where source material supports it:
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

Known evidence labels must remain attached to claims:
- OFFICIAL
- RELEASE NOTE
- REPRODUCIBLE
- COMMUNITY
- EXPERIMENTAL
- UNKNOWN
- HISTORICAL/RETIRED

Do not silently upgrade community or experimental behavior into official product behavior. When source documents conflict, resolve the conflict in favor of the most current/highest-authority evidence and preserve the evidence status.

## 4. Content ingestion and organization

The existing `suno-build.mjs` currently fetches the complete Markdown source tree and renders source-document pages. The new design keeps that source synchronization but adds a topic/content layer so route pages are assembled from classified source material rather than simply pointing at one large overlapping Markdown document.

The build must:
1. Fetch all Markdown source files from the complete guide repository.
2. Preserve the complete raw source library.
3. Identify relevant sections/content blocks by topic.
4. Merge duplicate coverage into canonical topic sections.
5. Preserve unique details from addenda and audits.
6. Attach evidence labels to claims where available.
7. Generate topic pages/routes and a combined search index.
8. Keep source-document provenance available from each topic where practical.
9. Prevent accidental truncation of long prompts or code/preformatted content.

The raw source library is secondary navigation. Topic pages are the primary user experience.

## 5. Search

Search should operate across the consolidated topic corpus and return categorized results. For a query such as `audio influence`, the visitor should see the canonical Audio Influence topic with its definition, behavior, recipes, interactions, troubleshooting, and related workflows rather than several duplicate source documents.

Search result categories should correspond to the major topic areas: Prompts, Lyrics, Controls, Audio, Editing, Production/Studio, Multimodal, Troubleshooting, Workflows, and Source Library.

## 6. UI and interaction requirements

- Preserve the existing LIL SYNN/Suno visual language.
- Featured V6 Audio Fix must be visually dominant and unmistakable.
- New Sliders must receive a separate prominent feature treatment.
- Long prompts must remain readable in scrollable/preformatted containers without clipping or horizontal page overflow.
- Mobile layout must remain usable.
- Primary navigation should make the topic hierarchy obvious.
- Avoid forcing users through multiple giant documents to find one answer.
- Do not replace detailed content with summaries when the source contains operational detail.

## 7. Testing and acceptance criteria

The implementation is accepted only when all of the following are true:

1. `/suno/` visibly advertises `V6 AUDIO FIX` near the front of the experience.
2. `/suno/` visibly advertises `NEW SLIDERS` near the front of the experience.
3. The exact Style-box prompt above is present in full, ending with `stable tonal balance and loudness`.
4. The exact `[SND]` Lyrics-box direction is present in full.
5. The exact 0% / 86% / 86% settings are preserved.
6. Slider/control information from the guide and addenda is consolidated into canonical topic sections.
7. Unique addendum/audit details are not lost during consolidation.
8. Raw source documents remain available in the Source Library.
9. Search returns consolidated topic results rather than only source-document duplicates.
10. Long prompt blocks do not visually truncate or break the page.
11. Mobile and desktop layouts have no horizontal overflow caused by the new content.
12. Build output completes successfully and generated indexes/routes remain internally consistent.

## Files/components expected to participate

- `Suno/index.html` — front-page featured V6 Audio Fix and New Sliders modules and primary topic navigation.
- `suno-build.mjs` — source ingestion, topic classification/assembly, search index and route generation.
- `Suno/` topic route/content files as needed for canonical sections.
- `Suno/library/` — preserved/generated raw source library.
- `Suno/search-index.json` and `Suno/manifest.json` — regenerated from the consolidated corpus.
- Supporting Suno CSS/JS only where needed for featured modules, long-prompt presentation, search, or responsive behavior.

## Non-goals

- Do not delete or hide source documents.
- Do not invent Suno functionality that is not supported by the source corpus/evidence.
- Do not turn `[SND]` into a claim of official Suno syntax.
- Do not alter the exact V6 Audio Fix prompt or settings.
- Do not perform unrelated redesign work outside the Suno knowledge experience.
