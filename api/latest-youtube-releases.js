export default async function handler(req,res){
  const page='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  const fallback=[
    {id:'Glh5acZNiFM',title:'Rescue You (Acoustic Version)'},
    {id:'q_EENWIxiUA',title:'Somewhere In-Between'},
    {id:'vebiWy-RL4Y',title:'Black Glass'},
    {id:'JRJswRmhbmA',title:'Static On My Tongue'},
    {id:'NMFONDfJoi8',title:"It's In Her Eyes"},
    {id:'tfVl30iEMkg',title:'Fade Into You'},
    {id:'_1w0aG-lj8U',title:'Heal'},
    {id:'WejkZ945Jt8',title:'Back From The Blackout'},
    {id:'HX5EZCPsAxI',title:'Hindsight'}
  ];
  const clean=s=>String(s||'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&#x27;/g,"'");
  try{
    const response=await fetch(`${page}?_=${Date.now()}`,{headers:{'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36','accept-language':'en-US,en;q=0.9','cache-control':'no-cache'}});
    if(!response.ok)throw new Error(`YouTube releases page returned ${response.status}`);
    const html=await response.text();
    const ids=[...new Set([...html.matchAll(/(?:"videoId"\s*:\s*"|videoId\s*"\s*:\s*"|\/watch\?v=)([A-Za-z0-9_-]{11})/g)].map(m=>m[1]))];
    if(!ids.length)throw new Error('YouTube releases page did not expose video IDs to the server');
    // The Releases tab can be out of chronological order. Inspect a large candidate pool,
    // then use each video's own upload metadata as the authoritative date.
    const candidates=ids.slice(0,180),items=[];
    for(let i=0;i<candidates.length;i+=8){
      const batch=candidates.slice(i,i+8);
      const results=await Promise.all(batch.map(async id=>{
        try{
          const r=await fetch(`https://www.youtube.com/watch?v=${id}&_=${Date.now()}`,{headers:{'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36','accept-language':'en-US,en;q=0.9','cache-control':'no-cache'}});
          if(!r.ok)return null;
          const h=await r.text();
          const date=(h.match(/"uploadDate"\s*:\s*"([^"]+)"/)||h.match(/"datePublished"\s*:\s*"([^"]+)"/)||h.match(/<meta[^>]+itemprop=["']datePublished["'][^>]+content=["']([^"']+)/i)||[])[1]||'';
          const title=(h.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)||h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'';
          if(!date)return null;
          return {id,title:clean(title).replace(/\s+-\s+YouTube\s*$/i,''),publishedAt:date};
        }catch{return null}
      }));
      items.push(...results.filter(Boolean));
    }
    const unique=new Map(items.map(x=>[x.id,x]));
    const latest=[...unique.values()].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,9);
    if(latest.length<9)throw new Error(`YouTube returned only ${latest.length} dated releases`);
    res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=900');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:latest,live:true});
  }catch(error){
    res.setHeader('Cache-Control','public, s-maxage=120, stale-while-revalidate=300');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:fallback,live:false,fallback:true,warning:error.message});
  }
}
