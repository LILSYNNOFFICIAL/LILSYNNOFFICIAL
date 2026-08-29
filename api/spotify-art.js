function norm(s){return String(s||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();}

function decodeHtml(s){return String(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');}

function extractCandidates(html){
  const text=decodeHtml(String(html||'').replace(/\\u002F/g,'/').replace(/\\\//g,'/').replace(/\\"/g,'"'));
  const patterns=[
    /https?:\\?\/\\?\/i\.scdn\.co\/image\/[a-zA-Z0-9_-]+/g,
    /https?:\\?\/\\?\/i\.scdn\.co\/image\/[a-zA-Z0-9_-]+\?[^"'<> ]*/g
  ];
  const out=[];
  for(const re of patterns){let m;while((m=re.exec(text)))out.push(m[0].replace(/\\\//g,'/').replace(/\\"/g,'"'));}
  return [...new Set(out)];
}

function scoreLocalImages(html,title){
  const source=decodeHtml(String(html||'').replace(/\\u002F/g,'/').replace(/\\\//g,'/'));
  const target=norm(title);
  const candidates=extractCandidates(source);
  if(!candidates.length)return null;
  const positions=[];
  const lower=source.toLowerCase();
  const raw=String(title||'').toLowerCase();
  let p=lower.indexOf(raw);
  while(p>=0){positions.push(p);p=lower.indexOf(raw,p+1);}
  const normalized=norm(source);
  if(!positions.length){
    const tokens=target.split(' ').filter(Boolean);
    let best=-1,bestScore=0;
    for(const token of tokens){const q=lower.indexOf(token);if(q>=0){const score=tokens.length>1?1:0.5;if(score>bestScore){best=q;bestScore=score;}}}
    if(best>=0)positions.push(best);
  }
  if(!positions.length)return candidates[0];
  let bestUrl=candidates[0],bestDistance=Infinity;
  for(const pos of positions){
    for(const url of candidates){
      const u=lower.indexOf(url.toLowerCase());
      if(u<0)continue;
      const d=Math.abs(u-pos);
      if(d<bestDistance){bestDistance=d;bestUrl=url;}
    }
  }
  return bestUrl;
}

async function spotifySearchArt(title){
  const q=encodeURIComponent(`LIL SYNN ${title}`);
  const urls=[
    `https://open.spotify.com/search/${q}/tracks`,
    `https://open.spotify.com/search/${q}`
  ];
  for(const url of urls){
    try{
      const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36','Accept':'text/html,application/xhtml+xml'}});
      if(!r.ok)continue;
      const html=await r.text();
      const art=scoreLocalImages(html,title);
      if(art)return art;
    }catch{}
  }
  return null;
}

export default async function handler(req,res){
  try{
    const titles=String(req.query?.titles||'').split('|').map(s=>s.trim()).filter(Boolean).slice(0,40);
    if(!titles.length)return res.status(400).json({error:'Missing titles'});
    const results=await Promise.all(titles.map(async title=>({title,art:await spotifySearchArt(title).catch(()=>null)})));
    res.setHeader('Cache-Control','public, s-maxage=21600, stale-while-revalidate=604800');
    return res.status(200).json(results);
  }catch(e){return res.status(500).json({error:'Spotify artwork lookup failed'});}
}
