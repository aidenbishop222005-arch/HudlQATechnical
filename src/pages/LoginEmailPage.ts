import { expect, type Locator, type Page } from '@playwright/test';

export class LoginEmailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly logo: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly createAccountLink: Locator;
  readonly googleButton: Locator;
  readonly facebookButton: Locator;
  readonly appleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Log In' });
    this.logo = page.getByRole('img', { name: /hudl/i });
    this.emailInput = page.getByTestId('email-input-input');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.createAccountLink = page.getByRole('link', { name: 'Create Account' });
    this.googleButton = page.getByRole('button', { name: 'Continue with Google' });
    this.facebookButton = page.getByRole('button', { name: 'Continue with Facebook' });
    this.appleButton = page.getByRole('button', { name: 'Continue with Apple' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.heading).toBeVisible();
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }
}