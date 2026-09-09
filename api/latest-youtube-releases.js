export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_DATA_API_KEY;
  const source='https://www.youtube.com/@LILSYNNOFFICIAL/videos';
  const send=(videos,live,warning)=>{
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source,updatedAt:new Date().toISOString(),videos,live,...(warning?{warning}:{})});
  };
  try{
    if(!API_KEY)throw new Error('YOUTUBE_DATA_API_KEY is not configured in Vercel');

    // Use the channel's official uploads playlist. This is the authoritative
    // chronological source for the channel's latest uploaded/public videos.
    // Do not use YouTube search ordering or the Releases tab here: those can
    // be affected by indexing, regional presentation, or release-playlist
    // organization rather than the channel's actual upload chronology.
    const cq=new URLSearchParams({part:'id,contentDetails',forHandle:'@LILSYNNOFFICIAL',key:API_KEY});
    const cr=await fetch(`https://www.googleapis.com/youtube/v3/channels?${cq}`,{cache:'no-store'});
    const cb=await cr.json();
    if(!cr.ok||cb.error)throw new Error(cb.error?.message||`YouTube channel lookup failed (${cr.status})`);
    const channel=cb.items?.[0];
    const uploadsPlaylistId=channel?.contentDetails?.relatedPlaylists?.uploads;
    if(!uploadsPlaylistId)throw new Error('LIL SYNN YouTube uploads playlist was not found');

    const q=new URLSearchParams({
      part:'snippet,contentDetails',
      playlistId:uploadsPlaylistId,
      maxResults:'50',
      key:API_KEY
    });
    const r=await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${q}`,{cache:'no-store'});
    const body=await r.json();
    if(!r.ok||body.error)throw new Error(body.error?.message||`YouTube uploads playlist failed (${r.status})`);

    const videos=(body.items||[])
      .map(item=>({
        id:item?.contentDetails?.videoId,
        title:item?.snippet?.title||item?.contentDetails?.videoId,
        publishedAt:item?.contentDetails?.videoPublishedAt||item?.snippet?.publishedAt
      }))
      .filter(video=>video.id&&/^[A-Za-z0-9_-]{11}$/.test(video.id)&&video.publishedAt)
      .slice(0,9);

    if(!videos.length)throw new Error('No public videos were returned from the YouTube uploads playlist');
    return send(videos,true);
  }catch(error){
    return send([],false,error.message);
  }
}
