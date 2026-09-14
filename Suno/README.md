# LIL SYNN Suno V6 Guide Website

`Suno/Suno_Guide.html` is the public flagship entry point for the LIL SYNN Suno V6 knowledge website.

## Source of truth

The canonical knowledge base is the separate repository:

- https://github.com/LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide

The website is a curated presentation layer over that research corpus. Official Suno documentation and release notes outrank old tutorials, screenshots, memory and unsupported community claims.

## Structure

- `Suno_Guide.html` — landing page, search and directory
- `css/` — shared gold/black visual system
- `js/` — navigation, search, tools, drafts and Forum behavior
- `guides/` — practical workflow pages
- `deep-dives/` — seven current research/index pages mapped to the canonical expansion corpus
- `complete/complete-guide.html` — master reading path through the entire website
- root-level tool pages — interactive creator surfaces
- `scripts/` — Suno-only maintenance and health tooling
- `package.json` — Suno-only local commands; intentionally separate from the main site's package/configuration
- `search-index.json` — isolated searchable catalog for guides, research and tools
- `manifest.json` — isolated web-app metadata and build status

## Suno browser health dashboard

For a mobile-friendly check of the **deployed** Suno site, open:

**`/Suno/health.html`**

The dashboard checks reachable Suno pages, discovered `/Suno/**` links, local resources, search-index integrity, manifest isolation, page landmarks, and important V6 audio-quality markers. It is a browser diagnostic reader and does not replace the repository doctor.

Full documentation is in `Suno/HEALTH.md`.

## Suno health check

Run the isolated doctor from this directory:

```bash
npm run doctor
```

The authoritative checker is `scripts/suno-site-doctor.mjs`. It resolves `/Suno` from its own file location, so it does not depend on the repository working directory or the main site's scripts.

The main site's Site Doctor performs a **non-blocking** health probe of this checker. A Suno failure is reported as a warning and does not fail the main-site doctor. If that warning appears, run the `/Suno` doctor directly for the detailed failure list.

## Tests

```bash
cd Suno
npm run test
npm run doctor
```

`npm run test` runs the isolation contract and the Suno doctor contract. `npm run doctor` performs the full isolated static health audit.

## Deployment model

The Suno project is intentionally self-contained under `/Suno`. Its canonical public entry point is `/Suno/Suno_Guide.html`; internal runtime navigation and search resolve to `/Suno/**` paths so the project does not depend on root-level Suno rewrites or root build tooling. Legacy `/suno/...` links are translated client-side when encountered inside the Suno app, but new links should use `/Suno/**` directly.

## Design rules

Premium black-and-gold editorial style; responsive; keyboard-visible focus; reduced-motion support; no generated replacement artwork; local relative asset references where possible.

## Updating

When the canonical guide changes, update the relevant web page and preserve a source attribution link. When Suno changes current behavior, verify against current official documentation/release notes before changing a claim. Keep experimental or community techniques explicitly labeled rather than presenting them as deterministic product behavior.
