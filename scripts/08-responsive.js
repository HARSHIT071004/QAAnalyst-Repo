const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');
const viewports = require('../config/viewports');

async function phase8() {
  console.log('\n=== PHASE 8: MOBILE RESPONSIVENESS ===');
  const results = { responsive: {} };

  const browser = await launchBrowser();

  for (const vp of viewports.VIEWPORTS) {
    results.responsive[vp.name] = [];
    const context = await createContext(browser, { width: vp.width, height: vp.height });
    const page = await context.newPage();

    for (const p of config.PAGES.slice(0, 5)) {
      try {
        await safeGoto(page, config.BASE_URL + p.path);
        await page.waitForTimeout(2000);

        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        const overflowAmount = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth
        );

        let hamburgerWorks = null;
        if (vp.width < 768) {
          try {
            const hamburger = await page.$('button[aria-label*="menu" i]');
            if (hamburger && await hamburger.isVisible()) {
              await hamburger.click({ timeout: 3000 });
              await page.waitForTimeout(500);
              hamburgerWorks = true;
            }
          } catch(e) { hamburgerWorks = false; }
        }

        results.responsive[vp.name].push({
          page: p.name, overflow, overflowAmount, hamburgerWorks
        });
      } catch(e) {
        results.responsive[vp.name].push({
          page: p.name, error: e.message.substring(0, 80)
        });
      }
    }
    console.log(`  ${vp.name}: tested`);
    await context.close();
  }

  await browser.close();

  saveResults('phase8-responsive.json', results);
  return results;
}

module.exports = phase8;

if (require.main === module) phase8().catch(console.error);
