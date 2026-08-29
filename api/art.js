export default async function handler(req, res) {
  try {
    const raw = req.query?.url;
    if (!raw) return res.status(400).json({ error: 'Missing artwork URL' });
    const url = String(raw);
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Invalid artwork URL' });
    }
    const response = await fetch(url, { headers: { 'User-Agent': 'LIL-SYNN-Official-Website/1.0', Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' } });
    if (!response.ok) return res.status(404).end();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).send(buffer);
  } catch {
    return res.status(400).end();
  }
}
