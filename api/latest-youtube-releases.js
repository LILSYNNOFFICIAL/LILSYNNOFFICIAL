export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_DATA_API_KEY;
  const source='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  const send=(videos,live,warning)=>{
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source,updatedAt:new Date().toISOString(),videos,live,...(warning?{warning}:{})});
  };
  const collectReleasePlaylists=(node,ids,seen)=>{
    if(!node||typeof node!=='object')return;
    if(Array.isArray(node)){for(const x of node)collectReleasePlaylists(x,ids,seen);return}
    const add=id=>{if(typeof id==='string'&&id.length>=13&&!seen.has(id)){seen.add(id);ids.push(id)}};
    // Current YouTube Releases responses can expose release collections as
    // lockupViewModel objects OR as playlistRenderer/music playlist objects.
    const lockup=node.lockupViewModel;
    if(lockup?.contentType==='LOCKUP_CONTENT_TYPE_PLAYLIST')add(lockup.contentId);
    if(typeof node.playlistId==='string')add(node.playlistId);
    for(const value of Object.values(node))collectReleasePlaylists(value,ids,seen);
  };
  try{
    if(!API_KEY)throw new Error('YOUTUBE_DATA_API_KEY is not configured in Vercel');

    const cq=new URLSearchParams({part:'id',forHandle:'@LILSYNNOFFICIAL',key:API_KEY});
    const cr=await fetch(`https://www.googleapis.com/youtube/v3/channels?${cq}`,{cache:'no-store'});
    const cb=await cr.json();
    if(!cr.ok||cb.error)throw new Error(cb.error?.message||`YouTube channel lookup failed (${cr.status})`);
    const channelId=cb.items?.[0]?.id;
    if(!channelId)throw new Error('LIL SYNN YouTube channel was not found');

    // This is the critical source restriction: YouTube's internal browse
    // request explicitly asks for the Releases tab, not the uploads/videos tab.
    const browse=await fetch('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false',{
      method:'POST',
      headers:{'Content-Type':'application/json','User-Agent':'Mozilla/5.0','Accept-Language':'en-US,en;q=0.9'},
      body:JSON.stringify({context:{client:{hl:'en',gl:'US',clientName:'WEB',clientVersion:'2.20260904.01.00'}},browseId:channelId,params:'EgtyZWxlYXNlcw=='})
    });
    const data=await browse.json();
    if(!browse.ok||data.error)throw new Error(data.error?.message||`YouTube Releases browse failed (${browse.status})`);

    const playlistIds=[];
    collectReleasePlaylists(data,playlistIds,new Set());
    if(!playlistIds.length)throw new Error('YouTube Releases tab returned no release playlists');

    const items=await Promise.all(playlistIds.slice(0,20).map(async playlistId=>{
      const q=new URLSearchParams({part:'snippet,contentDetails',playlistId,maxResults:'50',key:API_KEY});
      const r=await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${q}`,{cache:'no-store'});
      const body=await r.json();
      if(!r.ok||body.error)throw new Error(`Release playlist ${playlistId} failed: ${body.error?.message||r.status}`);
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
    return send([],false,error.message);
  }
}
