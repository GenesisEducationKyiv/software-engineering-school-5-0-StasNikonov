const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/e2e',
  use: {
    baseURL: 'http://api-gateway:3001',
    headless: true,
  },
});
