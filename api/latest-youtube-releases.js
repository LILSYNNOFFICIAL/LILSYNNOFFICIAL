export default async function handler(req,res){
  const page='https://www.youtube.com/@LILSYNNOFFICIAL/releases';
  try{
    const response=await fetch(page,{headers:{'user-agent':'Mozilla/5.0 (compatible; LILSYNN-site/1.0)'}});
    if(!response.ok)throw new Error(`YouTube releases page returned ${response.status}`);
    const html=await response.text();
    const ids=[...new Set([...html.matchAll(/(?:"videoId"|videoId)\s*:\s*"([A-Za-z0-9_-]{11})"/g)].map(m=>m[1]))];
    if(!ids.length)throw new Error('No YouTube release video IDs found');
    const candidates=ids.slice(0,40);
    const items=[];
    for(let i=0;i<candidates.length;i+=5){
      const batch=candidates.slice(i,i+5);
      const results=await Promise.all(batch.map(async id=>{
        try{
          const r=await fetch(`https://www.youtube.com/watch?v=${id}`,{headers:{'user-agent':'Mozilla/5.0 (compatible; LILSYNN-site/1.0)'}});
          if(!r.ok)return null;
          const h=await r.text();
          const date=(h.match(/"uploadDate":"([0-9T:+-]+)"/)||h.match(/"datePublished":"([0-9T:+-]+)"/)||[])[1]||'';
          const title=(h.match(/<meta property="og:title" content="([^"]+)"/)||[])[1]||'';
          const clean=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
          return {id,title:clean(title),publishedAt:date};
        }catch{return null}
      }));
      items.push(...results.filter(Boolean));
    }
    items.sort((a,b)=>new Date(b.publishedAt||0)-new Date(a.publishedAt||0));
    const latest=items.filter(x=>x.publishedAt).slice(0,9);
    res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:latest});
  }catch(error){
    res.setHeader('Cache-Control','no-store');
    return res.status(502).json({error:'Unable to refresh YouTube releases',detail:error.message});
  }
}
