const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase9() {
  console.log('\n=== PHASE 9: KEYBOARD ACCESSIBILITY ===');
  const results = { keyboard: {} };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  await safeGoto(page, config.BASE_URL);
  await page.waitForTimeout(2000);

  // Tab through elements
  const focusable = [];
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    const focused = await page.evaluate(() => ({
      tag: document.activeElement.tagName,
      text: (document.activeElement.textContent || '').substring(0, 50).trim()
    }));
    focusable.push(focused);
  }

  // Enter navigation
  await safeGoto(page, config.BASE_URL);
  await page.waitForTimeout(2000);
  const aboutLink = await page.$('a:text("About Us")');
  let enterNav = false;
  if (aboutLink) {
    await aboutLink.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    enterNav = page.url().includes('/about-us');
  }

  // Escape
  await safeGoto(page, config.BASE_URL);
  await page.waitForTimeout(2000);
  let escapeWorks = null;
  const servicesBtn = await page.$('button:text("Services")');
  if (servicesBtn && await servicesBtn.isVisible()) {
    await servicesBtn.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const dd = await page.$('a:text("AI Implementation")');
    escapeWorks = dd ? !(await dd.isVisible()) : true;
  }

  results.keyboard = {
    tabResults: focusable,
    enterNavigation: enterNav,
    escapeClosesDropdown: escapeWorks
  };

  console.log(`  Tab: ${focusable.length} elements`);
  console.log(`  Enter: ${enterNav ? '✓' : '✗'}`);
  console.log(`  Escape: ${escapeWorks}`);

  await context.close();
  await browser.close();

  saveResults('phase9-keyboard-a11y.json', results);
  return results;
}

module.exports = phase9;

if (require.main === module) phase9().catch(console.error);
