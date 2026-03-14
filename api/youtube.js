export default async function handler(req, res) {

  const API_KEY = process.env.YOUTUBE_API_KEY;

  const CHANNEL_ID = "UC1uTOgZd1rNHnASINvT4b4Q";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=4&order=date&type=video&key=${API_KEY}`;

  try {

    const youtubeResponse = await fetch(url);

    if (!youtubeResponse.ok) {
      throw new Error("YouTube API request failed");
    }

    const data = await youtubeResponse.json();

    res.status(200).json(data);

  } catch (error) {

    console.error("YouTube API error:", error);

    res.status(500).json({
      error: "Failed to fetch YouTube videos"
    });

  }

}
