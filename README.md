# LIL SYNN

## Official Website Repository

Production source for https://lilsynn.com.

The site is deployed from `main` through Vercel.

---

## Architecture

The site follows one core rule:

> **One global shell, one navigation system, one canonical release database, one background-video system, and no competing implementations.**

| System | Responsibility |
|---|---|
| `index.html` | Homepage content and landing experience |
| `site-global.js` | Canonical header, navigation, footer, shared controls, metadata, About accordion, shell behavior, release/video corrections |
| `site-global.css` | Canonical shell styling, responsive layout, header positioning, controls, background presentation, release presentation |
| `script.js` | Global randomized WebM background, homepage presentation, global release/video ordering and deduplication helpers |
| `latest-videos.js` | Loads the canonical latest-video manifest, resolves videos against catalog order, deduplicates, and renders playable video cards |
| `latest-videos.json` | Canonical YouTube Releases video manifest with IDs, titles, dates, and release names |
| `music-random.js` | Catalog-derived music-card pool, artwork mapping, random selection, and the single RANDOMIZE control |
| `site-polish.js` | Homepage-specific release/video presentation |
| `release-catalog.json` | Canonical release order, groups, tracks, artwork and streaming destinations |
| `releases.html` | Release archive presentation, filters, ordering, and artwork rendering |
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

Every page should use the same shell. There must not be page-specific copies of the global header, navigation, menu, footer, THE CALM control, or Back To Top control.

## Canonical loader

```html
<script src="/site-global.js?v=20260911"></script>
```

The source architecture removes obsolete homepage shell markup instead of allowing multiple competing shells to initialize.

Legacy items that must not return include:

- `aria-label="Primary navigation"` page-level duplicate navigation
- `#sideMenu`
- `.site-headphones`
- `assets/img/LS_HEADPHONES.png`
- `homepage-final-fixes.js`
- duplicate `site-global.js` loaders
- obsolete homepage-only background-video markup

---

# Header

The header is fixed to the viewport and spans the full width.

Current layout logic:

1. **Far left:** `LS_HEADPHONES.png`
2. **Center:** `LS_LOGO.png`, absolutely centered independently of left controls
3. **Bottom-left:** THE CALM control, pinned directly to the header's left edge
4. **Right:** navigation toggle

The header has no rounded outer corners and no left inset that would visually pull THE CALM away from the edge.

The headphone control uses:

```text
/assets/images/icons/LS_HEADPHONES.png
```

Desktop headphone sizing is currently `175px × 175px`. Mobile is `145px × 145px`. The artwork is allowed to overflow the 150px desktop / 118px mobile header height so it can remain visually large.

The centered header logo is positioned with:

```text
left: 50%
top: 50%
transform: translate(-50%, -50%)
```

This keeps the logo mathematically centered even when the headphone control is enlarged.

THE CALM is positioned with `left: 0` and is therefore attached to the actual left edge of the header rather than being placed inside the headphone control's layout flow.

The clickable Special Access target is constrained to the headphone artwork box and opens `/special_access.html`.

---

# Navigation Stability

The site uses one responsive navigation drawer.

Primary navigation includes Home, Music, Releases, Videos, About, Merch, Lyrics, and Contact.

Social and streaming destinations are grouped inside the same drawer.

The drawer supports:

- Responsive sizing
- Internal scrolling
- Keyboard use
- Escape-to-close
- ARIA state
- Body scroll locking
- No competing page-level menu

---

# Global Background WebM System

Background videos live in:

```text
/assets/mov/
```

The GitHub Actions workflow generates:

```text
/assets/mov/index.json
```

from the `.webm` files currently in that directory.

`script.js`:

1. Creates or adopts the global background video.
2. Moves it to the document-level background layer when necessary.
3. Loads the WebM manifest.
4. Selects one available WebM randomly.
5. Plays it muted and inline.
6. Covers the viewport with `object-fit: cover`.
7. Places a dark overlay above the video and below page content.

If the manifest cannot be loaded, `BG_ANI.webm` is retained as the fallback.

Adding a new WebM to `assets/mov` makes it eligible for selection after the manifest is regenerated.

---

# Global Top Artwork

The global shell inserts `LS.png` directly below the fixed header as shared top artwork.

The canonical asset is:

```text
/assets/img/LS.png
```

The old homepage copy is hidden/removed so the artwork does not appear twice.

The top-art block owns the header offset. Individual pages should not add another large artificial header gap when the global top-art system already provides the visual offset.

---

# THE CALM

THE CALM is a global shell feature and must have one controller.

Ambient audio source:

```text
/assets/other/sound/Background.mp3
```

The control belongs to the global header and is positioned independently from the headphones and centered logo.

Shared media behavior prevents competing playback behavior where applicable.

---

# Back To Top

Back To Top is global and uses:

