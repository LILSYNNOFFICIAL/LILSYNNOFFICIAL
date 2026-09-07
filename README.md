<div align="center">

# LIL SYNN

### Official Website · Music · Visuals · Archive

**Production repository for https://lilsynn.com**

</div>

---

## Production Source of Truth

- Production branch: `main`
- Deployment platform: Vercel
- Primary page: `index.html`
- Shared visual system: `style.css`
- Core navigation interactions: `script.js`
- Homepage presentation/enrichment: `site-polish.js`
- Homepage media/background/release compatibility: `homepage-final-fixes.js`
- Random music discovery: `music-random.js`
- Latest video rendering: `latest-videos.js` + `latest-videos.json` + `api/latest-youtube-releases.js`
- Secondary-page shell: `site-global.js`
- Canonical release data: `release-catalog.json`

## Important Architecture Rule

`index.html` is the reference implementation for the site's global navigation, responsive behavior, animated background geometry, typography, and menu interaction model.

Secondary pages must visually/functionally follow that implementation. `site-global.js` provides the secondary-page shell; it must not become a competing navigation architecture or invent a different menu state model.

The canonical navigation model is:

```text
Header
  ├── LIL SYNN brand
  └── hamburger

Right-side fixed menu
  ├── Home
  ├── Music
  ├── Releases
  ├── Videos
  ├── Socials
  │   └── collapsed dropdown → full social links
  ├── Stream
  │   └── collapsed dropdown → full streaming links
  ├── About
  ├── Merch
  ├── Lyrics
  └── Contact
```

The menu opens from the right and is fixed to the viewport. It must never become normal page-flow content or appear at the bottom-left.

### Navigation ownership

`script.js` is the homepage navigation controller. It owns only menu state, accessibility state, homepage Socials/Stream group creation, and navigation-related visual rules. It must not overwrite release data, Latest Releases, YouTube data, or other page content.

`site-global.js` is the secondary-page shell. It creates the complete navigation and background for secondary pages, so `script.js` must recognize an already-complete `Stream` group and leave it alone. There must be exactly one hamburger and one side menu per page.

### Navigation typography

The homepage uses Tailwind's `text-lg` for the primary menu (`1.125rem`) and `text-base` for dropdown items (`1rem`). Primary navigation uses Orbitron; Socials and Stream options use Rajdhani.

Socials and Stream are independently collapsed by default. Each dropdown uses a pink scrollbar and the same spacing/behavior as the homepage reference.

## Animated WebM Background

The site uses `#bgVideo` for the animated homepage/secondary-page background.

Known assets:

```text
assets/mov/BG_ANI.webm
assets/mov/HERO_BG_WEBM.webm
```

The homepage/secondary shell can randomly select an available `.webm` from `assets/mov/`, with a known asset retained as fallback when discovery fails.

The current geometry intentionally starts the video **below the pink navigation divider**:

```text
top: 74px
height: calc(100dvh - 74px)
width: 100vw
object-fit: cover
position: fixed
```

The video must remain behind page content and must not create horizontal overflow. Mobile also uses `object-fit: cover`.

**`BG2.webm` is not a repository asset and must not be introduced as a source reference.** The validation workflow normalizes legacy `BG2.webm` references to `BG_ANI.webm` on pushes, then rejects any remaining obsolete references.

Do not create a second competing background-video system.

## Music / Release Architecture

`release-catalog.json` is the canonical release database. It contains release ordering, release/group information, track lists, Spotify destinations, Apple Music destinations, track-level Spotify destinations, and Apple Music data.

Current catalog order begins:

1. `Never Known`
2. `HOME (ACOUSTIC VERSION)`
3. `I DID IT AGAIN`

Existing Spotify and Apple Music URLs in the catalog are authoritative. Never regenerate, guess, replace, or modify a correct URL merely to fix artwork or presentation.

### Releases archive

`releases.html` consumes the canonical release data and presents the release archive.

### Homepage Latest Releases

The homepage `LATEST RELEASES` renderer is catalog-driven through `site-polish.js` and uses the first three entries in `release-catalog.json`.

Artwork is resolved from:

```text
assets/images/icons/album_art/
```

The current canonical artwork files for the newest three releases are:

```text
Never Known_album_cover.jpg
home_acoustic_version.png
I DID IT AGAIN.jpg
```

`homepage-final-fixes.js` also verifies the rendered Latest Releases cards and restores those canonical artwork paths if a renderer/cache leaves a placeholder or stale image. This is a compatibility safeguard, not a second release database.

**Do not hard-code new release records into `index.html`.** Fix the catalog/renderer instead.

### Artwork matching

Release artwork filenames are not guaranteed to exactly equal release titles. Numeric `lil_synn_` prefixes and descriptive suffixes such as `_album_cover` are valid. Artwork resolution must therefore normalize filenames rather than requiring literal title equality.

### Discover LIL SYNN / random music

`music-random.js` is the existing randomized music system. It consumes the release architecture, expands grouped releases into individual tracks, preserves parent-release artwork, and supplies Spotify/Apple destinations where available.

