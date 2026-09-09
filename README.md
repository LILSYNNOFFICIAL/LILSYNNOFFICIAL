<div align="center">

# ✦ LIL SYNN

### THE OFFICIAL DIGITAL HOME OF LIL SYNN

**A cinematic, browser-native artist platform engineered as one unified digital experience.**

`MUSIC` · `RELEASES` · `ARCHIVE` · `VISUALS` · `UNIVERSE` · `VIDEOS` · `ABOUT` · `SPECIAL ACCESS`

</div>

---

## ◈ Executive Summary

This repository is the production source of truth for the official LIL SYNN website at **lilsynn.com**. It is a browser-native artist platform built from static HTML, centralized CSS, deterministic JavaScript modules, canonical JSON data, media assets, API endpoints, and GitHub automation.

The site is intentionally music-first. It creates a unified LIL SYNN experience while keeping official streaming and video platforms as the destination for listening and watching.

### Architectural doctrine

> **One shell. One source of truth. Explicit ownership. Deterministic rendering. Root-cause fixes. Real verification.**

---

# 🧬 System Architecture

```text
DATA
  release-catalog.json
  latest-videos.json
  transmissions.json
       ↓
GLOBAL / BEHAVIOR
  site-global.js
  site-global.css
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
  HTML + CSS + media assets
```

The release catalog is the canonical identity and ordering layer. Feature pages consume that source rather than maintaining competing release lists.

---

# 👑 Global Shell

`site-global.js` owns the shared site shell and loads the shared feature modules.

It provides:

- Universal header
- Universal footer
- Hamburger navigation
- THE CALM control
- Back To Top
- About controls
- Escape / keyboard behavior
- Body scroll locking
- Global `LS.png` top artwork
- Skip navigation
- Global MusicGroup structured data
- Signal loading
- Latest Releases loading
- Random music loading
- Global easter-egg behavior

### Header contract

- Desktop header: `150px`
- Mobile header: `118px`
- `LS_LOGO.png` independently centered
- THE CALM lower-left
- Menu right-aligned
- `LS.png` begins at the exact header boundary
- `LS_HEADPHONES.png` is footer-only and links to Special Access
- Releases, Archive, Visuals, and Universe are available through the hamburger menu
- No duplicate page-specific global header is required

### Easter eggs

The global shell contains deterministic discovery behavior:

- Five logo clicks trigger an unknown-frequency Signal
- Keyboard sequence `L I L S Y N` triggers the same Signal layer

---

# 💿 Canonical Release Architecture

`release-catalog.json` is the single source of truth for:

- Release order
- Release identity
- Release type
- Album / EP track sets
- Track identity
- Spotify destinations
- Apple Music destinations
- SoundCloud sets and tracks
- Platform availability restrictions

The current canonical catalog begins with the newest entries, including:

```text
Never Known
HOME (ACOUSTIC VERSION)
I DID IT AGAIN
Rescue You (Acoustic Version)
Somewhere In-Between
Black Glass
Hello Goodbye
...
```

This means the homepage Latest Releases section is not hardcoded to Hello Goodbye. It derives its three cards from the first three entries in the canonical catalog.

### Release URLs

A release can be addressed directly:

```text
/release.html?id=Hello%20Goodbye
```

A track can also be addressed directly:

```text
/release.html?id=It's%20You
```

Track requests resolve to their canonical parent release. Album/EP tracks are therefore presented inside the correct release set rather than being treated as unrelated releases.

---

# 🚀 Phase 1 — Foundation — COMPLETE

Completed:

- Dynamic release engine
- Global shell
- Signal / transmission foundation
- Site Doctor foundation
- Global motion system
- Reduced-motion handling
- Low-power handling
- Cinematic reveal behavior
- Shared ownership rules
- Production-oriented shell architecture

---

# 🚀 Phase 2 — Music Discovery + Conversion — COMPLETE

Completed:

- Canonical release discovery
- Release-to-release navigation
- Related releases
- Streaming-first calls to action
- Spotify pathways
- Apple Music pathways
- SoundCloud pathways
- YouTube discovery
- Release detail experiences
- Homepage latest-release discovery
- Deterministic Randomize music discovery
- Release cards linked to individual release experiences

### Homepage Latest Releases

`latest-releases.js` dynamically reads `release-catalog.json` and renders exactly the top three canonical catalog entries into the homepage Latest Releases section.

```text
release-catalog.json
        ↓
  catalog.order
        ↓
      top 3
        ↓
LATEST RELEASES
```

This prevents stale hardcoded releases from becoming the homepage's definition of "latest."

### Randomize

`music-random.js` is the dedicated Randomize / discovery module. Its ownership is centralized so `script.js` no longer competes with it through a second randomizer implementation.

### Streaming law

```text
DISCOVER → ENGAGE → OFFICIAL PLATFORM → STREAM / WATCH
```

The persistent personal/native music player was intentionally excluded from this upgrade.

---

# 🚀 Phase 3 — LIL SYNN UNIVERSE — COMPLETE