```text
/assets/images/icons/UP_ARROWS.png
```

Individual pages must not create competing Back To Top controls.

---

# Music RANDOMIZE

The homepage Music section contains exactly **one** RANDOMIZE control.

`music-random.js` owns the random music system.

Its logic is:

1. Read `release-catalog.json`.
2. Walk releases in canonical catalog order.
3. Pull tracks from release group `tracks` arrays.
4. Exclude SoundCloud-only `Touching to the North` entries from the Spotify-driven random pool.
5. Resolve Spotify and artwork data from the catalog and artwork map.
6. Deduplicate tracks before adding them to the pool.
7. Select up to 8 tracks using a Fisher-Yates-style shuffle.
8. Compare the candidate set with the previous set stored in `sessionStorage`.
9. Retry selection when possible so the exact same set is not repeatedly displayed.
10. Randomize the presentation order of the chosen cards.
11. Render real music cards with artwork and streaming links.

The catalog itself is never randomized or mutated. Randomization is presentation-only.

There are defensive guards in both the global shell and `music-random.js` so duplicate `.discover-button` / RANDOMIZE controls are removed or ignored. The intended final state is one `.homepage-refinement` containing one `.discover-button`.

The click handler also prevents duplicate listeners from causing multiple randomizations and can scroll the resulting music selection into view.

---

# About Sections

The About area uses expandable panels.

When a section opens:

- Its content becomes visible.
- The page scrolls to the selected panel.
- The global header offset is respected.
- Other panels are closed.
- An individual `×` close control is available inside the open panel.

Keyboard and focus behavior must remain accessible.

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
- Spotify destinations
- Apple Music destinations
- SoundCloud destinations and sets

`releases.html` owns presentation only.

## Canonical track order

Track rows come directly from each group's `tracks` array.

The renderer must not alphabetize, reverse, randomize, or otherwise mutate the catalog track arrays.

To change track order, edit `release-catalog.json`.

## Canonical archive order

The archive order comes from `release-catalog.json` `order`.

The release renderer and global correction logic create maps/copies for presentation so the canonical catalog itself is never mutated.

## Filters

`releases.html` provides:

### Filter

- All releases
- Albums
- EPs
- Singles

The default state is explicitly **All releases**.

### Order

- Catalog order
- A → Z
- Z → A

Filtering and sorting are presentation-only.

Albums and EPs remain grouped with their track lists. Standalone singles remain independently renderable and filterable.

---

# Release Artwork Logic

Standalone singles can render their own artwork.

`releases.html` maintains explicit artwork mappings where needed, including:

```text
Signal Light Sermon (Remastered 2026)
→ 39_lil_synn_signal_light_sermon___remastered_2026.jpg
```

`script.js` also contains the shared single-art mapping and a `prepareSingleArt()` guard that injects missing artwork into single cards when the release archive is reordered.

The renderer never creates duplicate artwork assets to hide a path problem. When artwork is missing, verify the catalog, filename, and asset path.

---

# Critical Release Separation

## Signal Light Sermon

`Signal Light Sermon` is the track on:

```text
Touching to the North
```

It is SoundCloud-only.

Required destinations:

- SoundCloud: YES
- Spotify: NO
- Apple Music: NO

## Signal Light Sermon (Remastered 2026)

This is a separate standalone single.

It has its own artwork and its own streaming destinations.

Never reuse the standalone remastered release destinations for the album track.

---

# Touching to the North

`Touching to the North` is a SoundCloud-only album.

Its set is:

```text
https://soundcloud.com/lilsynnofficial/sets/touching-to-the-north
```

It must never receive Spotify or Apple Music buttons through generic fallback logic.

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

Apple Music search fallback is permitted only where an exact direct destination is unavailable.

Release-specific restrictions override generic fallback behavior.

---

# Latest Videos

The homepage Latest Videos system is driven by:

```text
latest-videos.json
```

The manifest is a canonical resolved list of YouTube Releases videos with:

- YouTube video ID
- Title
- Published timestamp
- Matching release name

The manifest is ordered according to the canonical release catalog. The YouTube Releases source is used to resolve video IDs, while the release catalog determines presentation order.

`latest-videos.js` then:

1. Fetches `release-catalog.json` and `latest-videos.json` without relying on stale browser cache.
2. Deduplicates the manifest by YouTube ID and normalized title.
3. Walks the canonical catalog order.
4. Matches a manifest video to each release using normalized title matching.
5. Prevents reuse of an already-selected ID or title.
6. Stops at the intended nine-video homepage limit.
7. Renders one article card per unique video.
8. Uses the YouTube thumbnail until the user presses play.
9. Replaces the thumbnail card with a privacy-enhanced `youtube-nocookie.com` iframe when played.

`script.js` also contains a defensive `videoOrder()` observer. It removes duplicate cards by video ID/title and reorders remaining cards against `release-catalog.json` when another homepage system inserts or changes the cards.

