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

const isLocalSunoHref = href => {
  if (!href || href.startsWith('#')) return false;
  try {
    const url = new URL(href, BASE_URL);
    return url.origin === BASE_ORIGIN && url.pathname.startsWith('/Suno/');
  } catch {
    return false;
  }
};

const forbiddenPublicHref = href => {
  if (!href) return false;
  const normalized = href.toLowerCase();
  return normalized.includes('/docs/') || normalized.endsWith('.md') || normalized.includes('github.com/') || normalized.includes('raw.githubusercontent.com/');
};

async function assertHealthyPage(page, route) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const onConsole = message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  };
  const onPageError = error => pageErrors.push(error.message);
  const onRequestFailed = request => failedRequests.push(`${request.url()} -> ${request.failure()?.errorText || 'failed'}`);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);

  const response = await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(350);

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

  test('all canonical routes render cleanly on mobile', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const page = await context.newPage();
    for (const route of ['/Suno/', '/Suno/create/', '/Suno/control/', '/Suno/produce/', '/Suno/fix-test/', '/Suno/research/', '/Suno/research/v6-experiment-lab.html', '/Suno/research/current-v6-capabilities.html', '/Suno/master/', '/Suno/audio_fix_v6/']) {
      await assertHealthyPage(page, route);
    }
    await context.close();
  });

  test('public Suno surface has no repository-document rabbit holes', async ({ page }) => {
    const queue = [...ENTRY_ALIASES, ...ROUTES];
    const visited = new Set();
    const violations = [];

    while (queue.length) {
      const route = queue.shift();
      if (visited.has(route)) continue;
      visited.add(route);
      const response = await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) continue;
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      for (const href of hrefs) {
        if (forbiddenPublicHref(href)) violations.push(`${route} -> ${href}`);
        if (!isLocalSunoHref(href)) continue;
        const url = new URL(href, BASE_URL);
        url.hash = '';
        url.search = '';
        if (!visited.has(url.pathname)) queue.push(url.pathname);
      }
    }

    expect(violations, `public repository-document links: ${violations.join('; ')}`).toEqual([]);
  });

  test('crawled internal Suno links resolve', async ({ page, request }) => {
    const queue = [...ENTRY_ALIASES, ...ROUTES];
    const visited = new Set();
    const failures = [];

    while (queue.length) {
      const route = queue.shift();
      if (visited.has(route)) continue;
      visited.add(route);
      const response = await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) {
        failures.push(`${route} -> ${response?.status() ?? 'NO_RESPONSE'}`);
        continue;
      }
      await page.waitForTimeout(200);
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      for (const href of hrefs) {
        if (!isLocalSunoHref(href)) continue;
        const url = new URL(href, BASE_URL);
        url.hash = '';
        url.search = '';
        const normalized = url.pathname;
        if (!visited.has(normalized)) queue.push(normalized);
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
      await page.waitForTimeout(200);
      const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      for (const href of hrefs) {
        if (!href || href.startsWith('#')) {
          if (!href) continue;
          const id = decodeURIComponent(href.slice(1));
          if (!id) continue;
          const count = await page.locator(`#${CSS.escape(id)}`).count();
          if (!count) failures.push(`${route} -> ${href}`);
          continue;
        }
        if (!isLocalSunoHref(href)) continue;
        const url = new URL(href, BASE_URL);
        const targetRoute = url.pathname;
        if (!url.hash) {
          if (!visited.has(targetRoute)) queue.push(targetRoute);
          continue;
        }
        const target = `${targetRoute}${url.hash}`;
        const targetResponse = await page.goto(absolute(target), { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!targetResponse || targetResponse.status() >= 400) {
          failures.push(`${route} -> ${href} (${targetResponse?.status() ?? 'NO_RESPONSE'})`);
          continue;
        }
        await page.waitForTimeout(150);
        const id = decodeURIComponent(url.hash.slice(1));
        const count = await page.locator(`#${CSS.escape(id)}`).count();
        if (!count) failures.push(`${route} -> ${href}`);
        await page.goto(absolute(route), { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(150);
        if (!visited.has(targetRoute)) queue.push(targetRoute);
      }
    }

    expect(failures, `broken internal anchors: ${failures.join('; ')}`).toEqual([]);
  });
});
