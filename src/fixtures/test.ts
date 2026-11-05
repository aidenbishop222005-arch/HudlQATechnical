import { test as base, expect } from '@playwright/test';
import { LoginEmailPage } from '../pages/LoginEmailPage';
import { LoginPasswordPage } from '../pages/LoginPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { SignupBirthdayPage } from '../pages/SignupBirthdayPage';
import { HomePage } from '../pages/HomePage';
import AxeBuilder from '@axe-core/playwright';

type LoginFixtures = {
  loginEmailPage: LoginEmailPage;
  loginPasswordPage: LoginPasswordPage;
  resetPasswordPage: ResetPasswordPage;
  signupBirthdayPage: SignupBirthdayPage;
  homePage: HomePage;
  login: (email: string, password: string) => Promise<void>;
  makeAxeBuilder: () => AxeBuilder;
  dialogs: string[];
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
  makeAxeBuilder: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']),
    );
  },
  dialogs: async ({ page }, use) => {
    const messages: string[] = [];
    page.on('dialog', (dialog) => {
      messages.push(dialog.message());
      void dialog.dismiss();
    });
    await use(messages);
  },
});

export { expect };
