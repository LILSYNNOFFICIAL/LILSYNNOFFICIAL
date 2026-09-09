<div align="center">

# LIL SYNN

### Official Website · Music · Visuals · Archive

**Production repository for https://lilsynn.com**

</div>

---

## Production Source of Truth

- Production branch: `main`
- Deployment: Vercel
- Homepage: `index.html`
- Global shell CSS: `site-global.css`
- Global shell JavaScript: `site-global.js`
- Homepage-specific behavior: `site-polish.js`
- Canonical release database: `release-catalog.json`
- Release archive: `releases.html`
- Special Access: `special_access.html`
- Coming Soon: `coming_soon.html`

The repository is a production website, not a collection of independent page templates. Global behavior must remain centralized so individual pages cannot accidentally create competing navigation, headers, footers, audio controls, or release data systems.

## Universal Site Shell

`site-global.js` provides the canonical runtime shell across the site's HTML pages. It removes legacy shell markup where necessary and injects one consistent header, navigation drawer, footer, The Calm control, and Back To Top control.

### Header

The global header uses:

```text
/assets/images/icons/LS_HEADPHONES.png
```

The headphone artwork is the **Special Access Easter egg** and links to `/special_access.html`.

Current sizing:

- Desktop header: approximately 90px
- Mobile header: approximately 82px
- Desktop headphone artwork: approximately 84px
- Mobile headphone artwork: approximately 72px

The headphone artwork must remain visually prominent. Do not shrink it back to a small icon or create page-specific header replacements.

### Navigation

Canonical primary navigation:

- Home
- Music
- Releases
- Videos
- About
- Merch
- Lyrics
- Contact

The drawer also contains independent collapsible **Socials** and **Stream** groups. Opening one closes the other.

The global menu supports keyboard focus, Escape-to-close, internal scrolling, body scroll locking, responsive sizing, and accessible ARIA state.

**Do not add another global hamburger, side menu, header, or footer implementation.**

## Release Architecture

`release-catalog.json` is the single source of truth for the release archive.

It controls:

- canonical release order
- albums
- EPs
- standalone singles
- track listings
- release-level Spotify links
- release-level Apple Music links
- track-level Spotify links
- track-level SoundCloud links
- SoundCloud album/set links
- release grouping

`releases.html` reads the catalog at runtime rather than maintaining a second hard-coded release database.

### Albums / EPs

Grouped releases are represented under `groups` in `release-catalog.json`.

Current grouped releases include:

- `Black Glass`
- `Hello Goodbye`
- `Heal`
- `Don't Say It`
- `Enough`
- `Touching to the North`

Grouped releases retain their complete track lists and release-level streaming destinations.

### Standalone singles

Any title present in the catalog `order` but not represented in `groups` is treated as a standalone release.

Standalone releases must remain visible in the release archive. They must not disappear simply because the page renderer is focused on albums or EPs.

The archive supports sorting that can place singles first or grouped releases first while preserving the canonical catalog as the default ordering.

## Critical Release Identity Rule

**Titles identify releases. Similar titles do not mean the same release.**

The most important example is `Signal Light Sermon`.

There are two distinct releases:

### 1. Signal Light Sermon on Touching to the North

This is the **album version**.

It is **SoundCloud ONLY**.

```text
Touching to the North
└── Signal Light Sermon
    └── SoundCloud only
```

There is:

- NO Spotify URL
- NO Apple Music URL

The Touching album version must never inherit a Spotify URL from a standalone release with a similar title.

### 2. Signal Light Sermon (Remastered 2026)

This is a **separate standalone single**.

It has its own:

- Spotify destination
- Apple Music destination

The standalone release must be displayed using its exact title:

```text
Signal Light Sermon (Remastered 2026)
```

The Spotify URL associated with this standalone release belongs **only** to this standalone release.

### Implementation requirement

The `Touching to the North` renderer must explicitly suppress Spotify and Apple Music links for every track in that album and render only the corresponding SoundCloud destination.

Do not use generic fallback logic that can accidentally pull `trackSpotify`, `spotify`, or Apple Music data into the Touching album tracks.

This separation is intentional and must be preserved.

## Touching to the North

`Touching to the North` has its own SoundCloud set:

```text
https://soundcloud.com/lilsynnofficial/sets/touching-to-the-north
```

Its tracks use the catalog's `trackSoundcloud` mappings.

For this release:

- Track buttons: SoundCloud only
- Album/set button: SoundCloud only
- Spotify: never render
- Apple Music: never render

