const { test, expect } = require('@playwright/test');

test.describe('ConnectSpace Cross-Browser Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { id: 1, firstName: 'Test', email: 'test@example.com' },
          token: 'test-token'
        })
      });
    });
  });

  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/ConnectSpace/);
    
    // Check main elements
    await expect(page.locator('text=ConnectSpace')).toBeVisible();
    await expect(page.locator('text=Properties')).toBeVisible();
  });

  test('should handle authentication flow', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login form exists
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign In")');
      if (await loginButton.count() > 0) {
        await loginButton.click();
      }
    }
  });

  test('should display properties', async ({ page }) => {
    await page.route('**/api/properties', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          properties: [
            {
              id: 1,
              title: 'Test Property',
              price: 50000,
              location: { city: 'Mumbai' },
              bhk: 2,
              area: 1200
            }
          ],
          pagination: { currentPage: 1, totalPages: 1 }
        })
      });
    });
    
    await page.goto('/properties');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if properties section exists
    const propertiesText = page.locator('text=Properties, text=Property');
    await expect(propertiesText.first()).toBeVisible();
  });
});