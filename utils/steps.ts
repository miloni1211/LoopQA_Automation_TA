import { test, Page } from '@playwright/test';

// SLOW_MO is set by `--headed` in playwright.config.ts; 0 means a normal, fast run
const watchDelay = Number(process.env.SLOW_MO) || 0;
export const isWatchMode = watchDelay > 0;

/**
 * Runs a named test step. In watch mode it also shows the step name in a banner
 * on the page and pauses afterwards so a viewer can follow along.
 */
export async function step(page: Page, title: string, body: () => Promise<void>) {
  await test.step(title, async () => {
    if (!isWatchMode) {
      await body();
      return;
    }
    const label = `${test.info().title.split(':')[0]} › ${title}`;
    await showBanner(page, label);
    await body();
    // Shown again in case the step navigated to a new page and removed the banner
    await showBanner(page, label);
    await page.waitForTimeout(watchDelay);
  }, { box: true }); // report the caller's line (the spec), not this helper's
}

async function showBanner(page: Page, text: string) {
  await page.evaluate((label) => {
    let banner = document.getElementById('pw-step-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pw-step-banner';
      banner.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:2147483647',
        'padding:10px 16px', 'background:#111827', 'color:#facc15',
        'font:600 16px/1.4 system-ui,sans-serif', 'pointer-events:none',
        'box-shadow:0 2px 8px rgba(0,0,0,.4)',
      ].join(';');
      document.body.appendChild(banner);
    }
    banner.textContent = `▶ ${label}`;
  }, text);
}
