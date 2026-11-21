#!/usr/bin/env node
// Builds static site data from release-catalog.json (the single source of truth for releases):
//   1. release/<slug>.html  one static page per catalog release, with real <title>, description,
//      canonical, Open Graph / Twitter tags and MusicAlbum JSON-LD, so social cards and crawlers see
//      the release without running JavaScript. The page body is release.html itself, so the release
//      experience has one owner; the static page only pre-fills the head and the release id.
//   2. sitemap.xml          every existing entry is kept; the generated release pages are appended in a
//      marked block that is rewritten on every run. The /special_access entry is never modified.
//
// Run: node scripts/build-site-data.mjs          (writes files)
//      node scripts/build-site-data.mjs --check  (exit 1 if the committed output is stale)
// The "Build site data" GitHub Action reruns this whenever release-catalog.json, release.html or this
// script changes, and commits the result. It is not part of the Vercel build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://lilsynn.com';
const ART_BASE = '/assets/images/icons/album_art/';
const OG_DEFAULT = `${ORIGIN}/assets/img/og-default.jpg`;
const OUT_DIR = 'release';
const SITEMAP_BEGIN = '  <!-- BEGIN generated release pages (scripts/build-site-data.mjs) -->';
const SITEMAP_END = '  <!-- END generated release pages -->';
const check = process.argv.includes('--check');

const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const catalog = JSON.parse(read('release-catalog.json'));
const releaseTemplate = read('release.html');

