# LIL SYNN

> **Official digital home of LIL SYNN.**
>
> A production-grade artist website built around a single global experience, canonical release data, media-driven presentation, and a deliberately controlled visual system.

<p align="center">
  <strong>Music • Releases • Videos • About • Merch • Lyrics • Contact</strong>
</p>

<p align="center">
  <a href="https://lilsynn.com">Live Site</a> ·
  <a href="https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL">Source</a>
</p>

---

## Overview

This repository is the production source for **[LIL SYNN](https://lilsynn.com)**.

It is intentionally more than a collection of static pages. The site is organized as a small, browser-native publishing system where shared behavior, release metadata, artwork, streaming destinations, video presentation, and visual effects have clearly defined owners.

The guiding principle is simple:

> **Build the system once. Make every page use the system. Keep the data authoritative.**

That means the website should not solve the same problem in five different files. Shared behavior belongs in the shared layer. Release truth belongs in the release catalog. Presentation layers consume that truth without mutating it.

---

## Production Stack

| Layer | Role |
|---|---|
| **HTML** | Page structure and semantic content |
| **CSS** | Global visual system, responsive layout, shell styling |
| **Vanilla JavaScript** | Interaction, rendering, media orchestration, shared behavior |
| **JSON** | Canonical release and media manifests |
| **GitHub** | Source control and production source of truth |
| **Vercel** | Production deployment and delivery |
| **GitHub Actions** | Automated cleanup, media manifest generation, and architecture validation |
| **YouTube** | Latest Releases video source |
| **Spotify / Apple Music / SoundCloud** | Streaming destinations |

No framework is required for the core site experience. The architecture favors deterministic browser code, small focused modules, and explicit ownership over unnecessary abstraction.

---

# Architecture

## The Source-of-Truth Model

The most important architectural rule in the project is the separation between **data**, **behavior**, and **presentation**.

```text
                         ┌──────────────────────┐
                         │ release-catalog.json │
                         │   CANONICAL TRUTH    │
                         └──────────┬───────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
          Release Archive      Music Selection      Video Ordering
                │                   │                   │
                ▼                   ▼                   ▼
            releases.html      music-random.js    latest-videos.js
                │                   │                   │
                └───────────────────┼───────────────────┘
                                    ▼
                              Global Experience
                                    │
                         site-global.js / CSS
                                    │
                                    ▼
                              Every Page
```

### Canonical data

`release-catalog.json` defines release order, release groupings, tracks, artwork relationships, and known streaming destinations.

### Shared behavior

`site-global.js`, `site-global.css`, and the global media layer provide behavior and presentation that should remain consistent across the site.

### Page presentation

Individual HTML pages render their own content while consuming the shared systems. A page should not create a competing version of a global feature simply because it needs to display it.

---

# Repository Map

| File / Directory | Responsibility |
|---|---|
| `index.html` | Main artist landing page and homepage experience |
| `releases.html` | Full release archive, filters, ordering, track presentation, artwork |
| `site-global.js` | Canonical global shell, navigation, shared controls, metadata, accessibility behavior, defensive cleanup |
| `site-global.css` | Canonical shell styling, responsive behavior, header, navigation, controls, shared visual presentation |
| `script.js` | Global background media, homepage orchestration, ordering/deduplication safeguards, shared presentation helpers |
| `music-random.js` | Catalog-driven music randomizer and music-card rendering |
| `latest-videos.js` | Latest Releases video resolution, canonical ordering, deduplication, playback UI |
| `latest-videos.json` | Resolved YouTube Releases manifest |
| `release-catalog.json` | **Canonical release database** |
| `site-polish.js` | Homepage-specific presentation refinements |
| `assets/img/` | Artist artwork, release artwork, logos, imagery |
| `assets/images/icons/` | Shared interface artwork and icon assets |
| `assets/mov/` | Background WebM media |
| `assets/other/sound/` | Shared audio assets |
| `.github/workflows/fix-homepage.yml` | Automated source cleanup, media indexing, and validation |

---

# Global Shell

`site-global.js` is the **single owner of the global site shell**.

It is responsible for the shared experience used across pages, including:

- Header
- Primary navigation
- Responsive navigation drawer
- Social destinations
- Streaming destinations
- Footer
- Special Access
- THE CALM
- Back To Top
- Shared metadata
- About accordion behavior
- Keyboard interaction
- Escape-to-close behavior
- Body scroll locking
- Duplicate-shell cleanup
- Defensive normalization of shared homepage systems where necessary

## Global Shell Contract

Every page should consume the same global shell.

There must not be competing page-level implementations of:

- The global header
- The primary navigation
- The navigation drawer
- The footer
- THE CALM
- Back To Top
- Shared shell controls

If a shared feature needs to change, change the owner of that feature instead of creating another patch that competes with it.

---

# Header System

The header is a **viewport-level global component**, not a page-specific decoration.

The intended layout contract is:

```text
┌──────────────────────────────────────────────────────────┐
│  SPECIAL ACCESS      CENTERED LS_LOGO             MENU  │
│                                                          │
│  THE CALM                                                │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
                     LS.png artwork
```

Key rules:

1. The header begins at the very top of the viewport.
2. The header spans the full viewport width.
3. The header has enough vertical height to accommodate the visual system without creating an artificial inset.
4. `LS_LOGO.png` is centered independently of the left-side controls.
5. The logo can be enlarged without shifting the mathematical center of the header.
6. Special Access remains anchored to its own artwork/control area.
7. THE CALM is positioned independently and can remain attached to the actual left edge.
8. `LS.png` begins immediately at the bottom boundary of the global header.
9. Individual pages must not invent their own header offset when the global shell already owns it.

The critical idea is **independent positioning**. Changing the size of one control must not push another control out of alignment.

---

# Navigation

The site uses one responsive navigation system.

Primary destinations include:

- Home
- Music
- Releases
- Videos
- About
- Merch
- Lyrics
- Contact

Social and streaming destinations are presented within the shared navigation experience.

The navigation system is expected to support:

- Desktop and mobile layouts
- Internal scrolling where required
- Keyboard navigation
- Escape-to-close
- Accessible expanded/collapsed state
- Body scroll locking
- Responsive sizing
- A single source of interaction truth

Legacy duplicate navigation systems must not be reintroduced.

---

# Global Visual System

The site's visual language is intentionally dark, cinematic, atmospheric, and music-first.

The global layer is responsible for consistency in:

- Typography
- Header geometry
- Navigation presentation
- Shared controls
- Background treatment
- Glass-style surfaces where used
- Responsive spacing
- Interactive states
- Artwork presentation

The site should feel like **one product**, not a collection of unrelated HTML pages.

---

# Background Motion System

Background WebM assets live under:

```text
/assets/mov/
```

The build workflow generates:

```text
/assets/mov/index.json
```

from the available `.webm` files.

The global background system is responsible for:

1. Creating or adopting the document-level background video.
2. Loading the generated media manifest.
3. Selecting an available WebM.
4. Playing it muted and inline.
5. Covering the viewport with the appropriate object-fit behavior.
6. Maintaining a readable contrast layer between motion and page content.
7. Falling back gracefully when the manifest cannot be loaded.

Adding a new WebM to `assets/mov/` should make it eligible after the media manifest is regenerated.

The background system should never become a page-specific duplicate.

---

# THE CALM

**THE CALM** is a global experience control.

Its ambient audio source is:

```text
/assets/other/sound/Background.mp3
```

The controller belongs to the global shell and should have exactly one authoritative implementation.

The architecture should prevent multiple page scripts from fighting over the same playback state.

---

# Back To Top

Back To Top is a global control and uses:

```text
/assets/images/icons/UP_ARROWS.png
```

Individual pages should not add competing versions of the same control.

---

# Music System

## RANDOMIZE

The homepage Music section uses one **RANDOMIZE** control.

`music-random.js` owns the feature.

The randomizer follows a deterministic data pipeline:

```text
release-catalog.json
        ↓
canonical release order
        ↓
track pool
        ↓
validation + deduplication
        ↓
random presentation selection
        ↓
music cards
```

The catalog itself is never randomized or mutated.

The randomizer may:

- Read the canonical release catalog
- Build a playable track pool
- Resolve artwork
- Resolve streaming destinations
- Exclude releases that are intentionally outside the supported streaming pool
- Deduplicate tracks
- Randomize presentation
- Remember the previous session selection when useful

The randomizer must not become a second release database.

### Touching to the North

`Touching to the North` is intentionally SoundCloud-only.

Its tracks must not be silently promoted into Spotify/Apple Music presentation through generic fallback logic.

---

# Release Archive

`release-catalog.json` is the **canonical release database**.

It owns:

- Release order
- Release types
- Albums
- EPs
- Standalone singles
- Track order
- Artwork relationships
- Spotify destinations
- Apple Music destinations
- SoundCloud destinations
- SoundCloud sets where applicable

`releases.html` is responsible for **presentation**, not for redefining the catalog.

## Track Order

Track rows should come directly from the catalog's `tracks` arrays.

The renderer must not silently:

- Alphabetize tracks
- Reverse tracks
- Randomize tracks
- Mutate the canonical arrays

If track order needs to change, change the catalog.

## Archive Order

The canonical archive order is defined by the catalog's explicit ordering data.

Presentation-level sorting is allowed for user-selected views, but it must not mutate canonical data.

## Filters

The release archive supports presentation-level filtering for:

- All releases
- Albums
- EPs
- Singles

Ordering views may include:

- Catalog order
- A → Z
- Z → A

The default should remain the complete canonical archive unless explicitly changed by the user.

---

# Release Identity & Streaming Integrity

A release title is not enough to safely infer a streaming destination.

**Exact release identity wins.**

This prevents a common class of production bugs where two similarly named releases accidentally inherit one another's links.

## Signal Light Sermon

The `Signal Light Sermon` track associated with `Touching to the North` is a SoundCloud-only catalog entry.

It must not inherit the streaming destinations belonging to the separate remastered single.

## Signal Light Sermon (Remastered 2026)

This is a separate standalone release with its own artwork and streaming destinations.

The two identities must remain separate in data, artwork, and links.

## Touching to the North

This album is SoundCloud-only.

Allowed:

| Destination | Status |
|---|---:|
| SoundCloud track | ✅ |
| SoundCloud set | ✅ |
| Spotify | ❌ |
| Apple Music | ❌ |

Generic streaming fallback logic must respect these release-level restrictions.

---

# Artwork System

Artwork is treated as structured release data, not as an incidental filename.

Where artwork is mapped explicitly, the renderer should consume that mapping rather than guessing from titles.

When artwork fails to render, verify in this order:

1. Release identity
2. Catalog mapping
3. Actual filename
4. Asset directory
5. URL/path construction
6. Renderer behavior

Do not create duplicate assets or unrelated JavaScript patches merely to conceal an incorrect path.

---

# Latest Videos

The homepage Latest Videos experience is powered by:

```text
latest-videos.json
```

The manifest contains resolved YouTube Releases information such as:

- Video ID
- Title
- Published timestamp
- Associated release

The important architectural distinction is:

> **YouTube provides the video source. The release catalog controls release order.**

`latest-videos.js` is responsible for:

1. Loading the canonical release catalog.
2. Loading the latest-video manifest.
3. Avoiding stale cache where appropriate.
4. Deduplicating by video identity and normalized title.
5. Matching videos to canonical releases.
6. Following catalog order rather than trusting source ordering.
7. Preventing duplicate release/video selection.
8. Rendering the intended homepage video count.
9. Providing a thumbnail-first playback experience.
10. Switching to a privacy-enhanced YouTube embed when the user chooses to play.

This means a YouTube source reorder should not silently reorder the site's release presentation.

### Defensive ordering

Because multiple browser systems can participate in homepage rendering, defensive deduplication/order guards may exist in shared code as a safety net.

Those guards are not a replacement for clear ownership. They exist to protect the final DOM from duplicate or out-of-order content.

---

# Accessibility

Accessibility is part of the architecture, not a final polish pass.

Preserve:

- Keyboard navigation
- Visible focus states
- Meaningful image alt text
- Correct `aria-expanded` state
- Correct `aria-controls` relationships
- Appropriate `aria-hidden` state
- Accessible button labels
- Escape-to-close behavior
- Focus-friendly dialogs/drawers
- Reduced-motion considerations
- Responsive layouts without unnecessary horizontal overflow

Any new interactive component should be usable without relying exclusively on a pointer or touch screen.

---

# Responsive Design

The site must remain coherent across:

- Desktop
- Laptop
- Tablet
- Mobile
- Narrow mobile widths

Responsive work should preserve the global component model.

### Important rule

**Do not solve a responsive problem by creating another version of the global shell.**

Instead:

1. Identify the owning component.
2. Adjust its responsive rules.
3. Verify neighboring controls.
4. Verify mobile overflow.
5. Verify desktop alignment.

The global header is especially sensitive because logo size, left-side controls, navigation, and top artwork all interact spatially.

---

# GitHub Actions

The repository includes automation under:

```text
.github/workflows/fix-homepage.yml
```

The workflow acts as an architectural guardrail.

Depending on the current implementation, it can handle tasks such as:

- Removing obsolete homepage shell markup
- Preventing duplicate navigation implementations
- Removing stale legacy references
- Ensuring the canonical global loader remains
- Generating the WebM manifest
- Validating required files and media
- Checking release data integrity
- Validating SEO-related files
- Validating sitemap coverage
- Committing generated changes when appropriate

Automation is intended to **protect the architecture**, not hide failures.

A passing workflow does not automatically mean the site has been visually verified in a real browser.

---

# Deployment

The production deployment path is:

```text
Developer change
      ↓
GitHub / main
      ↓
GitHub Actions
      ↓
Validation + generated assets
      ↓
Vercel
      ↓
https://lilsynn.com
```

The repository's `main` branch is the production source branch.

When debugging production behavior, distinguish between:

- Source code state
- Generated asset state
- GitHub Actions state
- Vercel deployment state
- Browser cache state
- Runtime DOM state

A fix is not considered production-verified simply because it exists in GitHub.

---

# Cache & Asset Strategy

Shared JavaScript and CSS may use cache-busting version parameters when necessary.

Example:

```html
<script src="/site-global.js?v=YYYYMMDD"></script>
```

When a shared asset changes and users may receive an older cached copy, update the appropriate cache-busting strategy rather than adding redundant scripts.

For data files that must reflect the newest catalog state, fetch behavior should be chosen deliberately rather than assuming the browser will always deliver the desired version.

---

# Legacy Code Policy

The project has accumulated iterative improvements over time. Some older implementations are specifically forbidden from returning because they compete with the canonical architecture.

Do not reintroduce obsolete systems such as:

- `#sideMenu`
- `.site-headphones`
- `homepage-final-fixes.js` as a competing global shell
- Duplicate `site-global.js` loaders
- Duplicate global navigation markup
- Duplicate THE CALM controllers
- Duplicate Back To Top controls
- Obsolete homepage-only background-video implementations
- Independent release databases that disagree with `release-catalog.json`

If an old system appears necessary, first determine whether the canonical owner is missing functionality. Fix the owner before creating a second owner.

---

# Engineering Principles

## 1. One owner per behavior

Every meaningful behavior should have a clearly identifiable owner.

## 2. Data is not presentation

Canonical release data should not be mutated simply to support a UI sort or randomization.

## 3. Deterministic software does deterministic work

Sorting, filtering, deduplication, path resolution, validation, and DOM operations belong to normal code.

## 4. Avoid patch stacking

If three scripts are all correcting the same component, the architecture needs consolidation rather than a fourth script.

## 5. Exact identity beats fuzzy inference

Release-specific links, artwork, and media relationships should be resolved from explicit data whenever possible.

## 6. Defensive code should remain defensive

Observers and guards are useful when external or asynchronous systems can alter the DOM. They should not become the primary architecture.

## 7. Preserve working behavior

A change should solve the requested problem without casually rewriting unrelated systems.

## 8. Verify what you actually verified

Never describe a production change as browser-tested, Vercel-verified, or visually confirmed unless that verification actually occurred.

---

# Change Workflow

Before modifying the site:

1. **Identify the owner.**
2. **Read the current implementation.**
3. **Trace its dependencies.**
4. **Make the smallest architectural change that solves the problem.**
5. **Do not create a competing implementation.**
6. **Preserve unrelated working behavior.**
7. **Validate the data layer if the change touches releases/media.**
8. **Check responsive behavior when touching layout.**
9. **Check generated assets/workflows when applicable.**
10. **Verify the actual deployed result before calling it production-complete.**

---

# Production QA Checklist

## Global Shell

- [ ] One global header
- [ ] Header starts at the viewport top
- [ ] Header spans the full width
- [ ] Header geometry is consistent across pages
- [ ] Center logo remains mathematically centered
- [ ] Left-side controls do not shift the logo
- [ ] Special Access remains correctly anchored
- [ ] THE CALM remains correctly anchored
- [ ] `LS.png` begins directly below the global header
- [ ] One navigation drawer
- [ ] One footer
- [ ] One THE CALM controller
- [ ] One Back To Top control
- [ ] No legacy `#sideMenu`
- [ ] No legacy `.site-headphones`
- [ ] No duplicate global script loaders

## Music

- [ ] Exactly one RANDOMIZE control
- [ ] Randomizer reads canonical catalog data
- [ ] Tracks are deduplicated
- [ ] Catalog order is not mutated
- [ ] Artwork resolves correctly
- [ ] Streaming destinations remain release-specific
- [ ] SoundCloud-only material is not promoted to unsupported platforms

## Releases

- [ ] Catalog is the source of truth
- [ ] Track order matches catalog arrays
- [ ] Archive order matches canonical order
- [ ] All releases filter works
- [ ] Albums filter works
- [ ] EPs filter works
- [ ] Singles filter works
- [ ] A → Z works
- [ ] Z → A works
- [ ] Artwork resolves correctly
- [ ] Similar release names do not share incorrect links

## Videos

- [ ] Latest Videos uses the manifest
- [ ] Release catalog controls canonical order
- [ ] Duplicate video IDs are removed
- [ ] Duplicate titles are removed where appropriate
- [ ] Video cards render once
- [ ] Thumbnail-first playback works
- [ ] YouTube playback uses the intended privacy-enhanced embed
- [ ] Missing video data fails gracefully

## Media

- [ ] Background WebM manifest exists
- [ ] Background selection works
- [ ] Background covers the viewport
- [ ] Foreground content remains readable
- [ ] THE CALM audio source resolves
- [ ] Reduced-motion behavior remains respected

## Responsive / Accessibility

- [ ] Desktop verified
- [ ] Tablet verified
- [ ] Mobile verified
- [ ] Narrow mobile verified
- [ ] No unintended horizontal overflow
- [ ] Keyboard navigation works
- [ ] Focus states remain visible
- [ ] Escape closes the navigation drawer
- [ ] ARIA state is synchronized
- [ ] Interactive controls have accessible labels

## Deployment

- [ ] GitHub source updated
- [ ] GitHub Actions completed successfully where applicable
- [ ] Generated assets are current
- [ ] Vercel deployment completed
- [ ] Production URL serves the expected revision
- [ ] Browser cache has been considered
- [ ] Actual production behavior has been checked

---

# Project Philosophy

The goal is not to make the codebase look complicated.

The goal is to make the **experience** feel effortless.

Visitors should see an artist website that feels cohesive, intentional, fast, immersive, and unmistakably LIL SYNN.

Behind that experience, the engineering should remain disciplined:

```text
ONE SHELL
ONE NAVIGATION SYSTEM
ONE RELEASE DATABASE
ONE MEDIA STRATEGY
ONE OWNER PER BEHAVIOR

                    ↓

          LESS CONFLICT
          LESS DUPLICATION
          LESS FRAGILITY
          MORE CONTROL

                    ↓

              LIL SYNN
```

---

## Official Links

- **Website:** https://lilsynn.com
- **TikTok:** https://www.tiktok.com/@lilsynnofficial
- **GitHub:** https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL

---

## Maintainer Note

This repository is a live production system. Treat shared shell files, canonical JSON data, generated manifests, and deployment automation as infrastructure.

When in doubt, do not add another patch.

**Find the owner. Fix the owner. Keep the architecture clean.**

---

<p align="center">
  <strong>LIL SYNN</strong><br>
  <sub>Official Website • Production Source • Built to Evolve</sub>
</p>
