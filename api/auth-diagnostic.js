const crypto=require('node:crypto');
function env(name){return process.env[name]||''}
module.exports=async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'METHOD_NOT_ALLOWED'});
  const email=env('ADMIN_EMAIL');
  const hash=env('ADMIN_PASSWORD_HASH');
  const secret=env('ADMIN_SESSION_SECRET');
  const parts=hash.split('$');
  let scryptValid=false;
  let saltBytes=0;
  let keyBytes=0;
  if(parts.length===3&&parts[0]==='scrypt'){
    try{
      const salt=Buffer.from(parts[1],'hex');
      const key=Buffer.from(parts[2],'hex');
      saltBytes=salt.length;
      keyBytes=key.length;
      scryptValid=saltBytes>=16&&keyBytes===64&&/^[0-9a-f]+$/i.test(parts[1])&&/^[0-9a-f]+$/i.test(parts[2]);
      if(!scryptValid)crypto.timingSafeEqual(Buffer.alloc(0),Buffer.alloc(0));
    }catch{}
  }
  return res.status(200).json({ok:true,productionAuth:{ADMIN_EMAIL:!!email,ADMIN_PASSWORD_HASH:!!hash,ADMIN_PASSWORD_HASH_FORMAT:scryptValid,ADMIN_PASSWORD_HASH_SALT_BYTES:saltBytes,ADMIN_PASSWORD_HASH_KEY_BYTES:keyBytes,ADMIN_SESSION_SECRET:!!secret}});
}
