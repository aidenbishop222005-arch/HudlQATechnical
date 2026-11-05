import { expect, type Locator, type Page } from '@playwright/test';

export class SignupBirthdayPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthYearSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /birthday/i });
    this.birthMonthSelect = page.getByTestId('dob-month-select');
    this.birthYearSelect = page.getByTestId('dob-year-select');
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}
