# 🌐 LIL SYNN OFFICIAL

**The official digital home of LIL SYNN — music, releases, visuals, the LIL SYNN Universe, video, special access, and the complete Suno V6 creator knowledge base.**

[Open the GitHub Pages preview →](https://lilsynnofficial.github.io/LILSYNNOFFICIAL/)

---

<!-- MAIN-SURFACE-QA:START -->
## 🩺 MAIN SURFACE QA

**🔴 QA: FAIL**

| Surface | Status |
|---|---|
| Main | 🟢 **PASS** |
| Command | 🔴 **FAIL** |
| Admin | 🔴 **FAIL** |
| Suno | 🟢 **PASS** |

**Tested commit:** `ddb4a3a`  
**Checked:** 2026-09-16 04:47 UTC  
**Workflow run:** `35056943535`

> This status is generated automatically. README-only commits are excluded from this workflow, so the QA status update cannot recursively trigger another QA run.

<!-- MAIN-SURFACE-QA:END -->

> **Current source-of-truth note:** `main` is the production source tree. The current root homepage is `index.html`, which is the former `index2.html` design. The previous homepage is preserved as `index3.html`. `index2.html` is no longer present.

---

# 📌 What This Repository Is

This repository is the source of truth for the LIL SYNN website and its supporting creator knowledge systems.

It contains:

- The public LIL SYNN artist website
- The current production homepage
- Releases and Archive systems
- Visual Gallery and LIL SYNN Universe systems
- Signal/transmission behavior
- THE CALM ambient layer
- Shared global navigation and shell
- Command and Admin surfaces
- Vercel routing and deployment configuration
- Automated repository and browser QA
- The `/Suno/` Suno V6 knowledge base
- Suno creation, control, production, repair/testing, research, and master-reference material
- Media, artwork, structured data, JSON catalogs, scripts, and supporting tools

The project is intentionally browser-native and primarily static: HTML + CSS + JavaScript + canonical JSON + media, with GitHub Actions providing automated structural/browser verification and Vercel providing deployment.

---

# 🧭 Current Production State

## Homepage

```text
/              → index.html
/index.html    → current NEW homepage design
/index3.html   → preserved previous homepage design
/index2.html   → removed
```

The new design formerly stored as `index2.html` has been promoted to the production root. Do not describe `index2.html` as an existing production file; it is not.

The current homepage includes the established LIL SYNN identity, cinematic hero treatment, background media, navigation, Buttondown signup, PRE-SAVE destination, VOTE 4 LIL SYNN, coming-soon messaging, and mobile-responsive behavior.

Primary homepage media includes:

```text
/assets/mov/HERO_BG_WEBM.webm
/assets/mov/LS_BG_STARS.webm
```

---

# 🏗️ Main Site Architecture

```text
CANONICAL DATA
├── release-catalog.json
├── latest-videos.json
└── transmissions.json
        │
        ▼
GLOBAL SHELL / BEHAVIOR
├── site-global.js
├── site-global.css
├── script.js
├── music-random.js
├── latest-releases.js
├── latest-videos.js
└── signal-engine.js
        │
        ▼
EXPERIENCES
├── Releases
├── Archive
├── Release Detail
├── Gallery
├── Universe
├── Videos
├── Special Access
├── Command
└── Admin
        │
        ▼
PRESENTATION
└── HTML + CSS + JavaScript + media assets
```

### Architectural doctrine

> **One shell. One source of truth. Explicit ownership. Deterministic rendering. Root-cause fixes. Real verification.**

Do not create a second system when an existing canonical system already owns the behavior.

---

# 👑 Global Shell

`site-global.js` owns shared site behavior wherever the global shell is used.

It provides or coordinates:

- Universal header
- Universal footer
- Hamburger navigation
- THE CALM control
- Back To Top
- About controls
- Escape/keyboard behavior
- Body scroll locking
- Global `LS.png` top artwork
- Skip navigation
- MusicGroup structured data
- Signal loading
- Latest Releases loading
- Random music discovery
- Shared easter-egg behavior

### Header contract

- Desktop header: `150px`
- Mobile header: `118px`
- `LS_LOGO.png` remains independently centered
- Header begins at viewport top (`top: 0`)
- THE CALM remains lower-left
- Menu remains right-aligned
- `LS.png` begins at the exact bottom boundary of the header
- `LS_HEADPHONES.png` remains footer-only and links to Special Access
- Releases, Archive, Visuals, and Universe remain available through navigation
- Page-specific duplicate global headers are not the preferred architecture

### Easter eggs

- Five logo clicks trigger the Signal layer
- Keyboard sequence `L I L S Y N` triggers the same Signal layer

---

# 💿 Canonical Release Architecture

`release-catalog.json` is the single source of truth for:

- Release order
- Release identity
- Release type
- Album/EP track sets
- Track identity
- Spotify destinations
- Apple Music destinations
- SoundCloud destinations
- Platform availability restrictions

Latest Releases must derive from canonical catalog data rather than maintaining a competing hand-written release list.

Track URLs should resolve to their canonical parent release where applicable.

---

# 📚 Releases vs Archive

### Releases

```text
/releases.html
```

Curated presentation of releases, artwork, release type, track context, filtering, and direct release experiences.

### Archive

```text
/archive.html
```

Discovery-oriented catalog layer with release search, track search, release-type filters, platform filters, sorting, A-Z/Z-A sorting, release-set artwork, parent-release context, and shareable query state.

**Rule:** Releases are presentation. Archive is exploration.

---

# 🖼️ Visual System

Reuse existing production assets before creating replacements.

Known core assets include:

```text
/assets/images/icons/LS_LOGO.png
/assets/images/icons/UP_ARROWS.png
/assets/images/icons/LS_HEADPHONES.png
/assets/img/LS.png
/assets/images/icons/album_art/
/assets/mov/LS_BG_STARS.webm
/assets/mov/HERO_BG_WEBM.webm
/assets/other/sound/Background.mp3
```

The repository already contains established release artwork and LIL SYNN visual assets. Audit the repository before requesting or generating a replacement.

**Do not ask the owner to recreate or re-upload an asset that already exists in the repository.**

---

# 📡 Signal / Transmission / Universe

`transmissions.json` is the canonical source for Signal-related transmission history and Universe narrative data.

It supports the site's Signal/easter-egg layer, Universe history, transmission discovery, and related Oracle behavior.

Transmission copy must not claim that something is the latest release unless the canonical release catalog establishes that ordering.

---

# 🎧 Music Discovery

The site does not use the previously proposed persistent personal/native music player architecture.

The intended journey is:

```text
DISCOVER → ENGAGE → OFFICIAL PLATFORM → STREAM / WATCH
```

Primary discovery surfaces include:

- Latest Releases
- Randomize
- Releases
- Archive Explorer
- Release Detail
- Spotify
- Apple Music
- SoundCloud
- YouTube

THE CALM is intentionally separate from foreground music discovery.

---

# 🎬 Global Motion

`script.js` owns global background-video behavior.

Primary background asset:

```text
/assets/mov/LS_BG_STARS.webm
```

Layering law:

```text
Background Video
      ↓
Overlay
      ↓
Global Shell / Page Content
```

Reduced-motion and low-power behavior should reduce visual intensity instead of creating duplicate rendering systems.

---

# 🌙 THE CALM

THE CALM is a globally owned ambient/environment layer and remains separate from foreground music discovery.

Primary source:

```text
/assets/other/sound/Background.mp3
```

Foreground playback may pause or mute THE CALM to avoid competing audio ownership.

---

# 🧠 DOM / Ownership Rules

```text
HTML PAGE
   ↓
GLOBAL SHELL
   ├── header
   ├── navigation
   ├── footer
   ├── global top art
   ├── shared controls
   ├── latest releases
   ├── random discovery
   └── shared behavior
          ↓
     FEATURE MODULES
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

When a duplicate or regression appears, identify the canonical owner before adding another patch layer.

---

# 🩺 Automated QA

The repository has multiple QA layers. They are intentionally different.

## Site Doctor

```text
.github/workflows/site-doctor.yml
          ↓
Node 22
          ↓
node tools/site-doctor.mjs
```

Site Doctor validates repository structure and source integrity, including JavaScript, HTML inline JavaScript, CSS variables, required assets, release-catalog integrity, transmission JSON, discovery modules, and duplicate shell/metadata conditions.

Site Doctor is repository QA. It does **not** pretend to be real browser verification.

## Main Surface QA

```text
.github/workflows/main-surface-qa.yml
          ↓
node tools/main-surface-qa.mjs
```

The Main Surface QA system checks four major surfaces:

```text
MAIN     🟢 / 🔴
COMMAND  🟢 / 🔴
ADMIN    🟢 / 🔴
SUNO     🟢 / 🔴
```

It checks:

- Site Doctor
- Required source files
- Important `vercel.json` routing contracts
- HTTP failures
- Empty/broken pages
- Browser console errors
- Browser page errors
- Failed same-origin requests
- Command source existence
- Admin source existence
- Suno source existence
- Core Suno routes

The detailed logs and Playwright results are uploaded as workflow artifacts when the Action runs.

---

# 🔒 Main Surface QA — Anti-Recursion Contract

**This is an intentional architecture. Do not weaken or replace it with a commit-message loophole.**

The workflow trigger is:

```yaml
on:
  push:
    branches: [main]
    paths-ignore:
      - 'README.md'
  workflow_dispatch:
```

Therefore:

```text
README-only user edit
        ↓
       NO QA

QA edits README only
        ↓
       NO QA

Code + README edit
        ↓
       QA

Code-only edit
        ↓
       QA
```

The Action writes its QA result back to `README.md`, but that README-only commit is excluded from the same push workflow.

### Why this matters

The recursion protection is based on **changed paths**, not a fragile commit-message convention.

Do not remove:

```yaml
paths-ignore:
  - 'README.md'
```

unless the entire recursion design is deliberately redesigned and re-verified.

---

# ☀️ `/Suno` — Complete Suno V6 Knowledge Base

`/Suno/` is a full browser-native knowledge base for Suno music creation and production. It is not merely a pasted README or badge wall. It is organized as a working creator reference with dedicated topic pages, research material, production guidance, testing methodology, and a complete master reference.

**Live entry point:**

```text
/Suno/
```

**Legacy aliases:**

```text
/Suno
/Suno/Suno_Guide
/Suno/Suno_Guide/
```

These aliases are routed to `/Suno/` by `vercel.json`.

The `/Suno/` entry page identifies the knowledge base as:

```text
THE COMPLETE CURRENT GUIDE
SUNO V6 GUIDE
```

and organizes the system into Create, Control, Produce, Fix/Test, Research, 00 Master, and the dedicated Fix Audio Quality module.

---

# 🎛️ Suno Guide Architecture

```text
/Suno/
├── create/          → CREATE
├── control/         → CONTROL
├── produce/         → PRODUCE
├── fix-test/        → FIX / TEST
├── research/        → RESEARCH
├── master/          → 00 MASTER REFERENCE
├── audio_fix_v6/    → PRIORITY AUDIO QUALITY MODULE
├── content/         → canonical guide content
├── assets/          → Suno-specific presentation assets/scripts
└── index.html       → guide entry point
```

### Six major knowledge areas

**01 / CREATE** — Build the song correctly from the beginning.

**02 / CONTROL** — Shape an existing generation without unnecessarily throwing away good information.

**03 / PRODUCE** — Move from generation into production, mixing, automation, editing, workspaces, and export.

**04 / FIX / TEST** — Diagnose failures, test variables, repair surgically, and document evidence.

**05 / RESEARCH** — Rights, ecosystem, official resources, audits, expansions, experiments, and the evidence boundary.

**00 / MASTER REFERENCE** — The complete unbroken reference across the knowledge base.

**PRIORITY / FIX AUDIO QUALITY** — Dedicated audio-quality rescue and diagnosis material.

---

# ✍️ Suno — CREATE

The Create section covers the complete generation pipeline.

Core topics include:

- Current V6 model family
- V6 fundamentals
- V6-WILD experimental behavior
- V6-MINI lighter/faster generation behavior
- Prompt engineering
- Lyrics engineering
- Style-box engineering
- Creative sliders
- References and multimodal creation
- Genre and identity
- Vocal identity and presentation
- Tempo and feel
- Instruments and roles
- Emotional and energy arcs
- Mix direction
- Exclude instructions
- Section-level control
- Experimental level
- Prompt variants
- LLM-ready prompt rewriting

## Prompt Lab

```text
/Suno/create/prompt-lab.html
```

The Prompt Lab provides structured controls for:

- Model selection
- Genre/identity
- Vocal definition
- Tempo/feel
- Instrument roles
- Emotional/energy arc
- Mix direction
- Exclusions
- Sections
- Experimental level
- Variants
- Generation/copy workflows
- LLM-ready rewrite briefs

## Lyrics as a Control Surface

The creation material treats lyrics as more than words. It documents how lyric geometry can influence generation through:

- Structure
- Phonetics
- Punctuation
- Capitalization
- Whitespace
- Repetition
- Performance cues
- Backing vocals
- Breaths
- Chorus architecture
- Section labels
- A/B testing
- Repair versus regeneration
- Experiment records
- Evidence rules

The practical principle is to change the smallest control surface that addresses the actual failure instead of destroying a useful generation unnecessarily.

---

# 🎤 Suno — VOCAL ENGINEERING

```text
/Suno/create/vocal-engineering.html
```

The vocal-engineering material covers:

- Vocal identity
- Gender presentation
- Register and tessitura
- Chest/head/mix behavior
- Breathiness
- Rasp and grit
- Articulation
- Vibrato
- Melisma
- Sustain
- Conversational delivery
- Intimate delivery
- Aggressive delivery
- Whispered delivery
- Spoken delivery
- Backing-vocal density
- Harmony density
- Call-and-response
- Vocal placement
- Consistency
- Late-song drift
- Ad-lib control
- Vocal failure taxonomy
- A/B testing

The goal is to define the desired performance clearly enough to test what changed instead of relying on vague descriptions.

---

# 🎚️ Suno — CONTROL

```text
/Suno/control/
```

Control covers ways to work with an existing generation while preserving useful information.

Major areas include:

- Editing
- Extend
- Crop
- Replace
- Reuse
- Adjust
- Song Editor
- Natural-language editing
- Remaster
- Stem separation
- Studio 2.0
- MIDI

The control philosophy is surgical: diagnose first, preserve what already works, then make the smallest meaningful intervention.

---

# 🎚️ Suno — PRODUCE

```text
/Suno/produce/
```

Produce covers the transition from generation to actual production.

Major areas include:

- Effects
- Custom plugins
- Automation
- Recording
- Editing
- Take lanes
- Library/workspaces
- Studio export
- Vocal engineering
- Mixing considerations
- Production workflow

The production material distinguishes problems that can be repaired inside the generation/editing environment from problems that belong in conventional post-production.

---

# 🔊 Suno — AUDIO QUALITY / FIX-TEST

```text
/Suno/audio_fix_v6/
/Suno/fix-test/
/Suno/produce/audio-engineering.html
```

The audio-quality material is a dedicated diagnostic system rather than a generic “make it sound better” checklist.

It covers:

- Low-end problems
- Mud
- Midrange congestion
- Hiss
- Harshness
- Dynamics
- Compression
- Vocal masking
- Reverb/depth
- Stereo width
- Mono compatibility
- Phase issues
- Transients
- Artifacts
- Timestamped diagnosis
- Reference audio
- Edit / Replace / Remaster decisions
- Stems
- Arrangement density
- Loudness versus quality
- Post-production boundaries

### Audio rescue decision model

```text
HEAR THE FAILURE
      ↓
DESCRIBE THE FAILURE
      ↓
IDENTIFY THE CONTROL SURFACE
      ↓
CHANGE THE SMALLEST VARIABLE
      ↓
TEST AGAIN
      ↓
KEEP / REJECT WITH EVIDENCE
```

A louder result is not automatically a better result. A cleaner result is not automatically a better musical result. Diagnosis and evidence come before broad destructive changes.

---

# 🔬 Suno — RESEARCH

```text
/Suno/research/
```

Research is the evidence and methodology layer of the knowledge base.

It covers:

- Rights
- Credits
- Downloads
- Current Suno ecosystem
- Mobile/web ecosystem
- Master workflow
- Official resources
- Current documentation audits
- Deep-dive addenda
- Coverage audits
- Gap closure
- Controlled experimentation
- Accuracy boundaries

## V5 → V6 Translation

```text
/Suno/research/v5-to-v6/
```

This material documents how legacy V5/V4.5-era inputs should be interpreted when working with current models, including:

- Legacy input translation
- Style translation
- Lyric translation
- Vocal translation
- What should not be blindly ported forward
- Comparison scorecards

Historical behavior is not automatically treated as current behavior.

## Controlled Experimentation

```text
/Suno/research/controlled-experimentation/
```

The experimental framework treats prompt engineering as a testable system.

It covers:

- Control versus test
- Experiment records
- Sample size
- Randomization
- Scoring
- Variables
- Model comparisons
- Slider sweeps
- Prompt density
- Minimalism
- Lyric geometry
- Structure tags
- Symbols and gibberish
- Reference audio
- Edit versus regenerate
- Chorus consistency
- Failure-first testing
- Confidence
- Evidence labels
- Community prompt research

### Evidence hierarchy

```text
CURRENT OFFICIAL SOURCE
        ↓
DIRECT CURRENT OBSERVATION
        ↓
REPRODUCIBLE CONTROLLED TEST
        ↓
DOCUMENTED COMMUNITY EXPERIENCE
        ↓
OLD TUTORIAL / OLD SCREENSHOT
        ↓
MEMORY / ASSUMPTION
```

Lower levels can be useful clues, but they should not silently outrank current official information or reproducible evidence.

---

# 🧪 Suno Experimental Lab

The experimental material explicitly includes symbol/gibberish experiments, structure-tag experiments, prompt-density experiments, conflict testing, whitespace/punctuation/capitalization tests, randomness/variety/weirdness testing, V6/WILD/MINI A/B comparisons, reference-audio tests, edit-versus-regenerate tests, and chorus-consistency tests.

These are documented as experiments rather than guaranteed commands.

A prompt feature should not be described as deterministic merely because it appeared to influence one generation.

Useful experiment records should capture:

```text
MODEL
INPUT
VARIABLE CHANGED
CONTROL
TEST
GENERATION COUNT
OBSERVATION
FAILURE MODE
RESULT
CONFIDENCE
EVIDENCE TYPE
```

---

# 📖 Suno — 00 MASTER GUIDE

```text
/Suno/master/
```

The 00 Master Guide is the unbroken reference layer. It exists so the knowledge base can be consumed as one coherent system rather than forcing the reader to reconstruct the methodology from disconnected pages.

It consolidates:

- Creation
- Prompting
- Lyrics
- Style
- Vocal engineering
- Control
- Production
- Audio quality
- Research
- Experiments
- Failure modes
- Evidence rules
- Current-source boundaries
- Deep-dive additions

The master reference is not a replacement for the dedicated topic pages; it is the complete reference layer across them.

---

# 📦 Suno Canonical Source Map

Important repository areas include:

```text
Suno/index.html
Suno/assets/
Suno/content/
Suno/create/
Suno/control/
Suno/produce/
Suno/fix-test/
Suno/research/
Suno/master/
Suno/audio_fix_v6/
Suno/health.html
```

Known important content/source files include:

```text
Suno/assets/suno-topic.js
Suno/content/manifest.json
Suno/content/master-guide.html
```

The Suno site is intentionally maintained as a real website with dedicated pages rather than forcing the entire knowledge base into a single GitHub README.

The **root README is now the unified project reference**, while `/Suno/` remains the actual browser-based knowledge base.

---

# 🔗 Suno Routing Contract

`vercel.json` owns the important Suno entry aliases.

```text
/Suno                  → /Suno/
/Suno/Suno_Guide       → /Suno/
/Suno/Suno_Guide/      → /Suno/
```

The `/Suno/` entry page also normalizes its own browser history so relative assets and links resolve correctly from the canonical trailing-slash route.

The important distinction is:

```text
/Suno/                 = canonical guide entry
/Suno/Suno_Guide       = legacy alias
/Suno/Suno_Guide/      = legacy alias
```

Do not create a duplicate `Suno_Guide` website to solve a routing problem that already has a canonical target.

---

# 🚦 Suno Browser QA

The dedicated Suno browser QA system exercises the Suno knowledge base with Playwright and Chromium.

Canonical browser surfaces include:

```text
/Suno/
/Suno/create/
/Suno/create/prompt-lab.html
/Suno/create/vocal-engineering.html
/Suno/control/
/Suno/produce/
/Suno/produce/audio-engineering.html
/Suno/fix-test/
/Suno/research/
/Suno/research/v5-to-v6/
/Suno/research/controlled-experimentation/
/Suno/master/
/Suno/audio_fix_v6/
```

The QA system checks HTTP success, meaningful page content, console/page errors, request failures, responsive/mobile behavior, horizontal overflow, internal crawling, and public-surface integrity.

Main Surface QA additionally verifies the Suno source/routing contracts so the top-level repository health signal cannot silently ignore the knowledge base.

---

# 🌐 Vercel Routing / Deployment

The deployment topology is:

```text
GitHub main
     ↓
GitHub Actions
     ↓
Vercel
     ↓
lilsynn.com
```

Important source/runtime distinction:

```text
SOURCE ≠ CI ≠ DEPLOYMENT ≠ CACHE ≠ RUNTIME DOM
```

A source-code change, a failed CI check, a failed deployment, a stale cached asset, and a runtime browser failure are different classes of problem and should be diagnosed separately.

Important `vercel.json` responsibilities include:

- `/command` normalization
- `/command/admin` rewrites
- `/Suno` aliases
- `/suno` routing compatibility
- Deep-dive Suno redirects
- Static media rewrites
- Long-lived immutable asset caching
- No-store behavior for HTML/JS/CSS and sensitive Admin/API paths
- Security headers on Admin/API paths

---

# 🧬 Cache & Versioning

Shared shell assets currently use the intentional cache-busting value:

```html
<script src="/site-global.js?v=20260914"></script>
<link id="site-global-css" rel="stylesheet" href="/site-global.css?v=20260914">
```

`20260914` is a cache-busting identifier currently present in source, not a roadmap date.

Any future shared-shell version change must be synchronized across consumers.

---

# 🧰 Maintenance Rules

## 1. Inspect before creating

Before asking for an asset, link, content block, or replacement file, inspect the repository. Existing source is the authority.

## 2. Fix the owner, not the symptom

If shared behavior is wrong, fix the canonical shared module rather than stacking page-specific overrides.

## 3. Preserve working information

Especially in Suno generation/production work: do not regenerate, replace, or rewrite everything when the actual failure is narrower.

## 4. Separate facts from experiments

A tested observation is not automatically a universal rule. A community claim is not automatically official behavior. Experimental prompt behavior should be labeled accordingly.

## 5. Current information outranks stale information

Current official Suno documentation and current product behavior outrank old screenshots, old tutorials, and remembered behavior.

## 6. QA must be real

Repository inspection is useful, but browser verification is different. Production verification is different again. Do not report one as the other.

## 7. Do not weaken anti-recursion protection

README-only changes must remain excluded from Main Surface QA unless the workflow architecture is deliberately redesigned and tested.

---

# 🧪 Verification Matrix

### Main site

- Homepage root resolves to the current promoted design
- `index.html` is the current homepage
- `index3.html` preserves the previous homepage
- `index2.html` is absent
- Header begins at viewport top
- Logo remains centered
- Mobile/desktop header dimensions remain correct
- THE CALM remains lower-left
- Menu remains correctly aligned
- Global top artwork aligns to the header boundary
- No duplicate global shell

### Release system

- Canonical catalog order preserved
- Album/EP track sets preserved
- Track URLs resolve to parent release sets
- Selected track highlighting works
- Release artwork resolves
- Streaming destinations remain canonical
- Latest Releases derives from canonical data

### Releases / Archive

- Search works
- Filters work
- Sorting works
- Artwork resolves
- Release-set context is correct
- Direct navigation works
- Shareable query state works

### Visuals / Universe

- Fullscreen viewer works
- Previous/next works
- Keyboard controls work
- Mobile swipe works
- Reduced-motion behavior works
- Universe timeline works
- Transmission history works
- Signal/Oracle behavior works

### Suno

- `/Suno/` entry loads
- Legacy aliases route correctly
- Create pages load
- Control pages load
- Produce pages load
- Fix/Test pages load
- Research pages load
- Master Guide loads
- Audio Quality module loads
- Internal navigation remains coherent
- Responsive/mobile behavior remains usable
- No browser console/page errors on tested surfaces

### Production

- Site Doctor passes
- Main Surface QA passes
- Suno Browser QA passes
- Deployment status is checked separately
- Cache behavior is checked separately
- Authenticated Command/Admin behavior is checked once production credentials are available

---

# 🧑‍🎤 Owner Action Queue

This is the handoff area for things that genuinely require LIL SYNN's input, approval, source material, or creative direction.

The assistant should inspect the repository first.

Owner input may be required for:

- New releases not yet represented in `release-catalog.json`
- New tracks, album/EP tracklists, dates, types, or platform destinations
- New official streaming/video links that are missing
- Updated artist bio/about copy
- New lyrics or release-specific lyric content
- New merch information
- New Special Access material
- New Universe/transmission story material
- Materially changed legal/business copy
- Credentials required for authenticated production verification

Do **not** re-send existing repository assets merely because a task mentions them.

---

# 🎨 LIL SYNN Visual Identity

The established LIL SYNN persona is a mysterious faceless figure.

Signature appearance:

- Black long-sleeve hoodie with hood fully up
- Skin-tight black face covering/balaclava with the face and eyes concealed
- No exposed facial skin or facial features
- Reflective pink sunglasses
- Black leather gloves
- Dark blue jeans
- Black and silver belt
- Black combat boots
- Small gold cross necklace when applicable to the artwork direction

Visual language commonly uses:

- Black
- Silver/chrome
- Hot pink
- Magenta
- Cosmic/star-field elements
- Metallic geometry
- Cinematic darkness
- Mysterious rather than generic horror styling

Existing artwork remains authoritative unless a specific new visual has been requested.

---

# 🗂️ Repository Working Map

```text
/
├── index.html                    # CURRENT homepage / promoted new design
├── index3.html                   # previous homepage preserved
├── command/
│   └── admin/                    # Command/Admin surfaces
├── Suno/
│   ├── index.html                # Suno guide entry
│   ├── create/
│   ├── control/
│   ├── produce/
│   ├── fix-test/
│   ├── research/
│   ├── master/
│   ├── audio_fix_v6/
│   ├── content/
│   └── assets/
├── assets/
├── tools/
├── docs/
├── .github/workflows/
│   ├── site-doctor.yml
│   ├── main-surface-qa.yml
│   └── suno-browser-qa.yml
└── vercel.json
```

---

# 📜 Project Status / History

The original five major site architecture phases are complete at the architecture level:

```text
PHASE 1  FOUNDATION                         ✓
PHASE 2  MUSIC DISCOVERY + CONVERSION      ✓
PHASE 3  LIL SYNN UNIVERSE                 ✓
PHASE 4  VISUAL GALLERY                    ✓
PHASE 5  ABSOLUTE POLISH + INTEGRITY       ✓ BASELINE
```

There is intentionally no numbered Phase 6. Future work is maintenance, correction, content/media updates, refinement, optimization, verification, and optional evolution of existing systems.

The Suno knowledge base is a parallel living documentation/creator system rather than a numbered site phase.

---

# 🧾 Important Recent Repository State

The Main Surface QA system was added and its detached-HEAD push behavior was corrected before the homepage promotion.

The current homepage promotion was completed on `main` by moving the former `index2.html` design into `index.html` and preserving the old homepage as `index3.html`.

The QA workflow has already produced an automated README result in an earlier run. The README block above preserves the last generated result until the next qualifying QA execution updates it.

---

# 🧑‍💻 Development / Contribution Rules

When modifying this repository:

1. Read the relevant canonical source first.
2. Identify the existing owner of the behavior.
3. Make the smallest correct change.
4. Preserve existing working functionality.
5. Run the relevant repository/browser QA.
6. Check routing separately from source correctness.
7. Check production separately from CI.
8. Do not introduce duplicate systems to compensate for an ownership mistake.
9. Do not weaken the Main Surface QA anti-recursion contract.
10. Update documentation when the architecture materially changes.

---

# 🖤 LIL SYNN

```text
HEAR MORE.
SEE MORE.
KNOW MORE.
```

**Music · Releases · Archive · Visuals · Universe · Videos · Special Access · Suno V6 Knowledge Base**

---

## 🌐 GitHub Pages Preview

**Vercel remains the production deployment.** GitHub Pages is a parallel fallback preview for times when Vercel build/deployment capacity is temporarily rate-limited or unavailable.

[**Open the GitHub Pages Preview →**](https://lilsynnofficial.github.io/LILSYNNOFFICIAL/)

The preview is generated from `main` by GitHub Actions and is kept separate from the production Vercel configuration.
