import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly userMenuTrigger: Locator;
  readonly userMenuEmail: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userMenuTrigger = page.locator('.hui-globaluseritem');
    this.userMenuEmail = page.locator('.hui-globaluseritem__email');
    this.logoutLink = page.getByTestId('webnav-usermenu-logout');
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/hudl\.com\/home/);
    await expect(this.logoutLink).toBeAttached();
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuTrigger.hover();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutLink.click();
  }
}