const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { fillForm, submitForm } = require('../src/utils/form-helper');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');
const testData = require('../config/test-data');

async function phase4() {
  console.log('\n=== PHASE 4: FORM VALIDATION ===');
  const results = { validationTests: [] };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  for (const test of testData.VALIDATION_TESTS) {
    await safeGoto(page, config.BASE_URL + config.FORM_PAGE);
    await page.waitForTimeout(2000);

    if (test.fill) {
      const data = {};
      if (test.name) data.name = test.name;
      if (test.email) data.email = test.email;
      if (test.phone) data.phone = test.phone;
      if (!test.email && !test.phone && !test.name) {
        data.name = 'Test';
        data.email = 'test@example.com';
        data.phone = '1234567890';
      }
      await fillForm(page, data, config.FORM_FIELDS);
    }

    await submitForm(page, config.FORM_FIELDS.submit);
    await page.waitForTimeout(1000);

    const validationMsg = await page.evaluate(() => {
      const el = document.querySelector(':invalid');
      return el ? el.validationMessage : null;
    });

    results.validationTests.push({
      name: test.name,
      validationMsg,
      hasValidation: !!validationMsg
    });
    console.log(`  ${test.name}: ${validationMsg || 'none'}`);
  }

  await context.close();
  await browser.close();

  saveResults('phase4-form-validation.json', results);
  return results;
}

module.exports = phase4;

if (require.main === module) phase4().catch(console.error);
