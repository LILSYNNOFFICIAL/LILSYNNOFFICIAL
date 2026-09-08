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
- Universal shell CSS: `site-global.css`
- Universal shell JavaScript: `site-global.js`
- Core homepage behavior: `script.js`
- Homepage presentation/enrichment: `site-polish.js`
- Homepage media/background/release compatibility: `homepage-final-fixes.js`
- Random music discovery: `music-random.js`
- Latest video rendering: `latest-videos.js` + `latest-videos.json` + `api/latest-youtube-releases.js`
- Canonical release data: `release-catalog.json`
- Custom not-found page: `404.html`

## Universal Site Shell: One Header, One Menu, One Footer

The site now has one canonical shell for every HTML page:

```text
site-global.css
       ↓
site-global.js
       ↓
┌──────────────────────────────┐
│ ONE FIXED HEADER             │
│ logo + LIL SYNN + hamburger  │
└──────────────────────────────┘
               ↓
┌──────────────────────────────┐
│ ONE RIGHT-SIDE MENU          │
│ Home / Music / Releases ...  │
│ Socials                      │
│ Stream                       │
└──────────────────────────────┘
               ↓
        PAGE-SPECIFIC CONTENT
               ↓
┌──────────────────────────────┐
│ ONE UNIVERSAL FOOTER         │
│ navigation + social icons    │
│ legal links + copyright      │
└──────────────────────────────┘
```

`site-global.js` is the owner of the shared shell. It replaces legacy page-specific header/menu/footer markup with the canonical shell at runtime so `index.html`, `releases.html`, `special_access.html`, `privacy.html`, `terms.html`, and `404.html` use the same structure and behavior.

`site-global.css` owns the shell geometry, responsive behavior, accessibility focus styling, fixed header, right-side menu, dropdowns, and footer presentation. Page-specific CSS must not redefine the shared shell.

### Canonical header

Every page gets the same:

- LIL SYNN logo from `/assets/img/LS.png`
- LIL SYNN wordmark
- fixed 72px desktop header, 64px narrow/mobile header
- hamburger button
- accessible header semantics
- pink divider and glass/dark treatment

The header is fixed flush to the viewport top. It is never implemented differently on the homepage versus secondary pages.

### Canonical menu

The right-side menu is fixed to the viewport and uses `100dvh`. Its own content scrolls internally so a long Socials or Stream list cannot push the page layout around.

Canonical primary navigation:

- Home
- Music
- Releases
- Videos
- About
- Merch
- Lyrics
- Contact
- Socials
- Stream

**Socials:** YouTube, Spotify, Apple Music, Instagram, X / Twitter, SoundCloud, TikTok, Facebook.

**Stream:** Spotify, Apple Music, YouTube, YouTube Music, TIDAL, Amazon Music.

Socials and Stream are independently collapsed by default. Opening one closes the other.

### Menu accessibility

The universal shell maintains:

- `aria-expanded`
- `aria-controls`
- `aria-hidden`
- keyboard focus states
- Escape-to-close
- internal scrolling
- body scroll locking while the drawer is open
- consistent external-link security using `noopener noreferrer`

Do not add another hamburger, another side menu, another Socials implementation, or page-specific menu positioning.

### Canonical footer

Every page receives the same footer containing:

- LIL SYNN branding
- `Dark sound. Raw emotion. No limits`
- common navigation
- SYNN SIGNAL
- Special Access
- eight social profiles
- Privacy
- Terms
- current-year copyright

The footer is generated once by `site-global.js`. Adding or removing a global footer item should be done there, not by copying markup into individual HTML pages.

## HTML Page Responsibilities

The HTML files should own **content**, not competing versions of the website shell.

Current pages:

- `index.html` → homepage content and homepage-specific scripts
- `releases.html` → release catalog renderer and catalog-specific controls
- `special_access.html` → archive videos and unreleased/demo audio player
- `privacy.html` → privacy content
- `terms.html` → terms content
- `404.html` → custom not-found experience

The universal shell may normalize legacy markup for compatibility, but new pages must not add legacy `.nav`, `.menu`, or duplicated `<footer>` implementations.

## Global Asset and Styling Rules

Primary fonts:

- Orbitron: branding, headings, primary navigation
- Rajdhani: supporting text, controls, dropdowns
- Inter: general body text where appropriate

Primary accent:

```text
#ff008f
```

Hover pink:

```text
#ff4fd8
```

The visual identity is dark, cinematic, high-contrast, and media-forward.

`site-global.css` owns only the global shell. `style.css` owns the shared visual system and page components. Page-specific styles should be limited to the page that actually needs them.

## SEO and Metadata

Each HTML page should have:

- unique `<title>`
- useful meta description
- canonical URL
- viewport declaration
- meaningful language declaration
- appropriate Open Graph/Twitter metadata on public marketing pages where applicable

