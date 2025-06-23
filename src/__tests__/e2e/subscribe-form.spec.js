const { test, expect } = require('@playwright/test');

test.describe('Форма підписки на прогноз погоди', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/subscribe.html');
  });

  test('Should display weather form', async ({ page }) => {
    const form = page.locator('#subscribe-form');
    await expect(form).toBeVisible();
  });

  test('Should subscribe with valid data', async ({ page }) => {
    await page.route('**/api/subscribe', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Subscription successful. Confirmation email sent.',
        }),
      }),
    );

    await page.fill('#email', 'valid@example.com');
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(
      /Subscription successful. Confirmation email sent./i,
      { timeout: 3000 },
    );
  });

  test('should fail with email', async ({ page }) => {
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/Invalid input/i, { timeout: 3000 });
  });

  test('should fail with missing city', async ({ page }) => {
    await page.fill('#email', 'test@test.com');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/Invalid input/i, { timeout: 3000 });
  });

  test('should fail with missing frequency', async ({ page }) => {
    await page.fill('#email', 'test@test.com');
    await page.fill('#city', 'Kyiv');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/Invalid input/i, { timeout: 3000 });
  });

  test('should fail with invalid email', async ({ page }) => {
    await page.fill('#email', 'invalid-email');
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/Invalid email format/i, {
      timeout: 3000,
    });
  });
});
