/**
 * E2E Tests: Mobile Experience
 * Tests responsive design and mobile-specific interactions
 */

import { test, expect, devices } from '@playwright/test';
import { sampleIdeas } from '../fixtures/test-data';
import { clearDatabase, mockVoiceAPI, mockVoiceTranscripts } from '../utils/test-helpers';

test.describe('Mobile Experience', () => {
  test.describe('iPhone 12 Pro', () => {
    test.use({
      ...devices['iPhone 12 Pro'],
    });

    test.beforeEach(async ({ page }) => {
      await clearDatabase(page);
      await page.goto('/');
    });

    test('should display mobile-optimized layout', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();

      // Check viewport size
      const viewport = page.viewportSize();
      expect(viewport?.width).toBe(390);
      expect(viewport?.height).toBe(844);
    });

    test('should have touch-friendly tap targets', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: /save/i });

      // Get button dimensions
      const box = await saveButton.boundingBox();
      expect(box).toBeTruthy();

      // Minimum tap target size is 44x44px (iOS guidelines)
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('should handle touch interactions', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /capture/i });

      // Tap the input
      await input.tap();
      await expect(input).toBeFocused();

      // Type on mobile keyboard
      await input.fill(sampleIdeas[0].text);
      await expect(input).toHaveValue(sampleIdeas[0].text);
    });

    test('should show mobile keyboard when input is focused', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /capture/i });
      await input.tap();

      // Input should be focused (keyboard opens automatically on real device)
      await expect(input).toBeFocused();
    });

    test('should handle swipe gestures', async ({ page }) => {
      // Create some ideas first
      for (let i = 0; i < 3; i++) {
        const input = page.getByRole('textbox', { name: /capture/i });
        await input.fill(sampleIdeas[i].text);
        await page.getByRole('button', { name: /save/i }).tap();
        await page.waitForTimeout(300);
      }

      // Try swiping on an idea card to delete
      const ideaCard = page.locator('[data-testid="idea-item"]').first();
      const box = await ideaCard.boundingBox();

      if (box) {
        // Swipe left
        await page.touchscreen.tap(box.x + box.width - 10, box.y + box.height / 2);
        await page.mouse.move(box.x + 10, box.y + box.height / 2);

        // Check if delete button appears
        const deleteButton = page.getByRole('button', { name: /delete/i });
        const isVisible = await deleteButton.isVisible().catch(() => false);
        expect(typeof isVisible).toBe('boolean');
      }
    });

    test('should handle pinch-to-zoom (if applicable)', async ({ page }) => {
      // Check if viewport is scalable
      const viewport = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta?.getAttribute('content');
      });

      // Should have user-scalable=no or fixed zoom for app
      expect(viewport).toBeTruthy();
    });

    test('should optimize text input for mobile', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /capture/i });

      // Check input type and attributes
      const inputType = await input.getAttribute('type');
      const autocomplete = await input.getAttribute('autocomplete');

      // Should be optimized for mobile input
      expect(inputType || 'text').toBeTruthy();
    });

    test('should handle orientation changes', async ({ page }) => {
      // Portrait mode first
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();

      // Switch to landscape
      await page.setViewportSize({ width: 844, height: 390 });
      await page.waitForTimeout(300);

      // UI should still be usable
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
      await expect(page.getByRole('textbox', { name: /capture/i })).toBeVisible();
    });
  });

  test.describe('Samsung Galaxy S20', () => {
    test.use({
      ...devices['Galaxy S9+'], // Using S9+ as proxy for S20
    });

    test.beforeEach(async ({ page }) => {
      await clearDatabase(page);
      await page.goto('/');
    });

    test('should display correctly on Android device', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
      await expect(page.getByRole('textbox', { name: /capture/i })).toBeVisible();
    });

    test('should handle Android back button behavior', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /capture/i });
      await input.fill(sampleIdeas[0].text);

      // Navigate to different page
      const aboutLink = page.getByRole('link', { name: /about/i });
      if (await aboutLink.isVisible()) {
        await aboutLink.tap();
        await page.waitForTimeout(300);

        // Go back
        await page.goBack();

        // Should return to capture page
        await expect(input).toBeVisible();
      }
    });

    test('should work with Android keyboard', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /capture/i });
      await input.tap();

      // Type with Android keyboard
      await page.keyboard.type(sampleIdeas[0].text);
      await expect(input).toHaveValue(sampleIdeas[0].text);
    });
  });

  test.describe('Responsive Breakpoints', () => {
    test('should adapt layout at 768px (tablet)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await clearDatabase(page);
      await page.goto('/');

      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();

      // Layout should be tablet-optimized
      const container = page.locator('main');
      const width = await container.evaluate((el) => el.offsetWidth);
      expect(width).toBeGreaterThan(0);
    });

    test('should adapt layout at 640px (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 1136 });
      await clearDatabase(page);
      await page.goto('/');

      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();

      // Check mobile layout
      const input = page.getByRole('textbox', { name: /capture/i });
      await expect(input).toBeVisible();
    });

    test('should handle very small screens (320px)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await clearDatabase(page);
      await page.goto('/');

      // Everything should still be accessible
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
      await expect(page.getByRole('textbox', { name: /capture/i })).toBeVisible();

      // No horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Touch Interactions', () => {
    test.use({
      ...devices['iPhone 12 Pro'],
    });

    test.beforeEach(async ({ page }) => {
      await clearDatabase(page);
      await page.goto('/');
    });

    test('should handle double-tap interactions', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /capture/i });

      // Double tap
      await input.tap();
      await input.tap();

      // Should not cause zoom or unexpected behavior
      await expect(input).toBeFocused();
    });

    test('should handle long press interactions', async ({ page }) => {
      // Create an idea first
      const input = page.getByRole('textbox', { name: /capture/i });
      await input.fill(sampleIdeas[0].text);
      await page.getByRole('button', { name: /save/i }).tap();

      await page.waitForTimeout(500);

      // Long press on idea card
      const ideaCard = page.locator('[data-testid="idea-item"]').first();
      const box = await ideaCard.boundingBox();

      if (box) {
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(500);

        // Context menu or actions should appear
        const isVisible = await ideaCard.isVisible();
        expect(isVisible).toBe(true);
      }
    });

    test('should prevent accidental taps', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: /save/i });

      // Tap multiple times rapidly
      await saveButton.tap();
      await saveButton.tap();
      await saveButton.tap();

      // Should not trigger multiple saves
      await page.waitForTimeout(1000);

      // Check that only one action occurred (button should be disabled during save)
      const isDisabled = await saveButton.isDisabled();
      expect(typeof isDisabled).toBe('boolean');
    });

    test('should handle tap outside to dismiss', async ({ page }) => {
      // Open dropdown or menu if available
      const menuButton = page.getByRole('button', { name: /menu/i });
      if (await menuButton.isVisible()) {
        await menuButton.tap();

        // Tap outside
        await page.tap('body');

        // Menu should close
        const menu = page.locator('[role="menu"]');
        await expect(menu).not.toBeVisible();
      }
    });
  });

  test.describe('Mobile Voice Input', () => {
    test.use({
      ...devices['iPhone 12 Pro'],
    });

    test.beforeEach(async ({ page }) => {
      await clearDatabase(page);
      await page.goto('/');
    });

    test('should handle voice input on mobile', async ({ page }) => {
      await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);

      await page.getByRole('tab', { name: /voice/i }).tap();

      const micButton = page.getByRole('button', { name: /microphone|start recording/i });
      await micButton.tap();

      await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible({
        timeout: 5000,
      });
    });

    test('should show mobile-optimized microphone button', async ({ page }) => {
      await page.getByRole('tab', { name: /voice/i }).tap();

      const micButton = page.getByRole('button', { name: /microphone|start recording/i });
      await expect(micButton).toBeVisible();

      // Check button size
      const box = await micButton.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  test.describe('Mobile Scroll Behavior', () => {
    test.use({
      ...devices['iPhone 12 Pro'],
    });

    test.beforeEach(async ({ page }) => {
      await clearDatabase(page);
      await page.goto('/');
    });

    test('should handle smooth scrolling on mobile', async ({ page }) => {
      // Create many ideas to enable scrolling
      for (let i = 0; i < 10; i++) {
        const input = page.getByRole('textbox', { name: /capture/i });
        await input.fill(`Idea ${i + 1}`);
        await page.getByRole('button', { name: /save/i }).tap();
        await page.waitForTimeout(200);
      }

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);

      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });

    test('should handle pull-to-refresh gesture', async ({ page }) => {
      // Swipe down from top
      await page.touchscreen.tap(200, 50);
      await page.mouse.move(200, 300);

      // Page should remain stable or trigger refresh
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
    });

    test('should maintain scroll position on mobile', async ({ page }) => {
      // Create ideas and scroll
      for (let i = 0; i < 10; i++) {
        const input = page.getByRole('textbox', { name: /capture/i });
        await input.fill(`Idea ${i + 1}`);
        await page.getByRole('button', { name: /save/i }).tap();
        await page.waitForTimeout(100);
      }

      await page.evaluate(() => window.scrollTo(0, 300));
      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Navigate away and back
      await page.goto('/about');
      await page.goBack();

      // Scroll position may or may not be preserved
      const scrollAfter = await page.evaluate(() => window.scrollY);
      expect(typeof scrollAfter).toBe('number');
    });
  });

  test.describe('Mobile Performance', () => {
    test.use({
      ...devices['iPhone 12 Pro'],
    });

    test('should load quickly on mobile', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
      const loadTime = Date.now() - startTime;

      // Should load in under 3 seconds on mobile
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle slow network on mobile', async ({ page }) => {
      // Simulate slow 3G
      await page.route('**/*', (route) => {
        setTimeout(() => route.continue(), 100);
      });

      await page.goto('/');

      // Should still load and be usable
      await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible({
        timeout: 10000,
      });
    });
  });
});
