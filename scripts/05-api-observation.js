const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { createApiCollector } = require('../src/utils/api-interceptor');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase5() {
  console.log('\n=== PHASE 5: API OBSERVATION ===');
  const results = { apiRequests: [] };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  const collector = createApiCollector(page);

  await safeGoto(page, config.BASE_URL);
  await page.waitForTimeout(5000);

  results.apiRequests = collector.getRequests();
  const statusCounts = collector.getStatusCounts();

  console.log(`  Captured ${results.apiRequests.length} requests`);
  console.log(`  Status: ${JSON.stringify(statusCounts)}`);

  await context.close();
  await browser.close();

  saveResults('phase5-api-observation.json', results);
  return results;
}

module.exports = phase5;

if (require.main === module) phase5().catch(console.error);
