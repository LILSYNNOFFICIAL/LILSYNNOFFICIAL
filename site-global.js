(()=>{
const home=/^(\/|\/index\.html?)$/i.test(location.pathname);
function installIndexNavigation(){
  if(home)return;
  const nav=document.querySelector('header .nav');
  if(!nav)return;
  if(document.getElementById('sideMenu'))return;
  const ham=document.createElement('button');
  ham.id='hamburger';
  ham.className='text-5xl text-[#ff008f]';
  ham.style.marginLeft='.5rem';
  ham.type='button';
  ham.setAttribute('aria-label','Open navigation');
  ham.setAttribute('aria-controls','sideMenu');
  ham.setAttribute('aria-expanded','false');
  ham.textContent='☰';
  nav.appendChild(ham);

  const menu=document.createElement('div');
  menu.id='sideMenu';
  menu.className='fixed top-0 right-0 h-full w-72 bg-black/90 backdrop-blur-xl transform translate-x-full transition-transform duration-300 z-50';
  menu.setAttribute('aria-label','Site menu');
  menu.innerHTML=`
    <div class="flex justify-end p-6 shrink-0">
      <button id="closeMenu" class="text-3xl text-white hover:text-pink-500" aria-label="Close menu">&times;</button>
    </div>
    <nav class="flex flex-col gap-6 px-8 text-lg font-['Orbitron']">
      <a href="/" class="menu-link shrink-0">Home</a>
      <a href="/#music" class="menu-link shrink-0">Music</a>
      <a href="/releases.html" class="menu-link shrink-0">Releases</a>
      <a href="/#videos" class="menu-link shrink-0">Videos</a>
      <a href="/#about" class="menu-link shrink-0">About</a>
      <a href="https://lilsynnofficial.threadless.com/" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Merch</a>
      <a href="https://genius.com/artists/Lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Lyrics</a>
      <a href="/#contact" class="menu-link shrink-0">Contact</a>
      <div>
        <button id="socialsTrigger" class="menu-link flex justify-between w-full shrink-0" aria-expanded="false" aria-controls="socialsDropdown">Socials</button>
        <div id="socialsDropdown" class="hidden flex flex-col gap-3 mt-4 pl-4 text-base font-['Rajdhani']">
          <a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube</a>
          <a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="menu-link">Spotify</a>
          <a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">Apple Music</a>
          <a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer" class="menu-link">Instagram</a>
          <a href="https://x.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">X / Twitter</a>
          <a href="https://soundcloud.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">SoundCloud</a>
          <a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">TikTok</a>
          <a href="https://www.facebook.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">Facebook</a>
          <a href="https://discord.gg/ZUVsHuCAv" target="_blank" rel="noopener noreferrer" class="menu-link">Discord</a>
          <a href="https://github.com/orgs/Neurosyn-Dev/repositories" target="_blank" rel="noopener noreferrer" class="menu-link">GitHub</a>
        </div>
      </div>
    </nav>`;
  document.body.appendChild(menu);

  const style=document.createElement('style');
  style.id='index-navigation-secondary';
  style.textContent=`
    :root{--nav-height:72px;--nav-gap:.5rem}
    header{position:sticky;top:0;z-index:10}
    .nav{height:var(--nav-height);display:flex;align-items:center;justify-content:space-between}
    .nav #hamburger{margin-left:.5rem}
    #sideMenu{position:fixed;top:0;right:0;left:auto;bottom:auto;height:100%;width:18rem;z-index:60;overflow:hidden}
    #sideMenu>nav{max-height:calc(100vh - 88px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain}
    @media(min-width:768px){#sideMenu>nav{height:calc(100vh - 88px);min-height:0;overflow:hidden}#sideMenu>nav>div:has(#socialsDropdown){flex:1 1 auto;min-height:0;display:flex;flex-direction:column}#sideMenu #socialsDropdown{flex:1 1 auto;min-height:0;max-height:none;overflow-y:scroll;overflow-x:hidden;overscroll-behavior:contain;padding-right:.75rem;padding-bottom:1.5rem;scrollbar-width:auto;scrollbar-color:#ff008f #111}#sideMenu #socialsDropdown::-webkit-scrollbar{width:10px}#sideMenu #socialsDropdown::-webkit-scrollbar-track{background:#111;border-radius:8px}#sideMenu #socialsDropdown::-webkit-scrollbar-thumb{background:#ff008f;border-radius:8px;border:2px solid #111}#sideMenu #socialsDropdown::-webkit-scrollbar-thumb:hover{background:#ff4fd8}}
    @media(max-width:640px){#sideMenu{width:min(86vw,360px)}#sideMenu>nav{max-height:calc(100vh - 82px);padding-bottom:1.5rem}.nav #hamburger{font-size:1.4rem;height:44px}}
  `;
  document.head.appendChild(style);

  const script=document.createElement('script');
  script.src='/script.js';
  script.defer=false;
  document.body.appendChild(script);
}
function init(){installIndexNavigation();}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();