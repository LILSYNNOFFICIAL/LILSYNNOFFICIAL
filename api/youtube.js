export default async function handler(req, res) {
    // Get parameters (defaults to your channel and 4 videos)
    const { channelId = 'UC1uTOgZd1rNHnASINvT4b4Q', maxResults = 4 } = req.query;

    const API_KEY = process.env.YOUTUBE_API_KEY;

    // Safety check
    if (!API_KEY) {
        console.error('❌ YOUTUBE_API_KEY not found in Vercel environment variables');
        return res.status(500).json({ error: 'API key not configured on Vercel' });
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=\( {channelId}&maxResults= \){maxResults}&order=date&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error('YouTube API error:', data);
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
}
