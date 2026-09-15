from __future__ import annotations

import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

import markdown

SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/suno-guide')
ROOT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('.')
SUNO = ROOT / 'Suno'

if not SOURCE.exists():
    raise SystemExit(f'Missing source guide: {SOURCE}')

# The central site is intentionally rebuilt from scratch so obsolete generated routes cannot survive.
if SUNO.exists():
    shutil.rmtree(SUNO)
(SUNO / 'content').mkdir(parents=True)
(SUNO / 'audio_fix_v6').mkdir(parents=True)
(SUNO / 'assets').mkdir(parents=True)

source_files = [SOURCE / 'README.md'] + sorted(SOURCE.glob('SUNO-*.md'))
source_files = [p for p in source_files if p.exists()]
if len(source_files) < 9:
    raise SystemExit(f'Expected the master guide plus all addendums; found {len(source_files)} documents')

manifest = []
for src in source_files:
    md_text = src.read_text(encoding='utf-8')
    base = 'master-guide' if src.name == 'README.md' else src.stem.lower()
    title = "LIL SYNN's Complete Suno V6 Guide" if src.name == 'README.md' else re.sub(r'^SUNO-V6-', '', src.stem, flags=re.I).replace('-', ' ')
    dst_md = SUNO / 'content' / f'{base}.md'
    dst_html = SUNO / 'content' / f'{base}.html'
    dst_md.write_text(md_text, encoding='utf-8')
    html = markdown.markdown(md_text, extensions=['extra', 'tables', 'fenced_code', 'toc', 'sane_lists'])
    dst_html.write_text(html, encoding='utf-8')
    manifest.append({'id': base, 'source': src.name, 'title': title, 'html': f'content/{base}.html', 'markdown': f'content/{base}.md'})

(SUNO / 'content' / 'manifest.json').write_text(json.dumps({
    'sourceRepository': 'https://github.com/LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide',
    'generatedAt': datetime.now(timezone.utc).isoformat(),
    'documents': manifest,
}, indent=2), encoding='utf-8')

(SUNO / 'index.html').write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LIL SYNN — Complete Suno V6 Guide</title><meta name="description" content="Complete LIL SYNN Suno V6 guide and addendum library."><link rel="stylesheet" href="/Suno/assets/guide.css"></head><body><header class="top"><a class="brand" href="/">LIL <b>SYNN</b> / SUNO V6</a><button id="menuBtn">☰</button></header><aside id="drawer"><div class="drawer-head"><strong>GUIDE DIRECTORY</strong><button id="closeBtn">×</button></div><input id="search" type="search" placeholder="Search the complete guide…"><nav id="nav"></nav></aside><main><section class="hero"><div class="eyebrow">THE COMPLETE CURRENT REFERENCE</div><h1>SUNO V6<br><span>REFERENCE</span></h1><p>Every source guide and addendum from the LIL SYNN V6 knowledge-base repository. Full material, not summaries.</p><div class="hero-actions"><a class="audio-fix" href="/Suno/audio_fix_v6">FIX AUDIO QUALITY <span>→</span></a><button id="openGuide">OPEN GUIDE DIRECTORY</button></div><div class="meta" id="meta"></div></section><section id="reader" class="reader"></section></main><footer>Source: LIL SYNN's Complete Suno V6 Guide.</footer><script src="/Suno/assets/guide.js" defer></script></body></html>''', encoding='utf-8')

