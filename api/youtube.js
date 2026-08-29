export default async function handler(req, res) {

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UC1uTOgZd1rNHnASINvT4b4Q";

  if (!API_KEY) {
    return res.status(500).json({
      error: "Missing YOUTUBE_API_KEY environment variable"
    });
  }

  // Latest Videos is intentionally NOT randomized.
  // YouTube returns the channel's newest videos first; the homepage renderer
  // should display these in that order and only use the local fallback if this fails.
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=6&order=date&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ youtube_error: data });
    }

    // Preserve YouTube's date order exactly. Never shuffle this response.
    if (Array.isArray(data.items)) {
      data.items = data.items.slice(0, 6);
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: "Server fetch failed",
      details: error.message
    });
  }

}
