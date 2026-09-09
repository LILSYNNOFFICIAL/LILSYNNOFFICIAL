<div align="center">

# ✦ LIL SYNN

### THE OFFICIAL DIGITAL HOME OF LIL SYNN

[![Live Site](https://img.shields.io/badge/🌐_LIVE_SITE-lilsynn.com-D4AF37?style=for-the-badge&labelColor=050505)](https://lilsynn.com)
[![Source](https://img.shields.io/badge/SOURCE-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)
[![CI](https://img.shields.io/github/actions/workflow/status/LILSYNNOFFICIAL/LILSYNNOFFICIAL/fix-homepage.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/actions)
[![Last Commit](https://img.shields.io/github/last-commit/LILSYNNOFFICIAL/LILSYNNOFFICIAL?style=for-the-badge&label=LAST%20COMMIT)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/LILSYNNOFFICIAL/LILSYNNOFFICIAL?style=for-the-badge&label=REPO%20SIZE)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)

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

It is deliberately engineered as a lightweight publishing platform rather than a collection of unrelated pages. The site combines static HTML, global browser-native JavaScript, a centralized CSS shell, structured JSON data, media manifests, artwork assets, API endpoints, and GitHub automation into one controlled system.

The architectural doctrine is:

> **One shell. One source of truth. Explicit ownership. Deterministic rendering. Production verification.**

The goal is not maximum framework complexity. The goal is maximum control over a fast, cinematic artist experience.

---

## ⚡ Production Control Panel

| Domain | State | Canonical Owner |
|---|:---:|---|
| Global shell | 🟢 | `site-global.js` |
| Global CSS | 🟢 | `site-global.css` |
| Release truth | 🟢 | `release-catalog.json` |
| Release archive | 🟢 | `releases.html` |
| Music randomization | 🟢 | `music-random.js` |
| Latest Releases videos | 🟢 | `latest-videos.js` + manifest |
| Background motion | 🟢 | `script.js` + `assets/mov/` |
| Ambient audio | 🟢 | THE CALM / global shell |
| Back To Top | 🟢 | global shell |
| SEO / metadata | 🟢 | page + global systems |
| Accessibility | 🟢 | global + page layers |
| Automation | 🟢 | GitHub Actions |
| Production delivery | 🟢 | Vercel |

> **Important:** repository state, CI state, deployment state, browser cache state, and runtime DOM state are separate systems. A commit is not visual proof of a production fix.

---

# 🧬 System Architecture

## The Core Model

The site is organized around three primary concerns:

```text
┌──────────────────────────────────────────────────────────────┐
│                         DATA LAYER                           │
│                                                              │
│                  release-catalog.json                        │
│                  latest-videos.json                          │
│                  media manifests                            │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       BEHAVIOR LAYER                         │
│                                                              │
│ site-global.js │ script.js │ music-random.js │ latest-videos │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│                                                              │
│ HTML │ site-global.css │ page CSS │ assets │ media           │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │  EVERY PAGE / DOM  │
                    └────────────────────┘
```

### Architectural law

**Presentation may consume data. Behavior may derive views from data. Neither should silently redefine canonical truth.**

---

# 👑 Global Shell Architecture

`site-global.js` is the **single authoritative owner of the shared site shell**.

It injects and normalizes the global experience across pages, including:

- Global header
- Navigation drawer
- Navigation groups
- Social destinations
- Streaming destinations
- Footer
- THE CALM
- Back To Top
- Shared metadata normalization
- About accordion behavior
- Keyboard interaction
- Escape-to-close behavior
- Body scroll locking
- Duplicate shell cleanup
- Global top artwork insertion
- Global media-loader coordination

### Shell lifecycle

```text
PAGE LOAD
   │
   ▼
site-global.js
   │
   ├── inject global CSS
   ├── normalize metadata
   ├── remove competing legacy shell nodes
   ├── create global header
   ├── create global footer
   ├── attach global top artwork
   ├── initialize navigation
   ├── initialize Back To Top
   ├── bind THE CALM
   ├── initialize About controls
   └── load global motion system
```

The shell is designed to be **idempotent**: running the initialization path should not produce multiple global headers, multiple footers, or duplicate shared controls.

---

# 👑 Header Geometry Contract

The header architecture is intentionally simple and precise.

```text
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                  ┌──────────────────────┐                      │
│                  │     LS_LOGO.png      │                      │
│                  │   TRUE CENTER AXIS   │                      │
│                  └──────────────────────┘                      │
│                                                                │
│ THE CALM                                           ☰ MENU      │
└────────────────────────────────────────────────────────────────┘
                              │
                              │ EXACT BOUNDARY
                              ▼
                    ┌────────────────────┐
                    │      LS.png        │
                    │   GLOBAL TOP ART   │
                    └────────────────────┘
```

### What is actually global

The header contains:

- `LS_LOGO.png` as the centered brand mark
- `THE CALM` positioned independently at the lower-left area
- The hamburger navigation control at the right

### What is **NOT** in the header

**Special Access does not belong in the header.**

`LS_HEADPHONES.png` is the Special Access artwork and is currently part of the **footer experience**, where it links to `/special_access.html`.

This distinction is intentional and is now documented as a hard architectural rule.

### Header invariants

1. The header begins flush at the viewport top.
2. The header spans the viewport width.
3. `LS_LOGO.png` remains mathematically centered.
4. Logo scaling does not allow side controls to push the center axis.
5. THE CALM is positioned independently from the logo.
6. The menu control is positioned independently from the logo.
7. `LS.png` begins directly at the header's bottom boundary.
8. No page invents a competing header offset.
9. Mobile geometry is controlled by the global shell.
10. Header changes must be verified at desktop and mobile widths.

---

# 🎧 Special Access / Footer Identity

The Special Access entry point uses:

```text
/assets/images/icons/LS_HEADPHONES.png
```

Its current architectural home is the **global footer**, not the header.

```text
GLOBAL FOOTER
      │
      ├── LIL
      │
      ├── LS_HEADPHONES.png
      │        │
      │        └── /special_access.html
      │
      └── SYNN
```

The footer artwork is therefore both a visual identity element and a navigation affordance.

Do not move `LS_HEADPHONES.png` into the header unless the global shell architecture is intentionally redesigned.

---

# 🖼 Global Top Artwork

`LS.png` is not treated as ordinary page content.

The global shell creates a dedicated top-art container immediately after the header:

```text
<header class="ls-header">
        │
        ▼
<div class="ls-global-top-art">
        │
        └── /assets/img/LS.png
</div>
        │
        ▼
page content
```

This gives the artwork a predictable relationship to the header across pages.

The intended rule is:

> **Header ends → LS.png begins → page content follows.**

No arbitrary top margin should be required to visually reconnect those pieces.

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
├── script.js                   ← GLOBAL MOTION / HOMEPAGE
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

# 💿 Canonical Release Data Architecture

`release-catalog.json` is the **single source of truth** for release identity and ordering.

It currently models:

- Explicit release order
- Release groups
- Album / EP / single type information
- Track arrays
- Streaming destinations
- Artwork relationships
- SoundCloud sets
- Release-specific restrictions

```text
                    release-catalog.json
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
       RELEASES            TRACKS          DESTINATIONS
          │                  │                  │
          ▼                  ▼                  ▼
     Archive UI        Music Randomizer    Stream Links
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                        PRESENTATION
```

### Data ownership rule

If release order changes, change the catalog.

If track order changes, change the catalog.

If a streaming destination changes, change the catalog.

If artwork mapping changes, change the authoritative mapping.

Do not bury canonical data inside presentation JavaScript.

---

# 🔐 Release Identity Integrity

Release matching must be identity-aware.

A title string alone is not a safe foreign key because releases can share names or have remastered variants.

### Required behavior

```text
Exact identity
     ↓
Resolve release metadata
     ↓
Resolve artwork
     ↓
Resolve streaming destinations
     ↓
Render presentation
```

### Signal Light Sermon separation

The `Signal Light Sermon` associated with `Touching to the North` must remain distinct from `Signal Light Sermon (Remastered 2026)`.

They are separate catalog identities and must not inherit one another's artwork or streaming links.

### Touching to the North

`Touching to the North` is intentionally SoundCloud-only.

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

It derives a playable presentation pool from canonical release data.

```text
CANONICAL CATALOG
       │
       ▼
DERIVED TRACK POOL
       │
       ▼
VALIDATE
       │
       ▼
DEDUPLICATE
       │
       ▼
APPLY RELEASE RESTRICTIONS
       │
       ▼
RANDOMIZE PRESENTATION
       │
       ▼
RENDER MUSIC CARDS
```

The critical distinction is:

> **Random presentation is allowed. Randomized canonical data is not.**

---

# 📺 Latest Releases Video Architecture

Latest Videos uses two cooperating sources:

```text
YouTube API / resolver
          │
          ▼
 latest-videos.json
          │
          ├──────────────┐
          ▼              ▼
   video identity    publication data
          │              │
          └──────┬───────┘
                 ▼
       latest-videos.js
                 │
                 ▼
        release-catalog.json
                 │
                 ▼
       CANONICAL RELEASE ORDER
                 │
                 ▼
          HOMEPAGE VIDEO UI
```

### Ownership rule

> **YouTube provides video source data. The release catalog controls release ordering.**

The renderer is responsible for deduplication, identity matching, ordering, intended video count, thumbnail-first playback, and privacy-enhanced playback behavior.

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

The pipeline is:

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
contrast overlay
    ↓
page content
```

The motion system is global. It must not be duplicated per page.

---

# 🌙 THE CALM

THE CALM is a global ambient-audio control.

Primary source:

```text
/assets/other/sound/Background.mp3
```

The global shell binds the control to the shared audio element and coordinates it with foreground video playback.

The intended result is one coherent ambient-audio state rather than multiple pages fighting over playback.

---

# ⬆ Back To Top

Back To Top is globally owned and uses:

```text
/assets/images/icons/UP_ARROWS.png
```

It appears once and is injected by the shell.

---

# 🧠 Runtime Lifecycle & DOM Ownership

The site uses browser-native DOM orchestration rather than a framework runtime.

That makes **ownership boundaries** especially important.

```text
HTML PAGE
   │
   ├── page content
   │
   └── global loader
           │
           ▼
     site-global.js
           │
           ├── global shell
           ├── global top art
           ├── global controls
           └── shared behavior
                    │
                    ▼
             feature modules
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      Music       Videos    Homepage
```

### Defensive DOM rules

Shared scripts may normalize the DOM defensively, but defensive cleanup must never become an excuse for unclear ownership.

When a duplicate appears, trace **who created it** before adding another removal rule.

---

# 🧱 Architectural Invariants

These are the rules that should survive future redesigns:

| Invariant | Requirement |
|---|---|
| Global shell | One authoritative implementation |
| Header | Flush to viewport top |
| Brand logo | Independently centered |
| `LS.png` | Begins at header boundary |
| `LS_HEADPHONES.png` | Footer Special Access artwork |
| THE CALM | Global, single owner |
| Back To Top | Global, single owner |
| Release order | Catalog-owned |
| Track order | Catalog-owned |
| Streaming identity | Exact-release aware |
| Randomization | Presentation-only |
| Video ordering | Catalog-aware |
| WebM background | Global, single owner |
| Responsive rules | Global shell owns global geometry |
| Accessibility | Required, not optional |
| Production verification | Browser/runtime validation required |

---

# 🧪 Verification Matrix

A serious change is not finished when the code compiles or a commit exists.

### Global shell

- [ ] Header starts at viewport `0`
- [ ] Header height is intentional
- [ ] `LS_LOGO.png` is correctly sized
- [ ] Logo center remains stable
- [ ] THE CALM remains independently anchored
- [ ] Menu remains independently anchored
- [ ] `LS.png` begins immediately after header
- [ ] No duplicate header exists
- [ ] No duplicate footer exists
- [ ] Special Access remains in footer
- [ ] `LS_HEADPHONES.png` links correctly

### Data

- [ ] Catalog JSON parses
- [ ] Explicit release order is preserved
- [ ] Track order is preserved
- [ ] Release identities remain distinct
- [ ] Streaming restrictions remain intact
- [ ] Artwork mappings resolve

### Media

- [ ] WebM manifest resolves
- [ ] Background motion loads
- [ ] Contrast overlay remains readable
- [ ] THE CALM works
- [ ] Video playback pauses ambient audio appropriately
- [ ] Latest Videos deduplicate correctly
- [ ] Latest Videos follow canonical release order

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

- [ ] Keyboard navigation
- [ ] Visible focus states
- [ ] Meaningful labels
- [ ] Accurate ARIA state
- [ ] Escape closes navigation
- [ ] Body scroll locking behaves correctly
- [ ] Reduced-motion behavior is respected

### Production

- [ ] CI passes
- [ ] Generated assets are current
- [ ] Deployment completes
- [ ] Production URL responds
- [ ] Real browser behavior checked
- [ ] Cache behavior checked
- [ ] Shared consumers checked for regression

---

# 🤖 Automation & CI

GitHub Actions provide repository-level automation and guardrails.

### `fix-homepage.yml`

The workflow supports architectural hygiene tasks such as:

- Removing stale homepage shell markup
- Preventing duplicate navigation implementations
- Removing legacy references
- Preserving the canonical global loader
- Generating media indexes
- Validating required assets
- Validating release data
- Checking SEO-related files
- Checking sitemap coverage
- Committing generated changes when appropriate

### `update-latest-videos.yml`

The repository also maintains a dedicated workflow for the latest-video data path.

Automation is a guardrail, not a substitute for human browser verification.

---

# 🚀 Deployment Topology

```text
┌───────────────────┐
│   Local Changes   │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│   GitHub / main   │
│  Production Source│
└─────────┬─────────┘
          ▼
┌───────────────────┐
│  GitHub Actions   │
│ Validation / Data │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Generated Assets  │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│      Vercel       │
└─────────┬─────────┘
          ▼
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

When debugging production, identify which state is actually wrong before changing code.

---

# 🧹 Root-Cause Engineering

The preferred debugging sequence is:

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

---

# ⚙️ Performance Philosophy

The site intentionally favors small deterministic browser modules over unnecessary framework overhead.

Performance priorities include:

- Avoiding duplicate global systems
- Avoiding redundant network work
- Lazy-loading expensive media where appropriate
- Thumbnail-first video playback
- Muted inline background video
- Responsive media sizing
- Cache-aware shared assets
- Minimal DOM duplication
- Explicit data manifests

The performance goal is not simply a fast first paint. It is a **fast, stable, predictable experience after the entire shell is active**.

---

# ♿ Accessibility Philosophy

Accessibility is part of the architecture.

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

The production system includes dedicated support for:

- Canonical URLs
- Meta descriptions
- Open Graph metadata
- Structured metadata / JSON-LD where applicable
- Sitemap coverage
- Crawlable page structure
- Dedicated 404 handling

The global shell normalizes missing canonical metadata where appropriate, while page-level metadata remains responsible for page-specific identity.

---

# 🧬 Cache & Versioning

Shared assets may use version query parameters when a deployment requires cache invalidation:

```html
<script src="/site-global.js?v=YYYYMMDD"></script>
<link rel="stylesheet" href="/site-global.css?v=YYYYMMDD">
```

Cache busting should be intentional. Do not increment versions randomly without a changed asset or deployment reason.

---

# 🖤 Visual System

The visual language is intentionally cinematic, dark, premium, and music-first.

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

The website should feel like a single artist universe, not a generic template with disconnected pages.

---

# 📋 Production Change Protocol

Before modifying a shared feature:

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
Move through the production pipeline.

### 08 · Confirm
Test the actual production runtime.

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

# 🔗 Official Destinations

| Destination | Purpose |
|---|---|
| [🌐 lilsynn.com](https://lilsynn.com) | Official artist website |
| [💻 GitHub Repository](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL) | Production source |
| [🎵 TikTok](https://www.tiktok.com/@lilsynnofficial) | Official social presence |

---

# 👑 Maintainer Doctrine

This repository is production infrastructure for the LIL SYNN digital universe.

The standard is not **"does this patch make the page look right?"**

The standard is:

> **Does the architecture now express the correct truth cleanly, globally, and predictably?**

When in doubt:

```text
ONE OWNER
ONE SOURCE OF TRUTH
ONE GLOBAL EXPERIENCE
ZERO DUPLICATE SYSTEMS
```

---

<div align="center">

## ✦ LIL SYNN

**DARK SOUND. RAW EMOTION. NO LIMITS.**

[![ENTER THE SITE](https://img.shields.io/badge/ENTER_THE_SITE-D4AF37?style=for-the-badge&labelColor=050505)](https://lilsynn.com)

<sub>Production source for the LIL SYNN digital universe.</sub>

</div>
