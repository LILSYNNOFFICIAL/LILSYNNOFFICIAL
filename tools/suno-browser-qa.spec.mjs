import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:4173';
const BASE_ORIGIN = new URL(BASE_URL).origin;
const absolute = route => new URL(route, BASE_URL).toString();

const ROUTES = [
  '/Suno/',
  '/Suno/create/',
  '/Suno/create/prompt-lab.html',
  '/Suno/create/vocal-engineering.html',
  '/Suno/control/',
  '/Suno/control/editor.html',
  '/Suno/control/studio.html',
  '/Suno/produce/',
  '/Suno/produce/audio-engineering.html',
  '/Suno/fix-test/',
  '/Suno/research/',
  '/Suno/research/v5-to-v6.html',
  '/Suno/research/controlled-experimentation.html',
  '/Suno/research/v6-experiment-lab.html',
  '/Suno/research/current-v6-capabilities.html',
  '/Suno/master/',
  '/Suno/audio_fix_v6/'
];

const ENTRY_ALIASES = ['/Suno', '/Suno/Suno_Guide', '/Suno/Suno_Guide/'];

const resolveHref = href => {
  if (!href || href.startsWith('#')) return null;
  try { return new URL(href, BASE_URL); } catch { return null; }
};

const isLocalSunoHref = href => {
  const url = resolveHref(href);
  return Boolean(url && url.origin === BASE_ORIGIN && url.pathname.startsWith('/Suno/'));
};

const forbiddenPublicHref = href => {
  const url = resolveHref(href);
  if (!url) return false;
  const normalized = url.href.toLowerCase();
  return normalized.includes('/docs/') ||
    normalized.includes('/suno/content/') ||
    normalized.endsWith('.md') ||
    normalized.includes('github.com/') ||
    normalized.includes('raw.githubusercontent.com/');
};

async function assertHealthyPage(page, route) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const onConsole = message => { if (message.type() === 'error') consoleErrors.push(message.text()); };
  const onPageError = error => pageErrors.push(error.message);
  const onRequestFailed = request => failedRequests.push(`${request.url()} -> ${request.failure()?.errorText || 'failed'}`);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);
  const response = await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(500);
  expect(response, `${route} returned no response`).not.toBeNull();
  expect(response.status(), `${route} HTTP status`).toBeLessThan(400);
  await expect(page.locator('body')).not.toBeEmpty();
  const bodyText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  expect(bodyText.length, `${route} rendered no meaningful text`).toBeGreaterThan(80);
  expect(bodyText, `${route} contains the old guide loading failure`).not.toContain('No configured guide sections matched the source documents');
  expect(bodyText, `${route} contains a guide loading error`).not.toContain('Guide loading error');
  expect(consoleErrors, `${route} browser console errors`).toEqual([]);
  expect(pageErrors, `${route} page errors`).toEqual([]);
  expect(failedRequests, `${route} failed browser requests`).toEqual([]);
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(horizontalOverflow, `${route} has unexpected horizontal overflow`).toBeLessThanOrEqual(2);
  page.off('console', onConsole);
  page.off('pageerror', onPageError);
  page.off('requestfailed', onRequestFailed);
}

