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

**Presentation consumes data. Behavior derives views from data. Canonical truth is never silently redefined by presentation code.**

---

# 👑 Global Shell

`site-global.js` is the single authoritative owner of the shared site shell.

It owns:

- Global header
- Navigation drawer and menu behavior
- Global footer
- THE CALM
- Back To Top
- Shared metadata normalization
- About controls
- Keyboard and Escape behavior
- Body scroll locking
- Legacy-shell cleanup
- Global `LS.png` top artwork
- Global motion-loader coordination
- Signal/experience loading when the page exposes `#signal`

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

`LS_HEADPHONES.png` is intentionally **footer-only** and links to `/special_access.html`.

---

# 💿 Canonical Release Architecture

`release-catalog.json` is the single source of truth for release identity and ordering.

It controls:

- Release order
- Release identity
- Album / EP / single classification
- Track arrays and track order
- Streaming destinations
- Release-specific restrictions
- SoundCloud sets

### Data ownership rule

If release order changes, change the catalog.

If track order changes, change the catalog.

If a streaming destination changes, change the catalog.

Do not duplicate canonical release truth inside presentation scripts.

### Identity integrity

Release identity is more important than title matching. Remastered variants and releases with overlapping names must remain distinct.

`Touching to the North` is intentionally SoundCloud-only. Generic fallback logic must never invent Spotify or Apple Music destinations for that release.

---

# 📄 Release Detail Experience

`release.html` is the dynamic release-detail route.

Example:

```text
/release.html?id=Hello%20Goodbye
```

The page resolves the requested release against `release-catalog.json` and derives:

- Release identity
- Artwork
- Release type
- Tracklist
- Official streaming destinations
- Previous release
- Next release
- Additional archive recommendations

### Phase 1 foundation

Phase 1 established the dynamic release experience and connected archive cards to release detail pages.

Every release archive card can open its corresponding detail route without creating a second release data source.

---

# 🚀 Phase 2 — Discovery + Streaming Conversion — COMPLETE

Phase 2 is complete at the source-implementation level.

The objective was:

> **Help visitors discover more LIL SYNN music while directing them outward to Spotify, Apple Music, SoundCloud, and YouTube.**

The website is a gateway to the streaming ecosystem, not a replacement for it.

## Phase 2 capabilities

- Release-to-release navigation
- Previous / next release routing
- Related archive recommendations
- Direct return to the complete release archive
- Direct routes into Music and Latest Videos
- Strong streaming-first calls to action
- Dynamic release metadata updates
- Signal / transmission discovery
- Non-personalized Signal Oracle
- Direct Spotify / Apple Music / SoundCloud / YouTube pathways
- Cinematic reveal behavior
- `prefers-reduced-motion` handling
- Save-Data / slow-connection handling

### Streaming conversion law

```text
DISCOVER
   ↓
ENGAGE
   ↓
CHOOSE MUSIC / VIDEO
   ↓
GO TO OFFICIAL PLATFORM
   ↓
STREAM / WATCH
```

No personal profiling layer. No chatbot designed to keep visitors away from streaming services. No proprietary player replacing official streaming destinations.

### Phase 2 completion commit

```text
7cd9537f0eae22e5d650f130746cea32446f747f
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
WebM files
   ↓
/assets/mov/index.json
   ↓
script.js
   ↓
global fixed background video
   ↓
contrast layer
   ↓
page content
```

A stale `LG_BG_STARS.webm` reference was identified and corrected.

`coming_soon.html` no longer maintains a competing `BG_ANI.webm` background implementation.

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
       └── Release Detail
