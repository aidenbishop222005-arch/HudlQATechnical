import { test, expect } from '@playwright/test';
import { LoginEmailPage } from '../src/pages/LoginEmailPage';

test('login page shows the email step', async ({ page }) => {
  const loginEmailPage = new LoginEmailPage(page);
  await loginEmailPage.goto();

  await expect(loginEmailPage.emailInput).toBeVisible();
  await expect(loginEmailPage.continueButton).toBeEnabled();
  await expect(loginEmailPage.googleButton).toBeVisible();
});