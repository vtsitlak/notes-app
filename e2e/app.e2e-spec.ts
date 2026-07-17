import { test, expect } from '@playwright/test';
import { NotesAppPage } from './app.po';

test.describe('NotesApp', () => {
  let app: NotesAppPage;

  test.beforeEach(async ({ page }) => {
    app = new NotesAppPage(page);
  });

  test('should show login page by default', async ({ page }) => {
    await app.gotoLogin();
    await app.expectToolbarTitle();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should login and show notes list', async ({ page }) => {
    await app.gotoLogin();
    await app.login();
    await app.expectNotesHeading();
    await expect(page.getByRole('tab', { name: 'All Notes' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Important' })).toBeVisible();
  });

  test('should logout from toolbar', async ({ page }) => {
    await app.gotoLogin();
    await app.login();
    await app.logoutFromToolbar();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should open create note dialog', async ({ page }) => {
    await app.gotoLogin();
    await app.login();
    await page.getByRole('button').filter({ has: page.locator('mat-icon', { hasText: 'add' }) }).click();
    await expect(page.getByText('Create Note')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
  });
});
