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

    // Read the actual Releases tab. Do not use the channel uploads playlist,
    // search results, home page, or any other YouTube section.
    const page=await fetch(source,{headers:{'User-Agent':'Mozilla/5.0','Accept-Language':'en-US,en;q=0.9'},cache:'no-store'});
    if(!page.ok)throw new Error(`YouTube Releases page returned ${page.status}`);
    const html=await page.text();

    const ids=[];
    const seen=new Set();
    const add=id=>{if(id&&!seen.has(id)){seen.add(id);ids.push(id)}};
    for(const match of html.matchAll(/"videoRenderer"\s*:\s*\{[\s\S]*?"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/g))add(match[1]);
    if(!ids.length)throw new Error('No videos were found on the LIL SYNN Releases tab');

    // Use the IDs discovered ONLY from /releases, then use YouTube Data API
    // solely to obtain authoritative publication timestamps for sorting.
    const q=new URLSearchParams({part:'snippet',id:ids.slice(0,50).join(','),key:API_KEY});
    const api=await fetch(`https://www.googleapis.com/youtube/v3/videos?${q}`);
    const body=await api.json();
    if(!api.ok||body.error)throw new Error(body.error?.message||`YouTube API ${api.status}`);

    const videos=(body.items||[])
      .map(x=>({id:x.id,title:x.snippet?.title||x.id,publishedAt:x.snippet?.publishedAt}))
      .filter(x=>x.id&&x.publishedAt)
      .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt))
      .slice(0,9);

    if(!videos.length)throw new Error('No dated releases were returned for the videos on the Releases tab');
    return send(videos,true);
  }catch(error){
    // Never substitute uploads or another YouTube section. An empty result is
    // preferable to showing the wrong videos.
    return send([],false,error.message);
  }
}
