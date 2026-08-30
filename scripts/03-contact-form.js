const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { fillForm, submitForm } = require('../src/utils/form-helper');
const { createApiCollector } = require('../src/utils/api-interceptor');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');
const testData = require('../config/test-data');

async function phase3() {
  console.log('\n=== PHASE 3: CONTACT FORM ===');
  const results = { formSubmit: null };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  const collector = createApiCollector(page);
  page.on('response', resp => {
    if (resp.url().includes('/api/contact')) {
      results.formSubmit = { url: resp.url(), status: resp.status() };
    }
  });

  await safeGoto(page, config.BASE_URL + config.FORM_PAGE);
  await page.waitForTimeout(3000);

  console.log('  Filling form...');
  await fillForm(page, testData.SAFE_TEST_DATA, config.FORM_FIELDS);

  console.log('  Submitting...');
  await submitForm(page, config.FORM_FIELDS.submit);
  await page.waitForTimeout(5000);

  const successMsg = await page.$('text="Thank you", text="success", text="sent"');
  const formCleared = await page.$eval(config.FORM_FIELDS.name, el => el.value === '');

  results.formSubmit = {
    ...results.formSubmit,
    successVisible: successMsg ? true : false,
    formCleared,
    apiCalls: collector.getRequests().filter(r => r.url.includes('/api/'))
  };

  console.log(`  Result: ${JSON.stringify(results.formSubmit)}`);

  await context.close();
  await browser.close();

  saveResults('phase3-contact-form.json', results);
  return results;
}

module.exports = phase3;

if (require.main === module) phase3().catch(console.error);
