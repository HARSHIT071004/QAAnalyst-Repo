const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase12() {
  console.log('\n=== PHASE 12: PERFORMANCE ===');
  const results = { performance: {} };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  for (const p of config.PAGES.slice(0, 4)) {
    try {
      const start = Date.now();
      await safeGoto(page, config.BASE_URL + p.path, { waitUntil: 'load' });
      const loadTime = Date.now() - start;

      const m = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        return {
          ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
          domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
          loadEvent: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
          fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null,
          resourceCount: performance.getEntriesByType('resource').length
        };
      });

      results.performance[p.name] = { loadTime, ...m };
      console.log(`  ${p.name}: load=${loadTime}ms ttfb=${m.ttfb}ms`);
    } catch(e) {
      console.log(`  ${p.name}: ERROR`);
    }
  }

  await context.close();
  await browser.close();

  saveResults('phase12-performance.json', results);
  return results;
}

module.exports = phase12;

if (require.main === module) phase12().catch(console.error);
