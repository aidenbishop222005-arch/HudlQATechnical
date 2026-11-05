import { test, expect } from '../src/fixtures/test';
import type AxeBuilder from '@axe-core/playwright';
import type { TestInfo } from '@playwright/test';
import { uniqueUnregisteredEmail } from '../src/data/testData';

async function expectNoA11yViolations(builder: AxeBuilder, testInfo: TestInfo): Promise<void> {
  const results = await builder.analyze();
  await testInfo.attach('axe-violations', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const summary = results.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.help} — ${violation.nodes.length} element(s)`,
  );
  expect(summary, 'Accessibility violations found; see the axe-violations attachment').toEqual([]);
}

test.describe('Accessibility scans', { tag: '@a11y' }, () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'axe results do not depend on the browser, so scans run once',
  );

  test('email step has no WCAG A/AA violations', async ({ loginEmailPage, makeAxeBuilder }, testInfo) => {
    await loginEmailPage.goto();
    await expectNoA11yViolations(makeAxeBuilder(), testInfo);
  });

  test('email step with a validation error has no violations', async ({ loginEmailPage, makeAxeBuilder }, testInfo) => {
    await loginEmailPage.goto();
    await loginEmailPage.submitEmail('abc');
    await expect(loginEmailPage.emailError).toBeVisible();
    await expectNoA11yViolations(makeAxeBuilder(), testInfo);
  });

  test('password step has no violations', async ({ loginEmailPage, loginPasswordPage, makeAxeBuilder }, testInfo) => {
    await loginEmailPage.goto();
    await loginEmailPage.submitEmail(uniqueUnregisteredEmail());
    await loginPasswordPage.waitForLoaded();
    await expectNoA11yViolations(makeAxeBuilder(), testInfo);
  });
});

test.describe('Accessibility basics', { tag: '@a11y' }, () => {
  test.beforeEach(async ({ loginEmailPage }) => {
    await loginEmailPage.goto();
  });

  test('every image has an alt attribute', async ({ page }) => {
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
  });

  test('page declares its language', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
  });

  test('page has exactly one main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('Tab moves from the email field to Continue', async ({ loginEmailPage, page }) => {
    await loginEmailPage.emailInput.focus();
    await page.keyboard.press('Tab');
    await expect(loginEmailPage.continueButton).toBeFocused();
  });

  test('validation error is announced with the email field', async ({ loginEmailPage }) => {
    await loginEmailPage.submitEmail('abc');
    await expect(loginEmailPage.emailInput).toHaveAccessibleDescription(/Enter a valid email/);
  });
});