function norm(s){return String(s||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
function extractCandidates(html){
  const out=[];
  const text=html.replace(/\\u002F/g,'/').replace(/\\"/g,'"');
  const re=/(?:https?:)?\\?\/\\?\/i\.scdn\.co\/image\/[a-zA-Z0-9_-]+)/g;
  let m;
  while((m=re.exec(text))) out.push(m[0].replace(/^\\?\//,'https://').replace(/^https:\/\/https:\/\//,'https://'));
  return [...new Set(out)];
}
async function spotifySearchArt(title){
  const q=encodeURIComponent(`LIL SYNN ${title}`);
  const r=await fetch(`https://open.spotify.com/search/${q}`,{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'} });
  if(!r.ok) return null;
  const html=await r.text();
  const target=norm(title);
  const candidates=extractCandidates(html);
  if(!candidates.length) return null;
  // Spotify's search document contains cover URLs in result order. Prefer the first
  // image after a matching title; otherwise return the first Spotify CDN image.
  const pos=Math.max(html.toLowerCase().indexOf(title.toLowerCase()),html.toLowerCase().indexOf(target));
  if(pos>=0){
    const window=html.slice(Math.max(0,pos-12000),pos+12000);
    const local=extractCandidates(window);
    if(local.length) return local[0];
  }
  return candidates[0];
}
export default async function handler(req,res){
  try{
    const titles=String(req.query?.titles||'').split('|').map(s=>s.trim()).filter(Boolean).slice(0,40);
    if(!titles.length) return res.status(400).json({error:'Missing titles'});
    const results=await Promise.all(titles.map(async title=>({title,art:await spotifySearchArt(title).catch(()=>null)})));
    res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(results);
  }catch(e){return res.status(500).json({error:'Spotify artwork lookup failed'});}
}
