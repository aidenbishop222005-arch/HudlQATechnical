import { test, expect } from '../src/fixtures/test';
import { uniqueUnregisteredEmail } from '../src/data/testData';

test.describe('Password step', () => {
  let email: string;

  test.beforeEach(async ({ loginEmailPage, loginPasswordPage }) => {
    email = uniqueUnregisteredEmail();
    await loginEmailPage.goto();
    await loginEmailPage.submitEmail(email);
    await loginPasswordPage.waitForLoaded();
  });

  test('shows the submitted email as read-only', async ({ loginPasswordPage }) => {
    await expect(loginPasswordPage.emailDisplay).toHaveValue(email);
    await expect(loginPasswordPage.emailDisplay).not.toBeEditable();
  });

  test('toggles password visibility', async ({ loginPasswordPage }) => {
    const { passwordInput, togglePasswordButton } = loginPasswordPage;
    await passwordInput.fill('not-a-real-password');

    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(togglePasswordButton).toHaveAttribute('aria-pressed', 'false');

    await loginPasswordPage.togglePasswordVisibility();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(togglePasswordButton).toHaveAttribute('aria-pressed', 'true');

    await loginPasswordPage.togglePasswordVisibility();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Edit link returns to the email step', async ({ loginPasswordPage, loginEmailPage }) => {
    await loginPasswordPage.editEmailLink.click();

    await expect(loginEmailPage.emailInput).toBeVisible();
    await expect(loginEmailPage.emailInput).toBeEditable();
  });

  test('Forgot password link opens the reset page', async ({ loginPasswordPage, resetPasswordPage }) => {
    await loginPasswordPage.forgotPasswordLink.click();

    await resetPasswordPage.waitForLoaded();
    await expect(resetPasswordPage.emailInput).toBeVisible();
  });
});