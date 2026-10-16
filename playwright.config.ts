import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './utils/env';

// Workers don't see the CLI flags, but they inherit env vars set here in the main process
if (process.argv.includes('--headed') && !process.env.SLOW_MO) {
  process.env.SLOW_MO = '700';
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list', { printSteps: true }], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Pause between actions so a headed run can be watched; SLOW_MO=<ms> overrides
    launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
