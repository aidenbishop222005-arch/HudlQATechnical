import { test, expect } from '../src/fixtures/test';
import { credentials } from '../src/config/env';
import {
  ERROR_MESSAGES,
  INVALID_EMAILS,
  WRONG_PASSWORD,
  uniqueUnregisteredEmail,
} from '../src/data/testData';

test.describe('Email validation', () => {
  test.beforeEach(async ({ loginEmailPage }) => {
    await loginEmailPage.goto();
  });

  test('requires an email address', async ({ loginEmailPage }) => {
    await loginEmailPage.continueButton.click();

    await expect(loginEmailPage.emailError).toHaveText(ERROR_MESSAGES.emailRequired);
    await expect(loginEmailPage.emailInput).toBeEditable();
  });

  for (const email of INVALID_EMAILS) {
    test(`rejects malformed email "${email}"`, async ({ loginEmailPage }) => {
      await loginEmailPage.submitEmail(email);

      await expect(loginEmailPage.emailError).toHaveText(ERROR_MESSAGES.emailInvalid);
    });
  }
});

test.describe('Password validation', () => {
  test('requires a password', async ({ loginEmailPage, loginPasswordPage }) => {
    await loginEmailPage.goto();
    await loginEmailPage.submitEmail(uniqueUnregisteredEmail());
    await loginPasswordPage.waitForLoaded();

    await loginPasswordPage.continueButton.click();

    await expect(loginPasswordPage.passwordError).toBeVisible();
  });
});

test.describe('Invalid credentials', { tag: '@lockout-risk' }, () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Failed logins run on one browser only to avoid locking the test account',
  );

  test('rejects a wrong password for a registered account', async ({
    login,
    loginPasswordPage,
    page,
  }) => {
    await login(credentials.email, WRONG_PASSWORD);

    await expect(loginPasswordPage.passwordError).toHaveText(ERROR_MESSAGES.invalidCredentials);
    await expect(page).not.toHaveURL(/hudl\.com\/home/);
  });

  test('shows the same error for an unregistered email', async ({ login, loginPasswordPage }) => {
    await login(uniqueUnregisteredEmail(), WRONG_PASSWORD);

    await expect(loginPasswordPage.passwordError).toHaveText(ERROR_MESSAGES.invalidCredentials);
  });
});
