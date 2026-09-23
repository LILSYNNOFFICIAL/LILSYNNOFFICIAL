const fs=require('node:fs');
const path=require('node:path');

module.exports = async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 res.setHeader('Cache-Control','public, max-age=300, s-maxage=300, stale-while-revalidate=600');
 if(req.method==='OPTIONS')return res.status(204).end();
 const API_KEY=process.env.YOUTUBE_API_KEY;
 const CHANNEL_ID="UC1uTOgZd1rNHnASINvT4b4Q";
 const norm=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'');
 const releaseDateFromDescription=description=>{
   const s=String(description||'');
   const m=s.match(/(?:released\s+on|release\s+date)\s*[:\-]?\s*([A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4}|\d{4}-\d{1,2}-\d{1,2})/i);
   if(!m)return '';
   const d=new Date(m[1]);
   return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10);
 };
 const latestReleaseDates=()=>{
   try{
     const file=path.join(process.cwd(),'latest-videos.json');
     const json=JSON.parse(fs.readFileSync(file,'utf8'));
     return new Map((json.videos||[]).map(v=>[String(v.id||''),{releasedOn:String(v.releasedOn||''),releaseTitle:String(v.releaseTitle||v.title||'')}]));
   }catch{return new Map()}
 };
 const catalogFor=async()=>{
   try{const r=await fetch('https://lilsynnofficial.github.io/LILSYNNOFFICIAL/release-catalog.json',{cache:'no-store'});if(!r.ok)throw Error();return await r.json()}catch{return null}
 };
 const annotate=async(items)=>{
   const c=await catalogFor(); const groups=c?.groups||{}; const latest=latestReleaseDates();
   const groupByTrack=new Map();
   Object.entries(groups).forEach(([release,g])=>{
     groupByTrack.set(norm(release),release);
     (g?.tracks||[]).forEach(t=>groupByTrack.set(norm(t),release));
   });
   return (items||[]).map(x=>{
     const title=x?.snippet?.title||'';
     const latestMeta=latest.get(String(x?.videoId||x?.id?.videoId||''));
     const releaseTitle=groupByTrack.get(norm(title))||latestMeta?.releaseTitle||title;
     const releasedOn=releaseDateFromDescription(x?.snippet?.description)||latestMeta?.releasedOn||'';
     return {...x,releaseTitle,releasedOn};
   });
 };
 const orderItems=items=>[...(items||[])].sort((a,b)=>String(b?.releasedOn||b?.snippet?.publishedAt||'').localeCompare(String(a?.releasedOn||a?.snippet?.publishedAt||''))).slice(0,30);
 const fetchRss=async()=>{try{const response=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,{cache:'no-store'});if(!response.ok)return null;const xml=await response.text();const entries=[];const blocks=xml.split('<entry>').slice(1);const extract=(block,tag)=>{const a=block.indexOf('<'+tag+'>'),b=block.indexOf('</'+tag+'>');return a>=0&&b>a?block.slice(a+tag.length+2,b):''};for(const block of blocks){const videoId=extract(block,'yt:videoId');if(!videoId)continue;const title=extract(block,'title');const published=extract(block,'published');entries.push({kind:'youtube#searchResult',videoId,snippet:{title:title.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'"),publishedAt:published,description:''}})}return entries.length?entries:null}catch{return null}};
 if(API_KEY){
  try{
   const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=date&type=video&key=${API_KEY}`;
   const response=await fetch(url);const data=await response.json();
   if(response.ok&&Array.isArray(data.items)&&data.items.length){
     const ids=data.items.map(x=>x?.id?.videoId).filter(Boolean);
     const detail=await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.join(',')}&key=${API_KEY}`).then(r=>r.ok?r.json():null).catch(()=>null);
     const byId=new Map((detail?.items||[]).map(x=>[x.id,x]));
     data.items=data.items.map(x=>byId.get(x.id?.videoId)||x);
     const annotated=await annotate(data.items);
     data.items=orderItems(annotated);
     return res.status(200).json(data);
   }
  }catch{}
 }
 const rss=await fetchRss();
 if(rss){
   const annotated=await annotate(rss);
   return res.status(200).json({items:orderItems(annotated),kind:'youtube#searchListResponse',fallback:true});
 }
 return res.status(503).json({error:'YouTube feed temporarily unavailable'});
}