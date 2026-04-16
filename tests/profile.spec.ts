import { test, expect } from '@playwright/test';

test.describe('User Profile Feature', () => {
  test('should view a user profile, update display name, and edit bio', async ({ page }) => {
    // 1. Visit the login page and authenticate (assuming testuser already exists)
    // Note: In a real CI environment, you would seed this user before the test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@echo.test');
    await page.fill('input[name="password"]', 'echo123456');
    await page.click('button:has-text("Sign In")');

    // Wait for successful login redirect
    await page.waitForURL('**/');

    // 2. Navigate to user profile settings page
    // We expect a navigation link or we can go directly
    await page.goto('/profile');

    // 3. Verify the form exists
    await expect(page.locator('h2', { hasText: 'Profile Settings' })).toBeVisible();

    // 4. Update the handle, display name and bio
    await page.fill('input[name="handle"]', 'echomaster');
    await page.fill('input[name="display_name"]', 'Echo Master');
    await page.fill('textarea[name="bio"]', 'Building a minimal microblog MVP.');
    await page.click('button:has-text("Save Profile")');

    // 5. Verify the update was successful
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
    
    // 6. Verify values persisted
    await expect(page.locator('input[name="handle"]')).toHaveValue('echomaster');
    await expect(page.locator('input[name="display_name"]')).toHaveValue('Echo Master');
    await expect(page.locator('textarea[name="bio"]')).toHaveValue('Building a minimal microblog MVP.');
  });
});
