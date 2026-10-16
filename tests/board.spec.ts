import { test, expect } from '../fixtures/auth.fixture';
import { step } from '../utils/steps';
import testCases from './data/testCases.json';

type TestCase = {
  id: number;
  project: string;
  task: string;
  column: string;
  tags: string[];
};

test.describe('Project board - data driven', () => {
  for (const tc of testCases as TestCase[]) {
    test(`TC${tc.id}: "${tc.task}" is in "${tc.column}" on ${tc.project}`, async ({ page, loggedInBoard: board }) => {
      await step(page, `Navigate to "${tc.project}"`, async () => {
        await board.openProject(tc.project);
      });

      const column = board.column(tc.column);
      const card = board.taskCard(column, tc.task);

      await step(page, `Verify "${tc.task}" is in the "${tc.column}" column`, async () => {
        await expect(column, `column "${tc.column}" should exist`).toHaveCount(1);
        await expect(card, `"${tc.task}" should be in "${tc.column}"`).toHaveCount(1);
        await card.highlight();
      });

      for (const tag of tc.tags) {
        await step(page, `Confirm tag "${tag}"`, async () => {
          const tagLocator = board.tags(card).filter({ hasText: new RegExp(`^${tag}$`) });
          await expect(tagLocator, `tag "${tag}"`).toHaveCount(1);
          await tagLocator.highlight();
        });
      }
    });
  }
});
