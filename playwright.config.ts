import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config for NotesApp (Angular 22).
 * Replaces the deprecated Protractor setup.
 *
 * Prerequisites:
 * - `npm run server` on port 9000
 * - app available at http://localhost:4200 (started by webServer below)
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.(e2e-)?spec\.ts/,
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 180_000
  }
});
