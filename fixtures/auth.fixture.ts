import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import { credentials } from '../utils/env';
import { step } from '../utils/steps';

type Fixtures = {
  loginPage: LoginPage;
  boardPage: BoardPage;
  /** A BoardPage that is already logged in with the configured credentials. */
  loggedInBoard: BoardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  boardPage: async ({ page }, use) => {
    await use(new BoardPage(page));
  },
  loggedInBoard: async ({ loginPage, boardPage }, use) => {
    await step(loginPage.page, 'Login to Demo App', async () => {
      await loginPage.goto();
      await loginPage.login(credentials.username, credentials.password);
      await expect(boardPage.logoutButton).toBeVisible();
    });
    await use(boardPage);
  },
});

export { expect };
