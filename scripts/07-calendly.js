const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase7() {
  console.log('\n=== PHASE 7: CALENDLY ===');
  const results = { calendly: null };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  await safeGoto(page, config.BASE_URL + config.FORM_PAGE);
  await page.waitForTimeout(5000);

  const calendlyFrame = await page.$('iframe[src*="calendly"]');
  const loaded = calendlyFrame ? true : false;

  let datesVisible = false;
  let slotsVisible = false;

  if (calendlyFrame) {
    const frame = await calendlyFrame.contentFrame();
    if (frame) {
      await frame.waitForTimeout(3000);
      const dateElements = await frame.$$('[data-handler="selectDay"]');
      datesVisible = dateElements.length > 0;
      const slotElements = await frame.$$('[data-component="time-slot"]');
      slotsVisible = slotElements.length > 0;
    }
  }

  results.calendly = {
    loaded, datesVisible, slotsVisible,
    note: 'Booking flow loaded; final booking not tested to avoid creating real appointment.'
  };

  console.log(`  Calendly: loaded=${loaded}, dates=${datesVisible}, slots=${slotsVisible}`);

  await context.close();
  await browser.close();

  saveResults('phase7-calendly.json', results);
  return results;
}

module.exports = phase7;

if (require.main === module) phase7().catch(console.error);
