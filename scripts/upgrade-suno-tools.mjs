import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const files=['command-center.html','prompt-architect.html','style-builder.html','lyrics-builder.html','controls.html','troubleshooter.html','workflow.html'];
for(const name of files){const file=path.join(root,'Suno',name);let html=await fs.readFile(file,'utf8');html=html.replaceAll('href="css/suno.css"','href="/css/suno.css"').replaceAll('href="css/command-center.css"','href="/css/command-center.css"').replaceAll('href="css/tools.css"','href="/css/tools.css"').replaceAll('src="js/suno.js"','src="/js/suno.js"').replaceAll('src="js/suno-tools.js"','src="/js/suno-tools.js"');if(!html.includes('href="/css/tools.css"'))html=html.replace('</head>','<link rel="stylesheet" href="/css/tools.css"></head>');await fs.writeFile(file,html,'utf8');}
console.log(`Hardened ${files.length} Suno interactive surfaces with clean-route asset paths.`);
