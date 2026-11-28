#!/usr/bin/env python3
"""Sync LIL SYNN songs from Google Drive into the game.

Lists every audio file under the Drive music folder (ACOUSTIC / SINGLES / ALBUMS/<album>/...),
downloads only files that are new or changed (Drive file id + md5Checksum, stored in
game/audio/tracks.json), transcodes each to 96 kbps stereo MP3 with loudness normalization,
and updates the manifest. Hand-edited fields (mood, rotation, title) are kept on existing entries.
Songs removed from Drive are kept in the manifest (never deleted automatically).
"""
import json, os, re, subprocess, sys, tempfile, datetime
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GAME = os.path.join(ROOT, 'game')
MANIFEST = os.path.join(GAME, 'audio', 'tracks.json')
MUSIC_DIR = os.path.join(GAME, 'audio', 'music')
AUDIO_EXT = {'.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg', '.oga', '.aif', '.aiff', '.wma', '.opus'}
API = 'https://www.googleapis.com/drive/v3/files'

def die(msg):
    print('::error::' + msg); sys.exit(1)

sa = os.environ.get('GDRIVE_SA_JSON', '').strip()
if not sa: die('GDRIVE_SA_JSON secret is not set')
folder_id = os.environ.get('GDRIVE_FOLDER_ID', '').strip() or os.environ.get('FALLBACK_FOLDER_ID', '1qoviagtzcS9naG0HqsAoBPx_zgoaUtKo')
creds = service_account.Credentials.from_service_account_info(json.loads(sa), scopes=['https://www.googleapis.com/auth/drive.readonly'])
creds.refresh(Request())
S = requests.Session(); S.headers['Authorization'] = 'Bearer ' + creds.token

def list_children(fid):
    out, tok = [], None
    while True:
        r = S.get(API, params={'q': f"'{fid}' in parents and trashed = false", 'fields': 'nextPageToken, files(id, name, mimeType, md5Checksum, size, modifiedTime)',
                               'pageSize': 1000, 'pageToken': tok, 'supportsAllDrives': True, 'includeItemsFromAllDrives': True}, timeout=60)
        r.raise_for_status(); j = r.json(); out += j.get('files', []); tok = j.get('nextPageToken')
        if not tok: return out

def walk(fid, path):
    for f in list_children(fid):
        if f['mimeType'] == 'application/vnd.google-apps.folder':
            yield from walk(f['id'], path + [f['name']])
        elif f['mimeType'].startswith('audio/') or os.path.splitext(f['name'])[1].lower() in AUDIO_EXT:
            yield f, path

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-') or 'song'

def probe_duration(p):
    try: return round(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip()), 1)
    except Exception: return None

man = {'version': 1, 'tracks': []}
if os.path.exists(MANIFEST):
    with open(MANIFEST) as fh: man = json.load(fh)
tracks = man.setdefault('tracks', [])
by_drive = {t.get('driveId'): t for t in tracks if t.get('driveId')}
used_ids = {t.get('id') for t in tracks}
os.makedirs(MUSIC_DIR, exist_ok=True)
changed = added = updated = 0

for f, path in walk(folder_id, []):
    name = os.path.splitext(f['name'])[0].strip(); md5 = f.get('md5Checksum')
    folder = path[0] if path else 'SINGLES'
    album = path[1] if folder.upper() == 'ALBUMS' and len(path) > 1 else folder
    t = by_drive.get(f['id'])
    if t and os.path.exists(os.path.join(GAME, t['file'])):
        if t.get('driveMd5') == md5: continue
        if t.get('driveMd5') is None:  # shipped before syncing existed: adopt the checksum, no re-download
            t['driveMd5'] = md5; changed += 1; continue
    if t: fid = t['id']
    else:
        fid = slug(name)
        if fid in used_ids: fid = slug(name + '-' + album)
        n = 2
        while fid in used_ids: fid = f"{slug(name)}-{n}"; n += 1
        used_ids.add(fid)
    out_rel = f'audio/music/{fid}.mp3'; out_abs = os.path.join(GAME, out_rel)
    print(f'Downloading {"/".join(path + [f["name"]])} -> {out_rel}')
    with tempfile.TemporaryDirectory() as td:
        src = os.path.join(td, 'src' + os.path.splitext(f['name'])[1])
        with S.get(f"{API}/{f['id']}", params={'alt': 'media', 'supportsAllDrives': True}, stream=True, timeout=600) as r:
            r.raise_for_status()
            with open(src, 'wb') as fh:
                for chunk in r.iter_content(1 << 20): fh.write(chunk)
        tmp_out = os.path.join(td, 'out.mp3')
        res = subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', src, '-vn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                              '-ac', '2', '-ar', '44100', '-codec:a', 'libmp3lame', '-b:a', '96k', tmp_out])
        if res.returncode != 0: print(f'::warning::ffmpeg failed for {f["name"]}; skipped'); continue
        os.replace(tmp_out, out_abs)
    entry = t or {'id': fid, 'title': name, 'artist': 'LIL SYNN', 'mood': 'explore', 'rotation': not re.search(r'rescue you', name, re.I)}
    entry.update({'album': album, 'folder': folder, 'file': out_rel, 'duration': probe_duration(out_abs), 'driveId': f['id'],
                  'drivePath': '/'.join(path + [f['name']]), 'driveMd5': md5, 'bitrate': '96k'})
    if t: updated += 1
    else: tracks.append(entry); by_drive[f['id']] = entry; added += 1
    changed += 1

if changed:
    man['updatedAt'] = datetime.date.today().isoformat()
    with open(MANIFEST, 'w') as fh: json.dump(man, fh, indent=1, ensure_ascii=False); fh.write('\n')
print(f'Sync done: {added} added, {updated} updated, {changed} manifest changes, {len(tracks)} songs total.')