test.describe('Suno V6 route and browser regression', () => {
  test('entry aliases resolve to the canonical Suno GUI', async ({ page }) => {
    for (const route of ENTRY_ALIASES) {
      await assertHealthyPage(page, route);
      expect(new URL(page.url()).pathname, `${route} canonical destination`).toMatch(/^\/Suno\/(?:index\.html)?$/);
    }
  });

  test('all canonical routes render cleanly on desktop', async ({ page }) => {
    for (const route of ROUTES) await assertHealthyPage(page, route);
  });

  test('current reference and dedicated Studio/editor guides expose the current baseline', async ({ page }) => {
    await page.goto(absolute('/Suno/master/'), { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);
    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
    expect(text).toContain('CURRENT / SEPTEMBER 2026');
    expect(text).toContain('SUNO STUDIO 2.0');
    expect(text).toContain('Take Lanes');
    expect(text).toContain('Advanced Split');
    expect(text).toContain('v6-wild');
    for (const route of ['/Suno/control/editor.html', '/Suno/control/studio.html']) {
      await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(200);
      const pageText = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      expect(pageText).toContain('September 2026');
      expect(pageText).not.toContain('Studio 1.x is the current');
    }
  });

  test('all canonical routes render cleanly on mobile', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const page = await context.newPage();
    for (const route of ['/Suno/', '/Suno/create/', '/Suno/control/', '/Suno/control/editor.html', '/Suno/control/studio.html', '/Suno/produce/', '/Suno/fix-test/', '/Suno/research/', '/Suno/research/v6-experiment-lab.html', '/Suno/research/current-v6-capabilities.html', '/Suno/master/', '/Suno/audio_fix_v6/']) await assertHealthyPage(page, route);
    await context.close();
  });

  test('every rendered Suno link is public-safe', async ({ page }) => {
    const queue = [...ENTRY_ALIASES, ...ROUTES];
    const visited = new Set();
    const violations = [];
    while (queue.length) {
      const route = queue.shift();
      if (visited.has(route)) continue;
      visited.add(route);
      const response = await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) continue;
      await page.waitForTimeout(500);
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      for (const href of hrefs) {
        if (forbiddenPublicHref(href)) violations.push(`${route} -> ${href}`);
        const url = resolveHref(href);
        if (url?.origin === BASE_ORIGIN && url.pathname.startsWith('/Suno/') && !visited.has(url.pathname)) queue.push(url.pathname);
      }
    }
    expect(violations, `forbidden/dead-looking public links: ${violations.join('; ')}`).toEqual([]);
  });

  test('all crawled internal Suno links resolve', async ({ page, request }) => {
    const queue = [...ENTRY_ALIASES, ...ROUTES];
    const visited = new Set();
    const failures = [];
    while (queue.length) {
      const route = queue.shift();
      if (visited.has(route)) continue;
      visited.add(route);
      const response = await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) { failures.push(`${route} -> ${response?.status() ?? 'NO_RESPONSE'}`); continue; }
      await page.waitForTimeout(500);
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      for (const href of hrefs) {
        const url = resolveHref(href);
        if (!url || url.origin !== BASE_ORIGIN || !url.pathname.startsWith('/Suno/')) continue;
        url.hash = '';
        url.search = '';
        if (!visited.has(url.pathname)) queue.push(url.pathname);
      }
    }
    for (const route of visited) {
      const response = await request.get(absolute(route));
      if (response.status() >= 400) failures.push(`${route} -> ${response.status()}`);
    }
    expect(failures, `broken crawled routes: ${failures.join('; ')}`).toEqual([]);
    expect(visited.size, 'crawler discovered at least the canonical Suno surface').toBeGreaterThanOrEqual(ROUTES.length);
  });

  test('all crawled internal Suno anchors resolve', async ({ page }) => {
    const queue = [...ENTRY_ALIASES, ...ROUTES];
    const visited = new Set();
    const failures = [];
    while (queue.length) {
      const route = queue.shift();
      if (visited.has(route)) continue;
      visited.add(route);
      const response = await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) continue;
      await page.waitForTimeout(500);
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      for (const href of hrefs) {
        const url = resolveHref(href);
        if (!url || url.origin !== BASE_ORIGIN || !url.pathname.startsWith('/Suno/')) continue;
        if (!url.hash) { if (!visited.has(url.pathname)) queue.push(url.pathname); continue; }
        const targetRoute = url.pathname;
        const targetResponse = await page.goto(absolute(`${targetRoute}${url.hash}`), { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!targetResponse || targetResponse.status() >= 400) {
          failures.push(`${route} -> ${href} (${targetResponse?.status() ?? 'NO_RESPONSE'})`);
          continue;
        }
        await page.waitForTimeout(150);
        const id = decodeURIComponent(url.hash.slice(1));
        const count = await page.locator(`#${CSS.escape(id)}`).count();
        if (!count) failures.push(`${route} -> ${href}`);
        await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(200);
        if (!visited.has(targetRoute)) queue.push(targetRoute);
      }
    }
    expect(failures, `broken internal anchors: ${failures.join('; ')}`).toEqual([]);
  });
});