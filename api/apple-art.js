export default async function handler(req, res) {
  try {
    const url = 'https://itunes.apple.com/lookup?id=1850720041&entity=album&limit=200&sort=recent';
    const response = await fetch(url, { headers: { 'User-Agent': 'LIL-SYNN-Official-Website/1.0' } });
    if (!response.ok) {
      return res.status(502).json({ error: 'Apple Music artwork source unavailable' });
    }
    const data = await response.json();
    const results = (data.results || [])
      .filter(x => x.wrapperType === 'collection' && x.collectionName && x.artistName === 'LIL SYNN')
      .map(x => ({
        title: x.collectionName,
        art: (x.artworkUrl100 || '').replace(/\d+x\d+bb/, '600x600bb'),
        date: x.releaseDate ? x.releaseDate.slice(0, 10) : null,
        type: x.collectionType === 'Album' ? 'Album' : x.collectionType === 'EP' ? 'EP' : 'Single'
      }));
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Artwork lookup failed' });
  }
}
