const REPO='LILSYNNOFFICIAL/LILSYNNOFFICIAL';
const API=`https://api.github.com/repos/${REPO}`;
const $=id=>document.getElementById(id);

export function normalizeSignal(name,state,detail,source=''){return {name,state:['PASS','WARN','FAIL','UNKNOWN'].includes(state)?state:'UNKNOWN',detail:String(detail||'No detail available.'),source};}

function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function stateClass(state){return String(state).toLowerCase();}
function relative(value){if(!value)return 'time unavailable';const diff=Date.now()-new Date(value).getTime();if(!Number.isFinite(diff))return 'time unavailable';const m=Math.max(0,Math.round(diff/60000));if(m<1)return 'just now';if(m<60)return `${m}m ago`;const h=Math.round(m/60);if(h<48)return `${h}h ago`;return `${Math.round(h/24)}d ago`;}
function signalCard(s){return `<article class="signal card"><div class="signal-head"><span class="signal-name">${escapeHtml(s.name)}</span><span class="signal-status ${stateClass(s.state)}">${s.state}</span></div><p>${escapeHtml(s.detail)}</p>${s.source?`<a href="${escapeHtml(s.source)}" target="_blank" rel="noopener noreferrer">Source ↗</a>`:''}</article>`;}

export async function runLocalHealthChecks(){
  const out=[];
  const probes=[['Main Site Health','/site-health.html','Main browser health dashboard'],['Suno Health','/Suno/health.html','Suno browser health dashboard'],['Suno Guide','/Suno/Suno_Guide.html','Canonical Suno entry point']];
  for(const [name,url,detail] of probes){try{const r=await fetch(url,{cache:'no-store'});out.push(normalizeSignal(name,r.ok?'PASS':'WARN',r.ok?`${detail} is reachable.`:`HTTP ${r.status} returned; main systems remain independent.`,url));}catch(e){out.push(normalizeSignal(name,'WARN',`${detail} could not be reached from this browser: ${e.message}`,url));}}
  return out;
}

async function githubJson(path){const r=await fetch(`${API}${path}`,{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});if(!r.ok)throw new Error(`GitHub HTTP ${r.status}`);return r.json();}
export async function loadGitHubSignals(){
  try{
    const [repo,runs,commits]=await Promise.all([githubJson(''),githubJson('/actions/runs?per_page=6'),githubJson('/commits?sha=main&per_page=6')]);
    const failures=runs.workflow_runs.filter(r=>['failure','cancelled','timed_out','action_required'].includes(r.conclusion));
    const ci=normalizeSignal('GitHub Actions',failures.length?'WARN':'PASS',failures.length?`${failures.length} recent run(s) need attention.`:`Recent workflow runs show no failed conclusions.`,`${repo.html_url}/actions`);
    return {repo,runs:runs.workflow_runs,commits,ci};
  }catch(error){return {repo:null,runs:[],commits:[],ci:normalizeSignal('GitHub Actions','UNKNOWN',`GitHub telemetry unavailable: ${error.message}`,`${API}/actions`)};}
}

