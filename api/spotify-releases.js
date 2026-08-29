const ARTIST_ID = '6ozcOAnRAUPn3z5c0GR5kU';
const OPERATION = 'queryArtistOverview';
const HASH = '1ac33ddab5d39a3a9c27802774e6d78b9405cc188c6f75aed007df2a32737c72';

function firstCover(item) {
  return item?.coverArt?.sources?.find((s) => s.width >= 600)?.url
    || item?.coverArt?.sources?.[0]?.url
    || null;
}

function flattenBucket(bucket) {
  return (bucket?.items || []).flatMap((entry) => {
    const release = entry?.releases?.items?.[0];
    if (!release) return [];
    return [{
      id: release.id || release.uri?.split(':').pop(),
      title: release.name,
      type: String(release.type || '').toUpperCase(),
      date: release.date
        ? [release.date.year, release.date.month, release.date.day]
            .filter(Boolean)
            .map((v) => String(v).padStart(2, '0'))
            .join('-')
        : null,
      artwork: firstCover(release),
      spotifyUrl: release.uri ? `https://open.spotify.com/album/${release.uri.split(':').pop()}` : null
    }];
  });
}

export default async function handler(req, res) {
  try {
    const tokenResponse = await fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!tokenResponse.ok) throw new Error(`Spotify token request failed: ${tokenResponse.status}`);
    const tokenData = await tokenResponse.json();

    const params = new URLSearchParams({
      operationName: OPERATION,
      variables: JSON.stringify({ uri: `spotify:artist:${ARTIST_ID}` }),
      extensions: JSON.stringify({
        persistedQuery: { version: 1, sha256Hash: HASH }
      })
    });

    const response = await fetch(`https://api-partner.spotify.com/pathfinder/v1/query?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${tokenData.accessToken}`,
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    if (!response.ok) throw new Error(`Spotify catalog request failed: ${response.status}`);

    const payload = await response.json();
    const artist = payload?.data?.artistUnion || payload?.data?.artist;
    if (!artist?.discography) throw new Error('Spotify artist catalog was not returned');

    const releases = [
      ...flattenBucket(artist.discography.albums),
      ...flattenBucket(artist.discography.singles),
      ...flattenBucket(artist.discography.compilations)
    ].filter((r) => r.title && r.spotifyUrl);

    const seen = new Set();
    const unique = releases.filter((r) => {
      const key = `${r.title.toLowerCase()}|${r.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      artist: 'LIL SYNN',
      artistId: ARTIST_ID,
      source: 'Spotify',
      releases: unique
    });
  } catch (error) {
    res.status(502).json({ error: 'Spotify release lookup failed', detail: error.message });
  }
}
