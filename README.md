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
- Homepage presentation/enrichment: `site-polish.js`
- Canonical release data: `release-catalog.json`
- Releases page: `releases.html`
- Coming Soon page: `coming_soon.html`

## Universal Site Shell

The site uses one runtime-generated header, one navigation drawer, and one footer for every HTML page. `site-global.js` removes legacy shell markup and injects the canonical shell so pages do not maintain competing global navigation implementations.

### Universal header

Every page uses `/assets/images/icons/LS_HEADPHONES.png` as the Special Access Easter egg. The universal header is intentionally compact while the headphone artwork is now substantially larger:

- 90px desktop header
- 82px narrow/mobile header
- 84px desktop headphone artwork
- 72px narrow/mobile headphone artwork
- headphone image links to `/special_access.html`
- universal hamburger/menu remains in the same global position

`site-global.css` owns the shell geometry and responsive behavior.

### Universal menu

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

Socials and Stream are independent collapsible groups. Opening one closes the other. The menu supports keyboard focus, Escape-to-close, internal scrolling, body scroll locking, and responsive behavior.

Do not add another global hamburger, side menu, or footer implementation.

## Releases Archive

`release-catalog.json` is the canonical release database and owns catalog order, release groups, release types, tracks, Spotify destinations, Apple Music destinations when known, and the SoundCloud exception for `Touching to the North`.

The canonical order begins:

1. `Never Known`
2. `HOME (ACOUSTIC VERSION)`
3. `I DID IT AGAIN`
4. `Rescue You (Acoustic Version)`
5. `Somewhere In-Between`
6. `Black Glass`
7. `Black Glass - Acoustic Version`
8. `Hello Goodbye`

The standalone `Black Glass - Acoustic Version` and `Don't Say It (Acoustic)` entries are explicitly included in the canonical order so they appear in the release archive and in **Singles Only**, while the parent EP/album cards retain their track listings.

### Release filters

`releases.html` has exactly two user-facing filters:

1. **SORT BY**
   - Newest to Oldest — default
   - Oldest to Newest
2. **FILTER**
   - All Releases — default
   - Singles Only
   - Albums/EPs Only

The default display follows the canonical catalog order. No legacy A→Z, Z→A, platform, or release-type sorting controls are exposed on the page.

### Streaming links

Spotify buttons use catalog destinations when available and fall back to an artist/title Spotify search when a direct destination is not yet known. Apple Music buttons use known direct Apple Music destinations where available and otherwise use an LIL SYNN + title Apple Music search fallback rather than inventing a direct URL.

Confirmed Apple Music destinations currently used include the LIL SYNN releases visible on the official Apple Music artist profile, including `Somewhere In-Between`, `Black Glass`, `Static On My Tongue`, `It's In Her Eyes`, `Fade Into You`, `Heal`, `Back From The Blackout`, `Hello Goodbye`, and `Enough`. The official artist profile is `https://music.apple.com/us/artist/lil-synn/1850720041`.

### Touching to the North exception

`Touching to the North` is deliberately SoundCloud-only:

```text
https://soundcloud.com/lilsynnofficial/sets/touching-to-north
```

It must not imply Spotify or Apple Music availability.

## Homepage / The Latest Signals

`site-polish.js` renders the `THE LATEST SIGNALS` section from the canonical release catalog. The section places:

- `VIEW RELEASE ARCHIVE`
- `COMING SOON`

side by side with responsive wrapping when necessary. `COMING SOON` links to `coming_soon.html`.

## Coming Soon

`coming_soon.html` uses the site's release-page visual template/shell without release-archive content and displays centered white text:

**PAGE UNDER CONSTRUCTION**

It uses the same universal header/footer and background system as the rest of the site.

## Artwork sizing

Release artwork is constrained through one shared rendering system. Do not create individual CSS hacks for individual releases or modify artwork files to compensate for layout problems.

## The Calm

Homepage background audio uses:

```text
assets/other/sound/Background.mp3
```

The universal shell supplies the `THE CALM` control beneath the headphone Easter egg. It pauses/mutes when YouTube or native HTML5 video playback begins, subject to browser autoplay restrictions.

## Back To Top

Every HTML page receives the universal floating back-to-top control using:

```text
/assets/images/icons/UP_ARROWS.png
```

## Accessibility / Responsive Rules

Preserve:

- meaningful image alt text
- keyboard focus states
- `aria-expanded`, `aria-controls`, and `aria-hidden`
- Escape-to-close
- reduced-motion behavior
- mobile-friendly drawer sizing
- internal scrolling for long navigation menus
- no horizontal overflow
- accessible labels for floating controls

Test desktop, tablet, mobile, and narrow mobile after shell or release-page changes.

## Git / Deployment QA

Before committing website changes:

1. Inspect changed files.
2. Review the complete diff.
3. Confirm no unrelated files changed.
4. Validate HTML/JS/CSS/JSON syntax where applicable.
5. Check console errors and failed network requests.
6. Verify artwork, WebM, and audio assets.
7. Verify the universal shell exists on every HTML page.
8. Verify exactly one rendered header, one rendered side menu, and one rendered footer.
9. Verify the headphone Easter egg routes to Special Access.
10. Verify the release filters and default catalog order.
11. Verify the standalone acoustic releases are present in the catalog and Singles Only view.
12. Verify `Touching to the North` remains SoundCloud-only.
13. Verify `COMING SOON` routes to `coming_soon.html`.
14. Verify responsive behavior.
15. Commit with a meaningful message.
16. Confirm Vercel deploys the intended commit.
17. Test the actual production site.

A Vercel deployment being `READY` does **not** by itself prove visual or functional correctness.

## Maintenance Rules

1. Fix the system that owns the behavior.
2. Do not create parallel implementations of navigation, footer, release data, artwork, or media playback.
3. Keep global shell CSS centralized in `site-global.css`.
4. Keep global shell JavaScript centralized in `site-global.js`.
5. Keep release data centralized in `release-catalog.json`.
6. Keep exact streaming URLs in the catalog when known.
7. Use search fallbacks rather than inventing direct streaming URLs.
8. Keep page-specific functionality in the page or its dedicated script.
9. Never claim live deployment or browser verification unless it was actually verified.

The design goal remains:

> **One header to rule them all. One menu to rule them all. One footer to rule them all. One source of truth.**