Do not replace this with a static hard-coded list.

## Media / The Calm

The background music track is:

```text
assets/other/sound/Background.mp3
```

The UI title is **The Calm**. The underlying filename must remain unchanged.

`homepage-final-fixes.js` maintains the compact player and coordinates it with external media where browser events permit:

```text
The Calm playing
    ↓
Spotify / YouTube begins
    ↓
The Calm pauses
    ↓
External media stops/ends
    ↓
The Calm resumes if it was previously playing
```

Browser autoplay restrictions are real; audible autoplay cannot be guaranteed on every browser/device.

## YouTube / Latest Videos

The production Latest Videos system uses the official YouTube Data API rather than scraping YouTube pages.

```text
YouTube channel
  ↓
YouTube Data API
  ↓
publication timestamps
  ↓
newest 9
  ↓
latest-videos.json
  ↓
index.html
```

Relevant files:

- `api/youtube.js`
- `api/latest-youtube-releases.js`
- `latest-videos.js`
- `latest-videos.json`
- `.github/workflows/update-latest-videos.yml`
- `assets/youtube-fallback.json`

`YOUTUBE_API_KEY` is a secret and must never be committed.

`script.js` no longer contains a competing hard-coded Latest Videos list. `latest-videos.js` and `site-polish.js` own that rendering path.

## Secondary Pages

The secondary pages currently include:

- `releases.html`
- `special_access.html`
- `privacy.html`
- `terms.html`

`site-global.js` supplies their shared shell: header/navigation, right-side menu, Socials/Stream dropdowns, and randomized WebM background.

The shell must preserve each page's existing content and links. It must not replace release data, music URLs, or page-specific functionality.

## Special Access

`special_access.html` contains the unreleased/demo library and bloopers/alternate-scenes video content.

Current archive audio assets include:

```text
assets/other/Before(1).mp3
assets/other/F 67.flac
assets/other/Oblivion_out.mp3
assets/other/Reset The Pin.flac
assets/other/Ties Remain2.mp3
```

Future browser-facing archive audio should preferably have MP3/Opus alternatives when FLAC compatibility is insufficient.

## Global Visual System

Primary fonts:

- Orbitron — branding/headings/primary navigation
- Rajdhani — supporting text/dropdowns
- Inter — general page/body fallback where used

Primary accent:

```text
#ff008f
```

Hover pink commonly uses:

```text
#ff4fd8
```

The interface is intentionally dark, cinematic, high-contrast, and media-forward.

## Accessibility / Responsive Rules

Preserve:

- keyboard focus states
- `aria-expanded` and `aria-controls` on menu/dropdown controls
- Escape-to-close behavior
- reduced-motion behavior where implemented
- mobile-friendly menu sizing
- `playsinline` for video
- no horizontal overflow
- meaningful image alt text

Test at large desktop, standard desktop, tablet, mobile, and narrow mobile.

## Release Change Workflow

```text
Add artwork
   ↓
Update canonical release catalog
   ↓
Verify Spotify + Apple destinations
   ↓
Verify artwork filename/path
   ↓
Verify releases.html
   ↓
Verify homepage Latest Releases
   ↓
Verify Discover/random music artwork
   ↓
Deploy
   ↓
Verify production
```

Never create a second release database just to make one page display a release.

## Git / Deployment QA

Before committing website changes:

1. Inspect `git status` / changed files.
2. Review the complete diff.
3. Confirm no unrelated files changed.
4. Validate HTML/JS/CSS syntax where applicable.
5. Check console errors and failed network requests.
6. Verify artwork/WebM assets.
7. Verify navigation DOM and dropdown state.
8. Verify responsive behavior.
9. Commit with a meaningful message.
10. Confirm Vercel deploys the intended commit.
11. Test the actual production site.

A Vercel deployment being `READY` does **not** by itself mean the website is visually or functionally correct.

### Automated validation

`.github/workflows/fix-homepage.yml` validates the required architecture/assets and canonical release data. On normal pushes it first normalizes any legacy `BG2.webm` references to the real `BG_ANI.webm` asset, commits that one-time repair when needed, and then rejects any remaining obsolete references. It does not continuously rewrite the site when no repair is needed.

`.github/workflows/inject-site-global.yml` remains responsible only for keeping the secondary-page `site-global.js` cache-buster current.

## Current Known Asset Locations

```text
assets/img/LS.png
assets/img/MERCH_SHOP.png
assets/mov/BG_ANI.webm
assets/mov/HERO_BG_WEBM.webm
assets/other/sound/Background.mp3
assets/images/icons/album_art/
```

`assets/img/LS.png` is the LIL SYNN logo/hero asset. It is not a release-art fallback and must never be removed by broad image cleanup logic.

## Maintenance Rule

When fixing a production issue, first identify which existing system owns the behavior, then fix that system. Do not create parallel implementations for navigation, release data, artwork, media playback, or background video merely because the existing system is temporarily broken.
