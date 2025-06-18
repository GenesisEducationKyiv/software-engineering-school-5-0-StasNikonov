const { test, expect } = require('@playwright/test');

test.describe('Форма підписки на прогноз погоди', () => {
  const url =
    process.env.E2E_BASE_URL || 'http://localhost:3000/subscribe.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('успішна підписка', async ({ page }) => {
    await page.fill('#email', 'valid@example.com');
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/успішна|успішно/i, { timeout: 3000 });
    await expect(message).toHaveCSS('color', 'rgb(0, 128, 0)');
  });

  test('помилка: не вказано email', async ({ page }) => {
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/email/i, { timeout: 3000 });
  });

  test('помилка: не вказано місто', async ({ page }) => {
    await page.fill('#email', 'test@test.com');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/city/i, { timeout: 3000 });
  });

  test('помилка: не вказано частоту', async ({ page }) => {
    await page.fill('#email', 'test@test.com');
    await page.fill('#city', 'Kyiv');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/frequency|частоту/i, { timeout: 3000 });
  });

  test('помилка: неправильний формат email', async ({ page }) => {
    await page.fill('#email', 'invalid-email');
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/invalid|email/i, { timeout: 3000 });
  });

  test('помилка: дублюючий email', async ({ page }) => {
    // Припускаємо, що підписка з цими даними вже існує
    await page.fill('#email', 'duplicate@example.com');
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    const message = page.locator('#message');
    await expect(message).toHaveText(/вже існує|exists/i, { timeout: 3000 });
    await expect(message).toHaveCSS('color', 'rgb(255, 0, 0)');
  });
});
