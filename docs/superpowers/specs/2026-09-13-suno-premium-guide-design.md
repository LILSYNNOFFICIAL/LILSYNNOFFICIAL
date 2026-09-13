# Premium Suno V6 Guide Website Design

## Goal
Transform `/Suno` into a premium, self-contained LIL SYNN Suno V6 knowledge-base experience with a compact hero, persistent horizontal/dropdown navigation, clean `/suno/*` routes, and all living-guide source material rendered internally without sending visitors to GitHub.

## Information architecture
- `/suno` is the landing/overview page.
- Core topic pages: v6, prompting, lyrics, styles, sliders, voices, editing, audio, stems, studio, midi, effects, automation, production, troubleshooting, rights.
- Deep-dive pages remain available as a secondary research/reference tier.
- Every guide page exposes the same navigation and previous/next/home controls.
- Existing complete rendered source documents remain internalized so no knowledge is lost.

## Visual system
- Near-black background with restrained gold accents and white text.
- Premium editorial/music-production aesthetic; no oversized artwork dominating the viewport.
- Hero artwork constrained to a compact identity panel and responsive aspect ratio.
- Sticky navigation with desktop horizontal dropdown groups and mobile menu.
- Strong typography hierarchy, thin gold rules, subtle hover motion, accessible focus states.

## Content rules
- The canonical living-guide repository is a build source only.
- No GitHub links for guide consumption.
- Official Suno documentation may remain an external evidence/reference link where useful.
- Do not remove canonical guide content; reorganize navigation and presentation around it.

## Technical approach
- Continue using static HTML/CSS/JS and the existing Markdown build synchronization.
- Generate clean route-aware internal links in the build script.
- Add Vercel rewrites from clean `/suno/*` routes to static HTML files.
- Keep legacy `/Suno/...` compatibility routes.
- Verify production deployment, route status, navigation, responsive behavior, and absence of repository guide links.
