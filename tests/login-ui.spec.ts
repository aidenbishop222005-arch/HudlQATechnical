import { test, expect } from '../src/fixtures/test';

test('login page shows the email step', async ({ loginEmailPage }) => {
  await loginEmailPage.goto();

  await expect(loginEmailPage.emailInput).toBeVisible();
  await expect(loginEmailPage.continueButton).toBeEnabled();
  await expect(loginEmailPage.googleButton).toBeVisible();
});