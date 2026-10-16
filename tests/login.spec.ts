import { test, expect } from '../fixtures/auth.fixture';
import { step } from '../utils/steps';

test.describe('Login', () => {
  test('rejects invalid credentials', async ({ page, loginPage, boardPage }) => {
    await step(page, 'Open the login page', async () => {
      await loginPage.goto();
    });

    await step(page, 'Submit a wrong password', async () => {
      await loginPage.login('admin', 'wrong-password');
    });

    await step(page, 'Verify the error is shown and the user stays logged out', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
      await expect(boardPage.logoutButton).toHaveCount(0);
      await loginPage.errorMessage.highlight();
    });
  });
});