The Universe is implemented as a real site experience, not merely a concept page.

Completed:

- `universe.html`
- Catalog timeline
- Release-to-Universe navigation
- Transmission history
- `transmissions.json` integration
- Signal / Oracle layer
- Special Access expansion
- Release-specific visual atmosphere hooks
- Header logo easter egg
- Keyboard easter egg sequence
- Connected Release / Archive / Visual pathways

### Design law

> **Music, visuals, transmissions, and story should feel connected without requiring visitor profiling or a personalized chatbot.**

---

# 🚀 Phase 4 — Visual Gallery — COMPLETE

`gallery.html` is the dedicated visual archive.

Completed:

- Existing LIL SYNN artwork
- Album filtering
- EP filtering
- Single filtering
- Fullscreen artwork viewer
- Previous / next controls
- Keyboard navigation
- Escape-to-close
- Mobile swipe navigation
- Release associations through the canonical catalog
- Catalog-order visual timeline
- Lazy-loaded artwork
- Reduced-motion-safe transitions

The gallery intentionally consumes the existing artwork mapping and release catalog instead of creating another visual database.

---

# 🚀 Phase 5 — Absolute Polish + Production Integrity — COMPLETE

Phase 5 is the final planned phase. **There is no Phase 6 in this project roadmap.**

Completed:

- SEO metadata
- Canonical URLs
- Open Graph metadata
- MusicGroup / release structured data
- Skip navigation
- Keyboard accessibility
- Reduced motion
- Low-power behavior
- Responsive/mobile refinement
- Global header alignment
- Global footer consistency
- Asset validation
- JavaScript syntax validation
- Inline page-script validation
- Duplicate shell detection
- Duplicate metadata detection
- Release catalog integrity checks
- Stale asset detection
- Cache/version consistency
- Dead-code cleanup
- Root-cause QA hardening
- Privacy / Terms shell normalization
- 404 shell normalization
- Homepage latest-release normalization
- Releases-page ordering normalization
- Oversized single-artwork constraints
- Track-to-parent-release resolution
- Archive release-set artwork/context
- Visual Gallery
- Universe navigation
- Hamburger discovery routes

### Site Doctor

```text
.github/workflows/site-doctor.yml
          ↓
Node 22
          ↓
node tools/site-doctor.mjs
```

The Site Doctor is deterministic repository QA. It checks both standalone JavaScript and inline HTML JavaScript and is designed to catch structural regressions before they reach production.

---

# 📚 Releases vs Archive

**Both systems remain. They serve different jobs.**

### Releases

```text
/releases.html
```

The curated visual catalog. It presents the release library in canonical order with artwork, type information, track context, filtering, and direct release experiences.

Album and EP cards are allowed to present the larger release-set experience. Singles are constrained so their artwork does not overwhelm the catalog layout.

### Archive Explorer

```text
/archive.html
```

The utility discovery layer. It provides:

- Release search
- Track search
- Album / EP / Single filters
- Spotify / Apple Music / SoundCloud filters
- Catalog ordering
- A-Z / Z-A sorting
- Release-set artwork
- Parent release context
- Shareable query state

A track found through Archive resolves to its canonical parent release experience.

> **Releases = presentation. Archive = exploration.**

---

# 🖼️ Visual System

Artwork is shared across the site through the canonical release catalog and global artwork mapping.

The repository contains the release artwork library under:

```text
/assets/images/icons/album_art/
```

Recent catalog artwork additions include dedicated assets for releases such as `Never Known`, `I DID IT AGAIN`, `HOME (ACOUSTIC VERSION)`, and `RESCUE YOU` alongside the established catalog artwork, including the `Heavy` / `Enough` artwork set.

The repository also retains the animated media assets:

```text
/assets/mov/LS_BG_STARS.webm
/assets/mov/HERO_BG_WEBM.webm
```

The global cinematic background system is wired around `LS_BG_STARS.webm` with explicit background, overlay, and content stacking layers.

---

# 📡 Transmission / Signal System

`transmissions.json` is the canonical Signal message source.

The system powers:

- Homepage Signal
- Signal Oracle
- Universe transmission history
- Archive transmission discovery
- Easter-egg Signal events

Transmission copy must not claim that a release is the latest unless the canonical release feed establishes that ordering.

Current transmission history includes:

```text
TRANSMISSION 001 — SYSTEM ONLINE
TRANSMISSION 002 — HELLO GOODBYE
TRANSMISSION 003 — VISUAL FREQUENCY
TRANSMISSION 004 — ARCHIVE EXPLORER
```

---

# 🎧 Music Discovery

The site deliberately does **not** include the previously proposed persistent personal/native music player.

Instead, the music experience is built around deterministic discovery and official platform handoff:

- Latest Releases
- Randomize
- Releases
- Archive Explorer
- Release Detail
- Spotify
- Apple Music
- SoundCloud
- YouTube

THE CALM remains a separate ambient/environment layer.

---

# 🎬 Global Motion

The primary global background asset is:

