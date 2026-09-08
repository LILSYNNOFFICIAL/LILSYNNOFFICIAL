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
- Core homepage behavior: `script.js`
- Homepage presentation/enrichment: `site-polish.js`
- Homepage media/background/release compatibility: `homepage-final-fixes.js`
- Random music discovery: `music-random.js`
- Latest video rendering: `latest-videos.js` + `latest-videos.json` + `api/latest-youtube-releases.js`
- Universal navigation shell: `site-global.js`
- Canonical release data: `release-catalog.json`

## Global Navigation Architecture

There is **one navigation system across the entire site**. `releases.html` is the canonical reference implementation for the header, hamburger, right-side menu, Socials dropdown, Stream dropdown, spacing, positioning, and menu behavior. `index.html` must use the same navigation model and must not maintain a visually or behaviorally separate legacy menu.

`site-global.js` is the universal navigation compatibility layer. It normalizes the navigation DOM, styling, menu state, accessibility state, Socials/Stream groups, and shared visual behavior so every HTML page presents the same menu.

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
  ├── About
  ├── Merch
  ├── Lyrics
  ├── Contact
  ├── Socials
  │   └── collapsed dropdown → 8 social links
  └── Stream
      └── collapsed dropdown → 6 streaming links
```

The menu is fixed to the right side of the viewport, uses a full viewport-height panel, and must never become normal page-flow content or appear at the bottom-left.

### Canonical menu links

**Socials:** YouTube, Spotify, Apple Music, Instagram, X / Twitter, SoundCloud, TikTok, Facebook.

**Stream:** Spotify, Apple Music, YouTube, YouTube Music, TIDAL, Amazon Music.

Socials and Stream are independently collapsed by default. They are adjacent primary navigation groups with consistent spacing. Do not add spacer elements, negative-margin hacks, duplicate menus, or page-specific positioning rules to recreate the relationship.

### Navigation implementation rules

- Exactly one hamburger control and one side menu per page.
- The header is fixed flush to the top of the viewport.
- The side menu is fixed to the right and uses `100dvh` height.
- Menu content scrolls inside the menu rather than expanding the page.
- `aria-expanded`, `aria-controls`, and `aria-hidden` must remain synchronized with menu state.
- Escape closes the menu.
- Opening one dropdown closes the other dropdown.
- Navigation links must retain their canonical destinations.
- `site-global.js` must remain loaded on pages that use the universal shell.
- Do not create a second navigation architecture when fixing a page-specific issue.

### Index-specific CSS rule

`index.html` historically contained broad selectors such as `nav { height: 72px; }`. Those selectors can also match the `<nav>` nested inside the side menu and cause layout differences. Navigation CSS must therefore target the header and menu structures explicitly rather than applying header geometry to every `<nav>` element.

The universal shell now explicitly normalizes the homepage and secondary-page menu structures so the index menu matches the canonical Releases menu.

## Animated WebM Background

The site uses an animated WebM background behind page content.

Known assets:

```text
assets/mov/BG_ANI.webm
assets/mov/HERO_BG_WEBM.webm
```

The background may select an available `.webm` from `assets/mov/`, with a known asset retained as fallback when discovery fails.

The geometry intentionally starts the video below the pink navigation divider:

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

`releases.html` consumes the canonical release data and presents the complete release archive. It is also the canonical navigation reference page.

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

`homepage-final-fixes.js` verifies the rendered Latest Releases cards and restores those canonical artwork paths if a renderer/cache leaves a placeholder or stale image. This is a compatibility safeguard, not a second release database.

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

`script.js` must not contain a competing hard-coded Latest Videos list. `latest-videos.js` and `site-polish.js` own that rendering path.

## Secondary Pages

The secondary pages currently include:

- `releases.html`
- `special_access.html`
- `privacy.html`
- `terms.html`

`site-global.js` supplies their shared shell, including the header/navigation, right-side menu, Socials/Stream dropdowns, and shared visual normalization.

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

- Orbitron — branding, headings, and primary navigation
- Rajdhani — supporting text and dropdown options
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
- `aria-expanded`, `aria-controls`, and `aria-hidden` menu state
- Escape-to-close behavior
- reduced-motion behavior where implemented
- mobile-friendly menu sizing
- `playsinline` for video
- no horizontal overflow
- meaningful image alt text
- independently collapsible Socials and Stream groups

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

1. Inspect changed files.
2. Review the complete diff.
3. Confirm no unrelated files changed.
4. Validate HTML/JS/CSS syntax where applicable.
5. Check console errors and failed network requests.
6. Verify artwork/WebM assets.
7. Verify navigation DOM and dropdown state.
8. Compare `index.html` navigation behavior against `releases.html` when navigation is touched.
9. Verify responsive behavior.
10. Commit with a meaningful message.
11. Confirm Vercel deploys the intended commit.
12. Test the actual production site.

A Vercel deployment being `READY` does **not** by itself mean the website is visually or functionally correct.

### Deployment rate-limit handling

Vercel may reject deployment attempts when the account's deployment allowance has been exhausted, including the `api-deployments-free-per-day` resource-limit condition. This is an external deployment constraint, not a website-code failure.

When that occurs:

- do not create placeholder or meaningless source commits just to trigger another deployment;
- do not repeatedly spam failed deployment attempts;
- keep `main` at the validated source state;
- preserve the existing production deployment until a valid deployment can be created;
- retry the established Vercel workflow only after the deployment allowance becomes available;
- after a successful deployment, verify that production is running the intended Git commit before declaring the release complete.

## Automated Validation

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

For navigation specifically, treat `releases.html` as the canonical reference and keep `index.html` synchronized with it through the universal shell. A page-specific CSS selector must never accidentally change the geometry of the shared menu.

## Current Production Freeze / Owner QA

The finalized website source should remain unchanged unless the site owner reports a specific, reproducible production problem. Do not proactively refactor or regenerate working systems.

Interactive browser testing may be unavailable in some maintenance sessions. When it is unavailable, report the limitation honestly rather than claiming hamburger clicks, dropdown interaction, randomizer interaction, or pixel-level visual verification was performed.

For a deployment-ready state, the required sequence remains:

```text
Validated GitHub main
   ↓
Successful Vercel deployment of that exact commit
   ↓
Production alias updated
   ↓
Live-site verification
   ↓
Owner manual interactive QA when required
```
