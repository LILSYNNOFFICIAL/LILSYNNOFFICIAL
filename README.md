<div align="center">

# ✦ LIL SYNN

### THE OFFICIAL DIGITAL HOME OF LIL SYNN

**A cinematic, browser-native artist platform engineered as one unified digital experience.**

`MUSIC` · `RELEASES` · `ARCHIVE` · `VISUALS` · `UNIVERSE` · `VIDEOS` · `ABOUT` · `SPECIAL ACCESS`

</div>

---

## ◈ Executive Summary

This repository is the production source of truth for the official LIL SYNN website. It is intentionally lightweight and browser-native: static HTML, centralized CSS, deterministic JavaScript modules, canonical JSON, media assets, API endpoints, and GitHub automation work together as one system.

### Architectural doctrine

> **One shell. One source of truth. Explicit ownership. Deterministic rendering. Root-cause fixes. Real verification.**

The site is a music-first gateway to official streaming and video destinations, not a replacement for them.

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
  latest-releases.js
  latest-videos.js
  signal-engine.js
       ↓
EXPERIENCES
  releases.html
  archive.html
  release.html
  gallery.html
  universe.html
  special_access.html
       ↓
PRESENTATION
  HTML + CSS + assets
```

The release catalog remains the canonical release identity and ordering source. Feature pages derive from it rather than maintaining competing release databases.

---

# 👑 Global Shell

`site-global.js` owns the global header, navigation drawer, footer, THE CALM control, Back To Top, metadata normalization, About controls, keyboard/Escape behavior, body scroll locking, global `LS.png` top artwork, skip navigation, global MusicGroup structured data, Signal loading, latest-release loading, random music loading, and the LIL SYNN easter-egg layer.

### Header contract

- Desktop header: `150px`
- Mobile header: `118px`
- `LS_LOGO.png` independently centered
- THE CALM lower-left
- Menu right-aligned
- `LS.png` starts exactly at the header boundary
- `LS_HEADPHONES.png` is footer-only and links to Special Access
- Releases, Archive, Visuals, and Universe are available from the hamburger navigation

---

# 💿 Canonical Release Architecture

`release-catalog.json` is the single source of truth for release order, release identity, type, track sets, streaming destinations, restrictions, and SoundCloud sets.

A release can be addressed directly:

```text
/release.html?id=Hello%20Goodbye
```

A track can also be addressed directly:

```text
/release.html?id=It's%20You
```

Track requests are resolved to their canonical album/EP set and the selected track is highlighted instead of creating duplicate release identities.

---

# 🚀 Phase 1 — Foundation — COMPLETE

Completed:

- Dynamic release engine
- Global shell
- Signal/transmission foundation
- Site Doctor foundation
- Global motion system
- Reduced-motion and low-power behavior
- Cinematic reveal behavior

---

# 🚀 Phase 2 — Music Discovery + Conversion — COMPLETE

Completed:

- Release-to-release navigation
- Related release recommendations
- Streaming-first calls to action
- Spotify / Apple Music / SoundCloud / YouTube pathways
- Release detail experiences
- Homepage catalog discovery
- Randomized music discovery
- Latest-release feed derived from the canonical catalog

### Streaming law

```text
DISCOVER → ENGAGE → OFFICIAL PLATFORM → STREAM / WATCH
```

---

# 🚀 Phase 3 — LIL SYNN UNIVERSE — COMPLETE

The previously planned Universe layer is now implemented as real functionality, not just documentation.

Completed:

- `universe.html`
- Catalog timeline
- Release-to-Universe navigation
- Transmission history
- Signal history sourced from `transmissions.json`
- Special Access expansion
- Release-specific atmosphere classes
- Header logo easter egg
- Keyboard easter egg sequence
- Connected Archive / Visuals / Release pathways

### Design law

> **Music, visuals, transmissions, and story should feel connected without requiring an AI chatbot or visitor profiling.**

---

# 🚀 Phase 4 — Visual Gallery — COMPLETE

`gallery.html` is the visual archive.

Completed:

- Existing release artwork
- Album / EP / Single filtering
- Fullscreen artwork viewer
- Previous / next controls
- Keyboard navigation
- Escape-to-close
- Mobile swipe navigation
- Release associations through the canonical catalog
- Catalog-order visual timeline
- Lazy-loaded artwork
- Reduced-motion-safe transitions

### Design law

> **The visual world should be explorable without creating a second artwork database.**

---

# 🚀 Phase 5 — Absolute Polish + Production Integrity — COMPLETE

Completed:

- SEO metadata
- Canonical URLs
- Open Graph release metadata
- MusicGroup / release structured data
- Skip navigation
- Keyboard accessibility
- Reduced motion
- Low-power handling
- Responsive/mobile refinement
- Asset validation
- JavaScript syntax validation
- Inline page-script validation
- Duplicate shell detection
- Duplicate metadata detection
- Catalog integrity checks
- Stale asset detection
- Cache/version consistency
- Dead-module cleanup
- Root-cause QA hardening

### Site Doctor

```text
.github/workflows/site-doctor.yml
          ↓
