const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/e2e',
  use: {
    baseURL: 'http://localhost:3002',
    headless: true,
  },
});
