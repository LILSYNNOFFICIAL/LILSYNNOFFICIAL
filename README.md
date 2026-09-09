<div align="center">

# ✦ LIL SYNN

### THE OFFICIAL DIGITAL HOME OF LIL SYNN

**A cinematic, browser-native artist platform engineered as one unified digital experience.**

`MUSIC` · `RELEASES` · `VIDEOS` · `ABOUT` · `MERCH` · `LYRICS` · `CONTACT`

</div>

---

## ◈ Executive Summary

This repository is the production source of truth for the official LIL SYNN website. The site is intentionally lightweight and browser-native: static HTML, centralized CSS, deterministic JavaScript modules, structured JSON, media assets, API endpoints, and GitHub automation work together as one system.

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

`site-global.js` is the authoritative owner of the shared shell. It owns the global header, navigation drawer, footer, THE CALM, Back To Top, metadata normalization, About controls, keyboard/Escape behavior, body scroll locking, legacy-shell cleanup, global `LS.png` top artwork, motion coordination, Signal loading, skip navigation, and global MusicGroup structured data.

The shell is idempotent and must not create duplicate global components.

## Header geometry contract

- Desktop header: `150px`
- Mobile header: `118px`
- Desktop logo: approximately `440px × 138px`
- Mobile logo: approximately `300px × 100px`
- Header begins at viewport position `0`
- `LS_LOGO.png` is independently centered
- THE CALM is lower-left
- Menu is right-aligned
- `LS.png` begins at the header boundary
- `LS_HEADPHONES.png` is footer-only and links to `/special_access.html`

---

# 💿 Canonical Release Architecture

`release-catalog.json` is the single source of truth for release identity and ordering. It controls release order, identity, album/EP/single classification, track arrays and order, streaming destinations, restrictions, and SoundCloud sets.

If release order changes, change the catalog. If track order changes, change the catalog. If a streaming destination changes, change the catalog.

Release identity is more important than loose title matching. `Touching to the North` is intentionally SoundCloud-only and fallback logic must never invent other destinations.

---

# 📄 Release Detail Experience

`release.html` resolves a requested release against `release-catalog.json` and derives artwork, type, tracklist, official streaming destinations, previous/next releases, related archive recommendations, dynamic metadata, canonical identity, Open Graph artwork, and release structured data.

Example:

```text
/release.html?id=Hello%20Goodbye
```

---

# 🚀 Phase 1 — Dynamic Release Foundation — COMPLETE

Established the dynamic release experience, canonical release data flow, archive-to-detail routing, Signal foundation, Site Doctor foundation, and the global shell architecture.

---

# 🚀 Phase 2 — Discovery + Streaming Conversion — COMPLETE

Capabilities:

- Previous/next release routing
- Related archive recommendations
- Return to the complete archive
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

Completion commit:

```text
7cd9537f0eae22e5d650f130746cea32446f747f
```

---

# 🚀 Phase 3 — Discoverability + Accessibility + Performance — COMPLETE

Capabilities:

- Global `MusicGroup` JSON-LD
- Release `MusicAlbum` / `MusicRelease` structured data
- Dynamic release canonical URLs
- Release-specific Open Graph artwork
- Release-specific titles and descriptions
- Global keyboard-visible Skip to main content
- Automatic main-content target creation
- Preserved focus, keyboard, Escape, and reduced-motion behavior
- Normal browser caching for Signal transmissions
- Low-power and Save-Data handling
- Lazy media and thumbnail-first strategies
- No heavy framework dependency

### Design law

> **Make the existing experience easier to understand, easier to navigate, and cheaper for the browser to run.**

Note: the historical Phase 3 commit hashes previously recorded in this document were not independently reliable and are intentionally omitted rather than repeated as facts.

---

# 🚀 Phase 4 — Archive Intelligence + Catalog Exploration — COMPLETE

`archive.html` is a searchable, shareable archive exploration route.

Capabilities:

- Search by release title
- Search by track title
- Album / EP / Single filters
- Spotify / Apple Music / SoundCloud filters
- Catalog, A → Z, and Z → A ordering
- Live result counts
- Shareable URL state using `q`, `type`, `platform`, and `sort`
- Keyboard-friendly native controls
- Reduced-motion-safe interaction
- Canonical routing into `/release.html?id=...`
- Signal integration through `TRANSMISSION 004`

