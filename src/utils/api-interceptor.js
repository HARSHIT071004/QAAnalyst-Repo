function createApiCollector(page) {
  const requests = [];

  page.on('response', resp => {
    const url = resp.url();
    if (url.includes('zoxima.com') || url.includes('target-site.com')) {
      requests.push({
        url: url.substring(0, 200),
        method: resp.request().method(),
        status: resp.status(),
        timestamp: Date.now()
      });
    }
  });

  return {
    getRequests: () => requests,
    getStatusCounts: () => {
      const counts = {};
      requests.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
      return counts;
    },
    getErrors: () => requests.filter(r => r.status >= 400),
    clear: () => { requests.length = 0; }
  };
}

function createApiInterceptor(page) {
  const intercepted = [];

  async function mockResponse(urlPattern, options = {}) {
    await page.route(urlPattern, async route => {
      if (options.timeout) {
        await new Promise(r => setTimeout(r, 30000));
        await route.abort('timedout');
      } else if (options.body !== undefined) {
        await route.fulfill({
          status: options.status || 200,
          body: options.body,
          contentType: 'text/plain'
        });
      } else {
        await route.fulfill({
          status: options.status,
          body: options.body || 'Mocked error',
          contentType: 'text/plain'
        });
      }
      intercepted.push({ urlPattern, options });
    });
  }

  async function clearMocks(urlPattern) {
    await page.unroute(urlPattern);
  }

  return { mockResponse, clearMocks, getIntercepted: () => intercepted };
}

module.exports = { createApiCollector, createApiInterceptor };
