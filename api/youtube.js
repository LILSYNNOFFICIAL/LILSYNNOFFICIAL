export default async function handler(req, res) {
    const { channelId = 'UC1uTOgZd1rNHnASINvT4b4Q', maxResults = 4 } = req.query;
    
    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=\( {channelId}&maxResults= \){maxResults}&order=date&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
}
