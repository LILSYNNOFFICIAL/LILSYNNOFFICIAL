import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const rewrites = new Map([
  ['/command', '/command/index.html'],
  ['/command/', '/command/index.html'],
  ['/command/admin', '/command/admin/index.html'],
  ['/command/admin/', '/command/admin/index.html'],
  ['/admin', '/command/admin/index.html'],
  ['/admin/', '/command/admin/index.html'],
  ['/vote', '/vote.html'],
  ['/vote/', '/vote.html'],
  ['/site-doctor', '/site-health.html'],
  ['/site-doctor/', '/site-health.html'],
  ['/suno', '/Suno/home/'],
  ['/suno/', '/Suno/home/']
]);

function safePath(urlPath) {
  let pathname = decodeURIComponent(urlPath.split('?')[0]);
  if (rewrites.has(pathname)) pathname = rewrites.get(pathname);
  if (pathname === '/') pathname = '/index.html';

  const clean = pathname.replace(/^\/+/, '');
  const candidate = path.resolve(root, clean);
  if (!candidate.startsWith(root + path.sep) && candidate !== root) return null;

  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const index = path.join(candidate, 'index.html');
    if (fs.existsSync(index)) return index;
  }
  if (!path.extname(candidate) && fs.existsSync(path.join(candidate, 'index.html'))) {
    return path.join(candidate, 'index.html');
  }
  return candidate;
}

const apiResponse = (req, res) => {
  if ((req.url || '').split('?')[0] !== '/api/admin') return false;
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ ok: false, error: 'AUTH_REQUIRED' }));
  return true;
};

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  try {
    if (apiResponse(req, res)) return;
    const file = safePath(req.url || '/');
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(String(error));
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`QA server listening on http://127.0.0.1:${port}`);
});