The album artwork is:

```text
/assets/images/icons/album_art/01 - Astral Signal - LIL SYN-artwork.jpg
```

## Streaming Link Rules

### Spotify

Use exact catalog URLs when a verified direct destination is known.

Do not substitute a similarly titled release.

### Apple Music

Use exact catalog URLs when a verified direct destination is known.

When an exact direct destination is not known, a search fallback may be used rather than inventing a direct URL.

### SoundCloud

Use exact catalog mappings for releases and tracks where available.

SoundCloud-only releases must not be given artificial Spotify or Apple Music links.

## Release Ordering

`release-catalog.json` owns canonical order through its `order` array.

The archive's default view must respect that order.

The UI may additionally support:

- Catalog order
- A → Z
- Z → A
- Singles first
- Albums / EPs first

If the UI exposes filtering, **Singles** must include every standalone catalog entry.

## Artwork Rules

Artwork is resolved through the release rendering system.

Do not create one-off CSS hacks for individual covers.

Do not rename or duplicate artwork merely to work around a layout problem.

The correct solution is to fix the shared artwork mapping or shared layout system.

## Homepage

`index.html` remains the primary landing page.

`site-polish.js` handles homepage-specific presentation/enrichment without replacing the universal shell.

The homepage must not contain a competing global header or menu implementation.

The `THE LATEST SIGNALS` area can reference the canonical release catalog, but release data must remain owned by `release-catalog.json`.

## The Calm

The site's ambient background audio uses:

```text
/assets/other/sound/Background.mp3
```

The universal shell supplies the **THE CALM** ON/OFF control.

The control must remain global rather than being separately implemented on individual pages.

Where browser policy permits, the background audio pauses or mutes when YouTube or native HTML5 video playback begins.

## Back To Top

The universal floating Back To Top control uses:

```text
/assets/images/icons/UP_ARROWS.png
```

It is provided by the global shell and should not be duplicated on individual pages.

## Accessibility

Preserve:

- meaningful image alt text
- keyboard navigation
- visible focus states
- `aria-expanded`
- `aria-controls`
- `aria-hidden`
- Escape-to-close behavior
- reduced-motion behavior
- accessible labels on icon-only controls
- internal scrolling for long navigation drawers
- responsive mobile layouts
- no unintended horizontal overflow

## Responsive Design

Every global change must be checked at minimum against:

- desktop
- tablet
- mobile
- narrow mobile

The global header, headphone artwork, menu drawer, release cards, track rows, buttons, and artwork must remain usable without horizontal scrolling.

## Change Discipline

When fixing a problem:

1. Identify which system owns the behavior.
2. Fix that system instead of adding another competing implementation.
3. Preserve existing working behavior outside the requested scope.
4. Inspect the complete file before replacing it.
5. Keep canonical data in the canonical data file.
6. Never infer one release's streaming links from another release's title.
7. Treat similarly named releases as separate entities unless the catalog explicitly groups them.
8. Never remove standalone singles while repairing album rendering.
9. Never add Spotify or Apple Music to a SoundCloud-only release.
10. Do not claim a deployment or browser test occurred unless it actually did.

## Git / Deployment QA

Before committing a website change:

1. Inspect the current files from `main`.
2. Review the complete proposed diff.
3. Confirm unrelated files were not changed.
4. Validate HTML, CSS, JavaScript, and JSON syntax where applicable.
5. Check for duplicate global shell implementations.
6. Confirm exactly one rendered header, menu, and footer.
7. Confirm `LS_HEADPHONES.png` remains the Special Access Easter egg and is visibly large enough.
8. Confirm the release archive renders albums, EPs, and standalone singles.
9. Confirm standalone `Signal Light Sermon (Remastered 2026)` remains separate from the Touching album track.
10. Confirm `Touching to the North` is SoundCloud-only.
11. Confirm no Touching track inherits the standalone Spotify URL.
12. Confirm artwork paths resolve correctly.
13. Confirm `THE CALM` and Back To Top remain global.
14. Confirm mobile and narrow-mobile layouts.
15. Review the actual production URL after deployment when browser verification is available.
16. Only then report the commit as complete.

A successful Vercel build or `READY` deployment status does **not** by itself prove that the visual or functional behavior is correct.

## Core Architecture Principle

> **One global shell. One release database. One source of truth. No cross-release link leakage.**

The website should remain simple to maintain: global behavior belongs in the global shell, release data belongs in `release-catalog.json`, and page-specific behavior belongs to the page that owns it.