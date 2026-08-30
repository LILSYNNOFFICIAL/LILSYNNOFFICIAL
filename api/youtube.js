export default async function handler(req,res){
 const API_KEY=process.env.YOUTUBE_API_KEY;const CHANNEL_ID="UC1uTOgZd1rNHnASINvT4b4Q";
 if(!API_KEY)return res.status(500).json({error:"Missing YOUTUBE_API_KEY environment variable"});
 const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=25&order=date&type=video&key=${API_KEY}`;
 try{
  const response=await fetch(url);const data=await response.json();
  if(!response.ok)return res.status(response.status).json({youtube_error:data});
  const items=Array.isArray(data.items)?data.items.slice():[];
  const normalize=s=>String(s||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]/g,'');
  const somewhere=items.findIndex(x=>normalize(x?.snippet?.title).includes('somewhereinbetween'));
  if(somewhere>0){const [item]=items.splice(somewhere,1);items.unshift(item)}
  data.items=items.slice(0,6);
  return res.status(200).json(data);
 }catch(error){return res.status(500).json({error:"Server fetch failed",details:error.message})}
}
