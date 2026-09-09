<div align="center">

# ✦ LIL SYNN

### THE OFFICIAL DIGITAL HOME OF LIL SYNN

**A cinematic, browser-native artist platform engineered as one unified digital experience.**

`MUSIC` · `RELEASES` · `VIDEOS` · `ABOUT` · `MERCH` · `LYRICS` · `CONTACT`

</div>

---

## ◈ Executive Summary

This repository is the production source of truth for the official LIL SYNN website.

The site is intentionally lightweight and browser-native. Static HTML, centralized CSS, JavaScript modules, structured JSON, media assets, API endpoints, and GitHub automation work together as one system.

### Architectural doctrine

> **One shell. One source of truth. Explicit ownership. Deterministic rendering. Root-cause fixes. Real verification.**

The objective is maximum control over a fast, cinematic, music-first artist experience without unnecessary framework complexity.

---

# 🧬 System Architecture

```text
DATA
  release-catalog.json
  latest-videos.json
  transmissions.json
       ↓
BEHAVIOR
  site-global.js
  script.js
  music-random.js
  latest-videos.js
  signal-engine.js
       ↓
PRESENTATION
  HTML + CSS + assets
       ↓
EVERY PAGE / DOM
```

Presentation consumes canonical data. Behavior derives views from that data. Presentation code must not silently redefine canonical release truth.

---

# 👑 Global Shell

`site-global.js` is the single authoritative owner of the shared site shell.

It owns the global header, navigation drawer, footer, THE CALM, Back To Top, shared metadata normalization, About controls, keyboard/Escape behavior, body scroll locking, legacy-shell cleanup, global `LS.png` top artwork, motion coordination, Signal loading, skip navigation, and global MusicGroup structured data.

The shell is idempotent. Re-running initialization must not create duplicate global components.

## Header geometry contract

```text
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                    LS_LOGO.png                                │
│                    TRUE CENTER AXIS                           │
│                                                               │
│ THE CALM                                           ☰ MENU     │
└───────────────────────────────────────────────────────────────┘
                              ↓
                         LS.png
                              ↓
                        page content
```

Current geometry:

- Desktop header: `150px`
- Mobile header: `118px`
- Desktop logo: approximately `440px × 138px`
- Mobile logo: approximately `300px × 100px`
- Header begins at viewport position `0`
- Logo is independently centered
- THE CALM is independently anchored lower-left
- Menu is independently anchored right
- `LS.png` begins at the header boundary
- `LS_HEADPHONES.png` is footer-only and links to `/special_access.html`

---

# 💿 Canonical Release Architecture

`release-catalog.json` is the single source of truth for release identity and ordering.

It controls release order, release identity, album/EP/single classification, track arrays and order, streaming destinations, release restrictions, and SoundCloud sets.

If release order changes, change the catalog. If track order changes, change the catalog. If a streaming destination changes, change the catalog.

Release identity is more important than loose title matching. Remastered variants and overlapping names must remain distinct.

`Touching to the North` is intentionally SoundCloud-only. Generic fallback logic must never invent Spotify or Apple Music destinations for it.

---

# 📄 Release Detail Experience

`release.html` is the dynamic release-detail route.

```text
/release.html?id=Hello%20Goodbye
```

It resolves the requested release against `release-catalog.json` and derives artwork, release type, tracklist, official streaming destinations, previous/next releases, and related archive recommendations.

Phase 1 established the dynamic release experience. Phase 2 expanded it into a streaming-first discovery path. Phase 3 hardened its SEO and structured-data identity.

---

# 🚀 Phase 2 — Discovery + Streaming Conversion — COMPLETE

Phase 2 established release-to-release discovery and streaming conversion.

Capabilities:

- Previous/next release routing
- Related archive recommendations
- Return to the complete release archive
- Music and Latest Videos pathways
- Strong streaming-first calls to action
- Dynamic release metadata
- Signal/transmission discovery
- Non-personalized Signal Oracle
- Spotify, Apple Music, SoundCloud, and YouTube pathways
- Cinematic reveal behavior
- Reduced-motion handling
- Save-Data / slow-connection handling

### Streaming conversion law

```text
DISCOVER → ENGAGE → CHOOSE MUSIC / VIDEO → OFFICIAL PLATFORM → STREAM / WATCH
```

The website is a gateway to the streaming ecosystem, not a replacement for it. No personal profiling layer and no proprietary player replacing official streaming destinations.