```

When a duplicate appears, identify who created it before adding another cleanup rule.

Defensive normalization is useful. Unbounded cleanup logic is not.

---

# 🐛 QA Hardening Log

The engineering audit found and fixed several real defects.

## MutationObserver feedback loops

The release archive observer and Latest Videos observer both mutated DOM nodes they were observing, creating potential recursive processing.

**Fix:** observers disconnect during mutation/processing and reconnect afterward, with running guards for async work.

## Somewhere In-Between artwork

Invalid mapping:

```text
somewhere_in_between.jpg
```

Correct asset:

```text
57_lil_synn_somewhere_in_between.jpg
```

## Background asset mismatch

Invalid:

```text
LG_BG_STARS.webm
```

Correct:

```text
LS_BG_STARS.webm
```

## Global CSS variable

Invalid:

```text
var(--glow)
```

Correct:

```text
var(--ls-glow)
```

## Legacy Special Access duplication

The old header headphones element was removed. `LS_HEADPHONES.png` now belongs to the global footer.

## Special Access regression

The archive player was accidentally removed during shell cleanup, caught during audit, and restored with track cards, queue, previous/play/next, progress seeking, volume, auto-next-track, load-error handling, and Enter/Space keyboard activation.

## 404 alignment

The 404 page was brought into the current global shell and cache-versioning architecture.

## Global stylesheet duplication

`site-global.js` recognizes explicitly loaded canonical global CSS and avoids injecting a second copy.

---

# 🩺 Site Doctor

`tools/site-doctor.mjs` is the repository-level structural QA tool.

It checks:

- Global shell script presence
- Duplicate explicit global CSS
- Missing local assets/references
- Legacy shell markers
- Release catalog validity
- Duplicate catalog order entries
- JavaScript syntax
- Undefined `--glow`
- Stale background references
- Required global assets
- `transmissions.json` validity

The workflow is:

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
- Header geometry remains intentional
- Logo remains independently centered
- THE CALM remains lower-left
- Menu remains right-aligned
- `LS.png` begins at the header boundary
- No duplicate header/footer
- Special Access remains in footer

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
- Signal experience respects low-power settings

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
- Visible focus
- Meaningful labels
- Correct ARIA state
- Escape-to-close
- Body scroll locking
- Reduced-motion support

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
- Cache-aware shared assets
- Reduced-motion and low-power handling

---

# ♿ Accessibility Philosophy

Accessibility is architectural.

Preserve semantic controls, keyboard navigation, visible focus, meaningful labels, accurate ARIA state, Escape behavior, focus-friendly navigation, reduced-motion support, and responsive layouts without unnecessary overflow.

Every new interactive component should work without requiring a pointer.

---

# 🔎 SEO & Discoverability

The production system supports:

- Canonical URLs
- Meta descriptions
- Open Graph metadata
- Crawlable page structure
- Sitemap coverage
- Dedicated 404 handling
- Release-specific dynamic metadata on `release.html`

Page-specific identity remains the responsibility of each page while the global shell handles shared normalization.

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
Generated assets / validation
        ↓
Vercel
        ↓
lilsynn.com
```

Important state distinction:

```text
SOURCE
  ≠
CI
  ≠
DEPLOYMENT
  ≠
CACHE
  ≠
RUNTIME DOM
```

A Vercel rate limit or deployment cap is a deployment-state problem, not automatically a source-code failure. Production visual verification must wait until deployment is actually available.

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

1. **Inspect** the current implementation.
2. **Identify ownership** of the behavior.
3. **Trace dependencies** and shared consumers.
4. **Change the canonical owner.**
5. **Remove obsolete competing behavior.**
6. **Run focused verification.**
7. **Run broader repository validation.**
8. **Deploy through the production pipeline.**
9. **Check the real runtime.**

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

# 📌 Current Project Status

## Phase 1 — COMPLETE

Phase 1 established the release-experience foundation, including dynamic `release.html`, release catalog resolution, archive-to-detail routing, streaming destination CTAs, artwork resolution, tracklist presentation, Signal foundation, Site Doctor, CI workflow, shell hardening, observer-loop fixes, asset corrections, and Special Access preservation.

Phase 1 archive-link commit:

```text
be6237a64c4393c6f1c8172fa8050d08afc8f16d
```

## Phase 2 — COMPLETE

Phase 2 established the discovery and streaming-conversion layer, including release navigation, related recommendations, streaming-first CTAs, dynamic release metadata, Signal transmissions, non-personalized Oracle discovery, direct official-platform pathways, cinematic reveals, and low-power behavior.

Phase 2 completion commit:

```text
7cd9537f0eae22e5d650f130746cea32446f747f
```

## Phase 3 — NEXT

Phase 3 is the **Discoverability + Accessibility + Performance hardening** phase.

Its objective is to make the existing experience easier for search engines and assistive technology to understand while reducing unnecessary browser work, without changing the streaming-first strategy.

---

# 🗺 Repository Topology

```text
LILSYNNOFFICIAL/
│
├── index.html
├── releases.html
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
```

---

<div align="center">

## ✦ LIL SYNN

**DARK SOUND. RAW EMOTION. NO LIMITS.**

Production source for the LIL SYNN digital universe.

</div>
