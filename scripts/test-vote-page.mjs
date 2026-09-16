import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../vote.html',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../site-shell.js',import.meta.url),'utf8');
const vercel=fs.readFileSync(new URL('../vercel.json',import.meta.url),'utf8');

assert.match(html,/VOTE 4 LIL SYNN/i,'vote page must use the requested title');
assert.match(html,/orbiiit\.com\/en\/participants\/8fd990f6-54eb-4a0c-9b6e-851526c04c41\?contestId=f85717be-ba9b-4857-b885-ccbbb9a45757/i,'vote CTA must use the supplied Orbiiit participant URL');
assert.match(html,/FREE VOTE|FREE OPTION/i,'page must clearly expose the free voting option');
assert.match(html,/PAID VOTES|PAY FOR VOTES/i,'page must explain the paid-vote option');
assert.match(html,/menuPanel|menuOpen/,'page must retain the main navigation menu');
assert.match(html,/<footer/i,'page must retain the site footer');
assert.doesNotMatch(html,/HERO_BG_WEBM\.webm/,'vote page must not load the main hero WebM');
assert.match(html,/site-shell\.js/,'vote page must load the canonical site shell');
assert.match(shell,/LS_BG_STARS\.webm/,'canonical site shell must provide the stars background');
assert.match(vercel,/"source":"\/vote"[^\n]*"destination":"\/vote\.html"/,'/vote must rewrite to vote.html');

console.log('vote-page assertions: PASS');
