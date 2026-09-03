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
- `releases.html` — complete release archive.
- `special_access.html` — restricted archive and unreleased/demo media.
- `privacy.html` — privacy/legal content.

### Core supporting systems

- `release-catalog.json` — canonical music/release database.
- `music-random.js` — homepage randomized music discovery.
- `latest-videos.json` — generated newest-nine video manifest.
- `api/youtube.js` — serverless YouTube endpoint.
- `.github/workflows/update-latest-videos.yml` — automated YouTube refresh.
- `style.css` — global visual/responsive system.
- `script.js` — core site interactions.
- `site-polish.js` — supporting presentation/responsive behavior.

---

## ✦ Music Architecture

The **release catalog is the authoritative music database**.

```text
                    release-catalog.json
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        releases.html              music-random.js
        Release Archive             Homepage Music
              │                         │
       Albums / EPs / Singles     Individual songs
       Tracklists / artwork       Randomized selection
       Platform links             Spotify + Apple
                                    Parent artwork
```

### `release-catalog.json`

The catalog maintains release ordering, release types, tracklists, artwork relationships, Spotify destinations, Apple Music destinations, individual track destinations, and parent-release relationships.

### `releases.html`

The public release archive consumes the catalog and presents releases, artwork, tracklists, and platform destinations.

### `music-random.js`

The homepage Music system expands grouped releases into individual songs, preserves each song's parent artwork, builds the eligible pool, and randomizes the displayed selection. Music randomization is independent from Latest Videos.

---

## ✦ Release Management Convention

For a new release, use this workflow:

```text
Upload artwork
      ↓
Add/update release-catalog.json
      ↓
Add Spotify + Apple Music destinations
      ↓
Verify artwork path/title
      ↓
Releases + homepage consume the catalog
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

Examples of corrected/intentional artwork assets include:

```text
home_acoustic_version.png
39_lil_synn_signal_light_sermon___remastered_2026.jpg
```

Do not reuse an ambiguous filename for multiple releases. If artwork changes, verify the catalog reference and all consumers before deleting or renaming the old asset.

---

## ✦ Latest Releases

The homepage Latest Releases section is intended to be driven from the release catalog rather than a second manually maintained database.

The current homepage design displays the **three latest releases**.

Recent release work has included:

- **HOME (ACOUSTIC VERSION)**
- **I DID IT AGAIN**
- **Signal Light Sermon**
- **Rescue You (Acoustic Version)**

Release-specific Spotify and Apple Music buttons should retain the exact supplied destinations.

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

The Blooper/Alt Scenes video is centered under its heading.

---

## ✦ Navigation & Responsive UX

The responsive system covers navigation, music tiles, release cards, video cards, CTAs, social controls, footer behavior, background video, reduced motion, and constrained mobile layouts.

The mobile hamburger menu has been intentionally given enough vertical space so its menu items remain fully visible and usable.

Homepage primary CTAs are:

**LISTEN NOW · PRE-SAVE · VOTE 4 LIL SYNN**

There should be only one Pre-Save CTA in that top action group.

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
│   ├── other/
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
└── DEPLOYMENT-REVISION.md
```

---

## ✦ Maintainer / Operations Guide

### Adding a new release

1. Upload artwork.
2. Add the release to `release-catalog.json`.
3. Add Spotify and Apple Music destinations.
4. Add tracks and track-level links where applicable.
5. Verify the artwork filename and catalog reference.
6. Check `releases.html` and the homepage after deployment.

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

If artwork is wrong:

1. Confirm the exact file in `assets/images/icons/album_art/`.
2. Confirm the catalog reference.
3. Search for duplicate/stale artwork references.
4. Check browser/CDN caching.
5. Do not delete a working asset until all references have been audited.

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

Known limitations should be solved deliberately and locally, not through broad rewrites.

---

## ✦ Change-Control Rules

This project contains interconnected production systems. Before changing anything:

1. Identify the authoritative source.
2. Identify every consumer.
3. Make the smallest targeted change possible.
4. Preserve existing records and functionality.
5. Verify generated data.
6. Verify the deployment.

### Critical rules

- **Never delete or reconstruct `release-catalog.json` from a partial list.** Add records while preserving the existing catalog.
- Do not duplicate release data across multiple homepage-only databases.
- Do not hard-code new YouTube videos into `index.html` when automation is working.
- Do not put API credentials into source files.
- Do not globally change module semantics to silence a warning without auditing the entire codebase.
- Do not replace a major production file with a partial reconstruction.
- Do not rename artwork without checking all references.
- Do not create multiple Special Access players when the single-library architecture is intended.
- Do not make desktop fixes that compromise mobile behavior.

---

## ✦ Changelog / Project Evolution

### 2026

- Established the LIL SYNN production website architecture.
- Centralized music data in `release-catalog.json`.
- Built the public release archive.
- Built homepage Music randomization from catalog data.
- Established Latest Releases as a catalog-driven presentation.
- Added direct Spotify and Apple Music destinations.
- Modernized Special Access into a custom library-style HTML5 audio player.
- Added the current unreleased/demo library.
- Improved mobile hamburger-menu sizing.
- Centered the Special Access Blooper/Alt Scenes video.
- Built Latest Videos automation for the newest nine videos.
- Migrated Latest Videos from `yt-dlp` to the YouTube Data API after bot-detection failures.
- Added `publishedAt`-based chronological sorting.
- Added GitHub Actions secret-based API authentication.
- Integrated generated video updates into the GitHub → Vercel deployment path.
- Documented the non-blocking Vercel ESM/CommonJS warning.

---

## ✦ Related Creative / Technology Ecosystem

LIL SYNN exists within a broader independent creative and technology ecosystem associated with **Neurosyn-Dev**.

Related projects and identities include:

- SYNTIENT RECORDS
- SYNSTATIC
- Ziggy and Chickenman
- Chasing Quiet
- The Lions Roar
- SYNSOUND
- BlueNote
- Neurodivergent Helper
- MARMalade
- Neurosyn-Aeon
- NR-PROMPT-ENGINEERING

These projects span music, visual storytelling, AI-assisted creative work, software, prompt engineering, and experimental human-computer interaction.

---

## ✦ Maintenance Philosophy

The guiding principle for this repository is:

> **Update the source once. Let the systems do the repetitive work.**

Music belongs in the release catalog. YouTube discovery belongs in the API automation. Generated manifests should remain generated. Presentation should consume authoritative data. Production changes should be targeted, reversible, and verified.

---

## ✦ Live Resources

- 🌐 [lilsynn.com](https://lilsynn.com)
- ▶️ [LIL SYNN on YouTube](https://www.youtube.com/@LILSYNNOFFICIAL)
- 💻 [LILSYNNOFFICIAL on GitHub](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)

---

## ✦ Contact

**synovamedia@gmail.com**

---

<div align="center">

### LIL SYNN

**The signal is alive.**

© 2026 LIL SYNN

</div>
