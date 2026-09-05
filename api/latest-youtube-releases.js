export default async function handler(req,res){
  const API_KEY=process.env.YOUTUBE_DATA_API_KEY;
  const CHANNEL_HANDLE='@LILSYNNOFFICIAL';
  const source='https://www.youtube.com/@LILSYNNOFFICIAL';
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
  const send=(videos,live,warning)=>{
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source,updatedAt:new Date().toISOString(),videos,live,...(warning?{fallback:true,warning}:{})});
  };
  const api=async(path,params={})=>{
    const q=new URLSearchParams({...params,key:API_KEY});
    const r=await fetch(`https://www.googleapis.com/youtube/v3/${path}?${q}`);
    const body=await r.json();
    if(!r.ok||body.error)throw new Error(body.error?.message||`YouTube API ${r.status}`);
    return body;
  };
  try{
    if(!API_KEY)throw new Error('YOUTUBE_DATA_API_KEY is not configured in Vercel');
    const channel=await api('channels',{part:'contentDetails,snippet',forHandle:CHANNEL_HANDLE});
    const item=channel.items?.[0];
    if(!item)throw new Error('LIL SYNN YouTube channel was not found');
    const uploads=item.contentDetails?.relatedPlaylists?.uploads;
    if(!uploads)throw new Error('LIL SYNN uploads playlist was not found');
    const page=await api('playlistItems',{part:'snippet,contentDetails',playlistId:uploads,maxResults:50});
    const videos=(page.items||[])
      .map(x=>({id:x.contentDetails?.videoId,title:x.snippet?.title||x.contentDetails?.videoId,publishedAt:x.contentDetails?.videoPublishedAt||x.snippet?.publishedAt}))
      .filter(x=>x.id&&x.publishedAt)
      .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt))
      .slice(0,9);
    if(!videos.length)throw new Error('YouTube uploads playlist returned no videos');
    return send(videos,true);
  }catch(error){
    return send(fallback,false,error.message);
  }
}
