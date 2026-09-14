# LIL SYNN Suno V6 Guide Website

`Suno/Suno_Guide.html` is the source file for the public flagship Suno V6 knowledge website.

## Public URLs

The supported public Suno URL surface is the clean lowercase `/suno/**` namespace:

- `/suno` — flagship landing page
- `/suno/v6`, `/suno/prompting`, `/suno/lyrics`, `/suno/styles`, `/suno/audio`
- `/suno/sliders`, `/suno/voices`, `/suno/editing`, `/suno/stems`, `/suno/studio`
- `/suno/midi`, `/suno/effects`, `/suno/automation`, `/suno/production`
- `/suno/troubleshooting`, `/suno/rights`, `/suno/complete`
- `/suno/prompt-architect`, `/suno/style-builder`, `/suno/lyrics-builder`, `/suno/controls`, `/suno/troubleshooter`, `/suno/workflow`
- `/suno/deep-dives/*` — research library

Vercel rewrites map those public URLs to the isolated `/Suno/**` file tree without changing the browser URL. Unknown `/suno/*` paths fall through to the real `/Suno/*` tree so nonexistent content produces the site's real 404 behavior instead of a false guide-page success.

The same behavior follows Vercel's documented rewrite model: rewrites proxy a matching source to a destination while preserving the requested browser URL. citeturn0search0

## Source of truth

The canonical knowledge base is the separate repository:

- https://github.com/LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide

The website is a curated presentation layer over that research corpus. Official Suno documentation and release notes outrank old tutorials, screenshots, memory and unsupported community claims.

## Structure

- `Suno_Guide.html` — landing page, search and directory
- `css/` — shared gold/black visual system
- `js/` — navigation, search, tools, drafts and Forum behavior
- `guides/` — practical workflow pages
- `deep-dives/` — current research pages mapped to the canonical expansion corpus
- `complete/complete-guide.html` — master reading path through the entire website
- root-level tool pages — interactive creator surfaces
- `scripts/` — Suno-only maintenance and health tooling
- `package.json` — Suno-only local commands; intentionally separate from the main site's package/configuration
- `search-index.json` — isolated searchable catalog for guides, research and tools
- `manifest.json` — isolated web-app metadata and build status

## Suno browser health dashboard

For a mobile-friendly check of the deployed Suno site, open `/Suno/health.html`. The dashboard checks reachable Suno pages, discovered `/Suno/**` links, local resources, search-index integrity, manifest isolation, page landmarks, and important V6 audio-quality markers. It is a browser diagnostic reader and does not replace the repository doctor.

Full documentation is in `Suno/HEALTH.md`.

## Suno health check

Run the isolated doctor from this directory:

```bash
npm run doctor
```

The authoritative checker is `scripts/suno-site-doctor.mjs`. It resolves `/Suno` from its own file location, so it does not depend on the repository working directory or the main site's scripts.

The main site's Site Doctor performs a **non-blocking** health probe of this checker. A Suno failure is reported as a warning and does not fail the main-site doctor.

## Tests

```bash
cd Suno
npm run test
npm run doctor
```

`npm run test` runs the isolation contract and the Suno doctor contract. The root Command Center workflow also runs the cross-site route/content contract so changes to `/Suno/**` or `vercel.json` cannot silently break public routing.

## Deployment and QA model

The Suno project is self-contained under `/Suno`, while Vercel routing is intentionally owned by the repository root because `/suno/**` is a public domain-level URL contract. The route contract is tested against every supported public route and every search-index target.

Static QA covers file existence, local references, navigation, search integrity, manifest isolation, V6 audio-quality markers, draft persistence hooks, Forum external-link safety, and Suno/main-site isolation. GitHub Actions runs both the cross-site contract and the isolated Suno test suite whenever relevant Suno, routing, Command Center, or workflow files change.

## Design rules

Premium black-and-gold editorial style; responsive; keyboard-visible focus; reduced-motion support; no generated replacement artwork; local relative asset references where possible.

## Updating

When the canonical guide changes, update the relevant web page and preserve a source attribution link. When Suno changes current behavior, verify against current official documentation/release notes before changing a claim. Keep experimental or community techniques explicitly labeled rather than presenting them as deterministic product behavior.
