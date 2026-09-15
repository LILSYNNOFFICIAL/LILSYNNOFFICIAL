import fs from 'node:fs';
import { chromium } from '@playwright/test';

const sourceChecks = [
  ['command/index.html', fs.existsSync('command/index.html')],
  ['command/admin/index.html', fs.existsSync('command/admin/index.html')],
  ['command/admin/admin.js', fs.existsSync('command/admin/admin.js')],
  ['Suno/index.html', fs.existsSync('Suno/index.html')],
  ['vercel.json', fs.existsSync('vercel.json')],
  ['vercel.json /Suno redirect contract', fs.existsSync('vercel.json') && fs.readFileSync('vercel.json', 'utf8').includes('"/Suno"')],
  ['vercel.json /Suno/Suno_Guide redirect contract', fs.existsSync('vercel.json') && fs.readFileSync('vercel.json', 'utf8').includes('/Suno/Suno_Guide')],
  ['vercel.json /command/admin rewrite contract', fs.existsSync('vercel.json') && fs.readFileSync('vercel.json', 'utf8').includes('/command/admin')]
];
for (const [name, pass] of sourceChecks) console.log(`${pass ? 'PASS' : 'FAIL'} | SOURCE | ${name}`);
if (sourceChecks.some(([, pass]) => !pass)) process.exit(1);

const baseUrl = (process.env.QA_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const routes = [
  { name: 'MAIN', path: '/' },
  { name: 'COMMAND', path: '/command/' },
  { name: 'ADMIN', path: '/command/admin/' },
  { name: 'SUNO', path: '/Suno/' },
  { name: 'SUNO CREATE', path: '/Suno/create/' },
  { name: 'SUNO CONTROL', path: '/Suno/control/' },
  { name: 'SUNO PRODUCE', path: '/Suno/produce/' },
  { name: 'SUNO FIX/TEST', path: '/Suno/fix-test/' },
  { name: 'SUNO RESEARCH', path: '/Suno/research/' },
  { name: 'SUNO MASTER', path: '/Suno/master/' },
  { name: 'SUNO AUDIO FIX', path: '/Suno/audio_fix_v6/' }
];

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const route of routes) {
    const page = await browser.newPage();
    const errors = [];
    const failures = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
    page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
    page.on('requestfailed', req => {
      const url = new URL(req.url());
      if (url.origin === new URL(baseUrl).origin) failures.push(`${req.url()} -> ${req.failure()?.errorText || 'failed'}`);
    });

    let status = 0;
    let bodyLength = 0;
    let failure = null;
    try {
      const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = response?.status() ?? 0;
      await page.waitForTimeout(350);
      bodyLength = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim().length;
      if (status >= 400 || status === 0) failure = `HTTP ${status}`;
      else if (bodyLength < 30) failure = `body too small (${bodyLength} chars)`;
      else if (errors.length) failure = errors[0];
      else if (failures.length) failure = failures[0];
    } catch (error) {
      failure = error.message;
    }

    results.push({ ...route, pass: !failure, status, bodyLength, errors, failures, failure });
    await page.close();
  }
} finally {
  await browser.close();
}

for (const result of results) {
  console.log(`${result.pass ? 'PASS' : 'FAIL'} | ${result.name} | ${result.path} | HTTP ${result.status} | body ${result.bodyLength}`);
  if (result.failure) console.log(`  ${result.failure}`);
}

const grouped = {
  MAIN: results.find(r => r.name === 'MAIN')?.pass ?? false,
  COMMAND: results.find(r => r.name === 'COMMAND')?.pass ?? false,
  ADMIN: results.find(r => r.name === 'ADMIN')?.pass ?? false,
  SUNO: results.filter(r => r.name.startsWith('SUNO')).every(r => r.pass)
};

console.log(`QA_MAIN=${grouped.MAIN ? 'PASS' : 'FAIL'}`);
console.log(`QA_COMMAND=${grouped.COMMAND ? 'PASS' : 'FAIL'}`);
console.log(`QA_ADMIN=${grouped.ADMIN ? 'PASS' : 'FAIL'}`);
console.log(`QA_SUNO=${grouped.SUNO ? 'PASS' : 'FAIL'}`);
console.log(`QA_OVERALL=${Object.values(grouped).every(Boolean) ? 'PASS' : 'FAIL'}`);

process.exit(Object.values(grouped).every(Boolean) ? 0 : 1);
