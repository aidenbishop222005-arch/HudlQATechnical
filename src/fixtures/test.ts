import { test as base, expect } from '@playwright/test';
import { LoginEmailPage } from '../pages/LoginEmailPage';
import { LoginPasswordPage } from '../pages/LoginPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { SignupBirthdayPage } from '../pages/SignupBirthdayPage';
import { HomePage } from '../pages/HomePage';

type LoginFixtures = {
  loginEmailPage: LoginEmailPage;
  loginPasswordPage: LoginPasswordPage;
  resetPasswordPage: ResetPasswordPage;
  signupBirthdayPage: SignupBirthdayPage;
  homePage: HomePage;
  login: (email: string, password: string) => Promise<void>;
};

export const test = base.extend<LoginFixtures>({
  loginEmailPage: async ({ page }, use) => {
    await use(new LoginEmailPage(page));
  },
  loginPasswordPage: async ({ page }, use) => {
    await use(new LoginPasswordPage(page));
  },
  resetPasswordPage: async ({ page }, use) => {
    await use(new ResetPasswordPage(page));
  },
  signupBirthdayPage: async ({ page }, use) => {
    await use(new SignupBirthdayPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  login: async ({ loginEmailPage, loginPasswordPage }, use) => {
    await use(async (email: string, password: string) => {
      await loginEmailPage.goto();
      await loginEmailPage.submitEmail(email);
      await loginPasswordPage.waitForLoaded();
      await loginPasswordPage.submitPassword(password);
    });
  },
});

export { expect };
