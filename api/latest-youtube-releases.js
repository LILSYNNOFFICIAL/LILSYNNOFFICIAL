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
    const channel=await api('channels',{part:'contentDetails,snippet',forHandle:CHANNEL_HANDLE});
    const channelItem=channel.items?.[0];
    if(!channelItem)throw new Error('LIL SYNN YouTube channel was not found');
    const releasesPlaylistId=channelItem.contentDetails?.relatedPlaylists?.uploads;
    if(!releasesPlaylistId)throw new Error('LIL SYNN uploads playlist was not found');

    // IMPORTANT: the Releases page is the membership source. YouTube does not expose
    // a separate Data API playlist for the /releases tab, so discover the IDs from that
    // public page, then use the Data API to obtain authoritative publication dates.
    const html=await (await fetch(page,{headers:{'user-agent':'Mozilla/5.0'}})).text();
    const ids=[...new Set([...html.matchAll(/(?:watch\\?v=|videoId\\?\\s*[:=]\\s*["'])([A-Za-z0-9_-]{11})/g)].map(m=>m[1]))];
    if(!ids.length)throw new Error('No video IDs were discoverable from the YouTube Releases page');

    const dated=[];
    for(let i=0;i<ids.length;i+=50){
      const data=await api('videos',{part:'snippet',id:ids.slice(i,i+50).join(',')});
      for(const item of data.items||[]){
        const publishedAt=item.snippet?.publishedAt;
        if(publishedAt)dated.push({id:item.id,title:item.snippet?.title||item.id,publishedAt});
      }
    }
    const unique=[...new Map(dated.map(x=>[x.id,x])).values()];
    unique.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
    const latest=unique.slice(0,9);
    if(latest.length<9)throw new Error(`Releases page returned only ${latest.length} dated videos`);
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,channelId:channelItem.id,updatedAt:new Date().toISOString(),videos:latest,live:true,selection:'YouTube Releases page membership sorted by YouTube publishedAt'});
  }catch(error){
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=180');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:fallback,live:false,fallback:true,warning:error.message});
  }
}
