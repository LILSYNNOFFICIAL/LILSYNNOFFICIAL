# LIL SYNN Central Suno V6 Guide Rebuild — Design Specification

**Date:** 2026-09-15  
**Status:** User-approved design; awaiting written-spec review before implementation  
**Target site:** `LILSYNNOFFICIAL/LILSYNNOFFICIAL`  
**Source knowledge base:** `LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide`

## 1. Goal

Replace the existing `/Suno` implementation with one central, complete, navigable website containing the full current contents of the Complete Suno V6 Guide repository and its addendums. The site must preserve the actual material rather than reducing it to summaries or short cards.

The source repository currently contains the organized master `README.md` plus these current-reference/deep-dive documents:

- `SUNO-V6-ADDITIONAL-CURRENT-DETAILS.md`
- `SUNO-V6-AUDIO-QUALITY-RESCUE.md`
- `SUNO-V6-CURRENT-COVERAGE-AUDIT.md`
- `SUNO-V6-CURRENT-GAPS-CLOSURE.md`
- `SUNO-V6-EVERYTHING-EXPANSION.md`
- `SUNO-V6-FINAL-CURRENT-EXPANSION.md`
- `SUNO-V6-GAP-CLOSURE-ALL-REMAINING-CURRENT.md`
- `SUNO-V6-ULTIMATE-CONTROL-AND-PRODUCTION-ADDENDUM-2026.md`

Repository maintenance metadata such as `.github/workflows/*`, `LICENSE`, and `docs/superpowers/*` is not treated as user-facing guide content unless explicitly required by the source guide itself.

## 2. Non-negotiable content rule

**No summary-only conversion.** Every source document's substantive Markdown content must be available on the website. Headings, paragraphs, lists, tables, code/prompt blocks, blockquotes, links, emphasis, and other meaningful Markdown structure must survive conversion into readable HTML.

The source repository is the content authority for this rebuild. Existing generated/staged `/Suno` HTML is not the content authority and must not override the source repository.

## 3. Information architecture

`/Suno/` becomes the central entry point.

The rebuilt guide uses:

- A persistent site navigation/menu.
- A prominent document/category directory.
- A master guide landing page based on the source README.
- Dedicated pages for each source addendum/deep-dive document.
- Section-level navigation generated from Markdown headings.
- Breadcrumbs identifying the current document/category.
- Previous/next document navigation where useful.
- Search/browse affordances for the full guide corpus.
- Stable anchors for headings so internal links remain usable.
- Responsive mobile presentation without hiding substantive content behind tiny UI elements.

The implementation should favor a shared layout/template plus generated content over maintaining many independently hand-authored HTML documents.

## 4. Markdown conversion

Implement a deterministic Markdown-to-HTML build path suitable for the site's existing Vercel/static deployment model.

Required Markdown support includes, at minimum:

- H1-H6 headings.
- Paragraphs and line breaks.
- Bold/italic/strikethrough where supported by the source.
- Ordered and unordered lists.
- Nested lists.
- Tables.
- Fenced code blocks and inline code.
- Blockquotes.
- Horizontal rules.
- Links and internal document links.
- Images when present and resolvable.
- HTML fragments used by the source README, including its back-to-top anchors and navigation markup, without exposing raw source markup as plain text.

Internal links between source Markdown files must be rewritten to their corresponding website document routes. Fragment links must resolve to generated heading IDs.

External links remain external and must not be silently removed.

## 5. Source synchronization model

The website build should consume a pinned snapshot/ref of the guide repository's `main` branch during the rebuild. The generated site must retain enough source metadata to identify which guide files were included and which source revision was used.

Do not invent new Suno facts while converting the source material. If the source contains evidence labels, dates, caveats, or uncertainty language, preserve them.

## 6. `/Suno` landing page

At the very top of `/Suno`, before the main guide directory/content, add a clearly highlighted action panel labeled exactly:

**FIX AUDIO QUALITY**

The panel links to:

`/Suno/audio_fix_v6`

The audio-fix destination is intentionally a placeholder/dedicated route only. Its substantive content must **not** be invented during this rebuild because the user will provide the exact contents later.

