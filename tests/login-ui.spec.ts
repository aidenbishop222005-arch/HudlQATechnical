import { test, expect } from '../src/fixtures/test';

test.describe('Login page UI', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ loginEmailPage }) => {
    await loginEmailPage.goto();
  });

  test('shows the Hudl logo and Log In heading', async ({ loginEmailPage }) => {
    await expect(loginEmailPage.logo).toBeVisible();
    await expect(loginEmailPage.heading).toBeVisible();
  });

  test('shows an empty email field and an enabled Continue button', async ({ loginEmailPage }) => {
    await expect(loginEmailPage.emailInput).toBeVisible();
    await expect(loginEmailPage.emailInput).toBeEmpty();
    await expect(loginEmailPage.continueButton).toBeEnabled();
  });

  test('offers Google, Facebook, and Apple sign-in', async ({ loginEmailPage }) => {
    await expect(loginEmailPage.googleButton).toBeVisible();
    await expect(loginEmailPage.facebookButton).toBeVisible();
    await expect(loginEmailPage.appleButton).toBeVisible();
  });

  test('Create Account link opens the sign-up flow', async ({
    loginEmailPage,
    signupBirthdayPage,
  }) => {
    await loginEmailPage.createAccountLink.click();
    await signupBirthdayPage.waitForLoaded();
    await expect(signupBirthdayPage.birthMonthSelect).toBeVisible();
    await expect(signupBirthdayPage.birthYearSelect).toBeVisible();
  });
});
