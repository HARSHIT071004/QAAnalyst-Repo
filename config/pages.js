module.exports = {
  BASE_URL: process.env.TARGET_URL || 'https://example.com',

  PAGES: [
    { path: '/', name: 'homepage' },
    { path: '/about-us', name: 'about-us' },
    { path: '/services/ai-implementation', name: 'ai-implementation' },
    { path: '/services/apps-automations', name: 'apps-automations' },
    { path: '/services/salesforce-crm', name: 'salesforce-crm' },
    { path: '/industries/manufacturing', name: 'manufacturing' },
    { path: '/industries/healthcare', name: 'healthcare' },
    { path: '/industries/cpg', name: 'cpg' },
    { path: '/industries/education', name: 'education' },
    { path: '/industries/digital-natives', name: 'digital-natives' },
    { path: '/case-studies', name: 'case-studies' },
    { path: '/demo', name: 'demo' },
    { path: '/privacy-policy', name: 'privacy-policy' }
  ],

  FORM_PAGE: '/demo',
  FORM_FIELDS: {
    name: 'input[name="name"]',
    email: 'input[name="email"]',
    phone: 'input[name="phone"]',
    business: 'input[name="business"]',
    message: 'textarea[name="message"]',
    submit: 'button:text("Send Message")'
  },

  NAV_LINKS: [
    { text: 'Home', href: '/' },
    { text: 'About Us', href: '/about-us' },
    { text: 'Case Studies', href: '/case-studies' }
  ],

  CTA_BUTTONS: [
    { text: 'Schedule Consultation', expected: '/demo' },
    { text: 'Schedule a Demo', expected: '/demo' }
  ],

  DROPDOWNS: [
    { trigger: 'Services', items: ['AI Implementation', 'Apps & Automations', 'Salesforce CRM'] },
    { trigger: 'Industries', items: ['Manufacturing', 'Healthcare', 'CPG', 'Education', 'Digital Natives'] }
  ]
};