(SUNO / 'audio_fix_v6' / 'index.html').write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fix Audio Quality — LIL SYNN Suno V6</title><link rel="stylesheet" href="/Suno/assets/guide.css"></head><body><header class="top"><a class="brand" href="/Suno">LIL <b>SYNN</b> / SUNO V6</a></header><main><section class="hero placeholder"><div class="eyebrow">SPECIAL DESTINATION</div><h1>FIX AUDIO<br><span>QUALITY</span></h1><p>Reserved for the exact audio-quality rescue material you will provide. No replacement instructions are invented here.</p><a class="audio-fix" href="/Suno">← BACK TO COMPLETE GUIDE</a></section></main></body></html>''', encoding='utf-8')

(SUNO / 'assets' / 'guide.css').write_text('''
:root{--bg:#050508;--panel:#0b0b11;--line:#252532;--text:#f5f5f7;--pink:#ff008f;--hot:#ff4fd8;--max:1200px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 80% 0%,#ff008f14,transparent 30%),var(--bg);color:var(--text);font:16px/1.65 system-ui,sans-serif}a{color:inherit}.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:15px 4vw;background:#050508f0;backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.brand{font:800 15px/1.1 ui-monospace,SFMono-Regular,monospace;letter-spacing:.12em;text-decoration:none}.brand b{color:var(--pink)}button{border:1px solid var(--line);background:var(--panel);color:#fff;padding:8px 12px;cursor:pointer}#drawer{position:fixed;z-index:30;left:0;top:0;bottom:0;width:min(390px,92vw);padding:24px;background:#08080d;transform:translateX(-105%);transition:.25s;overflow:auto;border-right:1px solid var(--line)}#drawer.open{transform:none}.drawer-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.drawer-head button{background:none;border:0;font-size:28px}#search{width:100%;padding:12px;background:#050507;border:1px solid var(--line);color:#fff;margin-bottom:14px}#nav a{display:block;padding:10px 8px;border-bottom:1px solid #ffffff0f;text-decoration:none;color:#bbb}#nav a:hover,#nav a.active{color:#fff;background:#ff008f14}main{width:min(var(--max),92vw);margin:auto}.hero{padding:80px 0 55px;border-bottom:1px solid var(--line)}.hero h1{font:900 clamp(52px,9vw,110px)/.82 ui-monospace,SFMono-Regular,monospace;letter-spacing:-.08em;margin:15px 0 24px}.hero h1 span{color:transparent;-webkit-text-stroke:1px #aaa}.eyebrow{color:var(--hot);font:800 11px/1.2 ui-monospace,SFMono-Regular,monospace;letter-spacing:.25em}.hero p{max-width:780px;color:#c5c5cf;font-size:18px}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}.hero-actions button,.audio-fix{display:inline-flex;align-items:center;gap:18px;padding:13px 17px;border:1px solid var(--pink);background:#ff008f1a;color:#fff;text-decoration:none;font-weight:900;letter-spacing:.08em}.audio-fix{background:var(--pink)}.meta{margin-top:18px;color:#777;font-size:12px}.reader{padding:55px 0 100px}.reader h1,.reader h2,.reader h3,.reader h4{font-family:ui-monospace,SFMono-Regular,monospace;line-height:1.15}.reader h2{font-size:32px;margin-top:55px}.reader p{color:#d2d2da}.reader a{color:#ff74c5}.reader img{max-width:100%;height:auto}.reader pre{overflow:auto;background:#020205;border:1px solid var(--line);padding:18px}.reader code{font-family:ui-monospace,SFMono-Regular,monospace}.reader :not(pre)>code{background:#11111a;padding:2px 5px}.reader blockquote{border-left:3px solid var(--pink);padding:8px 18px;background:#ff008f0b}.reader table{width:100%;border-collapse:collapse;display:block;overflow:auto}.reader th,.reader td{border:1px solid var(--line);padding:9px 11px;text-align:left;vertical-align:top}.reader th{background:#101019}.reader hr{border:0;border-top:1px solid var(--line);margin:45px 0}.doc{display:none}.doc.active{display:block}footer{border-top:1px solid var(--line);padding:30px 4vw;color:#666;font-size:12px}.placeholder{min-height:75vh;display:flex;flex-direction:column;justify-content:center}@media(max-width:700px){.hero{padding-top:55px}.hero p{font-size:16px}.reader h2{font-size:25px}}
''', encoding='utf-8')

(SUNO / 'assets' / 'guide.js').write_text('''(()=>{const $=s=>document.querySelector(s),nav=$('#nav'),reader=$('#reader'),drawer=$('#drawer'),search=$('#search');let docs=[];async function boot(){const m=await fetch('/Suno/content/manifest.json').then(r=>r.json());docs=m.documents;$('#meta').textContent=`${docs.length} complete source documents · generated ${new Date(m.generatedAt).toLocaleString()}`;nav.innerHTML=docs.map((d,i)=>`<a href="#${d.id}" data-id="${d.id}">${String(i+1).padStart(2,'0')} · ${d.title}</a>`).join('');for(const d of docs){const html=await fetch('/Suno/'+d.html).then(r=>r.text());const sec=document.createElement('article');sec.className='doc';sec.id=d.id;sec.innerHTML=html;reader.appendChild(sec)}show(location.hash.slice(1)||docs[0].id);addEventListener('hashchange',()=>show(location.hash.slice(1)||docs[0].id));search.addEventListener('input',()=>{const q=search.value.toLowerCase();nav.querySelectorAll('a').forEach(a=>a.hidden=q&&!a.textContent.toLowerCase().includes(q))})}function show(id){if(!docs.some(d=>d.id===id))id=docs[0].id;document.querySelectorAll('.doc').forEach(x=>x.classList.toggle('active',x.id===id));nav.querySelectorAll('a').forEach(x=>x.classList.toggle('active',x.dataset.id===id));scrollTo({top:0,behavior:'instant'})}$('#menuBtn').onclick=()=>drawer.classList.add('open');$('#openGuide').onclick=()=>drawer.classList.add('open');$('#closeBtn').onclick=()=>drawer.classList.remove('open');boot().catch(e=>reader.innerHTML=`<p>Guide failed to load: ${e.message}</p>`)})();
''', encoding='utf-8')

# Existing index2 patch: top WebM moves higher; lower WebM remains fixed and begins exactly at top WebM's end.
idx2 = ROOT / 'index2-final-fix.js'
if idx2.exists():
    s = idx2.read_text(encoding='utf-8')
    s = s.replace('top:-110px!important', 'top:-170px!important')
    s = s.replace('top:-75px!important;height:auto', 'top:-120px!important;height:auto')
    idx2.write_text(s, encoding='utf-8')

print(f'REBUILT {len(manifest)} source documents')