Node 22
          ↓
node tools/site-doctor.mjs
```

The Site Doctor now validates both standalone JavaScript modules and inline page JavaScript.

### Design law

> **Catch structural regressions at the source before they reach the visitor.**

---

# 📚 Releases vs Archive

These are intentionally different systems and both remain.

### Releases

`/releases.html`

The curated, visual catalog. It presents albums, EPs, and singles in canonical catalog order with larger artwork, tracklists, and direct release experiences.

### Archive Explorer

`/archive.html`

The utility discovery layer. It provides search, type filters, platform filters, sorting, release-set artwork, track matching, and shareable query state.

A track search in the Archive routes to the parent album/EP release experience rather than inventing a standalone release.

> **Releases = presentation. Archive = exploration.**

---

# 🖼️ Visual System

`gallery.html` consumes the same release catalog and global artwork mapping used by the rest of the site.

The gallery does not create a duplicate visual database.

---

# 📡 Transmission System

`transmissions.json` is the canonical Signal message source.

The system powers:

- Homepage Signal
- Signal Oracle
- Universe transmission history
- Archive transmission discovery

Transmission copy must never claim a release is the latest unless the canonical release feed confirms it.

---

# 🎧 Music Discovery

The persistent personal/native music player was intentionally **not** added to this upgrade.

The site remains focused on sending visitors to official listening platforms while providing deterministic discovery tools such as:

- Latest releases
- Randomize
- Release experiences
- Archive Explorer
- Spotify embed
- Official streaming CTAs

THE CALM remains a separate ambient/environment layer.

---

# 🎬 Global Motion

The active global background is:

```text
/assets/mov/LS_BG_STARS.webm
```

The background is inserted once by `script.js` and layered behind page content with an explicit content stacking layer. Reduced-motion and low-power states reduce visual intensity rather than removing the entire shell.

---

# 🌙 THE CALM

THE CALM is globally owned by the shell and remains separate from foreground music discovery.

Primary source:

```text
/assets/other/sound/Background.mp3
```

Foreground video playback pauses/mutes THE CALM to avoid competing audio ownership.

---

# 🧠 DOM Ownership

```text
HTML PAGE
   ↓
site-global.js
   ├── shell
   ├── navigation
   ├── global top art
   ├── shared controls
   ├── latest releases
   ├── random discovery
   └── shared behavior
          ↓
     feature modules
       ├── Music
       ├── Videos
       ├── Signal
       ├── Releases
       ├── Archive
       ├── Release Detail
       ├── Visual Gallery
       ├── Universe
       └── Special Access
