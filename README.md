# LIL SYNN — Official Website

[![Website](https://img.shields.io/badge/Website-lilsynn.com-ff008f?style=for-the-badge)](https://lilsynn.com)
[![Release Archive](https://img.shields.io/badge/Release%20Archive-lilsynn.com%2Freleases-111111?style=for-the-badge)](https://lilsynn.com/releases)

The official website for **LIL SYNN**, an AI artist and AI persona from California's Central Valley. This repository contains the production website, release archive, music data, YouTube integration, artwork, responsive styling, accessibility behavior, and supporting site logic for **[lilsynn.com](https://lilsynn.com)**.

## Live Site

- **Official website:** https://lilsynn.com
- **Release archive:** https://lilsynn.com/releases
- **Source repository:** https://github.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL

The production website is maintained from the **`main` branch**. The repository no longer uses a separate backup branch as the production source of truth.

## About LIL SYNN

LIL SYNN is an AI artist and AI persona built at the intersection of music, artificial intelligence, visual art, storytelling, and technology.

The persona is intentionally faceless and is designed to exist beyond the conventional boundaries of a traditional artist. LIL SYNN's identity carries across music, artwork, animation, video, storytelling, and an evolving creative mythology.

The sound draws from dark pop, electropop, melodic trap, ambient R&B, emo rap, and electronic music. The project combines atmospheric production, melodic songwriting, and raw emotional expression while exploring themes such as love, heartbreak, identity, isolation, ambition, and darker aspects of the human experience.

The project is AI-assisted, but the creative direction is human. The creator writes and directs the lyrics, concepts, visual prompts, structure, emotional direction, production decisions, and broader creative identity behind LIL SYNN.

## What This Repository Does

This repository is the working production site for LIL SYNN. It is not a generic profile-page template: the files work together as a small static/serverless web application with a shared music database and a dedicated YouTube API endpoint.

The site combines:

- Artist branding and biography content.
- A responsive homepage and navigation system.
- A structured release archive.
- A shared music catalog used by both Releases and the homepage Music section.
- Randomized individual-song discovery on the homepage.
- A chronological Latest Videos section powered by YouTube.
- A six-video fallback when the YouTube API is unavailable or rate-limited.
- Direct Spotify and Apple Music destinations.
- Release artwork and social-platform artwork.
- Responsive desktop/mobile layouts.
- SEO, Open Graph, structured data, accessibility, and performance enhancements.
- Privacy and Terms pages.
- Footer/legal/social navigation.

## Site Architecture

### `index.html`

The primary LIL SYNN homepage and artist landing page.

The homepage contains the main hero, artist presentation, newest release area, Music discovery section, Latest Videos section, artist/platform links, navigation, footer, legal links, and supporting metadata.

### `releases.html`

The complete public release archive.

This page reads the site's release catalog and presents albums, EPs, and singles with their artwork, tracklists, platform links, and sorting controls.

The release archive is intentionally also the **music data source** used by the homepage Music section. The homepage should not maintain a separate duplicate song database.

### `release-catalog.json`

The canonical structured release database.

It contains:

- The canonical release order.
- Release groups and their types.
- Album/EP tracklists.
- Release-level Spotify destinations.
- Individual `trackSpotify` destinations.
- Relationships between individual songs and parent releases.

Current grouped releases include:

- **Hello Goodbye** — Album
- **Heal** — EP
- **Black Glass** — EP
- **Don't Say It** — EP
- **Enough** — Album

Standalone releases are represented in the same catalog order.

The catalog currently uses the newest-to-oldest sequence beginning with **Somewhere In-Between**, followed by **Black Glass**, **Hello Goodbye**, **Static On My Tongue**, **It's In Her Eyes**, **Fade Into You**, and the remaining releases in their established order.

### `music-random.js`

Owns the homepage **Music** discovery system.

Its job is to load the release catalog, expand grouped releases into individual songs, preserve the parent release artwork, shuffle the eligible song pool, and render the randomized Music tiles.

The homepage Music system is deliberately separate from Latest Videos. The randomizer operates on the Music grid only and must never shuffle the YouTube grid.

Each Music tile is designed to provide:

- Song title.
- Associated release artwork.
- Direct Spotify link to the individual song.
- Direct Apple Music link to the individual song.

The Music feed is intended to change on refresh so visitors see different songs rather than the same fixed set on every page load.

### `script.js`

Core homepage behavior, including:

- Background-video initialization and playback handling.
- Reduced-motion handling.
- Connection-aware background-video behavior.
- Hamburger navigation behavior.
- Social dropdown behavior.
- Pre-save/listen call-to-action handling.
- Latest YouTube video loading and rendering.

The current architecture keeps the legacy Music renderer out of this file so the dedicated randomized Music system can remain the sole owner of the homepage Music grid.

### `site-polish.js`

Supporting site polish and production behavior, including responsive/accessibility improvements, footer/social restoration, layout enhancements, and related interaction behavior.

The production baseline also uses this supporting layer for approved responsive and presentation improvements without making the core release catalog duplicate itself.

### `style.css`

Global styling and responsive behavior for the site, including typography, navigation, cards, buttons, release tiles, video tiles, footer layout, mobile breakpoints, focus states, and visual presentation.

## Music Data Flow

The intended data flow is:

```text
release-catalog.json
        │
        ├──► releases.html
        │      └── release archive / album + EP tracklists
        │
        └──► music-random.js
               └── randomized individual songs
                      ├── Spotify track link
                      ├── Apple Music track link
                      └── parent release artwork
```

This design means the release archive is the authoritative music database. When releases or tracks are added or corrected, the catalog is the place where those data relationships belong.

Album and EP tracks remain grouped together on the Releases page, but are split into individual song entries when the homepage Music section is rendered.

## Spotify and Apple Music Links

Direct platform destinations are preferred over search URLs.

The catalog maintains direct Spotify destinations at both the release and individual-track levels. The `trackSpotify` map is the source used when a specific song needs its own Spotify button.

Apple Music destinations are associated with the corresponding LIL SYNN artist catalog and are used for song-specific Music and Releases buttons.

The repository also contains the current direct Spotify track URLs supplied for the LIL SYNN catalog, including the songs within the grouped releases and the standalone releases.

## Latest Videos

The **Watch Latest Videos / Music videos and visual stories from LIL SYNN** section is intentionally **not randomized**.

It is a chronological YouTube feed representing LIL SYNN's recent videos.

The serverless endpoint in `api/youtube.js`:

- Reads the YouTube API key from `YOUTUBE_API_KEY`.
- Targets the LIL SYNN YouTube channel.
- Requests only videos.
- Uses `order=date` so recent uploads arrive newest-first.
- Requests a larger recent result set so the current top videos can be selected reliably.
- Returns six videos to the homepage.

The frontend displays those six entries in the order supplied by the endpoint. There is no Music-style shuffle applied to this section.

### YouTube Fallback

`assets/youtube-fallback.json` provides a repository-backed fallback catalog for when the live Google/YouTube API cannot provide a usable response, including rate-limit/API failure situations.

The fallback is also deterministic: the homepage uses the first six entries rather than randomizing the fallback list.

This preserves the intended distinction:

```text
MUSIC              → randomized songs
LATEST VIDEOS      → newest YouTube videos
```

## Homepage Newest Release

The homepage newest-release presentation follows the canonical release database order.

The current newest release is **Somewhere In-Between**.

The release presentation provides the appropriate artwork and direct platform actions, including Spotify and Apple Music, with a separate pre-save destination for upcoming releases where applicable.

## Release Archive

The Releases page is intended to be a complete, browsable archive rather than a collection of unrelated cards.

It supports:

- Albums.
- EPs.
- Singles.
- Grouped tracklists.
- Individual song entries.
- Direct release and track platform links.
- Release artwork.
- Sorting/display controls.

Artwork is maintained in:

```text
assets/images/icons/album_art/
```

Release artwork must stay associated with the correct catalog entry so the same database can drive both the release archive and homepage Music tiles.

## Navigation and Socials

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

The Socials section includes the site's established social/community destinations, including YouTube, Spotify, Apple Music, Instagram, X, SoundCloud, TikTok, Facebook, Discord, and GitHub.

The artist profile area also includes the LIL SYNN Tidal profile.

The navigation uses the hamburger pattern on mobile and includes a dedicated scrollable social area so the complete navigation remains accessible on smaller screens.

## Footer and Legal Navigation

The site footer includes the approved social SVG buttons and legal navigation.

Current legal pages include:

- `privacy.html`
- Terms page

The footer/social artwork is intended to remain visible and usable on both desktop and mobile layouts.

## Responsive Design

Desktop and mobile are both supported as production layouts.

Responsive behavior covers:

- Homepage content sections.
- Music tiles.
- Release tiles.
- Video tiles.
- Navigation and hamburger menu.
- Social/follow buttons.
- Footer SVG buttons.
- Artist/profile links.
- Background video behavior.

The mobile navigation is designed to use the available viewport height rather than being constrained by the desktop navigation height, and its content area can scroll when necessary.

## Accessibility

The site includes production accessibility work such as:

- Keyboard focus states.
- Accessible button labels.
- Accessible navigation state changes.
- Reduced-motion support.
- Alt text for artwork/video images where applicable.
- Usable controls across desktop and mobile layouts.
- Navigation and social areas that remain reachable when content exceeds the mobile viewport.

## Performance and Media Handling

The site includes performance-conscious media handling, including:

- Lazy loading for appropriate images/video thumbnails.
- Lightweight video placeholders before playback.
- `playsinline` handling for mobile video.
- Reduced-motion handling for the background video.
- Connection-aware background-video behavior.
- API caching controls where appropriate.

The intention is to preserve LIL SYNN's visual identity without forcing unnecessary heavy media work on constrained mobile connections.

## SEO and Sharing

The production site includes work for:

- Search-engine metadata.
- Open Graph/social sharing metadata.
- JSON-LD structured data.
- `robots.txt`.
- `sitemap.xml`.
- Canonical production URLs.

These elements are maintained as part of the website rather than treated as separate documentation-only assets.

## Serverless API

The `api/` directory contains the YouTube serverless endpoint.

```text
api/
└── youtube.js
```

The endpoint is designed for Vercel-style serverless deployment and requires the `YOUTUBE_API_KEY` environment variable in production.

No YouTube API key is stored in the repository.

## Repository Layout

```text
LILSYNNOFFICIAL/
└── LILSYNNOFFICIAL/
    ├── api/
    │   └── youtube.js
    ├── assets/
    │   ├── images/
    │   │   └── icons/
    │   │       └── album_art/
    │   └── youtube-fallback.json
    ├── DEPLOYMENT-REVISION.md
    ├── index.html
    ├── music-random.js
    ├── privacy.html
    ├── release-catalog.json
    ├── releases.html
    ├── robots.txt
    ├── script.js
    ├── site-polish.js
    ├── sitemap.xml
    └── style.css
```

## Production Deployment

The website is deployed for production from **`main`**.

The repository's production source of truth is:

```text
main
```

The prior backup branch has been removed. Do not create parallel production branches unless there is a specific documented reason to do so.

`DEPLOYMENT-REVISION.md` records the approved production baseline and the single-branch production model.

## Content and Engineering Rules

The website depends on a few architectural rules that should be preserved during future maintenance:

1. **Do not create a second music database.** `release-catalog.json` is the authoritative release/song source.
2. **Randomization belongs only to homepage Music.** Do not apply the Music shuffle to Latest Videos.
3. **Latest Videos stays newest-first.** It is a recent YouTube feed, not a discovery shuffle.
4. **Keep the six-video YouTube fallback deterministic.** Its purpose is availability during API failure/rate limiting.
5. **Use direct platform destinations.** Do not silently replace a direct song/release URL with a search page.
6. **Keep album/EP structure intact on Releases.** Split tracks only when rendering the homepage Music discovery cards.
7. **Keep artwork tied to the correct release.** Artwork is part of the music data relationship, not a decorative afterthought.
8. **Preserve desktop and mobile behavior together.** Responsive changes should work at both sizes.
9. **Avoid competing renderers.** A single section should have one authoritative renderer so separate scripts cannot overwrite each other's output.
10. **Keep secrets out of source control.** The YouTube API key belongs in the deployment environment.

## Related Creative and Technology Projects

The LIL SYNN site is part of a larger independent creative and technology ecosystem associated with Neurosyn-Dev.

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

## Contact

Website/project contact:

**synovamedia@gmail.com**

## Project Status

This repository represents the working production baseline for the official LIL SYNN website.

The repository currently contains the production homepage, responsive navigation, music/release data architecture, direct platform linking, randomized homepage Music discovery, chronological YouTube Latest Videos, six-video API fallback, artwork system, footer/social navigation, legal pages, and supporting SEO/accessibility/performance work.

For the live experience, visit **https://lilsynn.com**.
