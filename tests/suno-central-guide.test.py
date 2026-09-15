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
assert (root/'Suno/create/prompt-lab.html').exists(), 'prompt lab missing'
research=(root/'Suno/research/index.html').read_text()
assert 'emojicombos.com' in research, 'EmojiCombos link missing'
assert 'b073c28f-b338-4e07-a1fb-25aeb6342246' in research, 'symbol example link missing'
assert '26937bed-2eae-47cd-92f4-63aa2bf07df0' in research, 'random phrase example link missing'
idx=(root/'index2-final-fix.js').read_text()
assert 'top:-90px!important' in idx, 'top WebM assertion is stale'
assert 'LS_BG_STARS.webm' in idx, 'bottom WebM missing'
print('PASS')