function renderSignalCollection(signals){$('signals').innerHTML=signals.map(signalCard).join('');}
function setMetric(id,state,detail){$(id).textContent=state;$(id).className=stateClass(state)+'-text';$(id.replace('state','detail')).textContent=detail;}
function renderRuns(runs){
  if(!runs.length){$('runs').innerHTML='<p class="empty">No workflow telemetry available.</p>';return;}
  $('runs').innerHTML=runs.slice(0,6).map(r=>{const state=r.conclusion==='success'?'PASS':r.conclusion==='failure'?'FAIL':r.conclusion?'WARN':'UNKNOWN';return `<a class="run" href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener noreferrer"><span class="mini-dot ${stateClass(state)}"></span><span class="run-main"><b>${escapeHtml(r.name||r.workflow_id||'Workflow run')}</b><small>${escapeHtml(r.head_branch||'unknown branch')} · ${relative(r.updated_at)}</small></span><span class="run-state ${stateClass(state)}-text">${state}</span></a>`}).join('');
}
function renderActivity(commits){
  if(!commits.length){$('activity').innerHTML='<p class="empty">No repository activity available.</p>';return;}
  $('activity').innerHTML=commits.slice(0,6).map(c=>`<a class="activity" href="${escapeHtml(c.html_url)}" target="_blank" rel="noopener noreferrer"><span class="activity-code">${escapeHtml(c.sha.slice(0,7))}</span><span class="activity-main"><b>${escapeHtml(c.commit.message.split('\n')[0])}</b><small>${escapeHtml(c.commit.author?.name||c.author?.login||'Unknown author')} · ${relative(c.commit.author?.date)}</small></span></a>`).join('');
}
function renderDiagnostics(signals){
  const issues=signals.filter(s=>s.state==='FAIL'||s.state==='WARN'||s.state==='UNKNOWN');
  $('diagnostics').innerHTML=issues.length?issues.map(s=>`<div class="diag"><span class="diag-icon">${s.state==='FAIL'?'◆':s.state==='WARN'?'▲':'●'}</span><div><b class="${stateClass(s.state)}-text">${escapeHtml(s.name)} · ${s.state}</b><p>${escapeHtml(s.detail)}</p></div></div>`).join(''):'<p class="empty">All monitored signals are reporting cleanly.</p>';
}

async function run(){
  $('refresh').disabled=true;$('hero-status').innerHTML='<span class="status-dot unknown"></span><span><b>REFRESHING</b><small>Gathering authoritative signals…</small></span>';
  const local=await runLocalHealthChecks();
  const gh=await loadGitHubSignals();
  const signals=[...local,gh.ci,normalizeSignal('Repository',gh.repo?'PASS':'UNKNOWN',gh.repo?`${gh.repo.default_branch} is the default branch; repository is public.`:'Repository metadata unavailable.',gh.repo?.html_url||`https://github.com/${REPO}`),normalizeSignal('Recent Commits',gh.commits.length?'PASS':'UNKNOWN',gh.commits.length?`${gh.commits.length} recent commit records loaded.`:'Commit activity unavailable.',`https://github.com/${REPO}/commits/main`)];
  renderSignalCollection(signals);renderRuns(gh.runs);renderActivity(gh.commits);renderDiagnostics(signals);
  const bad=signals.filter(s=>s.state==='FAIL').length,warn=signals.filter(s=>s.state==='WARN').length,unknown=signals.filter(s=>s.state==='UNKNOWN').length;
  const overall=bad?'FAIL':warn?'WARN':unknown?'UNKNOWN':'PASS';
  const score=overall==='PASS'?100:overall==='WARN'?82:overall==='FAIL'?45:0;
  $('overall').textContent=overall;$('overall-detail').textContent=`${signals.length} signals observed · ${bad} failures · ${warn} warnings · ${unknown} unknown`;$('score').textContent=score?`${score}%`:'—';
  $('orb').classList.remove('pass','warn','fail','unknown');$('orb').classList.add(stateClass(overall));
  setMetric('main-state',local[0]?.state||'UNKNOWN',local[0]?.detail||'Unavailable.');setMetric('suno-state',local[1]?.state||'UNKNOWN',local[1]?.detail||'Unavailable.');setMetric('github-state',gh.ci.state,gh.ci.detail);
  $('hero-status').innerHTML=`<span class="status-dot ${stateClass(overall)}"></span><span><b>${overall==='PASS'?'OPERATIONAL':overall==='WARN'?'ATTENTION REQUIRED':overall}</b><small>Observed ${new Date().toLocaleString()}</small></span>`;$('last-updated').textContent=new Date().toLocaleString();$('freshness').textContent=`LAST OBSERVED · ${new Date().toLocaleTimeString()}`;$('refresh').disabled=false;
}
$('refresh').addEventListener('click',run);run();
