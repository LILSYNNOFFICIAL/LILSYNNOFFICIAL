<div align="center">

# ✦ LIL SYNN

### THE OFFICIAL DIGITAL HOME OF LIL SYNN

[![Live Site](https://img.shields.io/badge/🌐_LIVE_SITE-lilsynn.com-D4AF37?style=for-the-badge&labelColor=050505)](https://lilsynn.com)
[![Source](https://img.shields.io/badge/SOURCE-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)
[![CI](https://img.shields.io/github/actions/workflow/status/LILSYNNOFFICIAL/LILSYNNOFFICIAL/fix-homepage.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/actions)
[![Last Commit](https://img.shields.io/github/last-commit/LILSYNNOFFICIAL/LILSYNNOFFICIAL?style=for-the-badge&label=LAST%20COMMIT)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/commits/main)

<br>

**A cinematic, browser-native artist platform engineered as one unified digital experience.**

`MUSIC` · `RELEASES` · `VIDEOS` · `ABOUT` · `MERCH` · `LYRICS` · `CONTACT`

<br>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla_JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JSON](https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white)](https://www.json.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## ◈ Executive Summary

This repository is the **production source of truth** for the official LIL SYNN website.

The site is intentionally built as a lightweight publishing platform instead of a framework-heavy application. Static HTML, browser-native JavaScript, centralized CSS, structured JSON, media assets, API endpoints, and GitHub automation work together as one system.

### Architectural doctrine

> **One shell. One source of truth. Explicit ownership. Deterministic rendering. Root-cause fixes. Real verification.**

The objective is not maximum framework complexity. It is maximum control over a fast, cinematic artist experience.

---

# 🧬 System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                          │
│                                                             │
│ release-catalog.json   latest-videos.json   media manifests │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       BEHAVIOR LAYER                        │
│                                                             │
│ site-global.js │ script.js │ music-random.js │ latest-videos│
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│                                                             │
│ HTML │ site-global.css │ page CSS │ assets │ media          │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │  EVERY PAGE / DOM  │
                    └────────────────────┘
```

### Architectural law

**Presentation consumes data. Behavior derives views from data. Canonical truth is never silently redefined by presentation code.**

---

# 👑 Global Shell Architecture

`site-global.js` is the **single authoritative owner of the shared site shell**.

It is responsible for the shared experience, including:

- Global header
- Navigation drawer and menu behavior
- Navigation groups and destinations
- Global footer
- THE CALM
- Back To Top
- Shared metadata normalization
- About accordion behavior
- Keyboard interaction
- Escape-to-close behavior
- Body scroll locking
- Duplicate legacy-shell cleanup
- Global top artwork insertion
- Global motion-loader coordination

The shell is designed to be **idempotent**. Re-running initialization should not create multiple headers, footers, or shared controls.

### Shell lifecycle

```text
PAGE LOAD
   ↓
site-global.js
   ├── global CSS
   ├── metadata normalization
   ├── legacy shell cleanup
   ├── header creation
   ├── footer creation
   ├── LS.png top-art insertion
   ├── navigation initialization
   ├── Back To Top initialization
   ├── THE CALM binding
   ├── About controls
   └── global motion loading
```

---

# 👑 Header Geometry Contract

The header is a global geometry contract, not page-specific decoration.

```text
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                    ┌──────────────────┐                       │
│                    │   LS_LOGO.png    │                       │
│                    │  TRUE CENTER AXIS│                       │
│                    └──────────────────┘                       │
│                                                               │
│ THE CALM                                           ☰ MENU     │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │      LS.png      │
                    │   GLOBAL TOP ART │
                    └──────────────────┘
```

### Current global geometry

- Desktop header height: `150px`
- Mobile header height: `118px`
- Desktop `LS_LOGO.png`: approximately `440px × 138px`
- Mobile `LS_LOGO.png`: approximately `300px × 100px`
- Header is fixed to the viewport top
- Logo is independently centered
- THE CALM is independently anchored at lower-left
- Menu is independently anchored at right
- `LS.png` is inserted immediately after the header
- The top-art relationship uses the global header height rather than page-specific guesswork

### Header hard rules

1. Header begins at viewport position `0`.
2. Header spans the viewport width.
3. `LS_LOGO.png` stays centered independently of side controls.
4. THE CALM does not determine logo position.
5. Menu controls do not determine logo position.
6. `LS.png` begins at the header boundary.
7. Pages do not invent competing global header offsets.
8. Mobile geometry is controlled by the global shell.
9. Global header changes must be checked at desktop and mobile widths.

---

# 🎧 Special Access / Footer Identity

`LS_HEADPHONES.png` is **not a header element**.

Its canonical location is the global footer, where it acts as both branding and a navigation affordance for Special Access.

```text
GLOBAL FOOTER
      │
      ├── LIL
      │
      ├── LS_HEADPHONES.png
      │        └── /special_access.html
      │
      └── SYNN
```

This separation is intentional. Moving the headphones artwork back into the header would violate the current shell contract unless the architecture is deliberately redesigned.

---

# 🖼 Global Top Artwork

`LS.png` is treated as global top artwork rather than ordinary page content.

The shell creates the predictable relationship:

```text
<header class="ls-header">
        ↓
<div class="ls-global-top-art">
        └── /assets/img/LS.png
</div>
        ↓
page content
```

The visual rule is:

> **Header ends → LS.png begins → page content follows.**

This prevents pages from accumulating arbitrary compensating margins.

---

# 🗺 Repository Topology

```text
LILSYNNOFFICIAL/
│
├── index.html
├── releases.html
├── 404.html
├── privacy.html
├── terms.html
├── special_access.html
│
├── site-global.js              ← GLOBAL SHELL
├── site-global.css             ← GLOBAL VISUAL SYSTEM
├── script.js                   ← GLOBAL MOTION / HOMEPAGE SYSTEM
├── site-polish.js              ← HOMEPAGE REFINEMENT
├── music-random.js             ← MUSIC PRESENTATION ENGINE
├── latest-videos.js             ← VIDEO PRESENTATION ENGINE
│
├── release-catalog.json        ← ★ CANONICAL RELEASE TRUTH
├── latest-videos.json          ← RESOLVED VIDEO MANIFEST
│
├── api/
│   ├── apple-art.js
│   ├── art.js
│   ├── latest-youtube-releases.js
│   ├── spotify-art.js
│   └── youtube.js
│
├── assets/
│   ├── img/
│   │   └── LS.png
│   ├── images/
│   │   └── icons/
│   │       ├── LS_HEADPHONES.png
│   │       ├── LS_LOGO.png
│   │       ├── UP_ARROWS.png
│   │       └── album_art/
│   ├── mov/
│   └── other/sound/
│       └── Background.mp3
│
└── .github/
    └── workflows/
        ├── fix-homepage.yml
        └── update-latest-videos.yml
```

---

# 💿 Canonical Release Data

`release-catalog.json` is the **single source of truth** for release identity and ordering.

It defines or participates in:

- Release order
- Release identity
- Release groups
- Album / EP / single classification
- Track arrays and track order
- Artwork relationships
- Streaming destinations
- SoundCloud sets
- Release-specific restrictions

### Data ownership rule

If release order changes, change the catalog.

If track order changes, change the catalog.

If a streaming destination changes, change the catalog.

If artwork mapping changes, change the authoritative mapping.

Do not duplicate canonical release truth inside presentation scripts.

---

# 🔐 Release Identity Integrity

Title-only matching is unsafe when releases share names or have remastered variants.

```text
EXACT RELEASE IDENTITY
        ↓
RELEASE METADATA
        ↓
ARTWORK
        ↓
STREAMING DESTINATIONS
        ↓
PRESENTATION
```

### Signal Light Sermon separation

`Signal Light Sermon` associated with `Touching to the North` and `Signal Light Sermon (Remastered 2026)` are distinct catalog identities.

They must never silently inherit one another's artwork, release metadata, or streaming links.

### Touching to the North

This release is intentionally SoundCloud-only.

| Destination | Policy |
|---|:---:|
| SoundCloud track | ✅ |
| SoundCloud set | ✅ |
| Spotify | ❌ |
| Apple Music | ❌ |

Generic fallback logic must respect explicit release restrictions.

---

# 🎵 Music Presentation Engine

`music-random.js` owns homepage RANDOMIZE behavior.

```text
CANONICAL CATALOG
       ↓
DERIVED TRACK POOL
       ↓
VALIDATE
       ↓
DEDUPLICATE
       ↓
APPLY RELEASE RESTRICTIONS
       ↓
RANDOMIZE PRESENTATION
       ↓
RENDER MUSIC CARDS
```

### Core rule

> **Random presentation is allowed. Randomized canonical data is not.**

---

# 📺 Latest Releases Video Architecture

Latest Videos uses the resolved video manifest together with canonical release ordering.

```text
YouTube source / resolver
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

The renderer is responsible for:

- Video deduplication
- ID and title handling
- Release identity matching
- Canonical ordering
- Intended video count
- Thumbnail-first playback
- Privacy-enhanced YouTube playback
- Clear handling when fewer canonical matches exist

> **YouTube supplies video data. The release catalog controls release ordering.**

---

# 🎬 Global Motion Pipeline

Background WebM media lives under:

```text
/assets/mov/
```

The generated manifest is:

```text
/assets/mov/index.json
```

The intended pipeline is:

```text
WebM files
    ↓
manifest generation
    ↓
index.json
    ↓
script.js
    ↓
global fixed background video
    ↓
contrast layer
    ↓
page content
```

The active background asset is `LS_BG_STARS.webm`.

A previous reference to `LG_BG_STARS.webm` was identified as invalid and corrected.

---

# 🌙 THE CALM

THE CALM is a global ambient-audio control.

Primary source:

```text
/assets/other/sound/Background.mp3
```

The global shell coordinates the shared ambient audio state with foreground video playback so separate pages and media systems do not fight over playback.

---

# ⬆ Back To Top

Back To Top is globally owned and uses:

```text
/assets/images/icons/UP_ARROWS.png
```

It should exist once and be injected by the shell rather than independently recreated by every page.

---

# 🧠 Runtime DOM Ownership

This is a browser-native application, so DOM ownership is critical.

```text
HTML PAGE
   ↓
GLOBAL LOADER
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
       └── Homepage
```

### Defensive DOM rule

When a duplicate appears, determine **who created it** before adding another cleanup rule.

Defensive normalization is useful. Unbounded cleanup logic is not.

---

# 🐛 QA Hardening Log

The latest source-level audit found and addressed several real defects.

## 1. Release archive MutationObserver loop

`script.js` previously observed the release archive and then mutated that same DOM inside the observer callback. Reordering releases triggered another mutation, which could trigger another reorder, creating an observer feedback loop.

### Fix

The observer is disconnected while the reorder operation runs and reattached after completion, with a running guard to prevent re-entry.

---

## 2. Latest Videos MutationObserver loop

The YouTube ordering logic had the same structural problem: the observer watched the grid while the fix routine sorted and appended cards into that grid.

### Fix

The video-order observer now disconnects during processing and reconnects after asynchronous work completes. A running guard prevents recursive execution.

---

## 3. Broken Somewhere In-Between artwork

The release archive contained an invalid artwork filename for `Somewhere In-Between`.

Invalid mapping:

```text
somewhere_in_between.jpg
```

Correct asset:

```text
57_lil_synn_somewhere_in_between.jpg
```

The canonical artwork mapping now resolves to the existing asset.

---

## 4. Invalid background filename

The automation previously referenced:

```text
assets/mov/LG_BG_STARS.webm
```

The actual background asset is:

```text
assets/mov/LS_BG_STARS.webm
```

The incorrect reference was removed.

---

## 5. Coming Soon background cleanup

`coming_soon.html` previously referenced a nonexistent `BG_ANI.webm` implementation.

The page now relies on the global motion system instead of maintaining a competing background-video implementation.

A stale `#bg` CSS selector remains harmless cleanup debt and should not be treated as an active background system.

---

## 6. Global CSS variable defect

A hover/focus rule referenced an undefined variable:

```text
var(--glow)
```

The canonical global variable is:

```text
var(--ls-glow)
```

The CSS now uses the defined variable.

---

## 7. Legacy header Special Access duplication

The legacy header implementation contained a Special Access element using `LS_HEADPHONES.png`.

That competed with the intended footer architecture.

The legacy header element was removed. Special Access now belongs to the footer.

---

## 8. Special Access player preservation

During shell cleanup, the Special Access archive player was accidentally removed once during an automated rewrite.

That regression was caught and the full archive player was restored, including:

- Track cards
- Queue
- Previous / play / next controls
- Progress seeking
- Volume control
- Automatic next-track behavior
- Load-error handling
- Keyboard activation with Enter / Space

This is documented because shared-shell refactors must not destroy feature-specific functionality.

---

## 9. 404 shell alignment

The 404 page was still using an older global-shell version and was updated to align with the current shell architecture, including global header geometry and current shell versioning.

### Important implementation note

If a page explicitly loads `site-global.css`, it should use the canonical stylesheet identifier expected by `site-global.js`, or the explicit stylesheet should be removed in favor of the shell loader. Otherwise the browser can receive duplicate global CSS.

This is an architectural consistency check that should remain part of future QA.

---

## 10. API environment naming

The YouTube API endpoint and automation historically used different environment variable names:

```text
YOUTUBE_DATA_API_KEY
YOUTUBE_API_KEY
```

The API path should support the canonical workflow secret or intentionally preserve both names for compatibility. Environment naming must be verified as part of deployment configuration, not inferred from source alone.

---

# 🧪 Verification Matrix

A change is not finished merely because a commit exists.

### Global shell

- [ ] Header starts at viewport `0`
- [ ] Header height is intentional
- [ ] `LS_LOGO.png` is correctly sized
- [ ] Logo remains independently centered
- [ ] THE CALM remains independently anchored
- [ ] Menu remains independently anchored
- [ ] `LS.png` begins at the header boundary
- [ ] No duplicate header exists
- [ ] No duplicate footer exists
- [ ] Special Access remains in footer
- [ ] `LS_HEADPHONES.png` links correctly

### Data

- [ ] Catalog JSON parses
- [ ] Release order is preserved
- [ ] Track order is preserved
- [ ] Release identities remain distinct
- [ ] Streaming restrictions remain intact
- [ ] Artwork mappings resolve to real assets

### Runtime

- [ ] Release observer does not recursively trigger itself
- [ ] Video observer does not recursively trigger itself
- [ ] Async observers reconnect correctly
- [ ] Duplicate shell cleanup is idempotent
- [ ] Global motion has one owner
- [ ] THE CALM has one owner
- [ ] Back To Top has one owner

### Media

- [ ] WebM manifest resolves
- [ ] Background motion loads
- [ ] Contrast remains readable
- [ ] THE CALM works
- [ ] Foreground video playback coordinates with ambient audio
- [ ] Latest Videos deduplicate correctly
- [ ] Latest Videos follow canonical release order
- [ ] YouTube playback uses privacy-enhanced embeds

### Responsive

- [ ] Desktop
- [ ] Laptop
- [ ] Tablet
- [ ] Mobile
- [ ] Narrow mobile
- [ ] No horizontal overflow
- [ ] Header controls do not collide
- [ ] Logo remains centered

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Controls have meaningful labels
- [ ] ARIA state is accurate
- [ ] Escape closes navigation
- [ ] Body scroll locking behaves correctly
- [ ] Reduced-motion behavior is respected

### Production

- [ ] CI passes
- [ ] Generated assets are current
- [ ] Deployment completes
- [ ] Production URL responds
- [ ] Real browser behavior is checked
- [ ] Cache behavior is checked
- [ ] Shared consumers are checked for regressions

---

# 🤖 Automation & CI

GitHub Actions provide repository-level automation and data-maintenance guardrails.

### `fix-homepage.yml`

The workflow is intended to support tasks such as:

- Removing stale homepage shell markup
- Preventing duplicate navigation implementations
- Removing obsolete references
- Preserving the canonical global loader
- Generating media indexes
- Validating required assets
- Validating release data
- Checking SEO files
- Checking sitemap coverage
- Committing generated changes when appropriate

### `update-latest-videos.yml`

Maintains the latest-video data path and its resolved manifest.

### CI philosophy

Automation is a guardrail, not proof of visual correctness.

A successful workflow cannot prove that a browser rendered the intended geometry, spacing, media behavior, or mobile layout.

---

# 🚀 Deployment Topology

```text
┌───────────────────┐
│   Local Changes   │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│   GitHub / main   │
│ Production Source │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│   GitHub Actions  │
│ Validation / Data │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Generated Assets  │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│      Vercel       │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│   lilsynn.com     │
└───────────────────┘
```

### State model

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

When debugging production, identify which state is wrong before changing code.

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

### Anti-patterns

Do not:

- Add arbitrary offsets to hide structural problems
- Duplicate global components
- Hard-code release order in multiple files
- Guess streaming links from titles
- Randomize canonical data
- Add CSS patches without understanding DOM ownership
- Assume CI proves visual correctness
- Assume GitHub proves deployment correctness
- Remove feature code during shell refactors without testing the feature owner

---

# ⚙️ Performance Philosophy

The site intentionally favors small deterministic browser modules over unnecessary framework overhead.

Priorities include:

- One global shell
- Minimal duplicate DOM
- Minimal redundant network work
- Lazy media where appropriate
- Thumbnail-first video playback
- Muted inline background video
- Responsive media sizing
- Explicit data manifests
- Cache-aware shared assets
- Stable runtime behavior

The goal is a fast and predictable experience after the full shell is active, not merely a fast initial paint.

---

# ♿ Accessibility Philosophy

Accessibility is architectural, not decorative.

Preserve:

- Semantic controls
- Keyboard navigation
- Visible focus
- Meaningful labels
- Correct `aria-expanded`
- Correct `aria-controls`
- Correct `aria-hidden`
- Escape-to-close behavior
- Focus-friendly navigation
- Reduced-motion support
- Responsive layouts without unnecessary overflow

Every new interactive component should be usable without requiring a pointer.

---

# 🔎 SEO & Discoverability

The production system supports:

- Canonical URLs
- Meta descriptions
- Open Graph metadata
- Structured metadata / JSON-LD where applicable
- Sitemap coverage
- Crawlable page structure
- Dedicated 404 handling

The global shell can normalize missing canonical metadata, while page-level metadata remains responsible for page-specific identity.

---

# 🧬 Cache & Versioning

Shared assets may use version query parameters when cache invalidation is required:

```html
<script src="/site-global.js?v=YYYYMMDD"></script>
<link id="site-global-css" rel="stylesheet" href="/site-global.css?v=YYYYMMDD">
```

Cache busting should be intentional. Do not increment versions randomly.

### Global CSS ownership rule

If a page explicitly includes the global stylesheet, it should identify it as the canonical global stylesheet so `site-global.js` does not inject a second copy.

This is especially important on pages such as `404.html`, `releases.html`, `special_access.html`, `privacy.html`, `terms.html`, and `coming_soon.html`.

---

# 🖤 Visual System

The visual language is cinematic, dark, premium, and music-first.

```text
MATTE BLACK
     ×
GOLD
     ×
WHITE
     ×
CHROME / METALLIC DETAIL
     ×
DARK ATMOSPHERE
     ×
CINEMATIC MOTION
```

The website should feel like one artist universe rather than a generic template assembled from unrelated pages.

---

# 📋 Production Change Protocol

### 01 · Inspect
Understand the current implementation before editing it.

### 02 · Identify ownership
Find the file that actually owns the behavior.

### 03 · Trace dependencies
Determine which pages and modules consume the system.

### 04 · Change the owner
Prefer one canonical fix over multiple patches.

### 05 · Remove obsolete behavior
Delete competing implementations when the canonical owner replaces them.

### 06 · Verify
Check data, DOM, responsive geometry, accessibility, and media behavior.

### 07 · Deploy
Move through the actual production pipeline.

### 08 · Confirm
Test the real production runtime.

---

# 🏆 Definition of Done

A production change is **DONE** only when all applicable conditions are true:

```text
[✓] Correct owner changed
[✓] Canonical data preserved
[✓] No competing implementation introduced
[✓] Responsive behavior checked
[✓] Accessibility preserved
[✓] Generated assets current
[✓] CI / validation passed
[✓] Deployment completed
[✓] Production runtime checked
[✓] No regression in shared consumers
```

A change that exists only in source control is **implemented**, not necessarily **verified**.

---

# 🍪 Current QA Status

The latest audit was performed primarily at the **source, dependency, DOM-flow, asset, and architecture level**.

### Confirmed hardening completed

- Global header Special Access duplication removed
- Global header geometry documented
- Global `LS.png` top-art contract documented
- Release archive observer feedback loop fixed
- Latest Videos observer feedback loop fixed
- `Somewhere In-Between` artwork mapping corrected
- Invalid `LG_BG_STARS.webm` reference corrected
- `BG_ANI.webm` competing background implementation removed from Coming Soon
- Undefined `--glow` CSS variable corrected to `--ls-glow`
- Special Access archive player restored after refactor regression
- 404 page aligned with the current global shell

### Verification limitation

Source-level correctness is not the same thing as visual production verification.

The repository should still be checked in a real browser at desktop, tablet, mobile, and narrow-mobile sizes after deployment. Vercel deployment availability or rate limits must also be treated as a separate deployment-state concern.

Do **not** claim a visual production fix is verified solely because GitHub contains the expected code.

---

# 🔗 Official Destinations

| Destination | Purpose |
|---|---|
| [🌐 lilsynn.com](https://lilsynn.com) | Official artist website |
| [💻 GitHub Repository](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL) | Production source |
| [🎵 TikTok](https://www.tiktok.com/@lilsynnofficial) | Official social presence |

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
VERIFY THE REAL RUNTIME
```

---

<div align="center">

## ✦ LIL SYNN

**DARK SOUND. RAW EMOTION. NO LIMITS.**

[![ENTER THE SITE](https://img.shields.io/badge/ENTER_THE_SITE-D4AF37?style=for-the-badge&labelColor=050505)](https://lilsynn.com)

<sub>Production source for the LIL SYNN digital universe.</sub>

</div>
