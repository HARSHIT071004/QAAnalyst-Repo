const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase1() {
  console.log('\n=== PHASE 1: PAGE AVAILABILITY ===');
  const results = { pages: [], consoleErrors: [] };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') results.consoleErrors.push(msg.text());
  });

  for (const p of config.PAGES) {
    const url = config.BASE_URL + p.path;
    const start = Date.now();
    try {
      const resp = await safeGoto(page, url);
      const loadTime = Date.now() - start;
      const title = await page.title();

      results.pages.push({
        url, name: p.name, status: resp.status(), loadTime,
        title, success: true
      });
      console.log(`  ✓ ${p.name}: ${resp.status()} (${loadTime}ms)`);
    } catch (e) {
      results.pages.push({
        url, name: p.name, status: 0, loadTime: Date.now() - start,
        success: false, error: e.message.substring(0, 200)
      });
      console.log(`  ✗ ${p.name}: FAILED`);
    }
  }

  await context.close();
  await browser.close();

  saveResults('phase1-page-availability.json', results);
  return results;
}

module.exports = phase1;

if (require.main === module) phase1().catch(console.error);
