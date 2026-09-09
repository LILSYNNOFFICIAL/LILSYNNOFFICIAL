<div align="center">

# LIL SYNN

### Official Website · Music · Visuals · Archive

**Production repository for https://lilsynn.com**

</div>

---

## Production Architecture

This repository is the production source for the LIL SYNN website. The site is deployed through Vercel from the `main` branch.

The website is intentionally organized around a small number of authoritative systems instead of duplicated page-by-page implementations.

| System | Responsibility |
|---|---|
| `index.html` | Primary homepage and landing experience |
| `site-global.css` | Canonical global shell styling and responsive behavior |
| `site-global.js` | Canonical global shell, navigation, controls, metadata, and shared behavior |
| `site-polish.js` | Homepage-specific presentation/enrichment only |
| `release-catalog.json` | Canonical release and streaming data source |
| `releases.html` | Catalog-driven release archive renderer |
| `special_access.html` | Special Access destination / Easter egg |
| `coming_soon.html` | Coming Soon page |

### Core rule

> **One global shell. One release database. One source of truth. No cross-release link leakage.**

The repository is not a collection of independent templates. Global behavior must remain centralized so individual pages cannot accidentally create competing headers, menus, footers, audio controls, or release databases.

---

## Universal Global Shell

`site-global.js` is responsible for the site's shared runtime shell.

It provides or manages:

- canonical header
- canonical primary navigation
- responsive navigation drawer
- Socials accordion
- Stream accordion
- footer
- global metadata
- Special Access headphone link
- `THE CALM` ambient audio control
- Back To Top control
- About-page artist accordion where applicable
- legacy shell cleanup where legacy markup is present
- responsive menu behavior
- keyboard interaction
- Escape-to-close behavior
- body scroll locking while the menu is open
- accessible ARIA state

`site-global.css` provides the shared visual system for those elements.

### Important implementation boundary

The current `site-global.js` is intentionally focused on the **universal shell**. It does not own homepage release normalization or release archive rendering.

Release rendering belongs to `releases.html` and `release-catalog.json`.

Homepage-specific behavior belongs to `site-polish.js` and `index.html`.

Do not reintroduce broad page normalization logic into the global shell merely to fix one page.

---

## Header

The canonical header uses:

```text
/assets/images/icons/LS_HEADPHONES.png
```

The headphone artwork is both the primary LIL SYNN header mark and the **Special Access Easter egg**. Clicking it routes to:

```text
/special_access.html
```

### Current sizing

`site-global.css` currently targets approximately:

- Desktop header height: `96px`
- Mobile header height: `86px`
- Desktop headphone artwork: `112px × 112px`
- Mobile headphone artwork: `94px × 94px`

The artwork intentionally extends beyond the nominal header height so it remains visually prominent.

**Do not shrink the headphone artwork back into a small icon.**

Do not create a second page-specific header to compensate for sizing or positioning issues. Fix the shared shell instead.

---

## Canonical Navigation

Primary navigation is:

- Home
- Music
- Releases
- Videos
- About
- Merch
- Lyrics
- Contact

The navigation drawer also contains two independent collapsible groups:

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

The Socials and Stream groups are mutually exclusive when expanded. Opening one closes the other.

### Menu behavior

The global menu supports:

- responsive sizing
- internal scrolling for long content
- keyboard focus
- Escape-to-close
- accessible ARIA state
- body scroll locking while open
- proper focusable controls
- no unintended horizontal overflow

**Never add another global hamburger, navigation drawer, header, or footer implementation.**

---

## Legacy Shell Handling

Some historical HTML pages may still contain older header, menu, or footer markup in their source.

The canonical runtime shell is responsible for removing conflicting legacy shell elements when necessary and inserting the current shared shell.

This allows older pages to remain compatible without maintaining multiple active global implementations.

When performing source cleanup, the goal is eventually to remove obsolete markup from the HTML itself, but runtime compatibility must not be broken merely to make source files look cleaner.

---

# Release System

## `release-catalog.json` is the Source of Truth

The release archive must not maintain a second hard-coded release database.

`release-catalog.json` owns the catalog data used by `releases.html`, including:

