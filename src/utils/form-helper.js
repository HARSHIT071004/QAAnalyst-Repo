async function fillForm(page, data, selectors) {
  if (data.name && selectors.name) await page.fill(selectors.name, data.name);
  if (data.email && selectors.email) await page.fill(selectors.email, data.email);
  if (data.phone && selectors.phone) await page.fill(selectors.phone, data.phone);
  if (data.business && selectors.business) await page.fill(selectors.business, data.business);
  if (data.message && selectors.message) await page.fill(selectors.message, data.message);
}

async function clearForm(page, selectors) {
  for (const key of Object.keys(selectors)) {
    if (key !== 'submit') {
      try { await page.fill(selectors[key], ''); } catch(e) {}
    }
  }
}

async function submitForm(page, submitSelector) {
  const btn = await page.$(submitSelector);
  if (btn) {
    await btn.click();
    await page.waitForTimeout(3000);
    return true;
  }
  return false;
}

async function getFormValues(page, selectors) {
  const values = {};
  for (const [key, selector] of Object.entries(selectors)) {
    if (key !== 'submit') {
      try {
        values[key] = await page.$eval(selector, el => el.value);
      } catch(e) {
        values[key] = null;
      }
    }
  }
  return values;
}

module.exports = { fillForm, clearForm, submitForm, getFormValues };