The explorer consumes `release-catalog.json` directly and does not maintain duplicate release metadata.

### Design law

> **Make the archive discoverable without fragmenting the source of truth.**

Completion commits:

```text
fa8b7a45bf626a90bdafc5619851528cbfe3170a  archive explorer
4d467030d71514fc7d7db9251fc43ad9b1956775  Signal Archive Explorer transmission
c1f6b05b22961666109fca324e7f3d520bd98aea  Phase 4 README completion record
```

---

# 🚀 Phase 5 — Production Integrity + QA Guardrails — COMPLETE

Phase 5 strengthens the repository's deterministic verification layer so architectural regressions are caught before they become production problems.

## Site Doctor hardening

`tools/site-doctor.mjs` now checks:

- Missing global shell script
- Duplicate explicit `site-global.js`
- Duplicate explicit `site-global.css`
- Duplicate meta descriptions
- Duplicate canonical links
- Missing local assets/references
- Missing `<main>` landmarks as accessibility warnings
- Legacy shell markers
- Release catalog validity
- Duplicate catalog order entries
- Catalog order entries without matching groups
- JavaScript syntax across repository modules
- Undefined `--glow`
- Stale background asset references
- Required global assets
- Required archive/release routes
- `transmissions.json` validity

The guardrail remains deterministic and repository-local. It does not pretend to replace real browser verification.

### Phase 5 design law

> **Catch structural regressions at the source before they reach the visitor.**

Completion commit:

```text
bde5456054e15e59bd05af18a8e893348d9d5984  Site Doctor integrity hardening
```

---

# 📺 Latest Videos

Latest Videos uses resolved YouTube data together with canonical release ordering.

```text
YouTube source → latest-videos.json → latest-videos.js → release-catalog.json → Latest Videos UI
```

The renderer owns video deduplication, ID/title handling, release identity matching, canonical ordering, thumbnail-first playback, and privacy-enhanced YouTube playback.

> **YouTube supplies video data. The release catalog controls release ordering.**

---

# 🎬 Global Motion

The active global background is:

```text
/assets/mov/LS_BG_STARS.webm
```

Pipeline:

```text
WebM → /assets/mov/index.json → script.js → global fixed background → contrast layer → page content
```

Stale `LG_BG_STARS.webm` and competing `BG_ANI.webm` references were removed from the active architecture.

---

# 🌙 THE CALM

THE CALM is globally owned by the shell.

Primary source:

```text
/assets/other/sound/Background.mp3
```

The shell coordinates ambient audio with foreground media so separate page systems do not fight over playback.

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

When a duplicate appears, identify who created it before adding another cleanup rule.

---

# 🐛 QA Hardening Log

Real defects previously identified and corrected include:

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

---

# 🩺 Site Doctor

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

Prefer small deterministic browser modules over unnecessary framework overhead.

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

Accessibility is architectural. Every new interactive component should work without requiring a pointer. Preserve semantic controls, keyboard navigation, skip navigation, visible focus, meaningful labels, accurate ARIA state, Escape behavior, reduced-motion support, and responsive layouts without unnecessary overflow.

---

# 🔎 SEO & Discoverability

The production system supports canonical URLs, meta descriptions, Open Graph metadata, release-specific canonical URLs, release-specific Open Graph artwork, global MusicGroup structured data, release structured data, crawlable page structure, sitemap coverage, and dedicated 404 handling.

---

# 🧬 Cache & Versioning

Shared assets may use intentional version query parameters:

```html
<script src="/site-global.js?v=YYYYMMDD"></script>
<link id="site-global-css" rel="stylesheet" href="/site-global.css?v=YYYYMMDD">
```

Do not increment versions randomly. Cache invalidation should correspond to meaningful shared-asset changes.

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
├── index.html
├── releases.html
├── archive.html
├── release.html
├── 404.html
├── privacy.html
├── terms.html
├── special_access.html
├── site-global.js
├── site-global.css
├── script.js
├── signal-engine.js
├── site-polish.js
├── music-random.js
├── latest-videos.js
├── release-catalog.json
├── latest-videos.json
├── transmissions.json
├── tools/site-doctor.mjs
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
VERIFY THE REAL RUNTIME
UPDATE THE README WHEN A PHASE IS DONE
```

<div align="center">

## ✦ LIL SYNN

**DARK SOUND. RAW EMOTION. NO LIMITS.**

</div>
