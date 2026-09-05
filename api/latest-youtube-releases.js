export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_DATA_API_KEY;
  const source='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  const instances=[
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://invidious.tiekoetter.com'
  ];
  const send=(videos,live,warning)=>{
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source,updatedAt:new Date().toISOString(),videos,live,...(warning?{warning}:{})});
  };
  try{
    if(!API_KEY)throw new Error('YOUTUBE_DATA_API_KEY is not configured in Vercel');

    // First resolve the official LIL SYNN channel ID with YouTube's API.
    const channelQ=new URLSearchParams({part:'id',forHandle:'@LILSYNNOFFICIAL',key:API_KEY});
    const channelRes=await fetch(`https://www.googleapis.com/youtube/v3/channels?${channelQ}`,{cache:'no-store'});
    const channelBody=await channelRes.json();
    if(!channelRes.ok||channelBody.error)throw new Error(channelBody.error?.message||`YouTube channel lookup failed (${channelRes.status})`);
    const channelId=channelBody.items?.[0]?.id;
    if(!channelId)throw new Error('LIL SYNN YouTube channel was not found');

    // YouTube's Releases tab is exposed by Invidious as /channels/:id/releases.
    // That endpoint returns release playlists (not the normal uploads feed).
    // We then collect the videos belonging to those release playlists only.
    let releaseData=null;
    let lastError='';
    for(const base of instances){
      try{
        const r=await fetch(`${base}/api/v1/channels/${channelId}/releases`,{headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json'},cache:'no-store'});
        if(!r.ok)throw new Error(`${base} returned ${r.status}`);
        const body=await r.json();
        if(!Array.isArray(body.playlists)||!body.playlists.length)throw new Error(`${base} returned no Releases playlists`);
        releaseData=body;
        break;
      }catch(error){lastError=error.message}
    }
    if(!releaseData)throw new Error(`Unable to read the YouTube Releases tab: ${lastError}`);

    const ids=[];
    const seen=new Set();
    for(const playlist of releaseData.playlists){
      for(const video of Array.isArray(playlist.videos)?playlist.videos:[]){
        const id=video?.videoId;
        if(id&&/^[A-Za-z0-9_-]{11}$/.test(id)&&!seen.has(id)){seen.add(id);ids.push(id)}
      }
    }
    if(!ids.length)throw new Error('The YouTube Releases tab returned no release videos');

    // The IDs came exclusively from the Releases endpoint. YouTube Data API
    // is used only to obtain authoritative titles/publication timestamps so
    // the final nine can be ordered newest -> oldest.
    const q=new URLSearchParams({part:'snippet',id:ids.slice(0,50).join(','),key:API_KEY});
    const api=await fetch(`https://www.googleapis.com/youtube/v3/videos?${q}`,{cache:'no-store'});
    const body=await api.json();
    if(!api.ok||body.error)throw new Error(body.error?.message||`YouTube video metadata failed (${api.status})`);

    const videos=(body.items||[])
      .map(x=>({id:x.id,title:x.snippet?.title||x.id,publishedAt:x.snippet?.publishedAt}))
      .filter(x=>x.id&&x.publishedAt)
      .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt))
      .slice(0,9);
    if(!videos.length)throw new Error('No dated videos were returned for the YouTube Releases tab');
    return send(videos,true);
  }catch(error){
    // Never substitute uploads, search, home, or another YouTube section.
    return send([],false,error.message);
  }
}
