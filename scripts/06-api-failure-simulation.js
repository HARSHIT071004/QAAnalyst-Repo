const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { createApiInterceptor } = require('../src/utils/api-interceptor');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');
const testData = require('../config/test-data');

async function phase6() {
  console.log('\n=== PHASE 6: API FAILURE SIMULATION ===');
  const results = { mockTests: [] };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  for (const test of testData.MOCK_TESTS) {
    const interceptor = createApiInterceptor(page);
    await interceptor.mockResponse(test.urlPattern, {
      status: test.status,
      body: test.body,
      timeout: test.timeout
    });

    try {
      const start = Date.now();
      await safeGoto(page, config.BASE_URL, { timeout: 15000 });
      const loadTime = Date.now() - start;
      const bodyLen = (await page.content()).length;

      results.mockTests.push({
        name: test.name, loadTime, bodyLength: bodyLen,
        hasContent: bodyLen > 1000, crashed: false
      });
      console.log(`  ${test.name}: ✓ (${loadTime}ms)`);
    } catch (e) {
      results.mockTests.push({
        name: test.name, error: e.message.substring(0, 100), crashed: true
      });
      console.log(`  ${test.name}: CRASHED`);
    }

    await interceptor.clearMocks(test.urlPattern);
  }

  await context.close();
  await browser.close();

  saveResults('phase6-api-failure-simulation.json', results);
  return results;
}

module.exports = phase6;

if (require.main === module) phase6().catch(console.error);
