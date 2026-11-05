import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly globalNav: Locator;
  readonly userMenuTrigger: Locator;
  readonly userMenuEmail: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNav = page.getByTestId('global-navbar');
    this.userMenuTrigger = this.globalNav.locator('.hui-globaluseritem');
    this.userMenuEmail = this.globalNav.locator('.hui-globaluseritem__email');
    this.logoutLink = this.globalNav.getByTestId('webnav-usermenu-logout');
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/hudl\.com\/home/, { timeout: 15_000 });
    await expect(this.userMenuTrigger).toBeVisible();
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuTrigger.hover();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutLink.click();
  }
}
