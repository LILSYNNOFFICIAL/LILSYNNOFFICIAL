export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_DATA_API_KEY;
  const source='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  const send=(videos,live,warning)=>{
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source,updatedAt:new Date().toISOString(),videos,live,...(warning?{warning}:{})});
  };
  try{
    if(!API_KEY)throw new Error('YOUTUBE_DATA_API_KEY is not configured in Vercel');

    // The Releases page currently renders release albums/singles as
    // lockupViewModel playlist cards. We read ONLY that page and extract ONLY
    // LOCKUP_CONTENT_TYPE_PLAYLIST IDs from it. We never use uploads, search,
    // home, videos, shorts, or any other YouTube section.
    const page=await fetch(source,{headers:{'User-Agent':'Mozilla/5.0','Accept-Language':'en-US,en;q=0.9'},cache:'no-store'});
    if(!page.ok)throw new Error(`YouTube Releases page returned ${page.status}`);
    const html=await page.text();

    const playlistIds=[];
    const seenPlaylists=new Set();
    const addPlaylist=id=>{if(id&&!seenPlaylists.has(id)){seenPlaylists.add(id);playlistIds.push(id)}};
    for(const match of html.matchAll(/"lockupViewModel"\s*:\s*\{[\s\S]*?"contentId"\s*:\s*"([A-Za-z0-9_-]{13,100})"\s*,\s*"contentType"\s*:\s*"LOCKUP_CONTENT_TYPE_PLAYLIST"/g))addPlaylist(match[1]);
    if(!playlistIds.length)throw new Error('No release playlists were found on the LIL SYNN Releases tab');

    // Each release playlist is now queried through YouTube's official API.
    // The playlist IDs themselves came exclusively from /releases, so the
    // resulting videos remain restricted to the Releases tab.
    const playlistItems=await Promise.all(playlistIds.slice(0,20).map(async playlistId=>{
      const q=new URLSearchParams({part:'snippet,contentDetails',playlistId,maxResults:'50',key:API_KEY});
      const r=await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${q}`,{cache:'no-store'});
      const body=await r.json();
      if(!r.ok||body.error)throw new Error(body.error?.message||`YouTube release playlist lookup failed (${r.status})`);
      return body.items||[];
    }));

    const ids=[];
    const seenVideos=new Set();
    for(const items of playlistItems){
      for(const item of items){
        const id=item?.contentDetails?.videoId;
        if(id&&/^[A-Za-z0-9_-]{11}$/.test(id)&&!seenVideos.has(id)){seenVideos.add(id);ids.push(id)}
      }
    }
    if(!ids.length)throw new Error('The YouTube Releases playlists returned no videos');

    // Get authoritative publication dates/titles and sort newest -> oldest.
    const videos=[];
    for(let i=0;i<ids.length;i+=50){
      const q=new URLSearchParams({part:'snippet',id:ids.slice(i,i+50).join(','),key:API_KEY});
      const r=await fetch(`https://www.googleapis.com/youtube/v3/videos?${q}`,{cache:'no-store'});
      const body=await r.json();
      if(!r.ok||body.error)throw new Error(body.error?.message||`YouTube video metadata failed (${r.status})`);
      for(const x of body.items||[]){
        const publishedAt=x.snippet?.publishedAt;
        if(x.id&&publishedAt)videos.push({id:x.id,title:x.snippet?.title||x.id,publishedAt});
      }
    }

    videos.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
    const latest=videos.slice(0,9);
    if(!latest.length)throw new Error('No dated videos were returned for the YouTube Releases playlists');
    return send(latest,true);
  }catch(error){
    // Never substitute uploads or another YouTube section. An empty result is
    // preferable to showing the wrong videos.
    return send([],false,error.message);
  }
}
