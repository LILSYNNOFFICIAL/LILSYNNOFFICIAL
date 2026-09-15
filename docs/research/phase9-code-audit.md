# PHASE 9 — /Suno CODE AUDIT

Date: 2026-09-15

## Scope

Audited the live `/Suno` architecture rather than only searching for anchor text:

- HTML entry points and topic pages
- JavaScript loaders and renderers
- CSS asset paths
- generated content and manifest mapping
- navigation and deep-link patterns
- dynamic section loading
- GitHub Pages compatibility
- Vercel/static-host compatibility
- cross-section destinations
- the central-guide sync workflow
- the browser health dashboard
- the locked Audio Fix V6 module

## Findings

### P0 — destructive central-guide rebuild risk — FIXED

`scripts/rebuild-suno-central.py` previously deleted the entire `/Suno` directory before rebuilding the generated source-document layer. That architecture could destroy custom topic pages, the redesigned navigation, custom assets, and the Audio Fix V6 page whenever the sync workflow was manually run.

The rebuild script now cleans **only `/Suno/content`** and creates legacy fallback files only when they do not already exist. The live `/Suno` application is preserved. The Audio Fix V6 module is therefore no longer an accidental casualty of a central-guide rebuild.

### P0 — Master Guide content path resolution — FIXED

`Suno/assets/suno-master.js` was normalizing manifest paths incorrectly. Manifest entries already use `content/<file>.html`, so the loader must remove the `content/` prefix before prepending `../content/`. The previous regular-expression form did not reliably remove that slash-prefixed path component.

The loader now uses:

```js
String(doc.html || '').replace(/^content\//, '')
```

and checks the manifest response before parsing it.

### P1 — research/engineering pages were not discoverable from the main category flows — IMPROVED

The Phase 5, 6, 7 and 8 pages existed as real routes but were not consistently surfaced from category landing pages. The audit connected:

- Create → Vocal Engineering
- Produce → Audio Engineering
- Fix / Test → Controlled Experimentation
- Health → all new research/engineering routes

The research pages remain independently addressable for direct experimentation and citation.

### P1 — browser QA coverage was too narrow — FIXED

`Suno/health.html` now checks the new Phase 5–8 routes, the manifest, the Master Guide loader and the existing Audio Fix V6 prompt signature.

## Architecture assessment

### GitHub Pages

The site uses ordinary static HTML/CSS/JavaScript and directory-level `index.html` files. This is compatible with GitHub Pages' static publishing model. The `/Suno`, `/Suno/create`, `/Suno/control`, `/Suno/produce`, `/Suno/fix-test`, `/Suno/research`, `/Suno/master`, and `/Suno/audio_fix_v6` directories each have an entry file.

### Vercel

The same file-based static architecture is compatible with Vercel. No server-side runtime is required by the Suno guide. Relative links are intentionally used inside `/Suno`, while root-relative paths are avoided in the redesigned topic pages except where an external or explicitly rooted asset is required.

### Dynamic loader

`suno-topic.js` loads the manifest, fetches generated HTML documents, searches `h1`, `h2`, and `h3`, and builds section-specific views. The heading search was previously the source of the “No configured guide sections matched” failure; the matcher now includes all three heading levels.

### Manifest mapping

The manifest is a generated source-document index. Its `html` values are `content/<file>.html`. The topic loader strips that prefix before constructing its relative fetch URL. This mapping is now consistent with the Master Guide loader.

## Preserved invariant

The Audio Fix V6 page was inspected during the audit. Its blob SHA remains:

`ead7b8c353814bf5f8d792494a88356110643444`

No Phase 9 modification was made to that file.

## Remaining audit watchpoints

1. External links should continue to use HTTPS.
2. New standalone research pages should be linked from the category that owns the workflow.
3. Generated `/Suno/content` files should be treated as generated artifacts; custom UI belongs outside that directory.
4. Future changes to the sync script must not reintroduce whole-directory deletion.
5. Browser-level QA should be run after substantial navigation or loader changes.

## Audit conclusion

The major architectural hazards discovered in Phase 9 were the destructive central rebuild and the Master Guide path bug. Both were corrected at their source rather than patched at individual destinations. The site now has a clearer boundary between generated research-source material and the hand-built `/Suno` application layer.
