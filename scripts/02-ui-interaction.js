const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase2() {
  console.log('\n=== PHASE 2: NORMAL UI INTERACTION ===');
  const results = { interactions: [] };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  await safeGoto(page, config.BASE_URL);
  await page.waitForTimeout(2000);

  // Logo
  const logo = await page.$('a[href="/"]');
  if (logo) {
    await logo.click();
    await page.waitForTimeout(1000);
    results.interactions.push({ element: 'Logo', clicked: true, url: page.url() });
    console.log(`  Logo: ✓`);
  }

  // Navigation Links
  for (const link of config.NAV_LINKS) {
    const el = await page.$(`a:text("${link.text}")`);
    if (el) {
      await el.click();
      await page.waitForTimeout(1500);
      const correct = page.url().includes(link.href);
      results.interactions.push({ element: `Nav: ${link.text}`, clicked: true, correct });
      console.log(`  ${link.text}: ${correct ? '✓' : '✗'}`);
      await page.goBack();
      await page.waitForTimeout(1000);
    }
  }

  // Dropdowns
  for (const dd of config.DROPDOWNS) {
    await safeGoto(page, config.BASE_URL);
    await page.waitForTimeout(2000);
    const btn = await page.$(`button:text("${dd.trigger}")`);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(500);
      const firstItem = await page.$(`a:text("${dd.items[0]}")`);
      const visible = firstItem ? await firstItem.isVisible() : false;
      results.interactions.push({ element: `${dd.trigger} Dropdown`, opened: visible });
      console.log(`  ${dd.trigger} Dropdown: ${visible ? '✓' : '✗'}`);
    }
  }

  // CTA Buttons
  for (const cta of config.CTA_BUTTONS) {
    const el = await page.$(`a:text("${cta.text}")`);
    if (el) {
      await el.click();
      await page.waitForTimeout(1500);
      const correct = page.url().includes(cta.expected);
      results.interactions.push({ element: `CTA: ${cta.text}`, clicked: true, correct });
      console.log(`  ${cta.text}: ${correct ? '✓' : '✗'}`);
      await page.goBack();
      await page.waitForTimeout(1000);
    }
  }

  // Read More / Read Less
  await safeGoto(page, config.BASE_URL);
  await page.waitForTimeout(2000);
  const readMoreBtns = await page.$$('button:text("Read More")');
  console.log(`  Read More buttons: ${readMoreBtns.length}`);

  if (readMoreBtns.length > 0) {
    const btn = readMoreBtns[0];
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(1000);
    const readLess = await page.$('button:text("Read Less")');
    const works = readLess ? await readLess.isVisible() : false;
    results.interactions.push({ element: 'Read More/Read Less', works });
    console.log(`  Read More/Read Less: ${works ? '✓' : '✗'}`);
  }

  // Footer
  const footerLinks = await page.$$('footer a');
  results.interactions.push({ element: 'Footer Links', count: footerLinks.length });
  console.log(`  Footer Links: ${footerLinks.length}`);

  await context.close();
  await browser.close();

  saveResults('phase2-ui-interaction.json', results);
  return results;
}

module.exports = phase2;

if (require.main === module) phase2().catch(console.error);
