export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_API_KEY;
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
    const lockup=node.lockupViewModel;
    if(lockup?.contentType==='LOCKUP_CONTENT_TYPE_PLAYLIST')add(lockup.contentId);
    if(typeof node.playlistId==='string')add(node.playlistId);
    for(const value of Object.values(node))collectReleasePlaylists(value,ids,seen);
  };
  try{
    if(!API_KEY)throw new Error('YOUTUBE_API_KEY is not configured in Vercel');
    const cq=new URLSearchParams({part:'id',forHandle:'@LILSYNNOFFICIAL',key:API_KEY});
    const cr=await fetch(`https://www.googleapis.com/youtube/v3/channels?${cq}`,{cache:'no-store'});
    const cb=await cr.json();
    if(!cr.ok||cb.error)throw new Error(cb.error?.message||`YouTube channel lookup failed (${cr.status})`);
    const channelId=cb.items?.[0]?.id;
    if(!channelId)throw new Error('LIL SYNN YouTube channel was not found');
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
    const releases=[];
    for(const playlistId of playlistIds.slice(0,20)){
      const pq=new URLSearchParams({part:'snippet',id:playlistId,key:API_KEY});
      const pr=await fetch(`https://www.googleapis.com/youtube/v3/playlists?${pq}`,{cache:'no-store'});
      const pb=await pr.json();
      if(!pr.ok||pb.error)throw new Error(`Release playlist ${playlistId} failed: ${pb.error?.message||pr.status}`);
      const playlist=pb.items?.[0];
      if(!playlist)continue;
      const iq=new URLSearchParams({part:'snippet,contentDetails',playlistId,maxResults:'1',key:API_KEY});
      const ir=await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${iq}`,{cache:'no-store'});
      const ib=await ir.json();
      if(!ir.ok||ib.error)throw new Error(`Release playlist ${playlistId} items failed: ${ib.error?.message||ir.status}`);
      const item=ib.items?.[0];
      const id=item?.contentDetails?.videoId;
      if(!id||!/^[A-Za-z0-9_-]{11}$/.test(id))continue;
      releases.push({id,title:playlist.snippet?.title||item?.snippet?.title||id,publishedAt:item?.contentDetails?.videoPublishedAt||item?.snippet?.publishedAt||null});
      if(releases.length===9)break;
    }
    if(!releases.length)throw new Error('The YouTube Releases tab returned no release videos');
    return send(releases,true);
  }catch(error){return send([],false,error.message)}
}
