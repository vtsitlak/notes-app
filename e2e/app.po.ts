import { Page, expect } from '@playwright/test';

export class NotesAppPage {
  constructor(private readonly page: Page) {}

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 10_000 });
  }

  /**
   * Defaults already match auth.json credentials.
   * Avoid Playwright fill() on Signal Forms — it can leave the form invalid/disabled.
   */
  async login(): Promise<void> {
    const loginButton = this.page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeEnabled();

    const loginResponse = this.page.waitForResponse(
      (res) => res.url().includes('/api/login') && res.request().method() === 'POST',
      { timeout: 15_000 }
    );

    await loginButton.click();
    const response = await loginResponse;
    expect(response.ok()).toBeTruthy();

    await expect(this.page).toHaveURL(/\/notes/, { timeout: 15_000 });
  }

  async expectToolbarTitle(): Promise<void> {
    await expect(this.page.getByText('Notes App')).toBeVisible();
  }

  async expectNotesHeading(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'All Notes' })).toBeVisible();
  }

  async logoutFromToolbar(): Promise<void> {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.page).toHaveURL(/\/login/);
  }
}
