# LIL SYNN

## Official Website Repository

Production source for [lilsynn.com](https://lilsynn.com).

The site is deployed from `main` through Vercel.

---

## Architecture

The site follows one core rule:

> **One global shell, one navigation system, one release database, one background-video system, and no competing implementations.**

| System | Responsibility |
|---|---|
| `index.html` | Homepage content and landing experience |
| `site-global.js` | Canonical header, navigation, footer, shared controls, metadata, About accordion, and shell behavior |
| `site-global.css` | Canonical shell styling, positioning, responsive behavior, controls, and global background presentation |
| `script.js` | Global randomized WebM background and homepage presentation behavior |
| `site-polish.js` | Homepage-specific release and video presentation |
| `music-random.js` | Catalog-derived random music cards and RANDOMIZE button |
| `release-catalog.json` | Canonical release order, groups, tracks, artwork and streaming destinations |
| `releases.html` | Release archive presentation, ordering and filters |
| `.github/workflows/fix-homepage.yml` | Source cleanup, WebM manifest generation, and architecture validation |

---

# Global Shell

`site-global.js` is the authoritative global shell.

It owns:

- Global header
- Primary navigation
- Responsive navigation drawer
- Socials group
- Stream group
- Footer
- Special Access headphone link
- THE CALM controller
- Back To Top
- Shared metadata
- About accordion behavior
- Keyboard and Escape handling
- Body scroll locking
- Duplicate-shell cleanup

Every page should use the same shell.

There must not be page-specific copies of the global header, navigation, menu, footer, THE CALM control, or Back To Top control.

## Duplicate prevention

The source architecture intentionally removes the old homepage shell instead of hiding it after load.

The homepage must not contain:

- `aria-label="Primary navigation"`
- `#sideMenu`
- `.site-headphones`
- `assets/img/LS_HEADPHONES.png`
- `homepage-final-fixes.js`
- a second `site-global.js` loader
- an old homepage background video implementation

The canonical shell is:

```html
<script src="/site-global.js?v=20260911"></script>
```

`site-global.js` also removes stale top-level shell elements defensively so older pages cannot create a second navigation system.

The GitHub workflow validates these rules across HTML files.

---

# Global Header

The global header is intentionally positioned slightly below the top edge instead of touching the viewport edge.

It has three conceptual areas:

1. **Far left:** `LS_HEADPHONES.png`
2. **Center:** reserved space for future artwork/content
3. **Right:** navigation button

The header mark uses:

```text
/assets/images/icons/LS_HEADPHONES.png
```

The headphone artwork is also the Special Access Easter egg.

Clicking the headphone artwork opens:

```text
/special_access.html
```

The clickable Special Access target is constrained to the headphone artwork box. It does not use an oversized invisible link around the whole header.

The old `assets/img/LS_HEADPHONES.png` path must never return.

The header is intentionally designed so additional center content can be added later without rebuilding the shell.

---

# Navigation Stability

The site uses one responsive navigation drawer.

The drawer contains:

### Primary

- Home
- Music
- Releases
- Videos
- About
- Merch
- Lyrics
- Contact

### Socials

- YouTube
- Spotify
- Apple Music
- Instagram
- X / Twitter
- SoundCloud
- TikTok
- Facebook

### Stream

- Spotify
- Apple Music
- YouTube
- YouTube Music
- TIDAL
- Amazon Music

The navigation supports:

- Responsive sizing
- Internal scrolling
- Keyboard use
- Escape-to-close
- ARIA state
- Body scroll locking
- No competing page-level menu

The source-level cleanup is important because an old header plus the new global header causes visible jumping and duplicate controls during page initialization.

---

# Global Background WebM System

The website has one shared full-page background-video system.

Background videos are stored in:

```text
/assets/mov/
```

The GitHub Actions workflow automatically generates:

```text
/assets/mov/index.json
```

containing every `.webm` file currently in that directory.

On page load, `script.js`:

1. Creates or adopts the global background video.
2. Moves the homepage video into the document-level background layer when necessary.
3. Loads `/assets/mov/index.json`.
4. Selects one WebM at random.
5. Plays it muted and inline.
6. Covers the entire viewport with `object-fit: cover`.
7. Places a dark overlay above the video and below page content.

This means adding a new `.webm` file to `assets/mov` automatically makes it eligible for random selection after the manifest is regenerated.

There is no hard-coded single background choice in the global system.

If the manifest cannot be loaded, `BG_ANI.webm` remains the fallback.

The old in-section-only `#bgVideo` architecture is removed from homepage source by the cleanup workflow.

---

# Homepage RANDOMIZE

The homepage music catalog includes a real button:

```text
RANDOMIZE
```

`music-random.js` builds the random music pool from `release-catalog.json` and associated artwork/streaming data.

The button generates a new randomized selection instead of merely displaying non-interactive text.

The randomizer avoids repeatedly returning the exact previous set when enough catalog entries are available.

The canonical release database remains untouched. Randomization is presentation-only.

---

# About Sections

The About area uses an expandable section system.

Each artist/persona/music section has its own control.

When a section is opened:

- Its content becomes visible.
- The page scrolls to that section.
- The section is positioned below the global header.
- Other sections are closed so the selected section is easy to read.
- A small `×` button appears inside the open section.

Clicking the `×` closes that individual section without requiring the user to reopen another section.

This avoids the old behavior where opening an About section could create awkward jumping and made it difficult to selectively collapse content.

---

# Releases

`release-catalog.json` is the canonical release database.

It owns:

- Release order
- Albums
- EPs
- Standalone singles
- Track listings
- Artwork mappings
- Spotify links
- Apple Music links
- SoundCloud links and sets

`releases.html` owns presentation only.

## Canonical track order

Track rows are rendered directly from each group's `tracks` array in `release-catalog.json`.

The renderer does not alphabetize, randomize, reverse, or otherwise mutate the track arrays.

Therefore the catalog is the authoritative track order.

When changing a track sequence, edit the corresponding `tracks` array in `release-catalog.json`, not the renderer.

## Archive order

The default archive order comes directly from the catalog's `order` array.

Presentation sorting creates a copy of that array so sorting cannot mutate canonical catalog order.

---

# Release Filters

`releases.html` provides two independent controls:

### Filter

- All releases
- Albums
- EPs
- Singles

### Order

- Catalog order
- A → Z
- Z → A

Both controls rerender the archive immediately.

Filtering does not modify the catalog data.

Sorting does not modify the catalog data.

Albums and EPs remain grouped with their track lists, while standalone singles remain available through the Singles filter.

---

# Critical Release Separation

## Signal Light Sermon

There are two distinct releases with similar names.

### `Signal Light Sermon`

This is the track on:

```text
Touching to the North
```

It is SoundCloud-only.

Required destinations:

- SoundCloud: YES
- Spotify: NO
- Apple Music: NO

### `Signal Light Sermon (Remastered 2026)`

This is a separate standalone single with its own Spotify and Apple Music destinations.

Never reuse the standalone remastered destinations for the album track.

---

# Touching to the North

`Touching to the North` is a SoundCloud-only album.

Its set is:

```text
https://soundcloud.com/lilsynnofficial/sets/touching-to-the-north
```

The album must never receive Spotify or Apple Music buttons through generic fallback logic.

| Destination | Allowed |
|---|---:|
| SoundCloud track | Yes |
| SoundCloud set | Yes |
| Spotify | **No** |
| Apple Music | **No** |

---

# Streaming Rules

Use exact catalog destinations when known.

Never infer a streaming destination from a similar title.

Apple Music search fallback is permitted only where an exact direct destination is not available.

Release-specific restrictions always override generic fallback logic.

---

# Artwork

Canonical global assets include:

```text
/assets/images/icons/LS_HEADPHONES.png
/assets/images/icons/UP_ARROWS.png
```

Release artwork mappings are controlled by the catalog/renderer.

When artwork fails:

1. Check `release-catalog.json`.
2. Check the actual repository filename.
3. Check the renderer path.
4. Fix the owning system.
5. Do not create duplicate assets to hide a path error.

---

# THE CALM

The ambient audio source is:

```text
/assets/other/sound/Background.mp3
```

THE CALM is a global shell feature and must have one controller.

When video playback begins, shared behavior can pause or mute ambient audio to avoid competing media.

---

# Back To Top

Back To Top is a global shell feature.

It uses:

```text
/assets/images/icons/UP_ARROWS.png
```

Individual pages must not create competing Back To Top controls.

---

# Latest Videos

Homepage Latest Videos uses:

```text
/api/latest-youtube-releases
```

The API represents YouTube Releases rather than the generic uploads feed.

Release playlist/card ordering is preserved and release representations are not flattened into an unrelated upload-date ranking.

---

# Responsive Design

The shared shell must work across desktop, tablet, mobile and narrow-mobile layouts.

Pay particular attention to:

- Header offset and positioning
- Far-left headphone alignment
- Future center-header content
- Navigation drawer sizing
- Long navigation scrolling
- Release filters
- Track rows
- Randomize control
- About section controls
- Full-page background video
- Horizontal overflow

Do not solve responsive problems by creating a second shell.

---

# Accessibility

Preserve:

- Keyboard navigation
- Visible focus states
- Meaningful image alt text
- `aria-expanded`
- `aria-controls`
- `aria-hidden`
- Accessible icon labels
- Escape-to-close behavior
- Individual About close buttons
- Reduced-motion behavior
- Responsive layouts without unnecessary horizontal scrolling

---

# GitHub Actions

`.github/workflows/fix-homepage.yml` protects the architecture.

On pushes to `main`, it:

1. Removes legacy homepage navigation.
2. Removes the legacy side drawer.
3. Removes stale global shell markup.
4. Removes the obsolete homepage fixer.
5. Removes the old homepage-only background-video element.
6. Ensures exactly one canonical `site-global.js` loader remains.
7. Generates `assets/mov/index.json` from the WebM files currently in `assets/mov`.
8. Commits those source changes when needed.
9. Validates required files and media.
10. Rejects obsolete shell references across HTML pages.
11. Validates canonical release data.
12. Validates Special Access SEO.
13. Validates sitemap coverage.

The workflow is a guardrail, not a substitute for real browser testing.

---

# Change Discipline

When changing the site:

1. Identify the system that owns the behavior.
2. Fix that system instead of stacking another patch on top.
3. Inspect the current file and blob SHA before replacement.
4. Preserve unrelated working behavior.
5. Keep release data in `release-catalog.json`.
6. Keep global behavior in `site-global.js` and `site-global.css`.
7. Keep global motion/background behavior in `script.js`.
8. Keep homepage-specific release/video presentation in homepage systems.
9. Never duplicate the global shell.
10. Never reuse streaming links between distinct releases.
11. Never add Spotify or Apple Music to `Touching to the North`.
12. Never use the old headphone asset path.
13. Never reintroduce `#sideMenu` or `.site-headphones`.
14. Never bring back `homepage-final-fixes.js` as a competing shell loader.
15. Never claim browser or production verification unless it actually happened.

---

# QA Checklist

Before a significant change is considered complete:

- [ ] One global header
- [ ] One navigation drawer
- [ ] One footer
- [ ] One THE CALM controller
- [ ] One Back To Top control
- [ ] No legacy `#sideMenu`
- [ ] No legacy `.site-headphones`
- [ ] No old headphone asset path
- [ ] Special Access click target matches the headphone artwork box
- [ ] Header is offset from the top edge
- [ ] Headphones are aligned far left
- [ ] Center header area remains available for future artwork
- [ ] RANDOMIZE is a real button
- [ ] About sections open and scroll correctly
- [ ] About sections have individual `×` close buttons
- [ ] Background WebM covers the entire page
- [ ] Background WebM is selected randomly from `assets/mov`
- [ ] WebM manifest is generated
- [ ] Release track order follows catalog arrays
- [ ] Release filter works
- [ ] Release ordering works
- [ ] Albums render
- [ ] EPs render
- [ ] Singles render
- [ ] Touching to the North remains SoundCloud-only
- [ ] Signal Light Sermon album track remains separate from the remastered single
- [ ] Latest Videos uses YouTube Releases
- [ ] Mobile layout checked
- [ ] Narrow-mobile layout checked
- [ ] Production behavior claimed only when actually verified

---

# Production Principle

> **Build one correct system instead of stacking patches on top of an incorrect system.**

If a global behavior is wrong, repair the global owner.

If release data is wrong, repair the catalog.

If homepage presentation is wrong, repair the homepage renderer.

Do not create another implementation to compete with the existing one.

---

## Repository

**LIL SYNN Official Website**

Production site: https://lilsynn.com

Branch: `main`

Deployment: Vercel
