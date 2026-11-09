module.exports = async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 res.setHeader('Cache-Control','public, max-age=60, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400');
 res.setHeader('CDN-Cache-Control','public, max-age=300, stale-while-revalidate=600, stale-if-error=86400');
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
     const json=require('../latest-videos.json');
     return new Map((json.videos||[]).map(v=>[String(v.id||''),{releasedOn:String(v.releasedOn||v.publishedAt||''),releaseTitle:String(v.releaseTitle||v.release||v.title||'')}]));
   }catch{return new Map()}
 };
 const catalogFor=async()=>{
   try{return require('../release-catalog.json')}catch{return null}
 };
 // Release names win over track names (a title track shares its album's name, and a
 // video named after an album track belongs to that album, not to a single of that
 // name). A catalog release with no group stays type-unknown rather than being
 // reported as a single.
 const releaseIndex=c=>{
   const byRelease=new Map(),byTrack=new Map(),orderByNorm=new Map();
   (c?.order||[]).forEach(t=>orderByNorm.set(norm(t),t));
   Object.entries(c?.groups||{}).forEach(([release,g])=>{
     const entry={release,type:String(g?.type||'').toUpperCase()};
     byRelease.set(norm(release),entry);
     (g?.tracks||[]).forEach(t=>{const k=norm(t);if(k&&!byRelease.has(k))byTrack.set(k,entry)});
   });
   return {byRelease,byTrack,orderByNorm};
 };
 // DistroKid / Topic uploads credit the track, then the release title on its own
 // line: "Track · Artist", blank, "Album", "℗ Label", "Released on: ...".
 const albumFromDescription=description=>{
   const lines=String(description||'').split(/\n+/).map(line=>line.trim()).filter(Boolean);
   const credit=lines.findIndex(line=>line.includes('·'));
   if(credit<0)return '';
   const candidate=lines[credit+1]||'';
   if(!candidate||/^℗/.test(candidate)||/^(released?\s+on|composer|auto-generated)/i.test(candidate))return '';
   return candidate;
 };
 const annotate=async(items)=>{
   const c=await catalogFor(); const latest=latestReleaseDates();
   const {byRelease,byTrack,orderByNorm}=releaseIndex(c);
   const resolve=title=>{
     const k=norm(title);
     if(byRelease.has(k))return byRelease.get(k);
     if(orderByNorm.has(k))return {release:orderByNorm.get(k),type:''};
     if(byTrack.has(k))return byTrack.get(k);
     return null;
   };
   return (items||[]).map(x=>{
     const title=x?.snippet?.title||'';
     const latestMeta=latest.get(String(x?.videoId||x?.id?.videoId||(typeof x?.id==='string'?x.id:'')||''));
     const seeded=latestMeta?.releaseTitle?{release:latestMeta.releaseTitle,type:byRelease.get(norm(latestMeta.releaseTitle))?.type||''}:null;
     // A track uploaded from an album names that album in its credits; group the
     // track under the album instead of publishing it as a release of its own.
     const album=albumFromDescription(x?.snippet?.description);
     const albumEntry=album&&norm(album)!==norm(title)?(byRelease.get(norm(album))||{release:album,type:''}):null;
     const match=albumEntry||resolve(title)||seeded;
     const releaseTitle=match?.release||title;
     const releaseType=match?.type||'';
     const releasedOn=releaseDateFromDescription(x?.snippet?.description)||latestMeta?.releasedOn||'';
     return {...x,releaseTitle,releaseType,releasedOn};
   });
 };
 // One card per release, newest first: collapse before slicing so a release with
 // several uploads cannot crowd older releases out of the response.
 const orderItems=items=>{
   const byRelease=new Map();
   for(const item of (items||[])){
     const key=norm(item?.releaseTitle||item?.snippet?.title||'');
     if(!key)continue;
     const date=String(item?.releasedOn||item?.snippet?.publishedAt||'');
     const current=byRelease.get(key);
     if(!current||date>=String(current?.releasedOn||current?.snippet?.publishedAt||''))byRelease.set(key,item);
   }
   return [...byRelease.values()].sort((a,b)=>String(b?.releasedOn||b?.snippet?.publishedAt||'').localeCompare(String(a?.releasedOn||a?.snippet?.publishedAt||''))).slice(0,30);
 };
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