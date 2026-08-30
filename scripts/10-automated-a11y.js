const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase10() {
  console.log('\n=== PHASE 10: AUTOMATED ACCESSIBILITY ===');
  const results = { accessibility: [] };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  for (const p of config.PAGES.slice(0, 5)) {
    try {
      await safeGoto(page, config.BASE_URL + p.path);
      await page.waitForTimeout(2000);

      const a11y = await page.evaluate(() => {
        const issues = [];
        document.querySelectorAll('img').forEach(img => {
          if (!img.alt && !img.getAttribute('aria-label')) {
            issues.push({ type: 'missing-alt', src: (img.src || '').substring(0, 80) });
          }
        });
        document.querySelectorAll('button').forEach(btn => {
          if (!btn.textContent?.trim() && !btn.getAttribute('aria-label')) {
            issues.push({ type: 'button-no-name' });
          }
        });
        document.querySelectorAll('input:not([type="hidden"]), textarea').forEach(input => {
          const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
          const hasAria = input.getAttribute('aria-label');
          if (!hasLabel && !hasAria && !input.placeholder) {
            issues.push({ type: 'input-no-label', name: input.name });
          }
        });
        return {
          issues,
          landmarks: {
            nav: !!document.querySelector('nav'),
            main: !!document.querySelector('main'),
            footer: !!document.querySelector('footer')
          },
          h1Count: document.querySelectorAll('h1').length,
          headingCount: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length
        };
      });

      results.accessibility.push({ page: p.name, ...a11y });
      console.log(`  ${p.name}: ${a11y.issues.length} issues`);
    } catch(e) {
      console.log(`  ${p.name}: ERROR`);
    }
  }

  await context.close();
  await browser.close();

  saveResults('phase10-automated-a11y.json', results);
  return results;
}

module.exports = phase10;

if (require.main === module) phase10().catch(console.error);