`site-global.js` supplies safe metadata fallbacks and canonical normalization when a page is missing basic metadata.

## Animated WebM Background

Known background assets:

```text
assets/mov/BG_ANI.webm
assets/mov/HERO_BG_WEBM.webm
```

`BG2.webm` is not a repository asset and must never be reintroduced.

The background must remain behind page content and must not create horizontal overflow.

## Music / Release Architecture

`release-catalog.json` is the canonical release database. It contains release ordering, group information, track lists, Spotify destinations, Apple Music destinations, and track-level streaming destinations.

Current catalog order begins:

1. `Never Known`
2. `HOME (ACOUSTIC VERSION)`
3. `I DID IT AGAIN`

Artwork lives in:

```text
assets/images/icons/album_art/
```

Newest canonical artwork:

```text
Never Known_album_cover.jpg
home_acoustic_version.png
I DID IT AGAIN.jpg
```

Never create a second release database in an HTML page merely to make a release display correctly.

### Releases archive

`releases.html` consumes `release-catalog.json` and renders the complete archive. It is no longer the owner of the global header/footer. Its responsibility is release content and sorting.

### Homepage releases

`site-polish.js` and `homepage-final-fixes.js` handle homepage release presentation and compatibility. `site-global.js` only handles universal shell normalization and legacy release fallback cleanup.

### Random music

`music-random.js` owns randomized catalog discovery. Do not replace it with a hard-coded static list.

## Media / The Calm

Background audio:

```text
assets/other/sound/Background.mp3
```

The UI title is **The Calm**. The filename must remain unchanged.

Browser autoplay restrictions are real. Audible autoplay cannot be guaranteed on every browser/device.

## YouTube / Latest Videos

The production Latest Videos path uses the official YouTube Data API:

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

Relevant files include:

- `api/youtube.js`
- `api/latest-youtube-releases.js`
- `latest-videos.js`
- `latest-videos.json`
- `.github/workflows/update-latest-videos.yml`
- `assets/youtube-fallback.json`

`YOUTUBE_API_KEY` is a secret and must never be committed.

## Special Access

`special_access.html` contains restricted archive material, early transmissions, bloopers/alternate scenes, and unreleased/demo audio.

Current archive audio includes:

```text
assets/other/Before(1).mp3
assets/other/F 67.flac
assets/other/Oblivion_out.mp3
assets/other/Reset The Pin.flac
assets/other/Ties Remain2.mp3
```

The page-specific archive player remains owned by `special_access.html`. The universal shell does not alter its audio controls.

## Accessibility and Responsive Rules

Preserve:

- meaningful image alt text
- keyboard focus states
- `aria-expanded`, `aria-controls`, and `aria-hidden`
- Escape-to-close
- reduced-motion behavior
- mobile-friendly menu sizing
- `playsinline` for video
- no horizontal overflow
- internal scrolling for long navigation menus

Test large desktop, standard desktop, tablet, mobile, and narrow mobile.

## 404

`404.html` uses the same universal header/footer and provides a branded `SIGNAL LOST / PAGE NOT FOUND` experience with a return-home action.

## Git / Deployment QA

Before committing website changes:

1. Inspect changed files.
2. Review the complete diff.
3. Confirm no unrelated files changed.
4. Validate HTML/JS/CSS syntax where applicable.
5. Check console errors and failed network requests.
6. Verify artwork, WebM, and audio assets.
7. Verify the universal shell exists on every HTML page.
8. Verify exactly one rendered header, one rendered side menu, and one rendered footer.
9. Verify Socials and Stream independently expand/collapse.
10. Verify responsive behavior.
11. Commit with a meaningful message.
12. Confirm Vercel deploys the intended commit.
13. Test the actual production site.

A Vercel deployment being `READY` does **not** by itself prove visual or functional correctness.

### Deployment rate limits

If Vercel reports an account deployment allowance such as `api-deployments-free-per-day`, do not create meaningless commits or spam retries. Keep `main` at the validated source state and retry only when deployment capacity is available.

## Automated Validation

`.github/workflows/fix-homepage.yml` validates required architecture/assets and canonical release data. It also handles legacy `BG2.webm` normalization where configured.

`.github/workflows/inject-site-global.yml` keeps the universal shell cache-buster current where required.

## Maintenance Rules

1. Fix the system that owns the behavior.
2. Do not create parallel implementations of navigation, footer, release data, artwork, media playback, or background video.
3. Do not add page-specific selectors that redefine global shell geometry.
4. Keep global links and social destinations centralized in `site-global.js`.
5. Keep global shell CSS centralized in `site-global.css`.
6. Keep release data centralized in `release-catalog.json`.
7. Keep page-specific functionality in the page or its dedicated script.
8. Never claim live deployment or browser verification unless it was actually verified.

The design goal is simple:

> **One header to rule them all. One menu to rule them all. One footer to rule them all. One source of truth.**
