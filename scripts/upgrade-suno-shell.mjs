import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const file=path.join(root,'Suno','Suno_Guide.html');
let html=await fs.readFile(file,'utf8');
if(!html.includes('href="css/command-center.css"')) html=html.replace('</head>','<link rel="stylesheet" href="css/command-center.css"></head>');
if(!html.includes('href="css/tools.css"')) html=html.replace('</head>','<link rel="stylesheet" href="css/tools.css"></head>');
const navNeed='<a class="nav-command" href="/suno/command-center">COMMAND CENTER</a>';
if(!html.includes(navNeed)) html=html.replace('<a class="nav-complete" href="/suno/complete">COMPLETE GUIDE</a>',`${navNeed}<a class="nav-complete" href="/suno/complete">COMPLETE GUIDE</a>`);
if(!html.includes('id="command-center"')){
 const section=`<section class="command-preview section" id="command-center"><div class="section-head"><div><p class="eyebrow">06 / CREATOR TOOLS</p><h2>Build. Diagnose.<br><em>Produce.</em></h2></div><p>The knowledge base now has an interactive command center. Build structured prompts and styles, assemble lyrics architecture, choose control strategies, diagnose failures and map a production workflow.</p></div><div class="command-preview-grid"><a href="/suno/command-center"><b>OPEN THE COMMAND CENTER →</b><span>All six creator tools in one workspace.</span></a><a href="/suno/prompt-architect"><b>PROMPT ARCHITECT</b><span>Turn intent into prioritized direction.</span></a><a href="/suno/troubleshooter"><b>TROUBLESHOOTER</b><span>Start from the symptom, not a guess.</span></a></div></section>`;
 html=html.replace('<section class="closing section">',section+'<section class="closing section">');
}
await fs.writeFile(file,html,'utf8');
console.log('Upgraded Suno landing with command-center discovery surface.');
