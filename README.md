# Black-Box Website QA Audit Framework

A comprehensive, production-safe black-box QA audit framework for website testing using Playwright. This project demonstrates end-to-end UI/UX, functional, API, accessibility, SEO, and performance testing — all without access to source code.

## What This Project Does

This framework performs a complete black-box audit of any public website, including:

- **Page Availability** — discovers and tests all publicly accessible pages
- **UI Interaction** — tests navigation, buttons, dropdowns, forms, and interactive elements
- **API Observation** — intercepts and analyzes all network requests
- **Contact Form Validation** — tests empty fields, invalid inputs, unicode, edge cases
- **API Failure Simulation** — mocks 400/404/500/timeout responses to test resilience
- **Mobile Responsiveness** — tests across 8 viewport sizes (320px to 1440px)
- **Keyboard Accessibility** — Tab, Enter, Escape navigation testing
- **Automated Accessibility** — checks labels, alt text, headings, landmarks, focus indicators
- **SEO Audit** — title, meta description, OpenGraph, robots.txt, sitemap.xml
- **Performance Metrics** — TTFB, FCP, load time, resource counts
- **Cross-Browser Testing** — Chromium, Firefox, WebKit (where available)

## Project Structure

```
├── README.md                          # This file
├── .gitignore                         # Git ignore rules
├── package.json                       # Node.js dependencies
├── requirements.txt                   # Python dependencies
│
├── config/                            # Configuration
│   ├── pages.js                       #   Page routes & form selectors
│   ├── viewports.js                   #   Viewport sizes
│   └── test-data.js                   #   Test data & mock scenarios
│
├── src/                               # Core utilities
│   ├── utils/
│   │   ├── browser.js                 #   Browser launcher
│   │   ├── api-interceptor.js         #   API collection & mocking
│   │   └── form-helper.js             #   Form fill/submit helpers
│   └── reporters/
│       └── json-reporter.js           #   Results persistence
│
├── scripts/                           # Test phases (run individually or all)
│   ├── 01-page-availability.js        #   Phase 1
│   ├── 02-ui-interaction.js           #   Phase 2
│   ├── 03-contact-form.js             #   Phase 3
│   ├── 04-form-validation.js          #   Phase 4
│   ├── 05-api-observation.js          #   Phase 5
│   ├── 06-api-failure-simulation.js   #   Phase 6
│   ├── 07-calendly.js                 #   Phase 7
│   ├── 08-responsive.js              #   Phase 8
│   ├── 09-keyboard-a11y.js            #   Phase 9
│   ├── 10-automated-a11y.js           #   Phase 10
│   ├── 11-seo-check.js                #   Phase 11
│   ├── 12-performance.js              #   Phase 12
│   ├── 13-cross-browser.js            #   Phase 13
│   └── run-all.js                     #   Orchestrator (runs all phases)
│
├── docs/                              # Documentation
│   ├── audit-plan.md                  #   Full execution plan
│   ├── review-instructions/           #   Phase-by-phase instructions
│   │   ├── review.md
│   │   ├── review2.md
│   │   ├── review3.md
│   │   ├── review4.md
│   │   ├── review5.md
│   │   └── review6.md
│   └── reports/                       #   Generated audit reports
│       ├── FINAL-COMPLETE-AUDIT.md
│       ├── REVIEW6-PRODUCTION-SAFE-REPORT.md
│       ├── PHASE3-DEEP-REPORT.md
│       ├── BUTTON-API-AUDIT-REPORT.md
│       └── FINAL-AUDIT-REPORT.md
│
├── results/                           # Raw test results (JSON)
│
└── legacy/                            # Previous test scripts (reference)
    ├── button-api-test.js
    ├── test-pages.js
    ├── phase3-deep-validation.js
    └── ...
```

## Prerequisites

- Node.js (v18+)
- npm

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run the full 13-phase audit
node scripts/run-all.js
```

## Running Individual Phases

```bash
# Run a single phase
node scripts/01-page-availability.js
node scripts/02-ui-interaction.js
node scripts/03-contact-form.js
# ... etc
```

## Configuration

### Target URL

Set your target website URL:

```bash
# Option 1: Environment variable
set TARGET_URL=https://your-site.com
node scripts/run-all.js

# Option 2: Edit config/pages.js
```

### Customizing Pages

Edit `config/pages.js` to match your site's routes:

```javascript
PAGES: [
  { path: '/', name: 'homepage' },
  { path: '/about', name: 'about' },
  // Add your pages here
]
```

### Customizing Viewports

Edit `config/viewports.js` to test different screen sizes.

## Test Methodology

### Safety Rules
- No destructive testing (no SQL injection, XSS, brute force)
- No real payments, bookings, or account creation
- Use fake test data only
- Mock API failures locally (never attack production)
- Normal browsing behavior only

### Bug Classification
- **CONFIRMED BUG** — Reproducible with clear evidence
- **SUSPECTED ISSUE** — Needs manual verification
- **UX ISSUE** — Works but could be better
- **INFORMATIONAL** — Observation, not a bug

## Contributing

Contributions welcome! Areas for improvement:
- Visual regression testing
- Lighthouse integration
- Screen reader testing
- Additional test scenarios

## License

MIT
