/**
 * E2E Tests: Visual Regression
 * Tests for visual consistency across browsers and viewports
 */

import { test, expect } from '@playwright/test';
import { clearDatabase } from '../utils/test-helpers';

test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
  });

  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match homepage in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match homepage in light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-light.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match capture form with text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill('This is a test idea for visual regression testing');

    await expect(page).toHaveScreenshot('capture-with-text.png', {
      animations: 'disabled',
    });
  });

  test('should match voice tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('tab', { name: /voice/i }).click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('voice-tab.png', {
      animations: 'disabled',
    });
  });

  test('should match mobile viewport (iPhone)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('mobile-iphone.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match mobile viewport (Android)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('mobile-android.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match desktop viewport (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('desktop-1920.png', {
      fullPage: false,
      animations: 'disabled',
    });
  });

  test('should match desktop viewport (1366x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('desktop-1366.png', {
      fullPage: false,
      animations: 'disabled',
    });
  });

  test('should match button states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const saveButton = page.getByRole('button', { name: /save/i });

    // Disabled state
    await expect(saveButton).toHaveScreenshot('button-disabled.png');

    // Enabled state
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill('Test');
    await expect(saveButton).toHaveScreenshot('button-enabled.png');

    // Hover state
    await saveButton.hover();
    await expect(saveButton).toHaveScreenshot('button-hover.png');

    // Focus state
    await saveButton.focus();
    await expect(saveButton).toHaveScreenshot('button-focus.png');
  });

  test('should match input states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const input = page.getByRole('textbox', { name: /capture/i });

    // Empty state
    await expect(input).toHaveScreenshot('input-empty.png');

    // Focus state
    await input.focus();
    await expect(input).toHaveScreenshot('input-focus.png');

    // Filled state
    await input.fill('Test idea');
    await expect(input).toHaveScreenshot('input-filled.png');
  });

  test('should match error states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trigger validation error
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.click();

    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('error-state.png', {
      animations: 'disabled',
    });
  });

  test('should match success message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill('Success test');

    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Wait for success message
    await page.waitForSelector('text=/saved/i', { state: 'visible', timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('success-state.png', {
      animations: 'disabled',
    });
  });

  test('should match loading state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill('Loading test');

    const saveButton = page.getByRole('button', { name: /save/i });

    // Intercept request to slow it down
    await page.route('**/api/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });

    // Click and immediately screenshot
    const clickPromise = saveButton.click();
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot('loading-state.png', {
      animations: 'disabled',
    });

    await clickPromise;
  });

  test('should match with saved ideas', async ({ page }) => {
    // Pre-populate with ideas
    await page.goto('/');
    await page.evaluate(() => {
      const ideas = [
        {
          id: '1',
          text: 'First test idea',
          timestamp: new Date().toISOString(),
          source: 'text',
        },
        {
          id: '2',
          text: 'Second test idea',
          timestamp: new Date().toISOString(),
          source: 'text',
        },
        {
          id: '3',
          text: 'Third test idea',
          timestamp: new Date().toISOString(),
          source: 'text',
        },
      ];
      localStorage.setItem('brain-capture-ideas', JSON.stringify(ideas));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('with-ideas.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match empty state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('empty-state.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match high contrast mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('high-contrast.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match reduced motion mode', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('reduced-motion.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match with long text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const longText = 'This is a very long idea that tests how the application handles lengthy content. '.repeat(5);
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(longText);

    await expect(page).toHaveScreenshot('long-text.png', {
      animations: 'disabled',
    });
  });

  test('should match RTL layout (if supported)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('rtl-layout.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match zoomed in (150%)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.body.style.zoom = '1.5';
    });

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('zoomed-150.png', {
      fullPage: false,
      animations: 'disabled',
    });
  });

  test('should match zoomed in (200%)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('zoomed-200.png', {
      fullPage: false,
      animations: 'disabled',
    });
  });

  test('should match specific component: header', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('component-header.png', {
      animations: 'disabled',
    });
  });

  test('should match specific component: capture form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const form = page.locator('form').first().or(page.locator('[data-testid="capture-form"]'));
    if (await form.count() > 0) {
      await expect(form).toHaveScreenshot('component-form.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match across browser updates', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Browser-specific screenshots
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match font rendering', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Ensure fonts are loaded
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('font-rendering.png', {
      fullPage: false,
      animations: 'disabled',
    });
  });

  test('should match with custom theme colors', async ({ page }) => {
    await page.goto('/');

    // Apply custom theme if supported
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--primary-color', '#ff0000');
      document.documentElement.style.setProperty('--background-color', '#f0f0f0');
    });

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('custom-theme.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Cross-Browser', () => {
  test('should look consistent across Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('cross-browser-chromium.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should look consistent across Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('cross-browser-firefox.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should look consistent across WebKit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'WebKit-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('cross-browser-webkit.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
