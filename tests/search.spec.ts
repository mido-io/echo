import { test, expect } from '@playwright/test';

test.describe('Global Search Feature', () => {
  test('should search for a user handle and display the result', async ({ page }) => {
    // 1. Visit the home page
    await page.goto('/');

    // 2. Locate the navigation search bar
    const searchInput = page.locator('input[name="searchQuery"]');
    
    // 3. Ensure the search bar is visible
    await expect(searchInput).toBeVisible();

    // 4. Fill in the search query and press Enter
    await searchInput.fill('echomaster');
    await searchInput.press('Enter');

    // 5. Verify navigation to the search results page
    await page.waitForURL('**/search?q=echomaster');

    // 6. Verify the search results display the expected user
    // Note: This expects 'echomaster' to exist in the database already.
    await expect(page.locator('text=@echomaster')).toBeVisible();
  });
});
