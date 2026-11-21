# LIL SYNN Browser Site Health

The deployed browser QA dashboard is:

**`/site-health.html`**

Open it on a phone or desktop to run same-origin checks against the live site.

## What it checks

- Main-site HTML entry points and discovered internal pages
- HTTP reachability
- Page titles and `<main>` landmarks
- Referenced local assets
- Core global shell assets
- Suno entry-point reachability
- Current browser timestamp and pass/warn/fail totals

## What it does not claim

The dashboard cannot execute Node.js, `npm`, GitHub Actions, or repository filesystem checks from a normal browser. Those remain the responsibility of the existing repository Site Doctor.

The Suno project has a separate isolated dashboard at **`/Suno/health.html`** and a separate Node-based doctor under `/Suno/scripts/`.

The browser dashboards are diagnostic readers, not replacements for repository CI.
