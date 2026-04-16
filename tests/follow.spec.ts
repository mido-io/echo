import { test, expect } from '@playwright/test';

test.describe('Follow System', () => {
  test('should allow a user to follow and unfollow another user', async ({ page }) => {
    // 1. Authenticate
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@echo.test');
    await page.fill('input[name="password"]', 'echo123456');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/');

    // 2. Navigate to a specific user's public profile
    await page.goto('/targetuser123');

    // 3. Find and click Follow
    const followButton = page.locator('button:has-text("Follow")');
    await expect(followButton).toBeVisible();
    await followButton.click();

    // 4. Verify it switches to Unfollow
    const unfollowButton = page.locator('button:has-text("Unfollow")');
    await expect(unfollowButton).toBeVisible();

    // 5. Unfollow and verify it switches back
    await unfollowButton.click();
    await expect(followButton).toBeVisible();
  });
});
