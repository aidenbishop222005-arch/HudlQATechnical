import { test, expect } from '../src/fixtures/test';
import { credentials } from '../src/config/env';

test.describe('Successful login', () => {
  test('logs in with valid credentials', { tag: '@smoke' }, async ({ login, homePage }) => {
    await test.step('submit valid email and password', async () => {
      await login(credentials.email, credentials.password);
    });

    await test.step('land on the Hudl home page', async () => {
      await homePage.waitForLoaded();
    });

    await test.step('user menu shows the logged-in account', async () => {
      await homePage.openUserMenu();
      await expect(homePage.userMenuEmail).toHaveText(credentials.email, { ignoreCase: true });
    });
  });

  test('submits both steps with the Enter key', async ({ loginEmailPage, loginPasswordPage, homePage }) => {
    await loginEmailPage.goto();
    await loginEmailPage.emailInput.fill(credentials.email);
    await loginEmailPage.emailInput.press('Enter');

    await loginPasswordPage.waitForLoaded();
    await loginPasswordPage.passwordInput.fill(credentials.password);
    await loginPasswordPage.passwordInput.press('Enter');

    await homePage.waitForLoaded();
  });

  test('treats the email as case-insensitive', async ({ login, homePage }) => {
    await login(credentials.email.toUpperCase(), credentials.password);

    await homePage.waitForLoaded();
  });

  test('logging out ends the session', async ({ login, homePage, page }) => {
    await login(credentials.email, credentials.password);
    await homePage.waitForLoaded();

    await homePage.logout();
    await page.goto('/home');

    await expect(homePage.logoutLink).not.toBeAttached();
  });
});