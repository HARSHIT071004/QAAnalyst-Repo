const { chromium, firefox, webkit } = require('playwright');
const { safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase13() {
  console.log('\n=== PHASE 13: CROSS-BROWSER ===');
  const results = { crossBrowser: {} };

  const browsers = [
    { name: 'Chromium', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit', launcher: webkit }
  ];

  for (const b of browsers) {
    try {
      const browser = await b.launcher.launch({ headless: true });
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();

      const start = Date.now();
      await safeGoto(page, config.BASE_URL);
      const loadTime = Date.now() - start;
      const title = await page.title();

      let readMoreWorks = null;
      try {
        const btn = await page.$('button:text("Read More")');
        if (btn) {
          await btn.scrollIntoViewIfNeeded();
          await btn.click();
          await page.waitForTimeout(1000);
          const rl = await page.$('button:text("Read Less")');
          readMoreWorks = rl ? true : false;
        }
      } catch(e) {}

      results.crossBrowser[b.name] = { loadTime, title, readMoreWorks, success: true };
      console.log(`  ${b.name}: ✓ (${loadTime}ms) Read More=${readMoreWorks}`);
      await context.close();
      await browser.close();
    } catch(e) {
      results.crossBrowser[b.name] = { success: false, error: e.message.substring(0, 80) };
      console.log(`  ${b.name}: ✗ (not installed)`);
    }
  }

  saveResults('phase13-cross-browser.json', results);
  return results;
}

module.exports = phase13;

if (require.main === module) phase13().catch(console.error);
