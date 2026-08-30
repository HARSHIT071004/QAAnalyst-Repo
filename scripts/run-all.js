const { saveResults, generateSummary } = require('../src/reporters/json-reporter');

const phases = [
  { num: 1, name: 'Page Availability', fn: require('./01-page-availability') },
  { num: 2, name: 'UI Interaction', fn: require('./02-ui-interaction') },
  { num: 3, name: 'Contact Form', fn: require('./03-contact-form') },
  { num: 4, name: 'Form Validation', fn: require('./04-form-validation') },
  { num: 5, name: 'API Observation', fn: require('./05-api-observation') },
  { num: 6, name: 'API Failure Simulation', fn: require('./06-api-failure-simulation') },
  { num: 7, name: 'Calendly', fn: require('./07-calendly') },
  { num: 8, name: 'Responsive', fn: require('./08-responsive') },
  { num: 9, name: 'Keyboard A11y', fn: require('./09-keyboard-a11y') },
  { num: 10, name: 'Automated A11y', fn: require('./10-automated-a11y') },
  { num: 11, name: 'SEO Check', fn: require('./11-seo-check') },
  { num: 12, name: 'Performance', fn: require('./12-performance') },
  { num: 13, name: 'Cross-Browser', fn: require('./13-cross-browser') }
];

async function runAll() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  Black-Box Website QA Audit — Full Suite       ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const allResults = {};
  const startTime = Date.now();

  for (const phase of phases) {
    console.log(`\n▸ Phase ${phase.num}/${phases.length}: ${phase.name}`);
    try {
      allResults[`phase${phase.num}`] = await phase.fn();
    } catch(e) {
      console.log(`  ERROR: ${e.message}`);
      allResults[`phase${phase.num}`] = { error: e.message };
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n╔══════════════════════════════════════════════════╗`);
  console.log(`║  Complete in ${elapsed}s                              ║`);
  console.log(`╚══════════════════════════════════════════════════╝`);

  saveResults('full-audit-results.json', allResults);
  return allResults;
}

module.exports = runAll;

if (require.main === module) {
  runAll().catch(e => { console.error('FATAL:', e); process.exit(1); });
}
