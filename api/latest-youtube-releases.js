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
  const headers={'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36','accept-language':'en-US,en;q=0.9','cache-control':'no-cache'};
  const clean=s=>String(s||'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&#x27;/g,"'");
  const parseRss=xml=>[...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m=>{const x=m[1],id=(x.match(/<yt:videoId>([^<]+)</)||[])[1]||'',title=(x.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'',publishedAt=(x.match(/<published>([^<]+)</)||[])[1]||'';return id&&publishedAt?{id,title:clean(title),publishedAt}:null}).filter(Boolean);
  try{
    const response=await fetch(`${page}?_=${Date.now()}`,{headers});
    if(!response.ok)throw new Error(`YouTube releases page returned ${response.status}`);
    const html=await response.text();
    const ids=[...new Set([...html.matchAll(/(?:"videoId"\s*:\s*"|videoId\s*"\s*:\s*"|\/watch\?v=)([A-Za-z0-9_-]{11})/g)].map(m=>m[1]))];
    // YouTube's Releases tab is not a reliable chronological feed. Supplement it with
    // the channel's official RSS feed, whose published timestamps are authoritative.
    const channelId=(html.match(/"channelId"\s*:\s*"(UC[A-Za-z0-9_-]{20,})"/)||html.match(/"externalId"\s*:\s*"(UC[A-Za-z0-9_-]{20,})"/)||[])[1]||'';
    let rss=[];
    if(channelId){
      const rr=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}&_=${Date.now()}`,{headers});
      if(rr.ok)rss=parseRss(await rr.text());
    }
    // Always include every RSS result, plus the Releases-page candidates. This fixes the
    // previous bug where newer uploads could be absent from the first chunk of /releases.
    const candidateIds=[...new Set([...rss.map(x=>x.id),...ids])].slice(0,220);
    const rssById=new Map(rss.map(x=>[x.id,x]));
    const items=[];
    for(let i=0;i<candidateIds.length;i+=10){
      const batch=candidateIds.slice(i,i+10);
      const results=await Promise.all(batch.map(async id=>{
        if(rssById.has(id))return rssById.get(id);
        try{
          const r=await fetch(`https://www.youtube.com/watch?v=${id}&_=${Date.now()}`,{headers});
          if(!r.ok)return null;
          const h=await r.text();
          const date=(h.match(/"uploadDate"\s*:\s*"([^"]+)"/)||h.match(/"datePublished"\s*:\s*"([^"]+)"/)||h.match(/<meta[^>]+itemprop=["']datePublished["'][^>]+content=["']([^"']+)/i)||[])[1]||'';
          const title=(h.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)||h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'';
          if(!date)return null;
          return{id,title:clean(title).replace(/\s+-\s+YouTube\s*$/i,''),publishedAt:date};
        }catch{return null}
      }));
      items.push(...results.filter(Boolean));
    }
    const unique=new Map(items.map(x=>[x.id,x]));
    const latest=[...unique.values()].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,9);
    if(latest.length<9)throw new Error(`YouTube returned only ${latest.length} dated candidates`);
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:latest,live:true});
  }catch(error){
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=180');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.status(200).json({source:page,updatedAt:new Date().toISOString(),videos:fallback,live:false,fallback:true,warning:error.message});
  }
}
