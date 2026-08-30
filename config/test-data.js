module.exports = {
  SAFE_TEST_DATA: {
    name: 'QA Test User',
    email: 'qatest@example.com',
    phone: '9876543210',
    business: 'QA Test Corp',
    message: 'Automated QA test - please ignore'
  },

  VALIDATION_TESTS: [
    { name: 'Empty fields', fill: false, expectValidation: true },
    { name: 'Invalid email', fill: true, email: 'notanemail', expectValidation: true },
    { name: 'Invalid phone', fill: true, phone: 'abc', expectValidation: false },
    { name: 'Whitespace only', fill: true, name: '     ', email: '     ', expectValidation: true },
    { name: 'Long input', fill: true, name: 'A'.repeat(500), expectValidation: false },
    { name: 'Unicode', fill: true, name: 'Test User हिन्दी العربية 😀', expectValidation: false }
  ],

  MOCK_TESTS: [
    { name: 'Mock 500 on RSC', status: 500, urlPattern: /__next.*\.txt$/ },
    { name: 'Mock 404 on RSC', status: 404, urlPattern: /__next.*\.txt$/ },
    { name: 'Mock timeout on RSC', status: null, urlPattern: /__next.*\.txt$/, timeout: true },
    { name: 'Mock empty on RSC', status: 200, urlPattern: /__next.*\.txt$/, body: '' },
    { name: 'Mock malformed on RSC', status: 200, urlPattern: /__next.*\.txt$/, body: 'not valid rsc data { [[' }
  ]
};
