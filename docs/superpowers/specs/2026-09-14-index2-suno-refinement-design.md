# INDEX2 + SUNO Refinement Design

## Goal
Refine `index2.html` into the approved LIL SYNN destination page without promoting it to `index.html`, while restoring the intended visual hierarchy, navigation, footer, artist-content interactions, and separating the `/Suno` guide's UI/runtime from the main-site shell.

## Requirements

### INDEX2 navigation
- The right-side control is a true three-line pink hamburger button, not a `MORE` button.
- The hamburger opens the existing full-screen/site-panel navigation rather than inventing a second navigation system.
- `VOTE 4 LIL SYNN` is a visible pink item in the primary horizontal navigation.
- The top transmission label is exactly `OFFICIAL TRANSMISSION / 369`.
- The main navigation must not contain `COMMAND`.
- The Suno forum destination is `https://suno-forum.base44.app` and must not be confused with Join the Signal.
- `JOIN THE SIGNAL` must remain associated with the Signal experience, not the Suno forum.

### WEBM composition
- The upper `HERO_BG_WEBM.webm` is the hero visual, with enough of its actual graphic visible to establish LIL SYNN's head/body composition.
- The upper WEBM must end before the stars background begins; the two videos must not visually occupy the same layer/region as competing backgrounds.
- `LS_BG_STARS.webm` begins at the transition point beneath the upper hero visual.
- The stars WEBM is a continuous full-width atmospheric background extending from its starting point to the bottom of the entire INDEX2 page, not merely the bottom of the hero.
- It must span the full left/right viewport width and remain behind the page content.
- Existing section readability overlays remain, but must not hide the WEBM artwork unnecessarily.
- Add very faint, slow-moving atmospheric particles across the site. They must be decorative, low-contrast, pointer-events-free, and respect `prefers-reduced-motion`.

### Artist section
- Preserve the long-form artist material already present on the original `index.html` rather than rewriting or inventing it.
- Provide controls for: THE ARTIST, THE PERSONA, THE MUSIC, TOOLKIT, THE VISUAL WORLD, THE CREATOR, and THE VISION.
- Clicking a control opens a floating modal/panel containing that subsection's complete existing content.
- Each modal has an obvious pink/black close X and an internal pink scrollbar where needed.
- Provide an OVERALL control that opens the complete artist narrative in one larger modal.
- Do not merely jump-scroll to the subsection; the intended interaction is a floating window/modal.

### Platform links
- Apple Music controls/links are pink.
- Spotify controls/links are green.
- Tidal styling can remain restrained black/silver/neutral.

### Footer
- Social icons: YouTube, Spotify, Instagram, X/Twitter, SoundCloud, TikTok, Facebook, Apple Music.
- Privacy and Terms appear beneath the label area.
- Include `DARK SOUND. RAW MOTION. NO LIMITS.`
- Include `© 2026 LIL SYNN`.
- Include `DESIGNED WITH CHATGPT`.
- Preserve the existing Suno Guide footer link placement where it already works.
- Add the existing `LS_HEADPHONES.png` as the hidden Special Access Easter egg, linking only to `/special_access.html`.
- Do not expose a normal navigation link to `/special_access.html` elsewhere.
- Add the existing `UP_ARROWS.png` as a small/mid-sized floating back-to-top control on the right side that returns to the absolute page top.
- Make the page scrollbar pink.

## SUNO separation
- `/Suno` is its own UI system and must retain its horizontal Suno navigation.
- Suno styling must remain black/gold and use the existing `Suno/css/suno.css` design language.
- Do not inject the main site's global header/footer/navigation/runtime into Suno pages.
- Main site and Suno may link to one another, but their CSS/JS responsibilities remain separated.
- Fix bright-blue default-looking links by preserving/strengthening the existing Suno gold link rules where necessary.

## Constraints
- Work on `index2.html` and its supporting files only; do not promote it to `index.html` yet.
- Preserve existing assets and content whenever they already exist.
- Do not invent replacement pages or duplicate projects.
- Avoid a single catch-all JavaScript runtime that owns both the main site and `/Suno`.
- Existing accessibility and reduced-motion behavior must continue to work.

## Verification
- Inspect source and runtime structure for duplicate navigation and cross-project script injection.
- Verify desktop and mobile navigation behavior.
- Verify WEBM sequencing, full-width stars background, and page-height coverage.
- Verify artist modals open/close and contain the intended existing copy.
- Verify footer links/assets and Special Access exclusivity.
- Verify Suno navigation and black/gold styling remain isolated.
- Verify the resulting deployment before claiming production readiness.