- canonical release order
- grouped releases
- albums
- EPs
- standalone singles
- track listings
- release artwork mappings
- release-level Spotify destinations
- release-level Apple Music destinations
- track-level Spotify destinations
- track-level SoundCloud destinations
- SoundCloud set destinations
- release grouping metadata

The renderer reads this data at runtime.

### Why this matters

If release information changes, update the catalog rather than creating another list inside `releases.html`.

The page renderer should determine **how data is displayed**, while the catalog determines **what the releases are**.

---

## Grouped Releases

Grouped releases are represented under `groups` in `release-catalog.json`.

The current catalog contains these major grouped releases:

- `Black Glass`
- `Hello Goodbye`
- `Heal`
- `Don't Say It`
- `Enough`
- `Touching to the North`

Grouped releases retain their track lists and release-level metadata.

---

## Standalone Singles

Standalone releases are just as important as albums and EPs.

Any release title present in the catalog's `order` that is not represented as a grouped release must render as a standalone release card.

The archive must therefore support all three release types:

1. Albums
2. EPs
3. Standalone singles

**Never remove standalone singles when repairing or rewriting album/EP rendering.**

The archive can sort or filter these independently, but the catalog remains authoritative.

---

## Release Ordering and Sorting

`release-catalog.json` owns the canonical order through its `order` array.

The default archive view must respect that order.

The UI may additionally expose sorting/filtering such as:

- Catalog order
- A → Z
- Z → A
- Singles first
- Albums / EPs first

If a Singles filter is available, it must include every standalone entry represented by the catalog.

Sorting is a presentation operation. It must never mutate the underlying catalog order.

---

# CRITICAL: Signal Light Sermon Release Separation

There are **two different releases** with similar titles.

They must never share streaming destinations merely because their names are similar.

## 1. `Signal Light Sermon`
### Touching to the North album version

This is the version included on:

```text
Touching to the North
```

This version is:

```text
SOUNDCLOUD ONLY
```

It must have:

- SoundCloud: YES
- Spotify: NO
- Apple Music: NO

The Touching to the North version must never inherit the Spotify or Apple Music destination belonging to the standalone remastered release.

## 2. `Signal Light Sermon (Remastered 2026)`
### Standalone single

This is a separate standalone release.

Its exact display title is:

```text
Signal Light Sermon (Remastered 2026)
```

This standalone release has its own:

- Spotify destination
- Apple Music destination

Those destinations belong **only** to the standalone remastered release.

### Renderer rule

When `releases.html` renders `Touching to the North`, it must explicitly suppress Spotify and Apple Music for every track in that album.

The renderer must not use generic fallback logic such as:

```text
data.trackSpotify[track]
data.spotify[track]
data.apple[track]
```

for Touching tracks.

For Touching to the North, streaming buttons are intentionally SoundCloud-only.

### Non-negotiable rule

> **Never reuse a streaming URL between the Touching album version and the standalone remastered release.**

A similar title does not mean the releases are the same entity.

---

# Touching to the North

`Touching to the North` is a special SoundCloud-only album presentation.

Its SoundCloud set is:

```text
https://soundcloud.com/lilsynnofficial/sets/touching-to-the-north
```

The album contains:

- `Astral Signal`
- `I Saw the Sky Breathe`
- `Touching to the North`
- `Shadowboxing the Ego`
- `Look Up, Look Within`
- `Signal Light Sermon`
- `Split Screen Mind`
- `This Battle Is Mine`
- `Tomorrow Ain't Promised`
- `Celestial Flow`
- `Cipher Echo`
- `Fragments of Light`
- `Touching to the North (Radio Edit)`

Track destinations are read from the catalog's `trackSoundcloud` mappings.

### Touching streaming policy

| Destination | Allowed |
|---|---:|
| SoundCloud track | Yes |
| SoundCloud album/set | Yes |
| Spotify | **No** |
| Apple Music | **No** |

This policy is intentional and must remain explicit in the renderer.

### Artwork

The album artwork is:

```text
/assets/images/icons/album_art/01 - Astral Signal - LIL SYN-artwork.jpg
```

Do not replace a correct artwork mapping with a guessed filename.

---