Completion commit:

```text
7cd9537f0eae22e5d650f130746cea32446f747f
```

---

# 🚀 Phase 3 — Discoverability + Accessibility + Performance — COMPLETE

Phase 3 made the existing experience easier to discover, navigate, and run.

### Discoverability

- Global `MusicGroup` JSON-LD
- Release-specific `MusicAlbum` / `MusicRelease` structured data
- Dynamic release canonical URLs
- Release-specific Open Graph artwork
- Release-specific titles and descriptions

### Accessibility

- Global keyboard-visible Skip to main content
- Automatic main-content target creation where needed
- Existing focus, keyboard, Escape, and reduced-motion behavior preserved

### Performance

- Signal transmissions use normal browser caching
- Low-power and Save-Data behavior remains active
- Lazy media and thumbnail-first strategies remain intact
- No heavy framework dependency introduced

Phase 3 completion commits:

```text
31fe7ae96e0d0f7c281484c40e947827eb4fac0e  global accessibility + structured data
 a0dbff339edd103298c0c8100f03b9fa87bc2c24  release SEO metadata + structured data
4ddb5b2555c1b080f158e2b678740aa5251b05d6  signal transmission caching
 ef75807166f8de78b2adc99b3835a0c107b1a30a  skip navigation refinement
```

Design law:

> **Make the existing experience easier to understand, easier to navigate, and cheaper for the browser to run.**

---

# 🚀 Phase 4 — Archive Intelligence + Catalog Exploration — COMPLETE

Phase 4 turns the release archive into an actual exploration surface without creating a second release database.

## Archive Explorer

`archive.html` is a searchable, shareable archive exploration route.

Capabilities:

- Search by release title
- Search by track title
- Filter by Album / EP / Single
- Filter by Spotify / Apple Music / SoundCloud availability
- Catalog order
- A → Z order
- Z → A order
- Live result counts
- Shareable URL state using `q`, `type`, `platform`, and `sort`
- Keyboard-friendly native controls
- Reduced-motion-safe interaction
- Every result resolves to the canonical `/release.html?id=...` experience

The explorer consumes `release-catalog.json` directly. It does not maintain duplicate release metadata.

## Signal integration

`transmissions.json` now exposes the Archive Explorer as `TRANSMISSION 004`, making the new discovery layer reachable from the existing Signal system.

### Phase 4 design law

> **Make the archive discoverable without fragmenting the source of truth.**

Completion commits:

```text
fa8b7a45bf626a90bdafc5619851528cbfe3170a  archive explorer
4d467030d71514fc7d7db9251fc43ad9b1956775  Signal Archive Explorer transmission
```

---

# 📺 Latest Videos

Latest Videos uses resolved YouTube data together with canonical release ordering.

```text
YouTube source
      ↓
latest-videos.json
      ↓
latest-videos.js
      ↓
release-catalog.json
      ↓
canonical release order
      ↓
Latest Videos UI
```

The renderer owns video deduplication, ID/title handling, release identity matching, canonical ordering, thumbnail-first playback, and privacy-enhanced YouTube playback.

> **YouTube supplies video data. The release catalog controls release ordering.**

---

# 🎬 Global Motion

The active global background is:

```text
/assets/mov/LS_BG_STARS.webm
```

The media pipeline is:

```text
WebM files → /assets/mov/index.json → script.js → global fixed background → contrast layer → page content
```

Stale `LG_BG_STARS.webm` references and the competing `BG_ANI.webm` implementation were removed from the active architecture.

---

# 🌙 THE CALM

THE CALM is globally owned by the shell.

Primary source:

```text
/assets/other/sound/Background.mp3
```

The shell coordinates ambient audio with foreground media so separate pages and media systems do not fight over playback.

---

# 🧠 DOM Ownership

```text
HTML PAGE
   ↓
site-global.js
   ├── shell
   ├── global top art
   ├── shared controls
   └── shared behavior
          ↓
     feature modules
       ├── Music
       ├── Videos
       ├── Signal
       ├── Archive Explorer
       └── Release Detail
```

When a duplicate appears, identify who created it before adding another cleanup rule. Defensive normalization is useful. Unbounded cleanup logic is not.

---

# 🐛 QA Hardening Log

The engineering audit found and fixed real defects including:

- MutationObserver feedback loops in release and video ordering
- Incorrect `Somewhere In-Between` artwork mapping
- Incorrect `LG_BG_STARS.webm` background reference
- Undefined `var(--glow)` reference
- Legacy Special Access header duplication
- Special Access archive-player regression
- 404 shell/alignment mismatch
- Duplicate global stylesheet injection
- Accessibility skip-navigation behavior
- Release SEO/structured-data identity
- Signal caching behavior

The Special Access archive player retains track cards, queue controls, previous/play/next, seeking, volume, auto-next-track, error handling, and keyboard activation.

---

# 🩺 Site Doctor

`tools/site-doctor.mjs` is the repository-level structural QA tool.

It checks global shell presence, duplicate global CSS, local asset references, legacy shell markers, release catalog validity, duplicate catalog order entries, JavaScript syntax, stale CSS/background references, required assets, and `transmissions.json` validity.

Workflow:

```text
.github/workflows/site-doctor.yml
          ↓
Node 22
          ↓
node tools/site-doctor.mjs
```

Site Doctor is a structural guardrail. It does not replace real browser verification.

---

# 🧪 Verification Matrix

### Global shell

- Header starts at viewport `0`
- Logo remains independently centered
- THE CALM remains lower-left
- Menu remains right-aligned
- `LS.png` begins at the header boundary
- No duplicate header/footer
- Special Access remains in footer
- Skip navigation is available to keyboard users

### Data

- Catalog JSON parses
- Catalog order is preserved
- Track order is preserved
- Release identities remain distinct
- Streaming restrictions remain intact
- Artwork mappings resolve to real assets

### Runtime

- Observers do not recursively trigger themselves
- Async observers reconnect correctly
- Shell initialization is idempotent
- Global motion has one owner
- THE CALM has one owner
- Signal respects low-power settings
- Signal transmissions can use browser caching
- Archive Explorer resolves through canonical release detail routes

### Responsive

- Desktop
- Laptop
- Tablet
- Mobile
- Narrow mobile
- No horizontal overflow
- Header controls do not collide

### Accessibility

- Keyboard navigation
- Skip navigation
- Visible focus
- Meaningful labels
- Correct ARIA state
- Escape-to-close
- Body scroll locking
- Reduced-motion support

### SEO

- Canonical URLs
- Release-specific canonical identity
- Meta descriptions
- Open Graph metadata
- Release artwork metadata
- MusicGroup structured data
- Release structured data
- Crawlable page structure
- Sitemap coverage

### Production

- CI passes
- Deployment completes
- Production URL responds
- Real browser behavior is checked
- Cache behavior is checked
- Shared consumers are checked for regressions

---

# ⚙️ Performance Philosophy

The site favors small deterministic browser modules over unnecessary framework overhead.

Priorities:

- One global shell
- Minimal duplicate DOM
- Minimal redundant network work
- Lazy media where appropriate
- Thumbnail-first video playback
- Muted inline background video
- Responsive media sizing
- Explicit data manifests
- Browser caching where safe
- Reduced-motion and low-power handling

---

# ♿ Accessibility Philosophy

Accessibility is architectural.

Preserve semantic controls, keyboard navigation, skip navigation, visible focus, meaningful labels, accurate ARIA state, Escape behavior, focus-friendly navigation, reduced-motion support, and responsive layouts without unnecessary overflow.

Every new interactive component should work without requiring a pointer.

---

# 🔎 SEO & Discoverability

The production system supports canonical URLs, meta descriptions, Open Graph metadata, release-specific canonical URLs, release-specific Open Graph artwork, global MusicGroup structured data, release MusicAlbum/MusicRelease structured data, crawlable page structure, sitemap coverage, and dedicated 404 handling.

Page-specific identity remains the responsibility of each page while the global shell handles shared normalization.

---

# 🧬 Cache & Versioning

Shared assets may use intentional version query parameters:

```html
<script src="/site-global.js?v=YYYYMMDD"></script>
<link id="site-global-css" rel="stylesheet" href="/site-global.css?v=YYYYMMDD">
```

Do not increment versions randomly. Cache invalidation should correspond to meaningful shared-asset changes.

Dynamic Signal transmissions use normal browser caching because the data is small, non-personalized publishing content.

---

# 🚀 Deployment Topology

