const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '../../results');

function ensureResultsDir() {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
}

function saveResults(filename, data) {
  ensureResultsDir();
  const filepath = path.join(RESULTS_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  return filepath;
}

function saveMarkdown(filename, content) {
  ensureResultsDir();
  const filepath = path.join(RESULTS_DIR, filename);
  fs.writeFileSync(filepath, content);
  return filepath;
}

function loadResults(filename) {
  const filepath = path.join(RESULTS_DIR, filename);
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch(e) {
    return null;
  }
}

function generateSummary(results) {
  return {
    timestamp: new Date().toISOString(),
    totalPages: results.pages?.length || 0,
    successfulPages: results.pages?.filter(p => p.success).length || 0,
    failedPages: results.pages?.filter(p => !p.success).length || 0,
    totalApiRequests: results.apiRequests?.length || 0,
    apiErrors: results.apiRequests?.filter(r => r.status >= 400).length || 0,
    confirmedBugs: results.bugs?.filter(b => b.confirmed).length || 0
  };
}

module.exports = { saveResults, saveMarkdown, loadResults, generateSummary, RESULTS_DIR };
