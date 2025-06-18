const { defineConfig } = require('@playwright/test');

defineConfig({
  testDir: '/e2e/',
  webServer: {
    command: 'npm run start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});

module.exports = {
  defineConfig,
};