# Streaming Link Rules

## Spotify

Use the exact catalog destination when a verified direct URL is known.

Never substitute a similarly titled release.

Never use a standalone release URL for an album track unless the catalog explicitly says they are the same release.

## Apple Music

Use the exact catalog destination when a verified direct URL is known.

If an exact direct destination is not known, a search fallback may be used rather than inventing a direct URL.

A search fallback is not equivalent to a verified direct release URL and must not be represented as one.

## SoundCloud

Use exact catalog mappings for releases and tracks where available.

SoundCloud-only releases must remain SoundCloud-only.

Do not add artificial Spotify or Apple Music buttons simply because other releases have them.

---

# `releases.html` Rendering Logic

The release archive is catalog-driven.

Its responsibilities are:

1. Fetch `/release-catalog.json`.
2. Read the canonical `order` array.
3. Determine whether each entry is a grouped release or standalone release.
4. Render grouped albums/EPs with their complete track lists.
5. Render standalone singles that are not represented under `groups`.
6. Apply catalog-driven artwork and metadata.
7. Apply release-specific streaming rules.
8. Preserve the special SoundCloud-only behavior for `Touching to the North`.
9. Keep `Signal Light Sermon (Remastered 2026)` separate from the Touching album track.
10. Provide sorting/filtering without modifying the catalog itself.

### Special title presentation

The catalog historically contains the standalone mapping under the `Signal Light Sermon` identifier while the release archive presents the standalone release as:

```text
Signal Light Sermon (Remastered 2026)
```

The renderer must continue to keep the standalone release distinct from the Touching album track.

If the catalog is normalized in the future, preserve the standalone Spotify and Apple Music mappings while changing the catalog identity cleanly. Do not solve the naming issue by attaching those mappings to the Touching track.

---

# Artwork System

Artwork should be resolved through shared release rendering and catalog mappings.

Do not create one-off CSS hacks for individual covers.

Do not duplicate artwork files merely to compensate for an incorrect path.

If artwork is missing:

1. verify the catalog mapping
2. verify the actual filename and path
3. fix the shared mapping or renderer
4. do not invent a replacement asset path

---

# Homepage

`index.html` is the primary landing page.

`site-polish.js` is reserved for homepage-specific presentation and enrichment.

The homepage must continue to use the canonical global shell.

It must not create a competing header, navigation drawer, footer, Back To Top control, or audio controller.

The homepage's release references should use the canonical catalog where release data is required.

---

# THE CALM

The site's ambient background audio is:

```text
/assets/other/sound/Background.mp3
```

The universal shell provides the **THE CALM** ON/OFF control.

The control is global and must not be duplicated on individual pages.

Where browser policy and playback state permit, the shared behavior can pause or mute ambient audio when YouTube or native HTML5 video playback begins.

Do not create multiple competing audio controllers.

---

# Back To Top

The universal Back To Top control uses:

```text
/assets/images/icons/UP_ARROWS.png
```

It belongs to the global shell.

Individual pages must not create their own duplicate Back To Top system.

---

# Responsive Design

Global changes must work across:

- desktop
- tablet
- mobile
- narrow mobile

Pay particular attention to:

- oversized headphone artwork
- fixed header positioning
- navigation drawer width
- internal menu scrolling
- release artwork
- release cards
- track rows
- streaming buttons
- filter controls
- no unintended horizontal overflow

The mobile header must remain usable even though the headphone artwork is intentionally larger than a conventional icon.

---

# Accessibility Requirements

Preserve:

- meaningful image `alt` text
- keyboard navigation
- visible focus states
- `aria-expanded`
- `aria-controls`
- `aria-hidden`
- Escape-to-close behavior
- accessible labels for icon-only controls
- focusable interactive elements
- reduced-motion behavior
- internal scrolling for long navigation drawers
- responsive layouts without horizontal scrolling

Do not sacrifice accessibility to reproduce a visual effect.

---

# Change Discipline

When fixing a website problem:

1. Identify the system that owns the behavior.
2. Fix the owning system instead of adding another implementation.
3. Inspect the complete current file before replacing it.
4. Preserve unrelated working behavior.
5. Keep canonical data in canonical data files.
6. Do not duplicate release databases inside page JavaScript.
7. Never infer streaming destinations from similar titles.
8. Treat similarly named releases as distinct unless the catalog explicitly groups them.
9. Never remove standalone singles while repairing album rendering.
10. Never add Spotify or Apple Music to a SoundCloud-only release.
11. Never shrink `LS_HEADPHONES.png` simply because another layout element is inconvenient.
12. Do not move global behavior into page-specific files without a clear ownership reason.
13. Do not claim a deployment or browser verification occurred unless it actually occurred.

---

# Git / Deployment QA

Before committing a website change:

1. Inspect the current state of `main`.
2. Fetch the complete files relevant to the change.
3. Confirm the current blob SHA before replacing an existing file.
4. Review the complete proposed diff.
5. Confirm unrelated files were not changed.
6. Validate JSON syntax for `release-catalog.json`.
7. Validate JavaScript syntax for changed scripts.
8. Validate HTML structure for changed pages.
9. Check for duplicate global shell implementations.
10. Confirm exactly one active rendered header, menu, and footer.
11. Confirm the headphone artwork remains the Special Access Easter egg.
12. Confirm the headphone artwork remains approximately `112px` desktop and `94px` mobile.
13. Confirm albums, EPs, and standalone singles all render.
14. Confirm catalog order remains the default archive order.
15. Confirm sorting does not mutate canonical catalog data.
16. Confirm `Touching to the North` remains SoundCloud-only.
17. Confirm no Touching track inherits the standalone Spotify URL.
18. Confirm no Touching track receives Apple Music through a generic fallback.
19. Confirm `Signal Light Sermon (Remastered 2026)` remains a separate standalone release.
20. Confirm artwork paths resolve correctly.
21. Confirm `THE CALM` remains global.
22. Confirm Back To Top remains global.
23. Confirm mobile and narrow-mobile layouts.
24. Verify the actual production URL after deployment when browser verification is available.
25. Only report a deployment or browser test as verified if it was actually performed.

A successful Vercel build or `READY` deployment status is not proof that visual or functional behavior is correct. Production verification must distinguish between **build success** and **actual site behavior**.

---

# Known Architectural Boundaries

### Global shell owns

- header
- primary navigation
- menu drawer
- Socials accordion
- Stream accordion
- footer
- Back To Top
- THE CALM
- shared metadata
- shared responsive shell behavior

### Homepage owns

- homepage-specific presentation
- homepage-specific content behavior
- homepage-specific enrichment through `site-polish.js`

### Release catalog owns

- release identity
- release ordering
- grouping
- track identity
- artwork mapping
- streaming destinations
- SoundCloud sets
- special release distinctions

### Release archive owns

- catalog loading
- release card rendering
- track row rendering
- sorting/filtering
- applying release-specific link rules

This ownership model prevents one page from silently rewriting another system's data.

---

# Repository Safety Rules

Do not:

- create duplicate headers
- create duplicate menus
- create duplicate footers
- create duplicate audio controls
- hard-code a second release catalog
- delete standalone singles to simplify album rendering
- copy streaming URLs between similarly titled releases
- add Spotify to the Touching to the North album version of `Signal Light Sermon`
- add Apple Music to the Touching to the North album version of `Signal Light Sermon`
- replace exact artwork paths with guesses
- claim browser verification without actually checking the production page
- claim deployment success without evidence

Do:

- centralize global behavior
- keep release data canonical
- preserve exact release identity
- use explicit special-case rules where release ownership requires them
- prefer deterministic rendering over duplicated hard-coded markup
- make the smallest correct change
- verify the final Git state before reporting completion

---

# Current Core Principle

> **Global behavior belongs in the global shell.**
>
> **Release data belongs in `release-catalog.json`.**
>
> **Release presentation belongs in `releases.html`.**
>
> **Homepage-specific behavior belongs in the homepage system.**
>
> **Similar titles are not interchangeable releases.**
>
> **Touching to the North is SoundCloud-only.**
>
> **Signal Light Sermon (Remastered 2026) is a separate standalone release.**

This architecture should be preserved whenever the site is repaired, extended, redesigned, or refactored.
