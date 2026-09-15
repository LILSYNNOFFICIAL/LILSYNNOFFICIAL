from pathlib import Path
import json

root=Path('.')
assert (root/'Suno/index.html').exists(), 'Suno index missing'
text=(root/'Suno/index.html').read_text()
assert 'FIX AUDIO QUALITY' in text, 'audio quality panel missing'
assert (root/'Suno/audio_fix_v6/index.html').exists(), 'audio_fix_v6 destination missing'
assert (root/'Suno/content/manifest.json').exists(), 'central guide manifest missing'
m=json.loads((root/'Suno/content/manifest.json').read_text())
assert len(m['documents']) >= 9, f"expected complete source document set, got {len(m['documents'])}"
for d in m['documents']:
    assert (root/'Suno'/d['html']).exists(), f"missing rendered document {d['html']}'"
idx=(root/'index2-final-fix.js').read_text()
assert 'top:-170px!important' in idx, 'top WebM has not been moved higher'
assert 'LS_BG_STARS.webm' in idx, 'bottom WebM missing'
print('PASS')
