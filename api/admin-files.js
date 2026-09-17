const crypto=require('node:crypto');
const REPO='LILSYNNOFFICIAL/LILSYNNOFFICIAL';
const COOKIE='ls_admin_session';
const ALLOWED=/\.(html?|css|js|mjs|json|txt|md)$/i;
const BLOCKED=/^(?:\.github|node_modules|\.git)(?:\/|$)|(?:^|\/)\.env(?:\.|$)/i;

function env(name){return process.env[name]||''}
function json(res,status,payload){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(payload))}
function sign(v){return crypto.createHmac('sha256',env('ADMIN_SESSION_SECRET')).update(v).digest('base64url')}
function validSession(req){
  const raw=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));
  if(!raw||!env('ADMIN_SESSION_SECRET'))return null;
  const token=decodeURIComponent(raw.slice(COOKIE.length+1));
  const [body,sig]=token.split('.');
  if(!body||!sig)return null;
  const expected=sign(body),a=Buffer.from(sig),b=Buffer.from(expected);
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;
  try{const p=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));return p.exp>Date.now()?p:null}catch{return null}
}
function isAllowedPath(path){
  const p=String(path||'').replace(/^\/+/, '');
  return !!p && p.length<=300 && !p.includes('\\') && !p.includes('..') && !BLOCKED.test(p) && ALLOWED.test(p);
}
async function gh(path,opts={}){
  const token=env('GITHUB_TOKEN');
  if(!token)throw new Error('GITHUB_TOKEN is not configured');
  const r=await fetch('https://api.github.com/repos/'+REPO+path,{...opts,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:'Bearer '+token,'Content-Type':'application/json',...(opts.headers||{})}});
  const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={message:text}};
  if(!r.ok)throw new Error(`GitHub ${r.status}: ${data.message||'request failed'}`);return data;
}
async function body(req){if(req.body!==undefined&&req.body!==null)return typeof req.body==='string'?JSON.parse(req.body):req.body;return await new Promise((resolve,reject)=>{const a=[];req.on('data',c=>a.push(c));req.on('end',()=>{try{resolve(JSON.parse(Buffer.concat(a).toString('utf8')||'{}'))}catch(e){reject(e)}});req.on('error',reject)})}
function requireAdmin(req,res){const s=validSession(req);if(!s){json(res,401,{ok:false,error:'AUTH_REQUIRED'});return null}return s}

module.exports=async function handler(req,res){
  if(!requireAdmin(req,res))return;
  try{
    const action=String(req.query?.action||'list');
    if(action==='list'&&req.method==='GET'){
      const tree=await gh('/git/trees/main?recursive=1');
      const files=(tree.tree||[]).filter(x=>x.type==='blob'&&isAllowedPath(x.path)).map(x=>({path:x.path,sha:x.sha,size:x.size||0}));
      return json(res,200,{ok:true,files,truncated:!!tree.truncated});
    }
    if(action==='read'&&req.method==='GET'){
      const path=String(req.query?.path||'');
      if(!isAllowedPath(path))return json(res,400,{ok:false,error:'INVALID_FILE_PATH'});
      const file=await gh('/contents/'+path.split('/').map(encodeURIComponent).join('/'));
      if(file.type!=='file')return json(res,400,{ok:false,error:'NOT_A_FILE'});
      return json(res,200,{ok:true,path,sha:file.sha,content:Buffer.from(file.content,'base64').toString('utf8'),size:file.size||0});
    }
    if(action==='save'&&req.method==='POST'){
      const p=await body(req);const path=String(p.path||'');
      if(!isAllowedPath(path))return json(res,400,{ok:false,error:'INVALID_FILE_PATH'});
      if(typeof p.content!=='string'||p.content.length>2*1024*1024)return json(res,413,{ok:false,error:'FILE_TOO_LARGE_OR_INVALID'});
      const current=await gh('/contents/'+path.split('/').map(encodeURIComponent).join('/'));
      if(p.sha&&p.sha!==current.sha)return json(res,409,{ok:false,error:'FILE_CONFLICT',currentSha:current.sha});
      const updated=await gh('/contents/'+path.split('/').map(encodeURIComponent).join('/'),{method:'PUT',body:JSON.stringify({message:`designer: save ${path}`,content:Buffer.from(p.content,'utf8').toString('base64'),sha:current.sha})});
      return json(res,200,{ok:true,path,sha:updated.content?.sha||updated.commit?.sha||'',commitUrl:updated.commit?.html_url||''});
    }
    return json(res,404,{ok:false,error:'UNKNOWN_ACTION'});
  }catch(e){console.error('admin-files error',e);return json(res,500,{ok:false,error:'ADMIN_FILE_OPERATION_FAILED',detail:process.env.NODE_ENV==='development'?e.message:undefined})}
};
module.exports.isAllowedPath=isAllowedPath;