This two-layer protection exists because multiple homepage systems can participate in rendering. The goal is that the user sees each video exactly once and in canonical release order.

---

# Responsive Design

The global shell must work across desktop, tablet, mobile, and narrow-mobile layouts.

Current shell breakpoints preserve:

- Desktop header height: `150px`
- Mobile header height: `118px`
- Desktop headphones: `175px × 175px`
- Mobile headphones: `145px × 145px`
- Centered desktop logo: `440px × 138px`
- Mobile logo: `300px × 100px`
- THE CALM: left edge at `0`

The header controls are intentionally independent so changing headphone size cannot shift the centered logo.

Pay particular attention to:

- Header positioning
- Far-left headphone alignment
- Far-left THE CALM alignment
- Center logo alignment
- Navigation drawer sizing
- Long navigation scrolling
- Release filters
- Track rows
- Single artwork
- RANDOMIZE control count
- Latest Videos duplication
- Background video coverage
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

On pushes to `main`, it can:

1. Remove legacy homepage navigation.
2. Remove the legacy side drawer.
3. Remove stale global shell markup.
4. Remove the obsolete homepage fixer.
5. Remove obsolete homepage-only background-video elements.
6. Ensure exactly one canonical `site-global.js` loader remains.
7. Generate `assets/mov/index.json` from the current WebM files.
8. Commit generated/source cleanup when required.
9. Validate required files and media.
10. Reject obsolete shell references across HTML pages.
11. Validate canonical release data.
12. Validate Special Access SEO.
13. Validate sitemap coverage.

The workflow is an architecture guardrail, not a substitute for real browser testing.

---

# Change Discipline

When changing the site:

1. Identify the system that owns the behavior.
2. Fix that system instead of stacking another competing patch on top.
3. Fetch the current file and blob SHA before replacing it.
4. Preserve unrelated working behavior.
5. Keep release data in `release-catalog.json`.
6. Keep global shell behavior in `site-global.js` and `site-global.css`.
7. Keep global background/motion behavior in `script.js`.
8. Keep latest-video resolution/rendering in `latest-videos.js` and `latest-videos.json`.
9. Keep music randomization in `music-random.js`.
10. Keep homepage-specific presentation in its owning homepage systems.
11. Never duplicate the global shell.
12. Never reuse streaming links between distinct releases.
13. Never add Spotify or Apple Music to `Touching to the North`.
14. Never use the old headphone asset path.
15. Never reintroduce `#sideMenu` or `.site-headphones`.
16. Never bring back `homepage-final-fixes.js` as a competing shell loader.
17. Never add a second RANDOMIZE control.
18. Never allow duplicate Latest Video cards.
19. Never claim browser or production verification unless it actually happened.

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
- [ ] Special Access target matches the headphone artwork box
- [ ] Header touches the viewport edges as designed
- [ ] Headphones are pinned far left
- [ ] THE CALM is pinned to the absolute left edge
- [ ] Center logo remains centered independently
- [ ] Global `LS.png` appears once below the header
- [ ] RANDOMIZE appears exactly once
- [ ] RANDOMIZE produces real catalog-derived cards
- [ ] Randomizer avoids the previous exact set when possible
- [ ] About sections open and scroll correctly
- [ ] About sections have individual `×` close buttons
- [ ] Background WebM covers the entire page
- [ ] Background WebM is selected randomly from `assets/mov`
- [ ] WebM manifest is generated
- [ ] Release track order follows catalog arrays
- [ ] Release filter defaults to All releases
- [ ] Release filtering works
- [ ] Release ordering works
- [ ] Albums render
- [ ] EPs render
- [ ] Singles render
- [ ] Standalone single artwork renders where mapped
- [ ] Touching to the North remains SoundCloud-only
- [ ] Signal Light Sermon album track remains separate from the remastered single
- [ ] Latest Videos uses `latest-videos.json`
- [ ] Latest Videos follows canonical catalog order
- [ ] Latest Videos contains no duplicate IDs
- [ ] Latest Videos contains no duplicate normalized titles
- [ ] Latest Videos renders no more than nine cards
- [ ] Video playback replaces the thumbnail with a playable iframe
- [ ] Mobile layout checked
- [ ] Narrow-mobile layout checked
- [ ] Production behavior claimed only when actually verified

---

# Production Principle

> **Build one correct system instead of stacking patches on top of an incorrect system.**

If a global behavior is wrong, repair the global owner.

If release data is wrong, repair the catalog.

If homepage presentation is wrong, repair the homepage renderer.

If duplicate UI appears, trace every system that can create that UI and make ownership explicit.

Do not create another implementation to compete with the existing one.

---

## Repository

**LIL SYNN Official Website**

Production site: https://lilsynn.com

Branch: `main`

Deployment: Vercel