```

When a duplicate appears, identify the canonical owner before adding another cleanup layer.

---

# 🐛 QA Hardening Log

Previously identified structural defects corrected include:

- MutationObserver feedback loops
- Incorrect Somewhere In-Between artwork
- Incorrect `LG_BG_STARS.webm` reference
- Undefined `--glow`
- Legacy Special Access header duplication
- Special Access archive-player regression
- 404 shell/alignment mismatch
- Duplicate global stylesheet injection
- Accessibility skip-navigation behavior
- Release SEO/structured-data identity
- Signal caching behavior
- Duplicate metadata injection
- Privacy / Terms shell regressions
- Self-triggering normalization workflow
- Duplicate homepage randomizer ownership
- Retired `site-polish.js`
- Homepage hardcoded stale latest release
- Releases-page ordering race
- Releases-page oversized single artwork
- Track URLs failing to resolve to parent release sets
- Archive lacking release-set artwork/context
- Global WebM hidden behind the page stacking context
- Missing hamburger discovery routes
- Missing Universe and Visual Gallery systems

---

# 🩺 Site Doctor Coverage

Site Doctor checks:

- Global shell presence
- Duplicate global shell assets
- Duplicate meta descriptions
- Duplicate canonical links
- Missing local references
- Missing `<main>` landmarks as warnings
- Legacy shell markers
- Release catalog JSON validity
- Duplicate catalog order entries
- Group track integrity
- Standalone JavaScript syntax
- Inline HTML JavaScript syntax
- Undefined CSS variables
- Stale background references
- Required global assets
- Required discovery routes/modules
- Transmission JSON validity

It is deterministic repository QA. It does not pretend to replace real browser verification.

---

# 🧪 Verification Matrix

### Global shell

- Header starts at viewport `0`
- Logo remains independently centered
- THE CALM remains lower-left
- Menu remains right-aligned
- Releases and Archive are both navigable
- Visuals and Universe are both navigable
- `LS.png` begins at the header boundary
- No duplicate header/footer
- Special Access remains in footer
- Skip navigation is keyboard-visible

### Release system

- Catalog order preserved
- Album/EP track sets preserved
- Track URL resolves to parent release set
- Selected track highlighted
- Artwork resolves
- Streaming destinations remain canonical

### Archive

- Search release
- Search track
- Show parent release set
- Album/EP/Single filters
- Platform filters
- Shareable query state

### Visuals

- Fullscreen viewer
- Previous/next
- Keyboard controls
- Mobile swipe
- Reduced-motion behavior

### Universe

- Release timeline
- Transmission history
- Release / Archive / Visual pathways
- Easter egg layer

### Production

- Site Doctor passes
- Deployment completes
- Production URL responds
- Real browser behavior is checked
- Cache behavior is checked
- Shared consumers are checked for regressions

---

# 🧬 Cache & Versioning

Shared shell assets use intentional version query parameters:

```html
<script src="/site-global.js?v=20260914"></script>
<link id="site-global-css" rel="stylesheet" href="/site-global.css?v=20260914">
```

Version changes should correspond to meaningful shared-asset changes.

---

# 🚀 Deployment Topology

```text
GitHub main
     ↓
GitHub Actions / Site Doctor
     ↓
Vercel
     ↓
lilsynn.com
```

Important:

```text
SOURCE ≠ CI ≠ DEPLOYMENT ≠ CACHE ≠ RUNTIME DOM
```

A Vercel build-rate-limit failure is a deployment-state problem, not automatically a source-code failure.

---

# 🗺 Repository Topology

```text
LILSYNNOFFICIAL/
├── index.html
├── releases.html
├── archive.html
├── release.html
├── gallery.html
├── universe.html
├── 404.html
├── privacy.html
├── terms.html
├── special_access.html
├── site-global.js
├── site-global.css
├── script.js
├── music-random.js
├── latest-releases.js
├── latest-videos.js
├── signal-engine.js
├── release-catalog.json
├── latest-videos.json
├── transmissions.json
├── sitemap.xml
├── tools/site-doctor.mjs
├── .github/workflows/site-doctor.yml
├── api/
└── assets/
```

---

# 👑 Maintainer Doctrine

This repository is production infrastructure for the LIL SYNN digital universe.

```text
ONE OWNER
ONE SOURCE OF TRUTH
ONE GLOBAL EXPERIENCE
ZERO DUPLICATE SYSTEMS
ROOT CAUSE OVER PATCHES
STREAMING DESTINATIONS STAY PRIMARY
NO PERSONALIZED CHATBOT REQUIRED
VERIFY THE REAL RUNTIME
UPDATE THE README WHEN A PHASE IS DONE
```

<div align="center">

## ✦ LIL SYNN

**DARK SOUND. RAW EMOTION. NO LIMITS.**

</div>
