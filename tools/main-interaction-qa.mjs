// Main-site interaction QA: things a page-load check cannot see.
//  - the hamburger drawer opens ABOVE the fixed header (CLOSE is the element hit at its own centre)
//  - CLOSE and Escape close the drawer
//  - exactly one <video> per page, owned by the template's #ls-bg-layer (single background contract)
//  - release-catalog.json flows render (homepage feeds, /releases grid, /release detail)
//  - no console errors / page errors
// Runs standalone (`node tools/main-interaction-qa.mjs`, QA_BASE_URL defaults to the qa-server)
// and is also called by tools/main-surface-qa.mjs, where its result is folded into QA_MAIN.
import { pathToFileURL } from 'node:url';

export const interactionRoutes = [
  { name: 'HOME', path: '/', menu: true, catalog: 'home' },
  { name: 'RELEASES', path: '/releases.html', menu: true, catalog: 'releases' },
  { name: 'RELEASE', path: '/release.html?id=Echoes%20of%20Us', menu: true, catalog: 'release' },
  { name: 'RELEASE PAGE', path: '/release/echoes-of-us', menu: true, catalog: 'release' },
  { name: 'GALLERY', path: '/gallery.html', menu: true },
  { name: 'PRESS', path: '/press.html', menu: true }
];
export const interactionViewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile', width: 390, height: 844 }
];

const probe = () => {
  const menu = document.getElementById('ls-template-menu');
  const close = document.getElementById('ls-template-menu-close');
  const header = document.querySelector('.ls-canonical-topbar');
  const out = { open: !!menu?.classList.contains('open') };
  if (menu && close) {
    const b = close.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    out.closeOnTop = !!hit && (hit === close || close.contains(hit));
    out.hit = hit ? `${hit.tagName.toLowerCase()}${hit.id ? '#' + hit.id : ''}${hit.className && typeof hit.className === 'string' ? '.' + hit.className.trim().split(/\s+/).join('.') : ''}` : null;
    out.menuZ = getComputedStyle(menu).zIndex;
    out.headerZ = header ? getComputedStyle(header).zIndex : null;
  }
  return out;
};

const videoProbe = () => {
  const vids = [...document.querySelectorAll('video')];
  return { count: vids.length, inBgLayer: vids.filter(v => v.closest('#ls-bg-layer')).length };
};

const catalogProbe = kind => {
  if (kind === 'home') return {
    ok: document.querySelectorAll('#newReleaseFeed > *').length > 0 && document.querySelectorAll('#releaseFeed > *').length > 0,
    detail: `newReleaseFeed=${document.querySelectorAll('#newReleaseFeed > *').length} releaseFeed=${document.querySelectorAll('#releaseFeed > *').length}`
  };
  if (kind === 'releases') {
    const n = document.querySelectorAll('#releases .release-card').length;
    return { ok: n > 0, detail: `release cards=${n}` };
  }
  if (kind === 'release') {
    const notFound = /SIGNAL NOT FOUND/.test(document.body.innerText);
    const h1 = document.querySelector('.release-detail h1')?.textContent?.trim() || '';
    return { ok: !notFound && h1.length > 0, detail: `h1="${h1.slice(0, 40)}"${notFound ? ' NOT FOUND' : ''}` };
  }
  return { ok: true, detail: '' };
};

export async function runMainInteractionQa(browser, baseUrl, log = console.log) {
  const baseOrigin = new URL(baseUrl).origin;
  const results = [];
  for (const route of interactionRoutes) {
    for (const vp of interactionViewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const errors = [];
      page.on('console', msg => {
        if (msg.type() !== 'error') return;
        const text = msg.text();
        if (/Failed to load resource/i.test(text)) return; // HTTP status is checked below, by origin
        errors.push(`console: ${text}`);
      });
      page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
      page.on('response', r => {
        const u = new URL(r.url());
        if (u.origin === baseOrigin && r.status() >= 400 && !u.pathname.startsWith('/_vercel/')) errors.push(`${u.pathname} -> HTTP ${r.status()}`);
      });
      const fails = [];
      try {
        await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'load', timeout: 30000 });
        await page.waitForFunction(() => document.documentElement.dataset.lsTemplateApplied === '1', null, { timeout: 15000 });
        await page.waitForTimeout(1200);

        const v = await page.evaluate(videoProbe);
        if (v.count !== 1 || v.inBgLayer !== 1) fails.push(`expected exactly 1 background video in #ls-bg-layer, found ${v.count} (${v.inBgLayer} in layer)`);

        if (route.catalog) {
          const c = await page.evaluate(catalogProbe, route.catalog);
          if (!c.ok) fails.push(`release-catalog flow did not render: ${c.detail}`);
        }

        if (route.menu) {
          await page.click('#ls-template-menu-open');
          await page.waitForTimeout(300);
          const opened = await page.evaluate(probe);
          if (!opened.open) fails.push('menu did not open');
          else if (!opened.closeOnTop) fails.push(`menu CLOSE is covered by ${opened.hit} (menu z ${opened.menuZ}, header z ${opened.headerZ})`);
          else {
            await page.click('#ls-template-menu-close', { timeout: 3000 });
            await page.waitForTimeout(200);
            if ((await page.evaluate(probe)).open) fails.push('CLOSE did not close the menu');
            await page.click('#ls-template-menu-open');
            await page.waitForTimeout(200);
            await page.keyboard.press('Escape');
            await page.waitForTimeout(200);
            if ((await page.evaluate(probe)).open) fails.push('Escape did not close the menu');
            // The scrim behind the drawer closes it on click (left edge, outside the drawer).
            await page.click('#ls-template-menu-open');
            await page.waitForTimeout(300);
            await page.mouse.click(4, Math.round(vp.height / 2));
            await page.waitForTimeout(300);
            if ((await page.evaluate(probe)).open) fails.push('clicking the scrim did not close the menu');
          }
          if (vp.width > 900) {
            // Desktop dropdowns open above the action bar and page content.
            await page.click('.ls-desktop-nav .ls-template-cat button');
            await page.waitForTimeout(200);
            const dd = await page.evaluate(() => {
              const m = document.querySelector('.ls-template-cat.open .ls-template-cat-menu');
              if (!m) return { ok: false, hit: 'no open dropdown' };
              const a = m.querySelector('a'); const r = a.getBoundingClientRect();
              const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
              return { ok: !!hit && (hit === a || a.contains(hit)), hit: hit ? hit.tagName + '.' + (hit.className || '') : null };
            });
            if (!dd.ok) fails.push(`desktop dropdown item is covered by ${dd.hit}`);
            await page.keyboard.press('Escape');
          }
        }
      } catch (error) {
        fails.push(error.message.split('\n')[0]);
      }
      fails.push(...errors);
      const pass = fails.length === 0;
      results.push({ route: route.name, path: route.path, viewport: vp.label, pass, fails });
      log(`${pass ? 'PASS' : 'FAIL'} | MAIN INTERACTION | ${route.name} ${route.path} @${vp.width} | menu-on-top, scrim, dropdown, one-bg-video${route.catalog ? ', catalog' : ''}`);
      for (const f of fails) log(`  ${f}`);
      await context.close();
    }
  }
  return { pass: results.every(r => r.pass), results };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const { chromium } = await import('@playwright/test');
  const baseUrl = (process.env.QA_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
  const browser = await chromium.launch({ headless: true });
  let summary;
  try { summary = await runMainInteractionQa(browser, baseUrl); }
  finally { await browser.close(); }
  console.log(`QA_MAIN_INTERACTION=${summary.pass ? 'PASS' : 'FAIL'}`);
  process.exit(summary.pass ? 0 : 1);
}
