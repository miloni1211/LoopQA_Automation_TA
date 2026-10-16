import { Page, Locator, expect } from '@playwright/test';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class BoardPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly projectHeading: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('nav');
    this.projectHeading = page.locator('header h1');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async openProject(name: string) {
    await this.sidebar
      .getByRole('button')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) })
      .click();
    await expect(this.projectHeading).toHaveText(name);
  }

  /** A board column, matched by its heading text, e.g. "To Do (2)" for "To Do". */
  column(name: string): Locator {
    const heading = this.page.locator('h2', {
      hasText: new RegExp(`^\\s*${escapeRegex(name)}\\s*\\(\\d+\\)\\s*$`),
    });
    return this.page.locator('main div.w-80').filter({ has: heading });
  }

  /** A task card inside the given column, matched by its exact title. */
  taskCard(column: Locator, title: string): Locator {
    return column
      .locator('div.bg-white')
      .filter({ has: this.page.getByRole('heading', { name: title, exact: true }) });
  }

  tags(card: Locator): Locator {
    return card.locator('span.rounded-full');
  }
}