// Same normalisation the site uses for catalog keys (index.html, releases.html, release.html).
const norm = s => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[’']/g, '').replace(/[^a-z0-9]/g, '');
const slugify = s => String(s ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[’']/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'release';
const escAttr = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escXml = escAttr;
const jsonForScript = v => JSON.stringify(v).replace(/</g, '\\u003c');

function releaseData(title) {
  const g = catalog.groups?.[title];
  // A single is its own one-track list, exactly as release.html renders it.
  const tracks = g?.tracks?.length ? g.tracks : [title];
  const artFile = catalog.artwork?.[norm(title)];
  const image = artFile ? ORIGIN + ART_BASE + encodeURIComponent(artFile) : OG_DEFAULT;
  // Wording matches the runtime metadata release.html already writes, so no new copy is introduced.
  const description = `${title} by LIL SYNN \u2014 ${tracks.length} track${tracks.length === 1 ? '' : 's'} with the full tracklist and official listening links.`;
  return { title, type: g?.type || 'SINGLE', tracks, image, hasArt: Boolean(artFile), description };
}

function buildPage(d, url) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: d.title,
    url,
    image: d.image,
    numTracks: d.tracks.length,
    albumReleaseType: { ALBUM: 'https://schema.org/AlbumRelease', EP: 'https://schema.org/EPRelease', SINGLE: 'https://schema.org/SingleRelease' }[d.type] || 'https://schema.org/SingleRelease',
    byArtist: { '@type': 'MusicGroup', name: 'LIL SYNN', url: `${ORIGIN}/` },
    track: d.tracks.map((name, i) => ({ '@type': 'MusicRecording', name, position: i + 1, byArtist: { '@type': 'MusicGroup', name: 'LIL SYNN' } }))
  };
  const head = [
    `<title>LIL SYNN | ${escAttr(d.title)}</title>`,
    `<meta name="description" content="${escAttr(d.description)}">`,
    `<link rel="canonical" href="${escAttr(url)}">`,
    `<meta property="og:site_name" content="LIL SYNN">`,
    `<meta property="og:type" content="music.album">`,
    `<meta property="og:title" content="LIL SYNN | ${escAttr(d.title)}">`,
    `<meta property="og:description" content="${escAttr(d.description)}">`,
    `<meta property="og:url" content="${escAttr(url)}">`,
    `<meta property="og:image" content="${escAttr(d.image)}">`,
    `<meta property="og:image:alt" content="${escAttr(d.hasArt ? `${d.title} artwork` : 'LIL SYNN - The Signal')}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="LIL SYNN | ${escAttr(d.title)}">`,
    `<meta name="twitter:description" content="${escAttr(d.description)}">`,
    `<meta name="twitter:image" content="${escAttr(d.image)}">`,
    `<script type="application/ld+json" data-ls-release-ld>${jsonForScript(ld)}</script>`,
    `<script>window.__LS_RELEASE=${jsonForScript({ id: d.title, url })};</script>`
  ].join('');

  let html = releaseTemplate;
  // Drop release.html's generic head tags; the release-specific ones replace them.
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+(?:property|name)="(?:og:[^"]+|twitter:[^"]+)"[^>]*>/gi, '');
  html = html.replace(/<meta charset="utf-8">/i, m => `${m}<!-- Generated by scripts/build-site-data.mjs from release-catalog.json and release.html. Do not edit by hand. -->`);
  html = html.replace(/(<meta name="viewport"[^>]*>)/i, `$1${head}`);
  // The page lives one folder down; make release.html's relative references root-relative.
  html = html.replace(/(["'`(])\.\//g, '$1/');
  return html;
}

function buildSitemap(entries) {
  const current = read('sitemap.xml');
  const begin = current.indexOf(SITEMAP_BEGIN);
  const end = current.indexOf(SITEMAP_END);
  let base = begin >= 0 && end > begin ? current.slice(0, begin) + current.slice(end + SITEMAP_END.length).replace(/^\n/, '') : current;
  // Existing entries stay. Their lastmod values are normalised to a W3C date (same day) so the file
  // validates; the /special_access entry is left byte-for-byte as it is.
  base = base.replace(/<url>[\s\S]*?<\/url>/g, block => {
    if (/<loc>https:\/\/lilsynn\.com\/special_access<\/loc>/.test(block)) return block;
    return block.replace(/<lastmod>([^<]*)<\/lastmod>/, (m, v) => {
      const day = String(v).match(/\d{4}-\d{2}-\d{2}/);
      return day ? `<lastmod>${day[0]}</lastmod>` : m;
    });
  });
  const known = new Set([...base.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
  const block = entries.filter(e => !known.has(e.url)).map(e => `  <url>\n    <loc>${escXml(e.url)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`).join('\n');
  const close = base.lastIndexOf('</urlset>');
  if (close < 0) throw new Error('sitemap.xml has no </urlset>');
  return base.slice(0, close) + `${SITEMAP_BEGIN}\n${block}${block ? '\n' : ''}${SITEMAP_END}\n` + base.slice(close);
}

const order = catalog.order || [];
if (!order.length) throw new Error('release-catalog.json has an empty order');
const outputs = new Map();
const entries = [];
const used = new Map();
for (const title of order) {
  let slug = slugify(title);
  if (used.has(slug)) throw new Error(`slug collision: "${title}" and "${used.get(slug)}" both map to ${slug}`);
  used.set(slug, title);
  const url = `${ORIGIN}/${OUT_DIR}/${slug}`;
  outputs.set(`${OUT_DIR}/${slug}.html`, buildPage(releaseData(title), url));
  entries.push({ url });
}
outputs.set('sitemap.xml', buildSitemap(entries));

// Stale generated pages (a release removed from the catalog) are removed too.
const existing = fs.existsSync(path.join(root, OUT_DIR)) ? fs.readdirSync(path.join(root, OUT_DIR)).filter(f => f.endsWith('.html')).map(f => `${OUT_DIR}/${f}`) : [];
const stale = existing.filter(f => !outputs.has(f));

const changed = [...outputs].filter(([file, content]) => !fs.existsSync(path.join(root, file)) || read(file) !== content).map(([file]) => file);
if (check) {
  if (changed.length || stale.length) {
    console.error(`build-site-data: output is stale (${[...changed, ...stale.map(f => f + ' (remove)')].join(', ')}). Run: node scripts/build-site-data.mjs`);
    process.exit(1);
  }
  console.log(`build-site-data: up to date (${order.length} release pages + sitemap.xml)`);
} else {
  fs.mkdirSync(path.join(root, OUT_DIR), { recursive: true });
  for (const file of changed) fs.writeFileSync(path.join(root, file), outputs.get(file));
  for (const file of stale) fs.unlinkSync(path.join(root, file));
  console.log(`build-site-data: ${order.length} release pages + sitemap.xml (${changed.length} written, ${stale.length} removed)`);
}
