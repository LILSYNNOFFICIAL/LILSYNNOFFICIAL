#!/usr/bin/env python3
import html
import json
import re
import shutil
import sys
from pathlib import Path

import markdown

GUIDE_REPO = Path(sys.argv[1])
SITE_REPO = Path(sys.argv[2])
OUT = SITE_REPO / 'Suno' / 'library'
OUT.mkdir(parents=True, exist_ok=True)

# The website must contain the guide content itself. GitHub is a build-time source only;
# GitHub URLs are deliberately removed from the rendered public site.
def strip_github_links(md: str) -> str:
    md = re.sub(r'\[([^\]]+)\]\(https?://(?:www\.)?github\.com/[^)]+\)', r'\1', md, flags=re.I)
    md = re.sub(r'https?://(?:www\.)?github\.com/[^\s)>]+', '', md, flags=re.I)
    return md

def slug_for(path: Path) -> str:
    rel = path.relative_to(GUIDE_REPO).with_suffix('')
    parts = [re.sub(r'[^a-z0-9]+', '-', p.lower()).strip('-') for p in rel.parts]
    return '/'.join(p for p in parts if p) or 'index'

def title_for(md_path: Path, text: str) -> str:
    m = re.search(r'^#\s+(.+?)\s*$', text, re.M)
    if m:
        return re.sub(r'[*_`]+', '', m.group(1)).strip()
    return md_path.stem.replace('-', ' ').replace('_', ' ').title()

files = sorted(p for p in GUIDE_REPO.rglob('*.md') if '.git' not in p.parts)
manifest = []

for src in files:
    raw = src.read_text(encoding='utf-8', errors='replace')
    raw = strip_github_links(raw)
    body = markdown.markdown(
        raw,
        extensions=['extra', 'tables', 'fenced_code', 'toc', 'sane_lists'],
        output_format='html5'
    )
    slug = slug_for(src)
    target = OUT / slug / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    title = title_for(src, raw)
    page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)} — LIL SYNN Suno V6</title><meta name="description" content="Complete LIL SYNN Suno V6 knowledge-base document: {html.escape(title)}."><link rel="stylesheet" href="/suno/css/suno.css"><style>
:root{{--bg:#070706;--panel:#0e0d0a;--ink:#f7f3eb;--muted:#a29b90;--gold:#f1cf78;--line:rgba(241,207,120,.2);--code:#0b0b0a}}*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}body{{margin:0;background:radial-gradient(circle at 80% 0,rgba(241,207,120,.08),transparent 28%),var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif}}a{{color:var(--gold)}}.wrap{{width:min(1180px,92vw);margin:auto;padding:105px 0 90px}}.top{{display:flex;justify-content:space-between;gap:20px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:18px;margin-bottom:40px}}.ey{{font:900 9px Rajdhani,sans-serif;letter-spacing:.25em;color:var(--gold);text-transform:uppercase}}.back{{font:900 9px Rajdhani,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}}article{{font-size:16px;line-height:1.72}}article h1,article h2,article h3,article h4{{font-family:Georgia,serif;font-weight:400;line-height:1.05;margin-top:2.2em}}article h1{{font-size:clamp(42px,6vw,78px);letter-spacing:-.045em}}article h2{{font-size:clamp(30px,4vw,52px);border-top:1px solid var(--line);padding-top:25px}}article h3{{font-size:30px}}article p,article ul,article ol{{color:#c4bdb2}}article strong{{color:#fff}}article blockquote{{margin:24px 0;padding:18px 22px;border-left:3px solid var(--gold);background:rgba(241,207,120,.05);color:#d9d1c4}}article pre{{overflow:auto;background:var(--code);border:1px solid rgba(255,255,255,.08);padding:18px;border-radius:2px;white-space:pre-wrap}}article code{{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}}article :not(pre)>code{{background:#12110e;padding:2px 5px;color:#f4d98e}}article table{{width:100%;border-collapse:collapse;margin:24px 0;display:block;overflow:auto}}article th,article td{{border:1px solid rgba(255,255,255,.1);padding:10px 12px;text-align:left;vertical-align:top}}article th{{color:var(--gold);background:#100f0c}}article hr{{border:0;border-top:1px solid var(--line);margin:40px 0}}article img{{max-width:100%;height:auto}}.source-meta{{color:#6f695f;font:800 8px Rajdhani,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-top:10px}}@media(max-width:700px){{.wrap{{padding-top:82px}}article{{font-size:15px}}.top{{display:block}}.back{{display:inline-block;margin-top:12px}}}}
</style></head><body><div class="wrap"><div class="top"><div><div class="ey">LIL SYNN / SUNO V6 COMPLETE KNOWLEDGE BASE</div><div class="source-meta">Full source document reproduced on-site · No GitHub navigation</div></div><a class="back" href="/suno/">← Suno Home</a></div><article>{body}</article></div></body></html>'''
    target.write_text(page, encoding='utf-8')
    manifest.append({'source': str(src.relative_to(GUIDE_REPO)), 'slug': slug, 'title': title})

# Generated index: every Markdown file gets an on-site destination.
links = ''.join(f'<a href="/suno/library/{html.escape(m["slug"])}/">{html.escape(m["title"])}</a>' for m in manifest)
index = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Complete Suno V6 Knowledge Base — LIL SYNN</title><link rel="stylesheet" href="/suno/css/suno.css"><style>body{{margin:0;background:#070706;color:#f7f3eb;font-family:Inter,system-ui,sans-serif}}main{{width:min(1180px,92vw);margin:auto;padding:110px 0}}h1{{font:400 clamp(45px,7vw,90px) Georgia,serif;line-height:.9}}p{{color:#aaa;line-height:1.7}}.grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:40px}}.grid a{{display:block;padding:18px;border:1px solid rgba(241,207,120,.18);background:#0e0d0a;color:#f1cf78;text-decoration:none;font-weight:800}}.grid a:hover{{border-color:#f1cf78;background:#14120d}}@media(max-width:700px){{.grid{{grid-template-columns:1fr}}}}</style></head><body><main><div style="font:900 9px Rajdhani;letter-spacing:.25em;color:#f1cf78">LIL SYNN / COMPLETE SOURCE LIBRARY</div><h1>THE COMPLETE<br>SUNO V6 KNOWLEDGE BASE.</h1><p>This is the complete on-site rendering of the Markdown knowledge base, including the master guide, addenda, audits, gap-closure documents and every other Markdown document in the source guide. GitHub is not used as a public navigation destination.</p><div class="grid">{links}</div></main></body></html>'''
(SITE_REPO / 'Suno' / 'library-index.html').write_text(index, encoding='utf-8')
(SITE_REPO / 'Suno' / 'generated-guide-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(f'Generated {len(manifest)} Markdown documents.')
