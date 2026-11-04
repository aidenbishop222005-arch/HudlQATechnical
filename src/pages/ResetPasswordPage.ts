import { expect, type Locator, type Page } from '@playwright/test';

export class ResetPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly goBackButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Reset Password' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.goBackButton = page.getByRole('button', { name: 'Go Back' });
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}