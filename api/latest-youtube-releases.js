export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_DATA_API_KEY;
  const source='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  const send=(videos,live,warning)=>{
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source,updatedAt:new Date().toISOString(),videos,live,...(warning?{warning}:{})});
  };
  const collect=(node,ids,seen)=>{
    if(!node||typeof node!=='object')return;
    if(Array.isArray(node)){for(const x of node)collect(x,ids,seen);return}
    if(node.lockupViewModel){
      const v=node.lockupViewModel;
      if(v.contentType==='LOCKUP_CONTENT_TYPE_PLAYLIST'&&typeof v.contentId==='string'&&!seen.has(v.contentId)){
        seen.add(v.contentId);ids.push(v.contentId);
      }
    }
    for(const value of Object.values(node))collect(value,ids,seen);
  };
  try{
    if(!API_KEY)throw new Error('YOUTUBE_DATA_API_KEY is not configured in Vercel');

    // Resolve the official channel ID.
    const cq=new URLSearchParams({part:'id',forHandle:'@LILSYNNOFFICIAL',key:API_KEY});
    const cr=await fetch(`https://www.googleapis.com/youtube/v3/channels?${cq}`,{cache:'no-store'});
    const cb=await cr.json();
    if(!cr.ok||cb.error)throw new Error(cb.error?.message||`YouTube channel lookup failed (${cr.status})`);
    const channelId=cb.items?.[0]?.id;
    if(!channelId)throw new Error('LIL SYNN YouTube channel was not found');

    // Ask YouTube's internal browse API specifically for the Releases tab.
    // EgtyZWxlYXNlcw== is the Releases-tab parameter; this is not the uploads
    // playlist and does not query the channel's Videos/Home/Shorts sections.
    const browse=await fetch('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false',{
      method:'POST',
      headers:{'Content-Type':'application/json','User-Agent':'Mozilla/5.0','Accept-Language':'en-US,en;q=0.9'},
      body:JSON.stringify({context:{client:{hl:'en',gl:'US',clientName:'WEB',clientVersion:'2.20260904.01.00'}},browseId:channelId,params:'EgtyZWxlYXNlcw=='})
    });
    const data=await browse.json();
    if(!browse.ok||data.error)throw new Error(data.error?.message||`YouTube Releases browse failed (${browse.status})`);

    const playlistIds=[];
    collect(data,playlistIds,new Set());
    if(!playlistIds.length)throw new Error('YouTube Releases tab returned no release playlists');

    // Expand ONLY the release playlists discovered from the Releases tab.
    const items=await Promise.all(playlistIds.slice(0,20).map(async playlistId=>{
      const q=new URLSearchParams({part:'snippet,contentDetails',playlistId,maxResults:'50',key:API_KEY});
      const r=await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${q}`,{cache:'no-store'});
      const body=await r.json();
      if(!r.ok||body.error)throw new Error(body.error?.message||`Release playlist ${playlistId} failed (${r.status})`);
      return body.items||[];
    }));

    const ids=[];
    const seenVideos=new Set();
    for(const list of items)for(const item of list){
      const id=item?.contentDetails?.videoId;
      if(id&&/^[A-Za-z0-9_-]{11}$/.test(id)&&!seenVideos.has(id)){seenVideos.add(id);ids.push(id)}
    }
    if(!ids.length)throw new Error('The YouTube Releases playlists returned no videos');

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
    if(!latest.length)throw new Error('No dated videos were returned for the YouTube Releases tab');
    return send(latest,true);
  }catch(error){
    // Never substitute uploads, search, home, videos, shorts, or any other
    // YouTube section. An empty result is preferable to the wrong videos.
    return send([],false,error.message);
  }
}
