import { test, expect } from '@playwright/test';

test.describe('Advanced Search & Discovery', () => {
  test('should search for both users and posts by keyword', async ({ page }) => {
    // 1. Visit the search page directly
    await page.goto('/search?q=nextjs');

    // 2. Verify we see User Results
    await expect(page.locator('h3:has-text("Users")')).toBeVisible();

    // 3. Verify we see Post Results
    await expect(page.locator('h3:has-text("Posts")')).toBeVisible();

    // 4. Verify post content matching query is present
    // Assuming there's a seeded post with "nextjs"
    const postResult = page.locator('div[data-testid="post-result"]');
    await expect(postResult.first()).toContainText(/nextjs/i);
  });
});
