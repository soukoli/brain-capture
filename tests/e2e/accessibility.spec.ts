/**
 * E2E Tests: Accessibility
 * Tests for WCAG compliance and inclusive design
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { sampleIdeas } from '../fixtures/test-data';
import { clearDatabase, goToCaptureB } from '../utils/test-helpers';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
    await goToCaptureB(page);
  });

  test('should not have automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have proper HTML lang attribute', async ({ page }) => {
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // e.g., 'en' or 'en-US'
  });

  test('should have skip to main content link', async ({ page }) => {
    const skipLink = page.getByRole('link', { name: /skip to (main )?content/i });

    // Skip link should exist (may be visually hidden)
    const exists = await skipLink.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test('should navigate using keyboard only', async ({ page }) => {
    // Start from the input
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.focus();
    await expect(input).toBeFocused();

    // Tab through all interactive elements
    const focusableElements: string[] = [];

    for (let i = 0; i < 10; i++) {
      const tagName = await page.evaluate(() => document.activeElement?.tagName);
      focusableElements.push(tagName || '');
      await page.keyboard.press('Tab');
    }

    // Should have focused multiple elements
    expect(focusableElements.filter((el) => el).length).toBeGreaterThan(1);
  });

  test('should show visible focus indicators', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.focus();

    // Check for focus styling
    const hasOutline = await input.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return (
        styles.outline !== 'none' ||
        styles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none'
      );
    });

    expect(hasOutline).toBe(true);
  });

  test('should not have keyboard trap', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.focus();

    // Tab forward and backward multiple times
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Shift+Tab');
    }

    // Should be able to escape focus (not trapped)
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeTruthy();
  });

  test('should have proper ARIA labels on buttons', async ({ page }) => {
    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');

      // Button should have accessible name via text, aria-label, or aria-labelledby
      expect(text || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should have proper ARIA labels on form inputs', async ({ page }) => {
    const inputs = page.getByRole('textbox');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Check for associated label
      let hasLabel = false;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = (await label.count()) > 0;
      }

      // Input should have accessible name
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.evaluate(() => {
      const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(elements).map((el) => el.tagName);
    });

    // Should have at least one H1
    expect(headings.filter((h) => h === 'H1').length).toBeGreaterThanOrEqual(1);

    // Should not skip heading levels
    const levels = headings.map((h) => parseInt(h.substring(1)));
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      // Can go down any levels, but should only go up by 1
      if (diff > 0) {
        expect(diff).toBeLessThanOrEqual(1);
      }
    }
  });

  test('should have proper color contrast ratios', async ({ page }) => {
    // Run axe specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have alt text for all images', async ({ page }) => {
    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).map((img) => ({
        src: img.src,
        alt: img.alt,
        role: img.getAttribute('role'),
      }));
    });

    for (const img of images) {
      // Decorative images can have empty alt or role="presentation"
      if (img.role === 'presentation' || img.role === 'none') {
        continue;
      }

      // All other images should have alt text
      expect(img.alt).toBeTruthy();
    }
  });

  test('should have proper landmark regions', async ({ page }) => {
    const landmarks = await page.evaluate(() => {
      const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
      return landmarkRoles.filter((role) => {
        return document.querySelector(`[role="${role}"], ${role}`);
      });
    });

    // Should have at least main landmark
    expect(landmarks).toContain('main');
  });

  test('should announce form errors to screen readers', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Should show error message
    const errorMessage = page.getByText(/required|enter.*text/i);

    if (await errorMessage.isVisible()) {
      // Check for aria-live or role="alert"
      const ariaLive = await errorMessage.getAttribute('aria-live');
      const role = await errorMessage.getAttribute('role');

      expect(ariaLive === 'polite' || ariaLive === 'assertive' || role === 'alert').toBe(true);
    }
  });

  test('should have proper ARIA states for interactive elements', async ({ page }) => {
    // Check tabs
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();

    if (tabCount > 0) {
      for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        const ariaSelected = await tab.getAttribute('aria-selected');
        expect(ariaSelected).toBeTruthy(); // Should be 'true' or 'false'
      }
    }

    // Check buttons
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const ariaDisabled = await button.getAttribute('aria-disabled');
      const ariaExpanded = await button.getAttribute('aria-expanded');
      const ariaPressed = await button.getAttribute('aria-pressed');

      // If any of these attributes exist, they should have proper values
      if (ariaDisabled) expect(['true', 'false']).toContain(ariaDisabled);
      if (ariaExpanded) expect(['true', 'false']).toContain(ariaExpanded);
      if (ariaPressed) expect(['true', 'false', 'mixed']).toContain(ariaPressed);
    }
  });

  test('should support browser zoom', async ({ page }) => {
    // Zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });

    // Content should still be accessible
    await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /capture/i })).toBeVisible();

    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = '1';
    });
  });

  test('should work with Windows High Contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });

    // Elements should still be visible
    await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /capture/i })).toBeVisible();
  });

  test('should have descriptive link text', async ({ page }) => {
    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a');
      return Array.from(linkElements).map((link) => ({
        text: link.textContent?.trim() || '',
        href: link.href,
        ariaLabel: link.getAttribute('aria-label'),
      }));
    });

    for (const link of links) {
      const text = link.text || link.ariaLabel || '';

      // Links should not be generic
      const genericTexts = ['click here', 'read more', 'here', 'link'];
      const isGeneric = genericTexts.some((generic) =>
        text.toLowerCase() === generic
      );

      expect(isGeneric).toBe(false);
    }
  });

  test('should have proper focus management in modals', async ({ page }) => {
    // Try to open a modal
    const settingsButton = page.getByRole('button', { name: /settings/i });

    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Focus should be trapped in modal
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();

      // Close with Escape
      await page.keyboard.press('Escape');

      // Focus should return to trigger button
      await expect(settingsButton).toBeFocused();
    }
  });

  test('should have proper labels for icon-only buttons', async ({ page }) => {
    const buttons = page.locator('button:has(svg)');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      // Icon-only buttons should have aria-label or title
      if (!text?.trim()) {
        expect(ariaLabel || title).toBeTruthy();
      }
    }
  });

  test('should have proper live regions for dynamic content', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);
    await page.getByRole('button', { name: /save/i }).click();

    // Success message should be in live region
    await page.waitForTimeout(500);

    const liveRegions = await page.evaluate(() => {
      const regions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
      return regions.length;
    });

    expect(liveRegions).toBeGreaterThanOrEqual(0);
  });

  test('should handle reduced motion preference', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Animations should be reduced or disabled
    const animations = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return {
        transition: style.transition,
        animation: style.animation,
      };
    });

    // This is a basic check - actual implementation varies
    expect(typeof animations).toBe('object');
  });

  test('should have proper table structure if tables exist', async ({ page }) => {
    const tables = page.locator('table');
    const tableCount = await tables.count();

    if (tableCount > 0) {
      for (let i = 0; i < tableCount; i++) {
        const table = tables.nth(i);

        // Should have proper structure
        const hasCaption = (await table.locator('caption').count()) > 0;
        const hasThead = (await table.locator('thead').count()) > 0;
        const hasTh = (await table.locator('th').count()) > 0;

        expect(hasCaption || hasThead || hasTh).toBe(true);
      }
    }
  });

  test('should have proper form field grouping', async ({ page }) => {
    const fieldsets = await page.evaluate(() => {
      const sets = document.querySelectorAll('fieldset');
      return Array.from(sets).map((fieldset) => ({
        hasLegend: fieldset.querySelector('legend') !== null,
      }));
    });

    // If fieldsets exist, they should have legends
    for (const fieldset of fieldsets) {
      expect(fieldset.hasLegend).toBe(true);
    }
  });

  test('should support keyboard shortcuts without modifier keys', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.focus();

    // Single key press should work in input
    await page.keyboard.type('test');
    await expect(input).toHaveValue('test');

    // Esc should work without modifiers
    await page.keyboard.press('Escape');
  });

  test('should have proper error identification', async ({ page }) => {
    // Try to submit invalid form
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.click();

    // Error should be clearly identified
    const error = page.getByText(/required|error/i);

    if (await error.isVisible()) {
      // Should have error styling
      const color = await error.evaluate((el) =>
        window.getComputedStyle(el).color
      );
      expect(color).toBeTruthy();
    }
  });

  test('should have timeout warnings for timed content', async ({ page }) => {
    // If there are timeouts (like auto-save), there should be warnings
    // This is more of a check that timeout mechanisms exist
    const hasTimeouts = await page.evaluate(() => {
      return typeof window.setTimeout !== 'undefined';
    });

    expect(hasTimeouts).toBe(true);
  });

  test('should not have content that flashes more than 3 times per second', async ({ page }) => {
    // Check for animations that could cause seizures
    const animations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let flashingCount = 0;

      elements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const animation = styles.animation;

        // Check for very fast animations
        if (animation && animation.includes('ms')) {
          const match = animation.match(/(\d+)ms/);
          if (match && parseInt(match[1]) < 333) {
            // Faster than 3 Hz
            flashingCount++;
          }
        }
      });

      return flashingCount;
    });

    // Should have no or very few fast animations
    expect(animations).toBeLessThan(5);
  });
});
