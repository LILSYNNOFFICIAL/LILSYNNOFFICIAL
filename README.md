<div align="center">

# ✦ LIL SYNN

### THE OFFICIAL DIGITAL HOME OF LIL SYNN

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-lilsynn.com-D4AF37?style=for-the-badge&labelColor=0B0B0B)](https://lilsynn.com)
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![CI](https://img.shields.io/github/actions/workflow/status/LILSYNNOFFICIAL/LILSYNNOFFICIAL/fix-homepage.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/actions)
[![Last Commit](https://img.shields.io/github/last-commit/LILSYNNOFFICIAL/LILSYNNOFFICIAL?style=for-the-badge&label=Last%20Commit)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/commits/main)

<br>

**A cinematic, media-driven artist platform engineered as a unified browser-native experience.**

Music · Releases · Videos · About · Merch · Lyrics · Contact

<br>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub">
<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">

</div>

---

## ◈ What This Is

This repository is the **production source** for the official LIL SYNN website.

It is not just a pile of static pages. The site is structured as a small, browser-native publishing platform with explicit ownership for global UI, release metadata, artwork, streaming destinations, video presentation, media manifests, accessibility, and deployment automation.

The architecture is built around one principle:

> **Build the system once. Make every page use the system. Keep the data authoritative.**

That principle prevents the most expensive class of frontend maintenance bugs: multiple implementations of the same feature slowly drifting apart.

---

## ⚡ Production Snapshot

| System | Status | Owner |
|---|:---:|---|
| Global shell | 🟢 Production | `site-global.js` |
| Global styling | 🟢 Production | `site-global.css` |
| Release database | 🟢 Canonical | `release-catalog.json` |
| Release archive | 🟢 Production | `releases.html` |
| Music randomizer | 🟢 Production | `music-random.js` |
| Latest Videos | 🟢 Production | `latest-videos.js` + manifest |
| Background motion | 🟢 Production | `script.js` + `/assets/mov/` |
| THE CALM | 🟢 Production | Global shell |
| Back To Top | 🟢 Production | Global shell |
| Responsive UI | 🟢 Production | Global CSS |
| Accessibility | 🟢 Required | Global + page layers |
| CI / automation | 🟢 Active | GitHub Actions |
| Deployment | 🟢 Production | Vercel |

---

# ✦ Architecture

## The Three-Layer Rule

The website deliberately separates **data**, **behavior**, and **presentation**.

```text
                         ┌─────────────────────────┐
                         │  release-catalog.json   │
                         │   ★ CANONICAL TRUTH ★   │
                         └────────────┬────────────┘
                                      │
               ┌──────────────────────┼──────────────────────┐
               │                      │                      │
               ▼                      ▼                      ▼
       RELEASE ARCHIVE          MUSIC RANDOMIZER        VIDEO ORDERING
               │                      │                      │
               ▼                      ▼                      ▼
        releases.html           music-random.js       latest-videos.js
               │                      │                      │
               └──────────────────────┼──────────────────────┘
                                      ▼
                           ┌─────────────────────┐
                           │   GLOBAL EXPERIENCE │
                           │ JS + CSS + MEDIA    │
                           └──────────┬──────────┘
                                      ▼
                                EVERY PAGE
```

### Data

`release-catalog.json` is the authoritative source for release identity, ordering, tracks, artwork relationships, and known streaming destinations.

### Behavior

Shared JavaScript owns global interactions and reusable systems. Feature-specific modules own their own deterministic pipelines.

### Presentation

HTML pages render content while consuming the shared systems. Pages must not quietly reinvent global behavior.

---

# ◇ Repository Map

```text
LILSYNNOFFICIAL/
│
├── index.html                 # Main artist landing page
├── releases.html              # Canonical release archive UI
│
├── site-global.js             # ★ Global shell owner
├── site-global.css            # ★ Global visual system
├── script.js                  # Global media + homepage orchestration
├── site-polish.js             # Homepage presentation refinements
├── music-random.js             # Catalog-driven music randomizer
│
├── latest-videos.js            # Latest Releases video renderer
├── latest-videos.json          # Resolved YouTube Releases manifest
├── release-catalog.json        # ★ CANONICAL RELEASE DATABASE
│
├── assets/
│   ├── img/                    # Artist + release artwork
│   ├── images/icons/           # Shared interface artwork
│   ├── mov/                    # Background WebM media
│   └── other/sound/            # Shared audio assets
│
└── .github/
    └── workflows/
        └── fix-homepage.yml    # Automation + architecture guardrails
```

---

# 🧠 Global Shell Contract

`site-global.js` is the **single owner of the global site shell**.

It controls the shared experience across pages, including:

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
- Defensive normalization where required

### 🚫 No Duplicate Global Systems

There must never be competing implementations of:

```text
HEADER
NAVIGATION
NAVIGATION DRAWER
FOOTER
THE CALM
BACK TO TOP
GLOBAL SHELL CONTROLS
```

If a global feature needs to change, modify its owner. Do not create another implementation and hope the browser chooses the right one.

---

# 👑 Header Architecture

The header is a **viewport-level global component**, not a page-specific decoration.

```text
┌──────────────────────────────────────────────────────────────┐
│ SPECIAL ACCESS        ┌──────────────┐              MENU     │
│                       │  LS_LOGO.png │                       │
│                       └──────────────┘                       │
│                                                              │
│ THE CALM                                                     │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                         LS.png artwork
```

### Header invariants

1. Header begins flush with the top of the viewport.
2. Header spans the full viewport width.
3. Header has intentional vertical height rather than artificial page offset.
4. `LS_LOGO.png` is mathematically centered independently of side controls.
5. Logo scaling must not change the true center position.
6. Special Access remains independently anchored.
7. THE CALM remains independently positioned.
8. `LS.png` begins exactly at the bottom boundary of the global header.
9. Pages do not add their own header compensation when the shell already owns the geometry.
10. Responsive rules belong to the global shell, not individual page hacks.

This independent-positioning model prevents one control from pushing another control out of alignment.

---

# 🎬 Global Motion System

Background motion lives under:

```text
/assets/mov/
```

The build workflow generates:

```text
/assets/mov/index.json
```

The global background system:

1. Creates or adopts the document-level background video.
2. Loads the generated media manifest.
3. Selects an available WebM.
4. Plays it muted and inline.
5. Uses cover-style viewport presentation.
6. Maintains readable contrast behind foreground content.
7. Falls back gracefully when media cannot be resolved.

Adding a new `.webm` to `assets/mov/` makes it eligible after the manifest is regenerated.

**One background system. One owner. No page-specific clones.**

---

# 🌙 THE CALM

THE CALM is a global ambient experience control.

Audio source:

```text
/assets/other/sound/Background.mp3
```

The controller belongs to the global shell and maintains one authoritative playback state across the site.

---

# ⬆ Back To Top

Global Back To Top uses:

```text
/assets/images/icons/UP_ARROWS.png
```

Pages should not create competing versions of this control.

---

# 🎵 Music Engine

## RANDOMIZE

The homepage Music section uses a single catalog-driven **RANDOMIZE** feature.

```text
release-catalog.json
        ↓
canonical release data
        ↓
track pool
        ↓
validation + deduplication
        ↓
random presentation selection
        ↓
music cards
```

`music-random.js` may:

- Read canonical release data
- Build a playable track pool
- Resolve artwork
- Resolve approved streaming destinations
- Exclude intentionally restricted releases
- Deduplicate tracks
- Randomize presentation
- Preserve useful session state

It must **never become a second release database**.

### SoundCloud-only content

`Touching to the North` is intentionally SoundCloud-only.

Generic streaming fallback logic must respect that restriction rather than manufacturing Spotify or Apple Music destinations.

---

# 💿 Release Archive

`release-catalog.json` is the **single canonical release database**.

It owns:

- Release order
- Release types
- Albums
- EPs
- Singles
- Track order
- Artwork relationships
- Spotify destinations
- Apple Music destinations
- SoundCloud destinations
- SoundCloud sets where applicable

`releases.html` is a renderer and presentation layer. It does not redefine catalog truth.

### Track order

Track rows come directly from each catalog `tracks` array.

The renderer must not silently alphabetize, reverse, randomize, or mutate canonical track arrays.

### Archive order

Explicit catalog ordering is authoritative. User-facing sort controls may change presentation without mutating the source data.

Supported presentation filters include:

- All
- Albums
- EPs
- Singles

Ordering views may include:

- Catalog order
- A → Z
- Z → A

---

# 🔐 Release Identity & Streaming Integrity

A release title alone is not enough to safely infer a streaming destination.

> **Exact release identity wins.**

This prevents similarly named releases from accidentally inheriting one another's links or artwork.

## Signal Light Sermon

The `Signal Light Sermon` entry associated with `Touching to the North` remains a SoundCloud-only catalog identity.

It must not inherit destinations belonging to the separate remastered release.

## Signal Light Sermon (Remastered 2026)

This is a separate standalone release with its own artwork and streaming destinations.

## Touching to the North

| Destination | Allowed |
|---|:---:|
| SoundCloud track | ✅ |
| SoundCloud set | ✅ |
| Spotify | ❌ |
| Apple Music | ❌ |

---

# 🖼 Artwork Integrity

Artwork is structured release data, not a filename guessing game.

When an explicit mapping exists, the renderer should consume that mapping.

If artwork fails:

```text
1. Verify release identity
2. Verify catalog mapping
3. Verify exact filename
4. Verify asset directory
5. Verify generated URL/path
6. Verify renderer behavior
```

Do not create duplicate assets or random JavaScript patches to hide a broken source mapping.

---

# 📺 Latest Releases Videos

The homepage Latest Videos system is powered by:

```text
latest-videos.json
```

The manifest contains resolved YouTube Releases metadata such as:

- Video ID
- Title
- Published timestamp
- Associated release

### Ownership model

> **YouTube provides the video source. The release catalog controls release order.**

`latest-videos.js` is responsible for:

1. Loading canonical release data.
2. Loading the video manifest.
3. Avoiding stale cache where appropriate.
4. Deduplicating by video identity and normalized title.
5. Matching videos to canonical releases.
6. Following release-catalog order.
7. Preventing duplicate release/video selection.
8. Rendering the intended video count.
9. Providing thumbnail-first playback.
10. Switching to a privacy-enhanced YouTube embed when playback is requested.

A source reorder on YouTube must not silently rewrite the site's canonical release presentation.

---

# ♿ Accessibility Contract

Accessibility is an architectural requirement.

Preserve:

- Keyboard navigation
- Visible focus states
- Meaningful image alt text
- Correct `aria-expanded` state
- Correct `aria-controls` relationships
- Appropriate `aria-hidden` state
- Accessible button labels
- Escape-to-close behavior
- Focus-friendly drawers and dialogs
- Reduced-motion considerations
- Responsive layouts without unnecessary horizontal overflow

New interactive components must not depend exclusively on pointer or touch input.

---

# 📱 Responsive Engineering

The experience must remain coherent across:

`Desktop` · `Laptop` · `Tablet` · `Mobile` · `Narrow Mobile`

### Golden rule

> **Never solve a responsive problem by creating another version of the global shell.**

Instead:

1. Identify the owning component.
2. Adjust its responsive rules.
3. Verify neighboring controls.
4. Verify mobile overflow.
5. Verify desktop alignment.

The global header is particularly sensitive because logo geometry, controls, navigation, and top artwork interact spatially.

---

# 🤖 GitHub Actions

Automation lives under:

```text
.github/workflows/fix-homepage.yml
```

The workflow acts as an architectural guardrail and can handle responsibilities such as:

- Removing obsolete homepage shell markup
- Preventing duplicate navigation implementations
- Removing stale legacy references
- Preserving the canonical global loader
- Generating the WebM media manifest
- Validating required files and media
- Checking release data integrity
- Validating SEO-related files
- Validating sitemap coverage
- Committing generated changes when appropriate

Automation should protect the architecture, not conceal failures.

A green workflow is not the same thing as browser-level visual verification.

---

# 🚀 Deployment Pipeline

```text
┌──────────────────┐
│ Developer Change │
└────────┬─────────┘
         ▼
┌──────────────────┐
│   GitHub / main  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ GitHub Actions   │
│ Validation / CI  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Generated Assets │
└────────┬─────────┘
         ▼
┌──────────────────┐
│     Vercel       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│   lilsynn.com    │
└──────────────────┘
```

`main` is the production source branch.

When diagnosing production behavior, distinguish between:

- Source state
- Generated asset state
- GitHub Actions state
- Vercel deployment state
- Browser cache state
- Runtime DOM state

A GitHub commit alone is not proof of production verification.

---

# 🧬 Cache Strategy

Shared JavaScript and CSS may use cache-busting query parameters when appropriate.

Example:

```html
<script src="/site-global.js?v=YYYYMMDD"></script>
```

When a shared asset changes, ensure production clients can receive the new version without requiring users to manually fight stale browser caches.

---

# 🧹 Legacy Code Policy

Legacy code is removed when its responsibility has been absorbed by the canonical system.

Do not preserve obsolete code merely because it once worked.

Do not add another workaround when the existing owner can be fixed correctly.

### Preferred maintenance pattern

```text
BUG
 ↓
Identify owner
 ↓
Trace data flow
 ↓
Fix root cause
 ↓
Remove obsolete workaround
 ↓
Validate dependent systems
 ↓
Deploy
 ↓
Verify real browser behavior
```

---

# 🛡 Engineering Principles

### 01 · Single ownership
Every global feature has one authoritative owner.

### 02 · Canonical data
Release truth lives in `release-catalog.json`.

### 03 · Deterministic software first
Use explicit code and structured data for deterministic work. Do not add unnecessary complexity where simple browser logic is sufficient.

### 04 · Presentation does not mutate truth
UI sorting, filtering, and randomization operate on derived views rather than corrupting canonical data.

### 05 · Fix causes, not symptoms
A CSS patch that hides a structural problem is not a completed fix.

### 06 · Reuse before duplication
If the site already has a system for something, extend it instead of creating a second one.

### 07 · Production verification matters
Source control, CI, deployment, and browser runtime are separate states and must be treated as such.

---

# 🧪 QA Checklist

Before considering a major change complete:

### Global shell

- [ ] Header starts flush at viewport top
- [ ] Header height is correct
- [ ] `LS_LOGO.png` is correctly sized
- [ ] Logo remains mathematically centered
- [ ] `LS.png` begins exactly at the header boundary
- [ ] Special Access remains aligned
- [ ] THE CALM remains aligned
- [ ] Navigation opens and closes correctly
- [ ] Footer appears once
- [ ] No duplicate shell exists

### Media

- [ ] Background WebM loads
- [ ] Manifest resolves correctly
- [ ] THE CALM audio works
- [ ] Back To Top works
- [ ] Latest Videos do not duplicate
- [ ] Latest Videos follow canonical release order

### Releases

- [ ] Catalog order is correct
- [ ] Track order is correct
- [ ] Artwork mappings are correct
- [ ] Streaming links match exact release identity
- [ ] SoundCloud-only content stays restricted
- [ ] Remastered releases remain separate identities

### Responsive

- [ ] Desktop verified
- [ ] Tablet verified
- [ ] Mobile verified
- [ ] Narrow mobile verified
- [ ] No unintended horizontal overflow
- [ ] Header controls do not collide

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states remain visible
- [ ] Buttons have meaningful labels
- [ ] ARIA state is accurate
- [ ] Escape behavior works
- [ ] Reduced-motion behavior is respected where applicable

### Production

- [ ] GitHub Actions passes
- [ ] Generated assets are current
- [ ] Deployment completes
- [ ] Production URL is tested
- [ ] Browser cache behavior is checked

---

# 📊 System Mental Model

The easiest way to reason about the site is:

```text
                  ┌─────────────────────┐
                  │  CANONICAL DATA     │
                  │ release-catalog.json│
                  └──────────┬──────────┘
                             │
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
          Music           Releases         Videos
             │               │               │
             └───────────────┼───────────────┘
                             ▼
                  ┌─────────────────────┐
                  │  GLOBAL SHELL       │
                  │ JS + CSS + MEDIA    │
                  └──────────┬──────────┘
                             ▼
                  ┌─────────────────────┐
                  │     EVERY PAGE      │
                  └─────────────────────┘
```

When something breaks, ask:

> **Is the problem data, behavior, presentation, generated assets, deployment, or runtime state?**

That question usually identifies the correct layer faster than adding another patch.

---

# 🔧 Change Workflow

For production changes:

```text
1. Inspect the current architecture
2. Identify the canonical owner
3. Trace dependencies
4. Make the smallest correct change
5. Remove obsolete competing behavior
6. Run validation / CI
7. Review generated assets
8. Deploy
9. Test the actual production page
10. Confirm no regression across shared consumers
```

### Never

- Create duplicate global shells
- Hard-code release order in page JavaScript
- Guess streaming URLs from titles
- Randomize canonical data
- Hide structural bugs with arbitrary offsets
- Add page-specific copies of global controls
- Declare a deployment successful without checking production behavior

---

# ✦ Brand Direction

The site intentionally supports the LIL SYNN visual identity:

```text
MATTE BLACK
     ×
GOLD
     ×
WHITE
     ×
CHROME / METALLIC DETAIL
     ×
DARK CINEMATIC ATMOSPHERE
```

The visual system should feel like one premium artist platform rather than a generic template.

---

# 🔗 Official Destinations

| Destination | Link |
|---|---|
| 🌐 Official Website | [lilsynn.com](https://lilsynn.com) |
| 💻 Source Repository | [GitHub](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL) |
| 🎵 TikTok | [@lilsynnofficial](https://www.tiktok.com/@lilsynnofficial) |

---

# 👑 Maintainer Rules

This repository is production infrastructure for the LIL SYNN digital experience.

When contributing, preserve the architecture before adding features.

If a feature appears to require a new global implementation, stop and ask:

> **Does the site already have an owner for this?**

If yes, extend that system.

If no, define the ownership clearly before implementing it.

---

<div align="center">

## LIL SYNN

**One shell. One source of truth. One experience.**

<br>

[![Website](https://img.shields.io/badge/ENTER_THE_SITE-D4AF37?style=for-the-badge&labelColor=0B0B0B)](https://lilsynn.com)

<sub>Built for the LIL SYNN digital universe.</sub>

</div>
