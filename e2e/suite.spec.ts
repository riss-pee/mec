import { test, expect } from '@playwright/test';

test.describe('Zirna STEM Studio Hub (MEC Layout) & Navigation Suite', () => {
  test('should load the Hub with MEC layout, all 7 modules and branding', async ({ page }) => {
    await page.goto('/');

    // Check main title is visible
    await expect(page.locator('h1')).toBeVisible();

    // Check MEC navbar brand
    await expect(page.locator('nav').first()).toContainText('ZIRNA STEM STUDIO');

    // Check module cards count (7 interactive workshop cards)
    const cards = page.locator('.glass-card');
    await expect(cards).toHaveCount(7);
  });

  test('should filter modules by category and search keyword', async ({ page }) => {
    await page.goto('/');

    // Filter by Fractions
    await page.getByRole('button', { name: /Fractions & Parts/i }).click();
    const fractionCards = page.locator('h3:has-text("Fraction")');
    await expect(fractionCards).toHaveCount(2);

    // Switch back to All Modules before searching
    await page.getByRole('button', { name: /All Modules/i }).click();

    // Search filter for optics
    const searchInput = page.getByPlaceholder('Search in modules...');
    await searchInput.fill('optics');
    await expect(page.locator('h3:has-text("Ray Tracing Optics Lab")')).toBeVisible();
  });

  test('should navigate into a module and return to Hub', async ({ page }) => {
    await page.goto('/');

    // Launch Fraction Zirna Playground
    await page.getByRole('button', { name: /Launch Game/i }).first().click();

    // Verify module wrapper header is visible
    await expect(page.getByText('Hub Overview')).toBeVisible();

    // Click Back to Hub
    await page.getByRole('button', { name: /Hub Overview/i }).click();

    // Verify back on Hub
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should toggle command palette and jump to module', async ({ page }) => {
    await page.goto('/');

    // Open search launcher via keyboard shortcut Control+K
    await page.keyboard.press('Control+k');

    // Search for abacus
    const searchInput = page.getByPlaceholder('Search games, concepts, topics');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('abacus');

    // Click abacus result inside command palette modal
    await page.locator('.max-h-80 button').filter({ hasText: 'Interactive Abacus Studio' }).click();

    // Verify Abacus module is active in the top header
    await expect(page.locator('header').getByText('Interactive Abacus Studio')).toBeVisible();
  });
});
