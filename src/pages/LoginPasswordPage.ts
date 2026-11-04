import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailDisplay: Locator;
  readonly editEmailLink: Locator;
  readonly passwordInput: Locator;
  readonly togglePasswordButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly continueButton: Locator;
  // TODO: add errorMessage locator once we've seen the real error markup

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Log In' });
    this.emailDisplay = page.getByTestId('email-display-input');
    this.editEmailLink = page.getByTestId('edit-identifier');
    this.passwordInput = page.getByTestId('password-input-input');
    this.togglePasswordButton = page.getByTestId('toggle-password-visibility');
    this.forgotPasswordLink = page.getByTestId('forgot-password');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.passwordInput).toBeVisible();
  }

  async submitPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.continueButton.click();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.togglePasswordButton.click();
  }
}