export default async function handler(req,res){
  const page='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  // Known current releases supplied/verified for the LIL SYNN channel. These are
  // priority candidates so a malformed/incomplete Releases-page response cannot
  // hide newly published videos from the homepage.
  const priority=[
    {id:'tINy0BDH06Y',title:'HOME'},
    {id:'0fXE-ABEcBU',title:'I DID IT AGAIN'},
    {id:'Glh5acZNiFM',title:'Rescue You (Acoustic Version)'}
  ];
  const fallback=[
    ...priority,
    {id:'q_EENWIxiUA',title:'Somewhere In-Between'},
    {id:'vebiWy-RL4Y',title:'Black Glass'},
    {id:'JRJswRmhbmA',title:'Static On My Tongue'},
    {id:'NMFONDfJoi8',title:"It's In Her Eyes"},
    {id:'tfVl30iEMkg',title:'Fade Into You'},
    {id:'_1w0aG-lj8U',title:'Heal'}
  ];
  const headers={'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36','accept-language':'en-US,en;q=0.9','cache-control':'no-cache'};
  const clean=s=>String(s||'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&#x27;/g,"'");
  const parseRss=xml=>[...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m=>{const x=m[1],id=(x.match(/<yt:videoId>([^<]+)</)||[])[1]||'',title=(x.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'',publishedAt=(x.match(/<published>([^<]+)</)||[])[1]||'';return id&&publishedAt?{id,title:clean(title),publishedAt}:null}).filter(Boolean);
  const fetchVideoMeta=async id=>{try{const r=await fetch(`https://www.youtube.com/watch?v=${id}&_=${Date.now()}`,{headers});if(!r.ok)return null;const h=await r.text();const date=(h.match(/"uploadDate"\s*:\s*"([^"]+)"/)||h.match(/"datePublished"\s*:\s*"([^"]+)"/)||h.match(/<meta[^>]+itemprop=["']datePublished["'][^>]+content=["']([^"']+)/i)||[])[1]||'';const title=(h.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)||h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'';return date?{id,title:clean(title).replace(/\s+-\s+YouTube\s*$/i,'')||priority.find(x=>x.id===id)?.title||id,publishedAt:date}:null}catch{return null}};
  try{
    const response=await fetch(`${page}?_=${Date.now()}`,{headers});
    const html=response.ok?await response.text():'';
    const ids=[...new Set([...html.matchAll(/(?:"videoId"\s*:\s*"|videoId\s*"\s*:\s*"|\/watch\?v=)([A-Za-z0-9_-]{11})/g)].map(m=>m[1]))];
    const channelId=(html.match(/"channelId"\s*:\s*"(UC[A-Za-z0-9_-]{20,})"/)||html.match(/"externalId"\s*:\s*"(UC[A-Za-z0-9_-]{20,})"/)||[])[1]||'';
    let rss=[];
    if(channelId){const rr=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}&_=${Date.now()}`,{headers});if(rr.ok)rss=parseRss(await rr.text())}
    // Priority videos are NEVER truncated out of the candidate set. RSS is then
    // merged in, followed by Releases-page candidates, and all dated metadata is
    // sorted by the actual publication timestamp.
    const candidateIds=[...new Set([...priority.map(x=>x.id),...rss.map(x=>x.id),...ids])].slice(0,300);
    const rssById=new Map(rss.map(x=>[x.id,x]));
    const items=[];
    for(let i=0;i<candidateIds.length;i+=10){const batch=candidateIds.slice(i,i+10);const results=await Promise.all(batch.map(id=>rssById.get(id)||fetchVideoMeta(id)));items.push(...results.filter(Boolean))}
    const unique=new Map(items.map(x=>[x.id,x]));
    // Ensure the three known current uploads are retained even if YouTube temporarily
    // refuses metadata for one of their pages; they are ordered first as supplied.
    for(const p of priority)if(!unique.has(p.id))unique.set(p.id,{...p,publishedAt:new Date(0).toISOString(),metadataUnavailable:true});
    const latest=[...unique.values()].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,9);
    if(latest.length<9)throw new Error(`YouTube returned only ${latest.length} candidates`);
    // The three current uploads are explicitly the newest in the supplied order.
    const priorityIds=priority.map(x=>x.id);const rest=latest.filter(x=>!priorityIds.includes(x.id));
    const ordered=[...priority.map(p=>unique.get(p.id)).filter(Boolean),...rest].slice(0,9);
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:ordered,live:true});
  }catch(error){res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=180');res.setHeader('Content-Type','application/json; charset=utf-8');return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:fallback,live:false,fallback:true,warning:error.message})}
}
