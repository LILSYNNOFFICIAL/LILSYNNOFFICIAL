# Suno Browser Health

The mobile-friendly deployed browser QA dashboard is:

**`/Suno/health.html`**

It is intentionally separate from the main-site health dashboard and from the Node-based Suno Site Doctor.

## Browser checks

The dashboard verifies:

- Core guide, tool, deep-dive, and complete-guide pages are reachable
- Discovered `/Suno/**` HTML links resolve
- Suno CSS, JavaScript, search index, and manifest resources are reachable
- Search-index entries point to isolated `/Suno/` routes
- The manifest points to `/Suno/Suno_Guide.html`
- Current V6 audio-quality rescue markers remain present
- Page titles, `<main>` landmarks, and local Suno references are usable

## What it cannot prove

A normal browser cannot run the repository's `npm` scripts or inspect GitHub's working tree. For repository-level verification use:

```bash
cd Suno
npm run test
npm run doctor
```

The browser dashboard is the convenient deployed-site companion, especially for mobile checks.

## Main site

The main-site browser dashboard is available at **`/site-health.html`**.
