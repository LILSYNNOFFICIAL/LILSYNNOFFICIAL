# LIL SYNN Suno V6 Guide Website Design

## Goal
Turn the canonical LIL SYNN Suno V6 knowledge base into a premium, responsive, searchable documentation website inside the existing `Suno/` directory, with `Suno/Suno_Guide.html` as the public landing page.

## Architecture
The website is a dependency-light static site using semantic HTML, a shared CSS design system, and vanilla JavaScript. The canonical knowledge remains in `LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide`; the website presents curated navigation and readable web pages while preserving source links back to the canonical GitHub documents.

The information architecture separates core practical guides from deep-dive/current-expansion material. Shared navigation, search/filter behavior, source attribution, responsive layout, and visual language are centralized rather than duplicated.

## Visual Direction
- Premium black-and-gold editorial aesthetic.
- Deep black/charcoal surfaces with restrained metallic-gold accents.
- High-contrast typography and generous spacing.
- Sophisticated cards, panels, badges, breadcrumbs, and section navigation.
- Subtle motion only where it improves orientation or hierarchy.
- Mobile-first responsive behavior with desktop navigation and compact mobile controls.
- LIL SYNN branding is present but the page remains clearly a Suno V6 knowledge resource.
- Use an existing suitable LIL SYNN asset from `assets/`; do not generate a replacement image.

## Landing Page
`Suno/Suno_Guide.html` is the flagship entry point and must include:
- Hero title and concise value proposition.
- V6 status/currentness indicator.
- Primary navigation into major guide categories.
- Featured core-guide cards.
- Deep-dive collection.
- Quick-reference/tools area.
- Search/filter entry point.
- Source/repository attribution.
- Direct LIL SYNN site link.
- Responsive footer and back-to-top control.

## Guide Information Architecture
Core sections should cover the existing knowledge base without inventing unsupported claims:
- V6 fundamentals and model selection
- Prompting and instruction hierarchy
- Lyrics and structure
- Style/genre construction
- Creative sliders and controls
- Voices/personas/custom models
- Editing, Extend, Replace Section, Crop, Remix, Reuse Prompt
- Audio uploads, stems, remaster, vocal tools
- Studio 2.0
- MIDI, musical typing, recording, effects/plugins, automation
- Production/mastering workflows
- Troubleshooting and diagnostic workflows
- Rights, downloads, formats, and release workflow

Deep-dive pages should map to the seven existing `SUNO-V6-*.md` expansion documents in the canonical repository, including the Ultimate Control and Production Addendum.

## Interaction Model
- Sticky desktop navigation.
- Collapsible mobile navigation.
- Client-side search across guide titles, descriptions, tags, and indexed section text.
- Category filtering without page reloads.
- Expand/collapse for dense reference material.
- Previous/next navigation where appropriate.
- Consistent source-link treatment.
- Respect reduced-motion preferences.

## Source Integrity
- Do not fabricate Suno features or settings.
- Preserve the canonical guide repository as the knowledge source.
- Official Suno documentation should be linked where relevant.
- Website pages should identify their source document when derived from repository material.
- External URLs must be normal navigable links in the website source.

## Asset Handling
Inspect the existing `assets/` tree and select an appropriate existing Lil Synn image for the landing page. Prefer a local relative asset path so the website remains deployable with the repository.

## Testing / Verification
- Validate every created HTML page for basic structural correctness.
- Verify all local navigation links resolve to existing files.
- Verify all external source links use valid URLs.
- Verify the landing page references an existing local asset.
- Verify responsive/mobile navigation behavior through browser testing.
- Check for console errors.
- Check keyboard focus visibility and semantic headings.
- Check reduced-motion behavior.
- Verify the final GitHub commit and changed-file set before reporting completion.