The obsolete `[SND]` instruction is not to be reintroduced anywhere as part of this rebuild.

## 7. Audio-fix placeholder route

Create `/Suno/audio_fix_v6` as a valid, styled destination with clear placeholder status and the correct route/link wiring. Do not populate it with an invented rescue prompt, settings, lyrics-box instruction, or other replacement content.

This route is deliberately isolated so its later content can be replaced without restructuring the guide navigation.

## 8. Existing `/index2` WebM behavior

Use the existing two WebM assets already used by `/index2`; do not create replacement videos.

Required behavior:

1. Move the top WebM higher so it begins closer to the intended top-of-page visual position.
2. The top WebM scrolls normally with the page/background.
3. The bottom WebM begins exactly where the top WebM ends, with no unintended gap or overlap.
4. The bottom WebM remains fixed/non-scrolling while the page/background content moves.
5. Preserve the existing visual treatment, responsive behavior, and controls unless required to achieve the requested motion/position behavior.
6. Verify the result at desktop and mobile viewport sizes.

The existing `index2-final-fix.js` wiring and related index2 workflow must be inspected before modifying the page so the rebuild does not create competing patches or duplicate behavior.

## 9. Existing `/Suno` cleanup

The existing `/Suno` directory and its old generated guide pages/styles/scripts are to be replaced by the new central architecture rather than incrementally patched around the old information hierarchy.

Before deleting old files, preserve any reusable global/site assets that are not Suno-guide-specific. Suno-specific generated artifacts should not remain as competing alternate versions of the guide.

The final `/Suno` route must have one authoritative navigation system and one authoritative content pipeline.

## 10. Visual/design direction

The guide should feel like a deliberate LIL SYNN reference system rather than a raw GitHub README dump:

- Dark, high-contrast visual language consistent with the existing LIL SYNN site.
- Clear hierarchy for major categories and deep-dive documents.
- Readable long-form typography optimized for extensive technical/reference content.
- Distinct styling for prompt/code blocks and tables.
- Strong active navigation state.
- Mobile-first menu behavior for the full guide directory.
- Avoid excessive animation that makes long-form reading difficult.

The design must prioritize information density and navigation over decorative hero content.

## 11. Data/content flow

```text
Guide repository main
        |
        v
Source Markdown corpus
        |
        v
Markdown parser + link/anchor normalization
        |
        +----> document metadata/index
        |
        +----> generated HTML pages
        |
        +----> central navigation/search index
        |
        v
/Suno website
        |
        +----> /Suno/audio_fix_v6 placeholder
```

`/index2` is a separate visual behavior fix and must continue using its existing WebM assets.

## 12. Testing and verification

Before declaring the rebuild complete:

- Build the site successfully.
- Verify every intended source document is represented in the generated guide.
- Verify source content is not truncated during conversion.
- Verify Markdown headings produce stable anchors.
- Verify internal links between documents resolve to the new routes.
- Verify code/prompt blocks and tables render correctly.
- Verify the `/Suno` audio-fix panel is the first highlighted action and links to `/Suno/audio_fix_v6`.
- Verify no obsolete `[SND]` instruction is introduced.
- Verify the placeholder route loads.
- Verify `/index2` top/bottom WebM positioning and scroll behavior on desktop and mobile.
- Verify the production deployment serves the new `/Suno` content, not a stale prior deployment.
- Verify the final deployment and custom domain after propagation/cache behavior is accounted for.

## 13. Out of scope for this rebuild

- Inventing or rewriting Suno guide facts merely to fill gaps.
- Writing the final contents of `/Suno/audio_fix_v6` before the user supplies them.
- Replacing the existing `/index2` WebM assets with newly generated media.
- Unrelated homepage or non-Suno site redesign.

## 14. Acceptance criteria

The rebuild is accepted only when `/Suno` functions as a single central website containing the complete source-guide material, with working categories/navigation and document links, the highlighted `FIX AUDIO QUALITY` destination, and no competing obsolete guide implementation. `/index2` must also exhibit the exact requested WebM positioning and scroll behavior.
