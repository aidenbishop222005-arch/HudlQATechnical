import { test, expect } from '../src/fixtures/test';
import type { Page } from '@playwright/test';
import {
  ERROR_MESSAGES,
  XSS_MARKER,
  XSS_PAYLOADS,
  uniqueUnregisteredEmail,
} from '../src/data/testData';

async function expectNoInjectedScript(page: Page, dialogs: string[]): Promise<void> {
  await expect(page.locator(`[${XSS_MARKER}]`)).toHaveCount(0);
  expect(await page.evaluate(() => 'xssExecuted' in window)).toBe(false);
  expect(dialogs).toEqual([]);
}

test.describe('Input injection', { tag: '@security' }, () => {
  for (const payload of XSS_PAYLOADS) {
    test(`email field neutralizes ${payload.name}`, async ({ loginEmailPage, page, dialogs }) => {
      await loginEmailPage.goto();
      await loginEmailPage.submitEmail(payload.value);

      await expect(loginEmailPage.emailError).toHaveText(ERROR_MESSAGES.emailInvalid);
      await expectNoInjectedScript(page, dialogs);
    });

    test(`password field neutralizes ${payload.name}`, async ({ login, loginPasswordPage, page, dialogs }) => {
      await login(uniqueUnregisteredEmail(), payload.value);

      await expect(loginPasswordPage.passwordError).toHaveText(ERROR_MESSAGES.invalidCredentials);
      await expectNoInjectedScript(page, dialogs);
    });
  }
});

test.describe('Transport and data handling', { tag: '@security' }, () => {
  test('password is never placed in the URL', async ({ login, loginPasswordPage, page }) => {
    const password = 'Url-Leak-Check-123!';
    await login(uniqueUnregisteredEmail(), password);

    await expect(loginPasswordPage.passwordError).toBeVisible();
    expect(page.url()).not.toContain(password);
    expect(page.url()).not.toContain(encodeURIComponent(password));
  });

  test('login page is served over HTTPS with HSTS', async ({ page }) => {
    const response = await page.goto('/login');

    expect(page.url()).toMatch(/^https:\/\//);
    expect(response?.headers()['strict-transport-security']).toBeTruthy();
  });

  test('login page cannot be embedded by other sites', async ({ page }) => {
    const response = await page.goto('/login');
    const headers = response?.headers() ?? {};
    const frameOptions = headers['x-frame-options'] ?? '';
    const csp = headers['content-security-policy'] ?? '';

    expect(
      /deny|sameorigin/i.test(frameOptions) || /frame-ancestors/i.test(csp),
      'Expected X-Frame-Options or a CSP frame-ancestors directive',
    ).toBe(true);
  });
});