export default async function handler(req,res){
 const API_KEY=process.env.YOUTUBE_API_KEY;
 const CHANNEL_ID="UC1uTOgZd1rNHnASINvT4b4Q";
 const DESIRED=["Somewhere In-Between","Black Glass","Static On My Tongue","It's In Her Eyes","Fade Into You","Heal","Hindsight","Back From The Blackout","Burn It Down","When The World Gets Loud","Manic Side"];
 const normalize=s=>String(s||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]/g,'');
 const rankTitle=title=>{const key=normalize(title);const idx=DESIRED.findIndex(x=>normalize(x)===key);return idx<0?999:idx};
 const orderItems=items=>[...(items||[])].sort((a,b)=>{const ra=rankTitle(a?.snippet?.title),rb=rankTitle(b?.snippet?.title);if(ra!==rb)return ra-rb;return String(b?.snippet?.publishedAt||'').localeCompare(String(a?.snippet?.publishedAt||''));}).slice(0,6);
 const parseRss=xml=>{const entries=[];for(const match of String(xml||'').matchAll(/<entry>([\s\S]*?)<\/entry>/g)){const block=match[1];const videoId=(block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)||[])[1]||'';const titleRaw=(block.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'LIL SYNN Video';const published=(block.match(/<published>([^<]+)<\/published>/)||[])[1]||'';if(videoId)entries.push({kind:'youtube#searchResult',videoId,snippet:{title:titleRaw.replace(/&amp;/g,'&').replace(/&quot;/g,'\"').replace(/&#39;/g,"'"),publishedAt:published}})}return entries};
 const rssFallback=async()=>{try{const response=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,{cache:'no-store'});if(!response.ok)return null;const xml=await response.text();const items=parseRss(xml);return items.length?{items:orderItems(items),fallback:true}:null}catch{return null}};
 if(API_KEY){
  try{
   const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=25&order=date&type=video&key=${API_KEY}`;
   const response=await fetch(url);const data=await response.json();
   if(response.ok&&Array.isArray(data.items)&&data.items.length){data.items=orderItems(data.items);return res.status(200).json(data)}
  }catch{}
 }
 const rss=await rssFallback();
 if(rss)return res.status(200).json({items:rss.items,kind:'youtube#searchListResponse',fallback:true});
 return res.status(503).json({error:'YouTube feed temporarily unavailable'});
}
