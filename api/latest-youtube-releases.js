export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_DATA_API_KEY;
  const CHANNEL_HANDLE='@LILSYNNOFFICIAL';
  const page='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  const fallback=[
    {id:'tINy0BDH06Y',title:'HOME'},
    {id:'0fXE-ABEcBU',title:'I DID IT AGAIN'},
    {id:'Glh5acZNiFM',title:'Rescue You (Acoustic Version)'},
    {id:'q_EENWIxiUA',title:'Somewhere In-Between'},
    {id:'vebiWy-RL4Y',title:'Black Glass'},
    {id:'JRJswRmhbmA',title:'Static On My Tongue'},
    {id:'NMFONDfJoi8',title:"It's In Her Eyes"},
    {id:'tfVl30iEMkg',title:'Fade Into You'},
    {id:'_1w0aG-lj8U',title:'Heal'}
  ];
  const api=async(path,params={})=>{const q=new URLSearchParams({...params,key:API_KEY});const r=await fetch(`https://www.googleapis.com/youtube/v3/${path}?${q}`);const body=await r.json();if(!r.ok||body.error)throw new Error(body.error?.message||`YouTube API ${r.status}`);return body};
  try{
    if(!API_KEY)throw new Error('YOUTUBE_DATA_API_KEY is not configured in Vercel');
    // Use the channel's official uploads playlist. This is the reliable source for
    // all uploads; the public /releases page is not treated as chronological data.
    const channel=await api('channels',{part:'contentDetails,snippet',forHandle:CHANNEL_HANDLE});
    const channelItem=channel.items?.[0];
    if(!channelItem)throw new Error('LIL SYNN YouTube channel was not found');
    const uploadsId=channelItem.contentDetails.relatedPlaylists.uploads;
    const items=[];let token='';
    // Walk enough pages to cover the recent catalog while avoiding an unbounded request.
    for(let pageNo=0;pageNo<5;pageNo++){
      const data=await api('playlistItems',{part:'snippet,contentDetails',playlistId:uploadsId,maxResults:'50',...(token?{pageToken:token}:{})});
      for(const item of data.items||[]){const id=item.contentDetails?.videoId;if(id)items.push({id,title:item.snippet?.title||id,publishedAt:item.contentDetails?.videoPublishedAt||item.snippet?.publishedAt||''})}
      token=data.nextPageToken||'';if(!token||items.length>=200)break;
    }
    const unique=[...new Map(items.map(x=>[x.id,x])).values()];
    // The API's publishedAt is authoritative. Newest first, independent of YouTube UI order.
    unique.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
    const latest=unique.filter(x=>x.publishedAt).slice(0,9);
    if(latest.length<9)throw new Error(`YouTube uploads playlist returned only ${latest.length} dated videos`);
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,channelId:channelItem.id,uploadsPlaylistId:uploadsId,updatedAt:new Date().toISOString(),videos:latest,live:true});
  }catch(error){
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=180');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:fallback,live:false,fallback:true,warning:error.message});
  }
}
