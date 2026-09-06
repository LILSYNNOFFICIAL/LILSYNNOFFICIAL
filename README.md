<div align="center">

# LIL SYNN

### Official Website · Music · Visuals · Archive

[![Live Website](https://img.shields.io/badge/LIVE%20SITE-lilsynn.com-ff008f?style=for-the-badge&logo=vercel&logoColor=white)](https://lilsynn.com)
[![GitHub](https://img.shields.io/badge/GITHUB-LILSYNNOFFICIAL-111111?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)
[![YouTube](https://img.shields.io/badge/YOUTUBE-LIL%20SYNN-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@LILSYNNOFFICIAL)
[![Vercel](https://img.shields.io/badge/DEPLOYED%20WITH-VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

**The production repository for the official LIL SYNN digital experience.**

Music • Visual storytelling • AI-assisted creativity • Interactive web design • Release automation

</div>

---

## ✦ About

**LIL SYNN** is an AI artist and AI persona from California's Central Valley, built at the intersection of music, artificial intelligence, visual art, storytelling, and technology.

The project is intentionally faceless and designed to exist beyond the conventional boundaries of a traditional artist. LIL SYNN's identity carries across music, artwork, animation, video, storytelling, and an evolving creative mythology.

The sound draws from dark pop, electropop, melodic trap, ambient R&B, emo rap, and electronic music, combining atmospheric production, melodic songwriting, and raw emotional expression. Recurring themes include love, heartbreak, identity, isolation, ambition, and darker aspects of the human experience.

The project is **AI-assisted, but creatively directed by a human**. Lyrics, concepts, visual direction, prompts, structure, emotional direction, production decisions, and the broader creative identity are intentionally directed rather than delegated to an automated system.

---

## ✦ Production Status

| System | Status |
|---|---|
| Official website | 🟢 Production |
| Vercel deployment | 🟢 Passing |
| YouTube latest-video automation | 🟢 Operational |
| YouTube Data API | 🟢 Operational |
| Homepage music randomizer | 🟢 Operational |
| Homepage Latest Releases catalog loader | 🟢 Operational |
| Randomized homepage WebM background | 🟢 Operational |
| The Calm background music | 🟢 Operational |
| Spotify / YouTube media coordination | 🟢 Operational |
| Release catalog | 🟢 Operational |
| Special Access archive | 🟢 Operational |
| Responsive/mobile layout | 🟢 Active |
| SEO / sharing metadata | 🟢 Active |

> **Production source of truth:** `main`

---

## ✦ Website Architecture

The site is a custom static/serverless web experience deployed through Vercel. It is intentionally organized around shared data sources and small, focused systems rather than duplicated content.

### Core pages

- `index.html` — primary artist homepage.
- `releases.html` — complete release archive and release-rendering source.
- `special_access.html` — restricted archive and unreleased/demo media.
- `privacy.html` — privacy/legal content.

### Core supporting systems

- `release-catalog.json` — canonical music/release database.
- `music-random.js` — homepage randomized music discovery.
- `site-polish.js` — homepage release/catalog presentation and supporting UI behavior.
- `homepage-final-fixes.js` — narrowly scoped homepage compatibility/media behavior; must not become a second release-data system.
- `latest-videos.json` — generated newest-nine video manifest.
- `api/youtube.js` — serverless YouTube endpoint.
- `.github/workflows/update-latest-videos.yml` — automated YouTube refresh.
- `style.css` — global visual/responsive system.
- `script.js` — core site interactions.

---

## ✦ Music Architecture

The **release catalog is the authoritative music database**. Homepage music discovery and homepage Latest Releases are separate consumers of that source.

```text
                    release-catalog.json
                           │
              ┌────────────┴─────────────┐
              ▼                          ▼
        releases.html                site-polish.js
        Release Archive              Homepage Latest Releases
              │                          │
       Full archive                 Newest 3 releases
       Tracklists                    Album artwork
       Artwork                       Spotify + Apple
       Platform links                      │
              │                          ▼
              │                       index.html
              │
              └──────────────┐
                             ▼
                       music-random.js
                       Homepage Music
                             │
                       Individual songs
                       Randomized selection
                       Spotify + Apple
                       Parent artwork
```

### `release-catalog.json`

The catalog maintains release ordering, release types, tracklists, artwork relationships, Spotify destinations, Apple Music destinations, individual track destinations, and parent-release relationships.

### `releases.html`

The public release archive consumes the catalog and presents releases, artwork, tracklists, and platform destinations. **This is the release-management page.** When releases change, update the release data there/catalog as designed; do not create a separate hard-coded homepage release database.

### Homepage Latest Releases

The homepage's **LATEST RELEASES** area is catalog-driven. The existing `site-polish.js` release system reads the canonical release data, selects the newest three releases, resolves their artwork and platform destinations, and renders them into the homepage.

Therefore:

> **Do not hard-code album art, release titles, Spotify links, or Apple Music links into `index.html` as a competing system.**

If the latest three releases change, the homepage should update through the existing catalog/release system after deployment.

### `music-random.js`

The homepage Music system expands grouped releases into individual songs, preserves each song's parent artwork, builds the eligible pool, and randomizes the displayed selection. Music randomization is independent from Latest Releases and Latest Videos.

The **RANDOM SONG REFRESH** control must call the existing `window.lilSynnRefreshMusic()` system. Refreshing the random songs must preserve the user's current scroll position; it must not call `scrollIntoView()` or otherwise jump the page to a selected card.

---

## ✦ Release Management Convention

For a new release, use this workflow:

```text
Upload artwork
      ↓
Update release catalog / releases system
      ↓
Add Spotify + Apple Music destinations
      ↓
Verify artwork path/title
      ↓
releases.html + homepage Latest Releases consume the same source
```

### Release data should include, when applicable

- Title.
- Release type: single, EP, or album.
- Release date/order.
- Artwork path.
- Spotify URL.
- Apple Music URL.
- Tracklist.
- Individual track destinations.
- Parent-release relationship.

### Artwork convention

Use unique, descriptive filenames under:

```text
assets/images/icons/album_art/
```

Do not reuse an ambiguous filename for multiple releases. If artwork changes, verify the catalog reference and all consumers before deleting or renaming the old asset.

**Important:** `assets/img/LS.png` is the LIL SYNN logo/hero asset, not a generic release-art fallback. Homepage image-cleanup code must never delete release artwork merely because a filename resembles the logo.

---

## ✦ Homepage Background Video

The homepage uses the existing `#bgVideo` element for its animated visual background.

### Random WebM background system

The background is designed so that a fresh page load can select a random `.webm` from:

```text
assets/mov/
```

Current known background assets include:

```text
assets/mov/BG_ANI.webm
assets/mov/HERO_BG_WEBM.webm
```

The intended maintenance model is:

```text
Upload a new .webm to assets/mov/
              ↓
Automatic discovery
              ↓
Random selection on page load
              ↓
Existing #bgVideo
```

Do not create a second competing background-video element. Preserve the existing mobile behavior (`object-fit: cover`) so portrait/mobile screens do not horizontally squash the video.

If automatic directory discovery fails, the existing known background should remain a safe fallback rather than leaving the page without a background.

---

## ✦ The Calm — Background Music

The background music track is **The Calm**. The source file remains:

```text
assets/other/sound/Background.mp3
```

The displayed title is **The Calm**; do not rename the underlying file merely to change the UI title.

The Calm has its own compact player at the bottom of the homepage. It should be integrated with the existing page rather than floating independently over the content.

### Playback behavior

The intended experience is:

- Attempt automatic playback when browser policy permits.
- Keep the audio muted/unintrusive until browser policy allows audible playback.
- Maintain looping playback while the user browses.
- When a YouTube video begins playing, pause The Calm.
- When that YouTube playback ends/pauses, resume The Calm if it was previously playing.
- Spotify playback must likewise take precedence over The Calm where browser/player events permit detection.

**Browser autoplay policy is a platform constraint.** Code must not pretend that audible autoplay can be guaranteed on every mobile browser. Do not introduce increasingly aggressive autoplay hacks that break the rest of the page.

---

## ✦ Spotify / YouTube Media Rules

The homepage should have **one intended Spotify embed**, not duplicate Spotify players created by corrective scripts.

Media coordination rules:

```text
The Calm playing
      ↓
Spotify / YouTube starts
      ↓
The Calm pauses
      ↓
External media ends/stops
      ↓
The Calm resumes if it was previously playing
```

YouTube embeds should use the YouTube player API when event-level playback coordination is required. Do not duplicate embeds or inject replacement players as a workaround for a broken existing player.

---

## ✦ Latest Videos — Automated Newest 9

Latest Videos is deliberately chronological. It does **not** use the visual order of YouTube's Releases page.

The production system uses the YouTube Data API and `publishedAt` timestamps.

```text
YouTube channel
      ↓
YouTube Data API
      ↓
Uploads playlist
      ↓
Video publication timestamps
      ↓
Sort newest → oldest
      ↓
Select newest 9
      ↓
latest-videos.json
      ↓
index.html
      ↓
Vercel
```

### Why the architecture changed

The first implementation used `yt-dlp`. GitHub Actions eventually encountered YouTube bot protection (`Sign in to confirm you're not a bot`), so scraping was retired in favor of the official YouTube Data API.

The API approach is the intended production architecture and should **not** be replaced with page scraping merely to solve a future indexing issue.

### GitHub Actions workflow

```text
.github/workflows/update-latest-videos.yml
```

It is designed to:

1. Check out `main`.
2. Read `YOUTUBE_API_KEY` from GitHub Actions secrets.
3. Resolve the LIL SYNN YouTube channel.
4. Resolve its uploads playlist.
5. Retrieve video metadata.
6. Sort by `publishedAt`.
7. Keep the newest nine.
8. Write `latest-videos.json`.
9. Commit only when generated data changes.
10. Push the update to `main` for the normal Vercel deployment pipeline.

The workflow can run on schedule, on relevant pushes, and manually through GitHub Actions.

### Secret handling

The key is stored as:

```text
YOUTUBE_API_KEY
```

in GitHub Actions secrets. Vercel may maintain its own `YOUTUBE_API_KEY` environment variable for serverless functionality.

**Secret values must never be committed to this repository.**

---

## ✦ YouTube Serverless API

`api/youtube.js` provides the production site's serverless YouTube functionality using the deployment environment rather than a browser-exposed secret.

`assets/youtube-fallback.json` provides deterministic fallback data when the live API cannot provide a usable response.

The systems have intentionally different responsibilities:

```text
MUSIC              → randomized song discovery
LATEST RELEASES    → catalog-driven newest 3 releases
LATEST VIDEOS      → newest videos by published date
YOUTUBE FALLBACK   → deterministic backup
```

---

## ✦ Special Access

`special_access.html` contains the restricted **UNRELEASED & DEMO** library and **BLOOPERS & ALT SCENES** video section.

### Single-library audio player

The unreleased/demo area uses **one compact library player**, not separate players for individual tracks.

Current tracks:

1. BEFORE
2. F 67
3. OBLIVION
4. RESET THE PIN
5. TIES REMAIN ALT VERSION

Current source assets:

```text
assets/other/Before(1).mp3
assets/other/F 67.flac
assets/other/Oblivion_out.mp3
assets/other/Reset The Pin.flac
assets/other/Ties Remain2.mp3
```

The player supports track selection, play/pause, seeking, volume, current-track display, queue advancement, and a compact professional presentation without exposing raw filenames as the primary UI.

### Media compatibility

For broad browser compatibility, **MP3 is preferred** for future web-playable archive tracks. FLAC browser support can vary. If a FLAC track fails in a target browser, provide a browser-friendly MP3/Opus derivative rather than redesigning the player.

---

## ✦ Navigation & Responsive UX

The responsive system covers navigation, music tiles, release cards, video cards, CTAs, social controls, footer behavior, background video, reduced motion, and constrained mobile layouts.

The mobile hamburger menu has been intentionally given enough vertical space so its menu items remain fully visible and usable.

Homepage primary CTAs are:

**LISTEN NOW · PRE-SAVE · VOTE 4 LIL SYNN**

There should be only one Pre-Save CTA in that top action group.

### Hero logo rule

The homepage hero should display **one** `assets/img/LS.png` logo. If a duplicate appears, identify and remove the duplicate source element specifically; do not use broad image-deletion logic that can remove release artwork or dynamically generated images.

---

## ✦ Visual System

The brand uses a dark, cinematic interface with strong contrast and pink LIL SYNN accents.

Design priorities include:

- Dark backgrounds.
- High-contrast typography.
- Pink accent treatment.
- Cinematic media presentation.
- Glass/dark card treatments.
- Deliberate motion.
- Strong hierarchy.
- Responsive desktop/mobile presentation.

---

## ✦ SEO, Accessibility & Performance

### SEO

- Canonical URLs.
- Search metadata.
- Open Graph/social sharing metadata.
- JSON-LD structured data.
- `robots.txt`.
- `sitemap.xml`.

### Accessibility

- Keyboard focus states.
- Accessible controls.
- Navigation state handling.
- Reduced-motion support.
- Appropriate media alt text.
- Mobile-friendly navigation.

### Performance

- Lazy loading where appropriate.
- Connection-aware video behavior.
- Reduced-motion media handling.
- `playsinline` handling.
- Controlled API retrieval/caching.

---

## ✦ Repository Structure

```text
LILSYNNOFFICIAL/
├── .github/workflows/
│   └── update-latest-videos.yml
├── api/
│   ├── apple-art.js
│   ├── art.js
│   ├── latest-youtube-releases.js
│   ├── spotify-art.js
│   └── youtube.js
├── assets/
│   ├── images/icons/album_art/
│   ├── img/
│   │   └── LS.png
│   ├── mov/
│   │   ├── BG_ANI.webm
│   │   └── HERO_BG_WEBM.webm
│   ├── other/
│   │   └── sound/Background.mp3
│   └── youtube-fallback.json
├── index.html
├── latest-videos.json
├── music-random.js
├── privacy.html
├── release-catalog.json
├── releases.html
├── robots.txt
├── script.js
├── site-polish.js
├── sitemap.xml
├── special_access.html
├── style.css
├── homepage-final-fixes.js
└── DEPLOYMENT-REVISION.md
```

---

## ✦ Maintainer / Operations Guide

### Adding a new release

1. Upload artwork.
2. Update the canonical release data/system.
3. Add Spotify and Apple Music destinations.
4. Add tracks and track-level links where applicable.
5. Verify the artwork filename and catalog reference.
6. Check `releases.html` and the homepage after deployment.

The homepage Latest Releases should automatically consume the same release source and show the newest three releases. **Do not manually rebuild those three cards in `index.html`.**

### Adding a new homepage background

Simply upload a `.webm` file into:

```text
assets/mov/
```

The random-background system should discover it automatically. Do not add another `<video>` element to `index.html` for each new background.

### Adding a new Special Access track

1. Upload the file to `assets/other/`.
2. Prefer MP3/Opus for browser compatibility.
3. Register it in the existing single library player.
4. Give it a clean display title.
5. Test selection and playback.

### Adding a YouTube release video

Normally **do nothing** to the website. Publish the video to the LIL SYNN YouTube channel and allow the scheduled API workflow to discover it.

The workflow should determine ordering from `publishedAt`, not from page position.

### Artwork troubleshooting

If artwork is wrong or missing:

1. Confirm the exact file in `assets/images/icons/album_art/`.
2. Confirm the canonical release reference.
3. Confirm the homepage is loading the existing catalog-driven release system.
4. Search for stale hard-coded homepage artwork references.
5. Check browser/CDN caching.
6. Do not add a second homepage release system.
7. Do not delete a working asset until all references have been audited.

---

## ✦ Automation Failure & Recovery

### YouTube workflow fails

Check the GitHub Actions run first.

**Bot-detection error:** do not reintroduce `yt-dlp`; the intended solution is the YouTube Data API.

**Missing/invalid API key:** verify the secret is named exactly:

```text
YOUTUBE_API_KEY
```

**API succeeds but site does not update:** check:

```text
GitHub Action passed
        ↓
latest-videos.json changed
        ↓
Commit pushed to main
        ↓
Vercel deployment triggered
        ↓
Production deployment READY
        ↓
Browser shows current data
```

Use **Actions → update latest videos → Run workflow** for manual recovery.

---

## ✦ Vercel & Deployment Notes

Production is deployed from `main` through Vercel.

```text
GitHub main
     ↓
Vercel build
     ↓
Production
     ↓
lilsynn.com
```

### Known non-blocking warning

Vercel may report:

> Node.js functions are compiled from ESM to CommonJS. If this is not intended, add "type": "module" to your package.json file.

This is currently a **warning, not a build failure**.

Do not blindly add `"type": "module"` solely to silence it. A project-wide module-format change can alter how JavaScript files are interpreted and could break existing functionality. The current passing production build is preferred over an unnecessary global module change.

### GitHub Actions vs. Vercel

These are separate layers:

- GitHub Actions discovers and generates video data.
- Vercel builds and deploys the website.

A failed Actions run does not automatically mean the website is broken, and a Vercel build problem does not automatically mean the YouTube updater is broken.

---

## ✦ Environment & Secrets Inventory

| Variable | Location | Purpose |
|---|---|---|
| `YOUTUBE_API_KEY` | GitHub Actions secret | Automated newest-nine updater |
| `YOUTUBE_API_KEY` | Vercel environment | Serverless YouTube functionality |

Secret values are intentionally absent from documentation and source control.

---

## ✦ Known Limitations & Technical Debt

1. **Vercel ESM → CommonJS warning** — currently non-blocking.
2. **YouTube API quota/availability** — automated discovery depends on API availability and authorization.
3. **FLAC browser support** — varies; MP3/Opus is safer for web playback.
4. **`latest-videos.json` is generated data** — normally do not edit it manually.
5. **Fallback data can become stale** — it exists as a deterministic backup, not the primary source.
6. **Browser autoplay restrictions** — audible The Calm playback cannot be guaranteed before a user gesture on every browser, especially mobile.
7. **Directory discovery for random WebM backgrounds** — the client must use an available repository/API-backed file list or equivalent manifest; browsers cannot natively enumerate arbitrary server directories.

Known limitations should be solved deliberately and locally, not through broad rewrites.

---

## ✦ Change-Control Rules

This project contains interconnected production systems. Before changing anything:

1. Identify the authoritative source.
2. Identify every consumer.
3. Read the relevant JS/HTML before editing it.
4. Make the smallest targeted change possible.
5. Preserve existing records and functionality.
6. Verify generated data.
7. Verify the production deployment/live behavior.

### Critical rules

- **Never delete or reconstruct `release-catalog.json` from a partial list.** Add records while preserving the existing catalog.
- The **release catalog/release system is authoritative** for Latest Releases; do not create a competing hard-coded homepage release database.
- `releases.html` and the homepage Latest Releases must remain connected through the existing release-loading logic.
- Do not duplicate release data across multiple homepage-only databases.
- Do not hard-code new YouTube videos into `index.html` when automation is working.
- Do not put API credentials into source files.
- Do not globally change module semantics to silence a warning without auditing the entire codebase.
- Do not replace a major production file with a partial reconstruction.
- Do not use broad DOM cleanup selectors such as “delete every second image” to solve a duplicate-image problem.
- **Never remove images globally based only on filename.** `LS.png` is a logo; album artwork is separate content.
- Do not add a second Spotify embed to compensate for a broken first embed.
- Do not add a second `<video>` background system.
- Do not replace `music-random.js` with a separate randomizer.
- The Random Song Refresh control must preserve scroll position.
- Do not use `scrollIntoView()` as a side effect of random-song refresh.
- Do not hard-code the newest release artwork into homepage-fix scripts when the catalog-driven release loader already exists.
- Before modifying any interconnected homepage script, inspect all related JS files and identify the existing data flow.

### Preferred repair pattern

```text
Observe live problem
       ↓
Read README / architecture
       ↓
Identify authoritative source
       ↓
Trace existing JS consumers
       ↓
Inspect production/live output
       ↓
Make one narrow change
       ↓
Deploy
       ↓
Check live site
       ↓
Only then proceed to another change
```

This repository has accumulated several interconnected homepage systems. **Preserving working architecture is more important than making a quick workaround.**

---

## ✦ Recent Production Lessons

The following lessons are now part of the operating rules because they caused real production regressions during recent homepage work:

### 1. Latest Releases artwork

A homepage image cleanup routine incorrectly treated `LS.png` as disposable duplicate content and caused release artwork to disappear. The fix was to restore the existing catalog-driven release loader and remove destructive global image cleanup.

**Lesson:** release artwork belongs to the release system. Never manipulate it through a generic homepage image filter.

### 2. Duplicate Spotify players

Adding corrective embeds produced duplicate Spotify players.

**Lesson:** preserve one intended Spotify embed and repair its source/placement rather than injecting another player.

### 3. Random Song Refresh scrolling

The random-song refresh could visually refresh the music cards while also jumping the browser to a selected card through `scrollIntoView()`.

**Lesson:** refresh content in place and preserve the user's scroll position.

### 4. The Calm autoplay

The Calm can work after interaction, but mobile browsers may block audible autoplay.

**Lesson:** use browser-compatible autoplay behavior and do not break other media in an attempt to bypass platform restrictions.

### 5. Mobile background video

The desktop background video can look correct while becoming distorted on mobile if forced into the desktop aspect ratio.

**Lesson:** preserve a dedicated mobile presentation using `object-fit: cover` rather than stretching the desktop video dimensions.

### 6. Random WebM backgrounds

The background system should use the existing `#bgVideo` and discover `.webm` files from `assets/mov/` rather than adding one hard-coded video element per background.

**Lesson:** adding a new background should be a file-upload operation, not a homepage rewrite.

---

## ✦ Final Operating Principle

> **Read first. Trace the existing architecture. Identify the source of truth. Make the smallest possible change. Verify the live site before declaring success.**

The goal is not merely to make one visible issue disappear. The goal is to preserve the LIL SYNN production system while making each subsystem easier to maintain and extend.