```text
/assets/mov/LS_BG_STARS.webm
```

`script.js` owns global background-video behavior while `site-global.css` provides explicit layering:

```text
Background Video
      ↓
Overlay
      ↓
Global Shell / Page Content
```

The previous negative-z-index stacking approach was removed because it could place the WebM behind the document's effective rendering layer.

Reduced-motion and low-power behavior reduce visual intensity rather than duplicating or replacing the shell.

---

# 🌙 THE CALM

THE CALM is globally owned by the shell and remains separate from foreground music discovery.

Primary source:

```text
/assets/other/sound/Background.mp3
```

Foreground video playback can pause or mute THE CALM to avoid competing audio ownership.

---

# 🧠 DOM Ownership

```text
HTML PAGE
   ↓
site-global.js
   ├── header
   ├── navigation
   ├── footer
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

When a duplicate appears, identify the canonical owner before adding another patch layer.

---

# 🐛 QA Hardening Log

Structural defects addressed during the architecture work include:

- MutationObserver feedback loops
- Release reorder race conditions
- YouTube ordering observer recursion
- Incorrect Somewhere In-Between artwork
- Incorrect legacy background references
- Undefined `--glow` variable
- Legacy Special Access header duplication
- Special Access archive-player regression
- 404 shell/alignment mismatch
- Duplicate global stylesheet injection
- Accessibility skip-navigation behavior
- Release SEO / structured-data identity
- Signal caching behavior
- Duplicate metadata injection
- Privacy / Terms shell regressions
- Self-triggering homepage normalization workflow
- Duplicate homepage randomizer ownership
- Retired `site-polish.js`
- Stale hardcoded homepage latest release
- Releases-page ordering race
- Oversized single artwork in Releases
- Track URLs failing to resolve to parent release sets
- Archive lacking release-set artwork/context
- Global WebM stacking-context visibility issue
- Missing hamburger discovery routes
- Missing Universe system
- Missing Visual Gallery system
- Stale transmission claim about the latest release

---

# 🩺 Site Doctor Coverage

`tools/site-doctor.mjs` validates:

- Global shell presence
- Duplicate global JavaScript
- Duplicate global CSS
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
- CSS variable references
- Stale background references
- Required global assets
- Required discovery routes/modules
- Transmission JSON validity

Workflow:

```text
push / pull request
        ↓
GitHub Actions
        ↓
Node 22
        ↓
Site Doctor
```

Site Doctor is repository QA. It does not pretend to replace real browser verification.

---

# 🧪 Verification Matrix

### Global shell

- Header begins at viewport `0`
- Logo remains independently centered
- THE CALM remains lower-left
- Menu remains right-aligned
- Releases and Archive are both navigable
- Visuals and Universe are both navigable
- `LS.png` begins at the header boundary
- No duplicate global shell
- Special Access remains in the footer
- Skip navigation is keyboard-visible

### Release system

- Canonical catalog order preserved
- Album / EP track sets preserved
- Track URL resolves to parent release set
- Selected track is highlighted
- Release artwork resolves
- Streaming destinations remain canonical
- Latest Releases uses the catalog's top three entries

### Releases

- Visual catalog presentation
- Album / EP / Single filtering
- Canonical ordering
- Artwork size constraints
- Direct release navigation

### Archive

- Search release
- Search track
- Show parent release set
- Album / EP / Single filters
- Platform filters
- Catalog / A-Z / Z-A sorting
- Shareable query state

### Visuals

- Fullscreen viewer
- Previous / next
- Keyboard controls
- Mobile swipe
- Reduced-motion behavior

### Universe

- Release timeline
- Transmission history
- Signal / Oracle layer
- Release / Archive / Visual pathways
- Easter-egg layer

### Production

- Site Doctor workflow present
- Deployment path documented
- Production behavior checked separately from repository QA
- Cache behavior checked
- Shared consumers checked for regressions

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

A Vercel build-rate-limit or upgrade-cap failure is a deployment-state problem and is not automatically evidence of a source-code failure.

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
├── .github/workflows/fix-homepage.yml
├── .github/workflows/update-latest-videos.yml
├── api/
└── assets/
```

---

# 🏁 Final Project Status

All five planned phases are complete:

```text
PHASE 1  FOUNDATION                         ✓
PHASE 2  MUSIC DISCOVERY + CONVERSION      ✓
PHASE 3  LIL SYNN UNIVERSE                 ✓
PHASE 4  VISUAL GALLERY                    ✓
PHASE 5  ABSOLUTE POLISH + INTEGRITY       ✓
```

The roadmap ends at Phase 5. Future work should be treated as maintenance, corrections, content/catalog updates, or optional evolution of the existing systems, not as a new roadmap phase.

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
NO PERSISTENT PERSONAL PLAYER
VERIFY THE REAL RUNTIME
UPDATE THE README WHEN A PHASE IS DONE
```

<div align="center">

## ✦ LIL SYNN

**DARK SOUND. RAW EMOTION. NO LIMITS.**

</div>
