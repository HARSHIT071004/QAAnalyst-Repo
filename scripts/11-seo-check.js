const { launchBrowser, createContext, safeGoto } = require('../src/utils/browser');
const { saveResults } = require('../src/reporters/json-reporter');
const config = require('../config/pages');

async function phase11() {
  console.log('\n=== PHASE 11: SEO CHECK ===');
  const results = { seo: {} };

  const browser = await launchBrowser();
  const context = await createContext(browser, { width: 1440, height: 900 });
  const page = await context.newPage();

  await safeGoto(page, config.BASE_URL);
  await page.waitForTimeout(2000);

  results.seo = await page.evaluate(() => {
    const getMeta = (n) => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.getAttribute('content');
    return {
      title: document.title,
      metaDescription: getMeta('description'),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      ogImage: getMeta('og:image'),
      twitterCard: getMeta('twitter:card'),
      h1: document.querySelector('h1')?.textContent?.trim(),
      structuredData: !!document.querySelector('script[type="application/ld+json"]')
    };
  });

  // robots.txt
  try {
    const r = await safeGoto(page, config.BASE_URL + '/robots.txt', { timeout: 10000 });
    results.seo.robotsTxt = { status: r.status(), content: (await r.text()).substring(0, 300) };
  } catch(e) { results.seo.robotsTxt = { status: 'NOT FOUND' }; }

  // sitemap
  try {
    const r = await safeGoto(page, config.BASE_URL + '/sitemap.xml', { timeout: 10000 });
    results.seo.sitemap = { status: r.status() };
  } catch(e) { results.seo.sitemap = { status: 'NOT FOUND' }; }

  console.log(`  Title: ${results.seo.title ? '✓' : '✗'}`);
  console.log(`  Meta desc: ${results.seo.metaDescription ? '✓' : '✗'}`);
  console.log(`  H1: ${results.seo.h1 ? '✓' : '✗'}`);
  console.log(`  robots.txt: ${results.seo.robotsTxt.status}`);
  console.log(`  sitemap: ${results.seo.sitemap.status}`);

  await context.close();
  await browser.close();

  saveResults('phase11-seo.json', results);
  return results;
}

module.exports = phase11;

if (require.main === module) phase11().catch(console.error);
