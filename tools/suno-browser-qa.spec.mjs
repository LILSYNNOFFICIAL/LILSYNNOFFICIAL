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
  '/Suno/master/',
  '/Suno/audio_fix_v6/'
];

const isLocalSunoHref = href => {
  if (!href || href.startsWith('#')) return false;
  try {
    const url = new URL(href, BASE_URL);
    return url.origin === BASE_ORIGIN && url.pathname.startsWith('/Suno/');
  } catch {
    return false;
  }
};

async function assertHealthyPage(page, route) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  };
  const onPageError = error => pageErrors.push(error.message);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

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

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(horizontalOverflow, `${route} has unexpected horizontal overflow`).toBeLessThanOrEqual(2);

  page.off('console', onConsole);
  page.off('pageerror', onPageError);
}

test.describe('Suno V6 route and browser regression', () => {
  test('all canonical routes render cleanly on desktop', async ({ page }) => {
    for (const route of ROUTES) await assertHealthyPage(page, route);
  });

  test('all canonical routes render cleanly on mobile', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const page = await context.newPage();
    for (const route of ['/Suno/', '/Suno/create/', '/Suno/control/', '/Suno/produce/', '/Suno/fix-test/', '/Suno/research/', '/Suno/master/', '/Suno/audio_fix_v6/']) {
      await assertHealthyPage(page, route);
    }
    await context.close();
  });

  test('crawled internal Suno links resolve', async ({ page, request }) => {
    const queue = [...ROUTES];
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
});
