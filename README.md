<div align="center">

# LIL SYNN

### Official Website · Music · Visuals · Archive

[![Live Website](https://img.shields.io/badge/LIVE%20SITE-lilsynn.com-ff008f?style=for-the-badge&logo=vercel&logoColor=white)](https://lilsynn.com)
[![GitHub](https://img.shields.io/badge/GITHUB-LILSYNNOFFICIAL-111111?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)
[![YouTube](https://img.shields.io/badge/YOUTUBE-LIL%20SYNN-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@LILSYNNOFFICIAL)
[![Spotify](https://img.shields.io/badge/SPOTIFY-LIL%20SYNN-1DB954?style=for-the-badge&logo=spotify&logoColor=white)](https://open.spotify.com/artist/0r7mQyqXv7QJ0jK5lQm3pF)
[![Apple Music](https://img.shields.io/badge/APPLE%20MUSIC-LIL%20SYNN-FA243C?style=for-the-badge&logo=applemusic&logoColor=white)](https://music.apple.com/us/artist/lil-synn/1800000000)

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

The repository uses the `main` branch as the production source of truth. The site is deployed through Vercel.

---

## ✦ The Website

**Live:** [lilsynn.com](https://lilsynn.com)

The site is a custom static/serverless web experience rather than a generic artist template. Its systems are intentionally separated so that content can be updated without repeatedly rebuilding unrelated sections by hand.

### Core pages

- **`index.html`** — primary artist homepage.
- **`releases.html`** — complete release archive.
- **`special_access.html`** — restricted archive containing rare video material and unreleased/demo audio.
- **`privacy.html`** — privacy/legal page.

The homepage brings together the artist presentation, latest releases, randomized music discovery, automatically refreshed YouTube videos, calls to action, social links, navigation, footer/legal content, and supporting metadata.

---

## ✦ Music Architecture

One of the project's most important design decisions is keeping the **release catalog as the authoritative music database**.

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

The canonical structured database for releases and songs.

It maintains relationships including:

- Release ordering.
- Albums, EPs, and singles.
- Grouped tracklists.
- Release-level Spotify destinations.
- Individual `trackSpotify` destinations.
- Parent-release relationships for individual tracks.
- Artwork relationships used by both the archive and homepage Music section.

### `releases.html`

The public release archive consumes the catalog and presents the music as a browsable library rather than a collection of disconnected cards.

The intended workflow is simple: **update the catalog once, and the relevant music systems consume that data.**

### `music-random.js`

Owns the homepage Music discovery system.

It expands grouped releases into individual songs, preserves each song's parent artwork, builds the eligible pool, and randomizes the displayed selection. The system provides direct song-level Spotify and Apple Music destinations where available.

**Important:** Music randomization applies to the Music section only. It does **not** randomize Latest Videos.

---

## ✦ Latest Releases

The homepage's **Latest Releases** presentation is driven from the site's release data rather than maintaining a separate manual homepage-only database.

This is designed so that release updates can remain centralized and the homepage can reflect the current release catalog without unnecessary duplication.

Recent catalog work has included releases such as:

- **HOME (ACOUSTIC VERSION)**
- **I DID IT AGAIN**
- **Signal Light Sermon**
- **Rescue You (Acoustic Version)**

Artwork is maintained under:

```text
assets/images/icons/album_art/
```

A corrected, explicitly named artwork asset for **HOME (ACOUSTIC VERSION)** is:

```text
assets/images/icons/album_art/home_acoustic_version.png
```

The project also maintains a dedicated remastered artwork asset for **Signal Light Sermon**:

```text
assets/images/icons/album_art/39_lil_synn_signal_light_sermon___remastered_2026.jpg
```

---

## ✦ Latest Videos — Fully Automated

The Latest Videos system evolved from an initial `yt-dlp` approach to a **YouTube Data API** architecture after GitHub Actions runners began receiving YouTube bot-detection responses.

The current system avoids scraping YouTube pages and instead uses the official API.

### Current flow

```text
YouTube channel
      │
      ▼
YouTube Data API
      │
      ▼
Uploads playlist
      │
      ▼
Published timestamps
      │
      ▼
Sort newest → oldest
      │
      ▼
Select newest 9
      │
      ▼
latest-videos.json
      │
      ▼
index.html
      │
      ▼
Vercel production
```

### GitHub Actions automation

The workflow is:

```text
.github/workflows/update-latest-videos.yml
```

It runs:

- On pushes to `main`.
- On a schedule every 10 minutes.
- Manually through GitHub Actions.

The workflow:

1. Checks out `main`.
2. Reads `YOUTUBE_API_KEY` from a GitHub Actions secret.
3. Resolves the `@LILSYNNOFFICIAL` channel.
4. Resolves its uploads playlist.
5. Retrieves recent uploads through the YouTube Data API.
6. Uses `publishedAt` for chronological ordering.
7. Sorts newest → oldest.
8. Selects the newest **9** videos.
9. Writes `latest-videos.json`.
10. Commits the refreshed manifest when content has changed.
11. Pushes the update to `main`, allowing the normal production deployment pipeline to consume it.

### Why this matters

The video section no longer requires manually telling the site which videos are new. When a new LIL SYNN video appears on the channel, the scheduled workflow can discover it, compare publication timestamps, and roll the older entries out of the nine-video window automatically.

This specifically addresses the situation where videos on YouTube's Releases page are not visually ordered perfectly by date: **the system uses the API's publication timestamp rather than trusting page order.**

### Secret handling

The YouTube API key is **not stored in source control**.

The workflow expects:

```text
YOUTUBE_API_KEY
```

as a GitHub Actions secret. The production/serverless environment can separately maintain its own `YOUTUBE_API_KEY` value for the website's API endpoint.

---

## ✦ YouTube Serverless API

The repository also contains:

```text
api/youtube.js
```

This is the serverless YouTube endpoint used by the production site. It reads the API key from the deployment environment and provides the frontend with video data.

The repository also maintains:

```text
assets/youtube-fallback.json
```

as a deterministic fallback source when the live YouTube API cannot provide a usable response.

The fallback is intentionally **not randomized**.

```text
MUSIC              → randomized song discovery
LATEST VIDEOS      → newest videos by publication date
YOUTUBE FALLBACK   → deterministic backup list
```

That separation is an important part of the site's architecture.

---

## ✦ Special Access Archive

`special_access.html` contains a dedicated **UNRELEASED & DEMO** archive player.

The design evolved from an embedded Jumpshare player to a custom HTML5 audio library so the site controls the presentation rather than relying on third-party iframe embedding behavior.

### Current archive library

The player is a **single compact library player** containing:

1. **BEFORE**
2. **F 67**
3. **OBLIVION**
4. **RESET THE PIN**
5. **TIES REMAIN ALT VERSION**

Current archive audio assets live in:

```text
assets/other/
```

including:

```text
Before(1).mp3
F 67.flac
Oblivion_out.mp3
Reset The Pin.flac
Ties Remain2.mp3
```

The player supports:

- One unified archive library.
- Track selection.
- Play/pause.
- Progress seeking.
- Volume control.
- Current-track display.
- Automatic advancement through the queue.
- Compact presentation without exposing raw filenames in the UI.
- Pink LIL SYNN visual treatment.

The same Special Access page also contains the **BLOOPERS & ALT SCENES** section, with the video centered within the page layout.

---

## ✦ Navigation & Responsive UX

The site has a custom responsive navigation system covering desktop and mobile layouts.

The primary navigation includes:

- Home
- Music
- Releases
- Videos
- About
- Merch
- Lyrics
- Contact
- Socials

On mobile, the hamburger menu is designed to provide enough vertical space for the menu items and to remain usable when the available viewport is smaller than the complete navigation content.

The broader responsive system covers:

- Music tiles.
- Release cards.
- Video cards.
- Buttons and CTAs.
- Social navigation.
- Footer controls.
- Background video behavior.
- Artist/profile links.
- Reduced-motion behavior.

---

## ✦ Homepage CTAs

The homepage has been intentionally simplified so the primary top-level calls to action remain clear:

**LISTEN NOW · PRE-SAVE · VOTE 4 LIL SYNN**

The duplicated Pre-Save CTA was removed so the top action row contains one of each primary action.

Release-specific platform buttons use direct destinations where available. For example, release cards can expose both Spotify and Apple Music destinations rather than sending visitors through generic search pages.

---

## ✦ Visual & Brand System

The site's visual language is built around a dark, cinematic interface with LIL SYNN's pink accent treatment.

The design emphasizes:

- Dark backgrounds.
- High-contrast typography.
- Pink brand accents.
- Cinematic media presentation.
- Glass/dark card treatments.
- Minimal but deliberate motion.
- Strong section hierarchy.
- Responsive presentation across desktop and mobile.

The Special Access audio player follows the same visual language while remaining intentionally more compact and functional than the broader media cards.

---

## ✦ SEO, Accessibility & Performance

Production work includes:

### SEO

- Canonical URLs.
- Search-engine metadata.
- Open Graph/social sharing metadata.
- JSON-LD structured data.
- `robots.txt`.
- `sitemap.xml`.

### Accessibility

- Keyboard focus states.
- Accessible control labels.
- Navigation state handling.
- Reduced-motion support.
- Appropriate artwork/video alt text.
- Mobile-friendly navigation.
- Reachable controls on constrained viewports.

### Performance

- Lazy loading where appropriate.
- Connection-aware background-video behavior.
- Reduced-motion media handling.
- `playsinline` handling for mobile video.
- Lightweight media presentation.
- API caching/controlled data retrieval where appropriate.

---

## ✦ Repository Structure

```text
LILSYNNOFFICIAL/
├── .github/
│   └── workflows/
│       └── update-latest-videos.yml
│
├── api/
│   └── youtube.js
│
├── assets/
│   ├── images/
│   │   └── icons/
│   │       └── album_art/
│   ├── other/
│   │   ├── Before(1).mp3
│   │   ├── F 67.flac
│   │   ├── Oblivion_out.mp3
│   │   ├── Reset The Pin.flac
│   │   └── Ties Remain2.mp3
│   └── youtube-fallback.json
│
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

## ✦ Core Files at a Glance

| File | Responsibility |
|---|---|
| `index.html` | Homepage and primary artist experience |
| `releases.html` | Public release archive |
| `release-catalog.json` | Canonical music/release database |
| `music-random.js` | Randomized homepage Music discovery |
| `latest-videos.json` | Generated newest-video manifest |
| `api/youtube.js` | Serverless YouTube endpoint |
| `.github/workflows/update-latest-videos.yml` | Automated newest-9 YouTube refresh |
| `special_access.html` | Restricted archive + unreleased/demo player |
| `script.js` | Core homepage interactions |
| `site-polish.js` | Supporting responsive/presentation behavior |
| `style.css` | Global styling and responsive layout |
| `assets/youtube-fallback.json` | Deterministic YouTube fallback |
| `assets/images/icons/album_art/` | Release artwork |

---

## ✦ Engineering Principles

Future changes should preserve these rules unless the architecture is intentionally being redesigned:

1. **One authoritative music database.** Keep release/song data in `release-catalog.json` rather than creating competing copies.
2. **Music and video discovery are different systems.** Music can randomize; Latest Videos must remain chronological.
3. **Latest Videos uses publication date.** Never rely on the visual order of YouTube's Releases page.
4. **Keep the newest-video window at nine.** Older entries naturally fall away as newer uploads arrive.
5. **Keep automation separate from presentation.** The GitHub workflow updates data; the homepage renders it.
6. **Keep secrets out of source control.** API credentials belong in environment variables/secrets.
7. **Preserve direct platform links.** Use the supplied Spotify/Apple destinations rather than silently replacing them with searches.
8. **Keep artwork tied to the correct release.** Artwork is part of the release data relationship.
9. **Avoid competing renderers.** A page section should have one authoritative rendering path.
10. **Preserve responsive behavior.** Desktop fixes must not break mobile, and mobile fixes must not degrade desktop.
11. **Prefer minimal, targeted production changes.** Existing working systems should remain intact when a change can be isolated.
12. **Keep `main` as the production source of truth.** Avoid unnecessary parallel production branches.

---

## ✦ Deployment

The production site is deployed through **Vercel** from the repository's `main` branch.

The GitHub → Vercel flow is intentionally straightforward:

```text
GitHub main
    │
    ├── normal site changes
    │
    └── automated latest-video manifest updates
             │
             ▼
          Vercel
             │
             ▼
      lilsynn.com production
```

Vercel has produced successful production deployments for the current system.

A known non-blocking Vercel warning may appear during builds:

> Node.js functions are compiled from ESM to CommonJS.

This is currently treated as a warning rather than a production failure. No project-wide `"type": "module"` change is intentionally introduced solely to silence it, because doing so without auditing every Node.js file could change module behavior.

---

## ✦ Related Creative / Technology Ecosystem

LIL SYNN exists within a broader independent creative and technology ecosystem associated with **Neurosyn-Dev**.

Related projects and identities include:

- **SYNTIENT RECORDS**
- **SYNSTATIC**
- **Ziggy and Chickenman**
- **Chasing Quiet**
- **The Lions Roar**
- **SYNSOUND**
- **BlueNote**
- **Neurodivergent Helper**
- **MARMalade**
- **Neurosyn-Aeon**
- **NR-PROMPT-ENGINEERING**

These projects span music, visual storytelling, AI-assisted creative work, software, prompt engineering, and experimental human-computer interaction.

---

## ✦ Content Maintenance Workflow

For future releases, the intended maintenance model is:

### Music

```text
Add/update release data
        ↓
release-catalog.json
        ↓
Releases + homepage Music consume it
```

### YouTube

```text
Publish video on LIL SYNN YouTube
        ↓
YouTube Data API discovers upload
        ↓
publishedAt determines order
        ↓
newest 9 selected automatically
        ↓
latest-videos.json updated
        ↓
Vercel deploys
```

### Artwork

```text
Upload artwork
        ↓
assets/images/icons/album_art/
        ↓
Associate artwork with correct catalog entry
        ↓
Releases + Music tiles use the same artwork relationship
```

The goal is simple: **update the source data once and let the site do the repetitive work.**

---

## ✦ Live Resources

- 🌐 **Website:** [lilsynn.com](https://lilsynn.com)
- 🎵 **Releases:** [lilsynn.com/releases](https://lilsynn.com/releases)
- ▶️ **YouTube:** [@LILSYNNOFFICIAL](https://www.youtube.com/@LILSYNNOFFICIAL)
- 💻 **Repository:** [LILSYNNOFFICIAL/LILSYNNOFFICIAL](https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL)

---

## ✦ Contact

**synovamedia@gmail.com**

---

<div align="center">

### LIL SYNN

**The signal is alive.**

© 2026 LIL SYNN

</div>
