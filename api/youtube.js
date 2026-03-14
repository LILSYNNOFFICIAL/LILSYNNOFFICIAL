export default async function handler(req, res) {

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UC1uTOgZd1rNHnASINvT4b4Q";

  if (!API_KEY) {
    return res.status(500).json({
      error: "Missing YOUTUBE_API_KEY environment variable"
    });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=4&order=date&type=video&key=${API_KEY}`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    // Show the real YouTube error if it fails
    if (!response.ok) {
      return res.status(response.status).json({
        youtube_error: data
      });
    }

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      error: "Server fetch failed",
      details: error.message
    });

  }

}
