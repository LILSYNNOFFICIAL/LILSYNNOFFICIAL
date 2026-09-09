# LIL SYNN

## Official Website Repository

Production source for [lilsynn.com](https://lilsynn.com).

The site is deployed from the `main` branch through Vercel.

---

## Architecture

The website is built around a small number of authoritative systems. The goal is simple: **one global shell, one release data source, and no competing implementations.**

| System | Responsibility |
|---|---|
| `index.html` | Homepage content and landing experience |
| `site-global.js` | Canonical global shell and shared behavior |
| `site-global.css` | Canonical global shell styling and responsive behavior |
| `site-polish.js` | Homepage-specific release/video presentation |
| `release-catalog.json` | Canonical release and streaming data |
| `releases.html` | Catalog-driven release archive |
| `.github/workflows/fix-homepage.yml` | Source cleanup and architecture validation |

### Core rule

> **One header. One navigation system. One menu. One footer. One audio control. One Back To Top control. One release database.**

Page-specific code must not recreate global systems.

---

# Universal Global Shell

`site-global.js` is the authoritative implementation of the shared website shell.

It owns:

- Header
- Primary navigation
- Responsive navigation drawer
- Socials accordion
- Stream accordion
- Footer
- Special Access headphone link
- THE CALM ambient audio control
- Back To Top control
- Shared metadata
- Responsive shell behavior
- Keyboard interaction
- Escape-to-close behavior
- Body scroll locking
- Accessibility state

`site-global.css` owns the corresponding shared styling.

## Source-level shell rule

The homepage must contain **no legacy global shell markup**.

`index.html` must not contain:

- the old fixed primary `<nav>`
- `#sideMenu`
- `.site-headphones`
- legacy page-level footer markup
- a second global header
- a second global menu
- a second global footer
- a second global audio controller
- a second Back To Top implementation
- a second `site-global.js` loader
- the obsolete `homepage-final-fixes.js` shell loader

The canonical shell is loaded directly by the homepage:

```html
<script src="/site-global.js?v=20260911"></script>
```

There must be exactly one active `site-global.js` reference in `index.html`.

## Legacy cleanup

Older markup may have existed historically, but compatibility is not a reason to keep duplicate source implementations indefinitely.

The repository workflow removes obsolete homepage shell markup and validates that it is gone.

The cleanup workflow rejects the following obsolete references in `index.html`:

```text
aria-label="Primary navigation"
id="sideMenu"
class="site-headphones"
assets/img/LS_HEADPHONES.png
homepage-final-fixes.js
```

This makes the source architecture authoritative rather than relying on JavaScript to hide duplicate markup after page load.

---

# Header

The canonical header uses:

```text
/assets/images/icons/LS_HEADPHONES.png
```

The headphone artwork is the primary LIL SYNN header mark and the Special Access Easter egg.

Clicking the artwork routes to:

```text
/special_access.html
```

The headphone artwork is intentionally oversized relative to the header so it remains visually prominent.

**Do not create a page-specific headphone header. Do not reintroduce the old `assets/img/` path.**

If sizing needs to change, change the universal shell styling rather than adding another header implementation.

---

# Navigation

The canonical primary navigation is:

- Home
- Music
- Releases
- Videos
- About
- Merch
- Lyrics
- Contact

The navigation drawer contains:

### Socials

- YouTube
- Spotify
- Apple Music
- Instagram
- X / Twitter
- SoundCloud
- TikTok
- Facebook

### Stream

- Spotify
- Apple Music
- YouTube
- YouTube Music
- TIDAL
- Amazon Music

Socials and Stream are independent collapsible groups and must not create duplicate navigation structures.

The menu supports:

- Responsive sizing
- Internal scrolling
- Keyboard interaction
- Escape-to-close
- Focusable controls
- ARIA state
- Body scroll locking
- No unintended horizontal overflow

---

# Homepage Ownership

`index.html` owns homepage content.

`site-polish.js` may enhance homepage-specific content, including:

- Latest Releases
- Latest Videos
- Homepage presentation

It must **not** own the global header, menu, footer, audio controller, or Back To Top system.

The obsolete `homepage-final-fixes.js` shell-loading logic is no longer part of the homepage architecture. The global shell is loaded directly by `index.html`.

---

# Latest Releases

Homepage release data is catalog-driven.

`release-catalog.json` is the source of truth for release metadata and streaming destinations.

The homepage must not maintain a separate hard-coded release database.

The latest release presentation reads the canonical catalog order and associated artwork/link mappings.

---

# Latest Videos

The homepage Latest Videos section uses:

```text
/api/latest-youtube-releases
```

The API is specifically responsible for the **YouTube Releases** feed.

Do not replace this with a generic uploads feed.

The release feed preserves YouTube release playlist/card ordering and selects the appropriate release representation rather than flattening the channel's uploads into a date-sorted list.

The homepage renderer consumes the API output and does not independently rebuild the release discovery logic.

---

# Release System

`release-catalog.json` is the canonical release database.

It owns:

- Release order
- Grouped releases
- Albums
- EPs
- Standalone singles
- Track listings
- Artwork mappings
- Spotify destinations
- Apple Music destinations
- SoundCloud destinations
- SoundCloud sets
- Release grouping metadata

`releases.html` owns presentation and rendering logic.

It must not become a second release database.

## Release types

The archive must support all three:

1. Albums
2. EPs
3. Standalone singles

Standalone singles must never disappear when album or EP rendering is changed.

## Ordering

The catalog's `order` array is the canonical default archive order.

Sorting and filtering are presentation operations. They must never mutate the catalog's canonical order.

---

# Critical Release Separation

## Signal Light Sermon

There are two distinct releases with similar names.

### `Signal Light Sermon`

This is the version on:

```text
Touching to the North
```

It is **SoundCloud only**.

Required behavior:

- SoundCloud: YES
- Spotify: NO
- Apple Music: NO

### `Signal Light Sermon (Remastered 2026)`

This is a separate standalone single.

It has its own:

- Spotify destination
- Apple Music destination

Those destinations belong only to the standalone remastered release.

## Non-negotiable rule

> **Never reuse the standalone remastered Spotify or Apple Music destinations for the Touching to the North album track.**

Similar titles do not make releases equivalent.

The renderer must apply release-specific rules rather than blindly falling back to similarly named global mappings.

---

# Touching to the North

`Touching to the North` is intentionally presented as a SoundCloud-only album.

Its SoundCloud set is:

```text
https://soundcloud.com/lilsynnofficial/sets/touching-to-the-north
```

The album's tracks may have SoundCloud destinations, but they must not receive Spotify or Apple Music destinations through generic fallback logic.

| Destination | Allowed |
|---|---:|
| SoundCloud track | Yes |
| SoundCloud album/set | Yes |
| Spotify | **No** |
| Apple Music | **No** |

The album artwork mapping is catalog-controlled. Never guess replacement filenames when repairing artwork.

---

# Streaming Rules

## Spotify

Use the exact catalog destination for the exact release when a verified direct URL exists.

Never substitute a similarly titled release.

## Apple Music

Use the exact catalog destination when available.

If an exact direct destination is not known, a search fallback may be used rather than inventing a direct URL.

## SoundCloud

Use catalog-controlled release and track mappings.

SoundCloud-only releases must remain SoundCloud-only.

Do not manufacture Spotify or Apple Music buttons simply because another release has them.

---

# Artwork

Artwork paths are data-driven wherever possible.

When artwork fails:

1. Check the catalog mapping.
2. Check the actual repository filename.
3. Check the renderer path construction.
4. Fix the owning system.
5. Do not create a duplicate asset just to hide a path error.

The canonical header headphone asset is:

```text
/assets/images/icons/LS_HEADPHONES.png
```

The canonical Back To Top artwork is:

```text
/assets/images/icons/UP_ARROWS.png
```

---

# THE CALM

The ambient background audio is:

```text
/assets/other/sound/Background.mp3
```

THE CALM is a global shell feature.

There must be one shared audio controller, not separate page-specific implementations.

Where browser playback policy and media state allow it, shared behavior can pause or mute ambient audio when video playback begins.

---

# Back To Top

Back To Top is a global shell feature.

It uses:

```text
/assets/images/icons/UP_ARROWS.png
```

Individual pages must not create competing Back To Top controls.

---

# Responsive Design

The shared shell must remain usable across:

- Desktop
- Tablet
- Mobile
- Narrow mobile

Pay particular attention to:

- Oversized headphone artwork
- Fixed header positioning
- Navigation drawer width
- Long-menu scrolling
- Release cards
- Track rows
- Streaming controls
- Filter controls
- Horizontal overflow

Do not solve a responsive issue by creating a second shell.

---

# Accessibility

Preserve:

- Meaningful image alt text
- Keyboard navigation
- Visible focus states
- `aria-expanded`
- `aria-controls`
- `aria-hidden`
- Escape-to-close behavior
- Accessible labels for icon-only controls
- Focusable interactive controls
- Reduced-motion behavior
- Internal scrolling for long navigation content
- Responsive layouts without unnecessary horizontal scrolling

---

# GitHub Actions and Validation

`.github/workflows/fix-homepage.yml` is responsible for protecting the homepage architecture.

On pushes to `main`, it can clean obsolete homepage shell source and validate the resulting repository.

Validation includes:

- Required homepage files exist
- Required media assets exist
- Obsolete `BG2.webm` references are rejected
- Legacy homepage shell references are rejected
- `homepage-final-fixes.js` is rejected from the homepage
- Exactly one `/site-global.js` reference exists in `index.html`
- Release catalog JSON remains valid
- Required canonical release entries remain present
- Sitemap coverage remains present
- Canonical URLs remain present

The workflow is a guardrail, not a substitute for actual browser testing.

---

# Change Discipline

When making changes:

1. Identify which system owns the behavior.
2. Fix that system instead of adding another implementation.
3. Inspect the complete current file before replacing it.
4. Preserve unrelated working behavior.
5. Keep release data in `release-catalog.json`.
6. Keep global behavior in `site-global.js` and `site-global.css`.
7. Keep homepage-specific behavior in homepage files.
8. Never duplicate the global shell.
9. Never infer streaming destinations from similar titles.
10. Never remove standalone singles while repairing grouped releases.
11. Never add Spotify or Apple Music to `Touching to the North`.
12. Never use the old `assets/img/LS_HEADPHONES.png` path.
13. Never reintroduce `#sideMenu` or `.site-headphones`.
14. Never use `homepage-final-fixes.js` as a second shell loader.
15. Never claim deployment or browser verification occurred unless it actually occurred.

---

# QA Checklist

Before committing a significant site change:

- [ ] Current `main` state inspected
- [ ] Complete relevant files inspected
- [ ] Current blob SHA confirmed before replacement
- [ ] Proposed change reviewed
- [ ] Unrelated files preserved
- [ ] JavaScript syntax checked
- [ ] JSON syntax checked
- [ ] HTML structure checked
- [ ] No duplicate header exists
- [ ] No duplicate navigation/menu exists
- [ ] No duplicate footer exists
- [ ] No duplicate THE CALM controller exists
- [ ] No duplicate Back To Top exists
- [ ] Exactly one `site-global.js` reference exists in `index.html`
- [ ] No `#sideMenu` remains in homepage source
- [ ] No `.site-headphones` remains in homepage source
- [ ] No old headphone asset path remains in homepage source
- [ ] Homepage uses the universal shell directly
- [ ] Latest Videos uses YouTube Releases API
- [ ] Latest Releases uses the canonical catalog
- [ ] Albums render
- [ ] EPs render
- [ ] Standalone singles render
- [ ] Catalog order remains authoritative
- [ ] Sorting does not mutate catalog data
- [ ] `Touching to the North` remains SoundCloud-only
- [ ] `Signal Light Sermon` album track remains separate from the remastered standalone
- [ ] Artwork paths resolve
- [ ] Mobile layout checked
- [ ] Narrow-mobile layout checked
- [ ] Production behavior verified only when actually tested

---

# Production Principle

The most important rule for this repository is:

> **Build one correct system instead of stacking patches on top of an incorrect system.**

If a global behavior is wrong, repair the global owner.

If release data is wrong, repair the catalog.

If homepage presentation is wrong, repair the homepage renderer.

Do not create another implementation to compete with the existing one.

---

## Repository

**LIL SYNN Official Website**

Production site: https://lilsynn.com

Branch: `main`

Deployment: Vercel