```text
Local / Codex changes
        ↓
GitHub main
        ↓
GitHub Actions
        ↓
Validation / generated assets
        ↓
Vercel
        ↓
lilsynn.com
```

Important state distinction:

```text
SOURCE ≠ CI ≠ DEPLOYMENT ≠ CACHE ≠ RUNTIME DOM
```

A Vercel rate limit or deployment cap is a deployment-state problem, not automatically a source-code failure. Production visual verification must wait until deployment is available.

---

# 🧹 Root-Cause Engineering

Preferred debugging sequence:

```text
OBSERVE
   ↓
REPRODUCE
   ↓
IDENTIFY OWNER
   ↓
TRACE DATA / DOM FLOW
   ↓
FIND ROOT CAUSE
   ↓
FIX CANONICAL OWNER
   ↓
REMOVE OBSOLETE WORKAROUNDS
   ↓
VERIFY DEPENDENTS
   ↓
CI
   ↓
DEPLOY
   ↓
REAL BROWSER CHECK
```

Never solve a structural problem by stacking arbitrary CSS or duplicate systems on top of it.

---

# 📋 Production Change Protocol

1. Inspect the current implementation.
2. Identify ownership of the behavior.
3. Trace dependencies and shared consumers.
4. Change the canonical owner.
5. Remove obsolete competing behavior.
6. Run focused verification.
7. Run broader repository validation.
8. Deploy through the production pipeline.
9. Check the real runtime.
10. Update the README when a phase is completed.

---

# 🏆 Definition of Done

A production change is DONE only when applicable conditions are satisfied:

```text
[✓] Correct owner changed
[✓] Canonical data preserved
[✓] No competing implementation introduced
[✓] Responsive behavior checked
[✓] Accessibility preserved
[✓] Generated assets current
[✓] Structural validation passed
[✓] Deployment completed
[✓] Production runtime checked
[✓] No regression in shared consumers
```

A change that exists only in GitHub is **implemented**, not necessarily **production-verified**.

---

# 🗺 Repository Topology

```text
LILSYNNOFFICIAL/
│
├── index.html
├── releases.html
├── archive.html
├── release.html
├── 404.html
├── privacy.html
├── terms.html
├── special_access.html
│
├── site-global.js
├── site-global.css
├── script.js
├── signal-engine.js
├── site-polish.js
├── music-random.js
├── latest-videos.js
│
├── release-catalog.json
├── latest-videos.json
├── transmissions.json
│
├── tools/
│   └── site-doctor.mjs
│
├── api/
│   ├── apple-art.js
│   ├── art.js
│   ├── latest-youtube-releases.js
│   ├── spotify-art.js
│   ├── youtube.js
│   └── ...
│
├── assets/
│   ├── img/LS.png
│   ├── images/icons/LS_LOGO.png
│   ├── images/icons/LS_HEADPHONES.png
│   ├── images/icons/UP_ARROWS.png
│   ├── images/icons/album_art/
│   ├── mov/LS_BG_STARS.webm
│   └── other/sound/Background.mp3
│
└── .github/workflows/
    ├── fix-homepage.yml
    ├── update-latest-videos.yml
    └── site-doctor.yml
```

---

# 🏆 Phase Roadmap

```text
PHASE 1  Dynamic Release Experience                 COMPLETE
PHASE 2  Discovery + Streaming Conversion           COMPLETE
PHASE 3  Discoverability + Accessibility + Perf     COMPLETE
PHASE 4  Archive Intelligence + Exploration         COMPLETE
PHASE 5  NEXT
```

Phase 5 should build on the canonical catalog and archive graph rather than introduce another content source.

---

# 👑 Maintainer Doctrine

This repository is production infrastructure for the LIL SYNN digital universe.

The standard is not:

> "Does this patch make the page look right?"

The standard is:

> **Does the architecture now express the correct truth cleanly, globally, and predictably?**

When in doubt:

```text
ONE OWNER
ONE SOURCE OF TRUTH
ONE GLOBAL EXPERIENCE
ZERO DUPLICATE SYSTEMS
ROOT CAUSE OVER PATCHES
STREAMING DESTINATIONS STAY PRIMARY
VERIFY THE REAL RUNTIME
UPDATE THE README WHEN A PHASE IS DONE
```

---

<div align="center">

## ✦ LIL SYNN

**DARK SOUND. RAW EMOTION. NO LIMITS.**

Production source for the LIL SYNN digital universe.

</div>
