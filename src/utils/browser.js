const { chromium, firefox, webkit } = require('playwright');

const BROWSERS = { chromium, firefox, webkit };

async function launchBrowser(browserName = 'chromium', options = {}) {
  const launcher = BROWSERS[browserName];
  if (!launcher) throw new Error(`Unknown browser: ${browserName}`);
  return launcher.launch({ headless: true, ...options });
}

async function createContext(browser, viewport) {
  return browser.newContext({ viewport });
}

async function createPage(context) {
  return context.newPage();
}

async function safeGoto(page, url, options = {}) {
  const defaults = { waitUntil: 'domcontentloaded', timeout: 30000 };
  return page.goto(url, { ...defaults, ...options });
}

module.exports = { launchBrowser, createContext, createPage, safeGoto, BROWSERS };
