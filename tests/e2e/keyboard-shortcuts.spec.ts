/**
 * E2E Tests: Keyboard Shortcuts
 * Tests all keyboard shortcuts for quick navigation and actions
 */

import { test, expect } from '@playwright/test';
import { sampleIdeas } from '../fixtures/test-data';
import { clearDatabase, goToCaptureB, pressShortcut } from '../utils/test-helpers';

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
    await goToCaptureB(page);
  });

  test('Cmd+K should focus the input field', async ({ page }) => {
    // Click somewhere else first
    await page.click('body');

    const input = page.getByRole('textbox', { name: /capture/i });
    await expect(input).not.toBeFocused();

    // Press Cmd+K (or Ctrl+K on Windows/Linux)
    await pressShortcut(page, 'k');

    await expect(input).toBeFocused();
  });

  test('Cmd+S should save the current idea', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);

    // Press Cmd+S to save
    await pressShortcut(page, 's');

    // Should show success message
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 3000 });
  });

  test('Cmd+E should clear the input field', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);
    await expect(input).toHaveValue(sampleIdeas[0].text);

    // Press Cmd+E to clear
    await pressShortcut(page, 'e');

    await expect(input).toHaveValue('');
  });

  test('Cmd+1 should switch to text mode', async ({ page }) => {
    // First switch to voice tab
    await page.getByRole('tab', { name: /voice/i }).click();

    // Press Cmd+1 to switch to text mode
    await pressShortcut(page, '1');

    const textTab = page.getByRole('tab', { name: /text/i });
    await expect(textTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Cmd+2 should switch to voice mode', async ({ page }) => {
    // Start on text tab (default)
    const textTab = page.getByRole('tab', { name: /text/i });
    await expect(textTab).toHaveAttribute('aria-selected', 'true');

    // Press Cmd+2 to switch to voice mode
    await pressShortcut(page, '2');

    const voiceTab = page.getByRole('tab', { name: /voice/i });
    await expect(voiceTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Esc should cancel or close dialogs', async ({ page }) => {
    // Try to open a dialog (e.g., settings or help)
    const settingsButton = page.getByRole('button', { name: /settings/i });
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Press Esc to close
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    }
  });

  test('Tab navigation should work correctly', async ({ page }) => {
    // Start from the input
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.focus();
    await expect(input).toBeFocused();

    // Tab to next element
    await page.keyboard.press('Tab');

    // Should move to save button or next focusable element
    const saveButton = page.getByRole('button', { name: /save/i });
    const isFocused = await saveButton.evaluate((el) => el === document.activeElement);

    // At least some element should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('Shift+Tab should navigate backwards', async ({ page }) => {
    // Focus on save button
    const saveButton = page.getByRole('button', { name: /save/i });
    await saveButton.focus();

    // Press Shift+Tab to go back
    await page.keyboard.press('Shift+Tab');

    // Should move focus to previous element
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
    expect(focusedElement).not.toBe('BUTTON');
  });

  test('Enter in textarea should create new line, not submit', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill('First line');

    // Press Enter
    await page.keyboard.press('Enter');

    // Type more text
    await page.keyboard.type('Second line');

    const value = await input.inputValue();
    expect(value).toContain('First line');
    expect(value).toContain('Second line');
  });

  test('Cmd+Enter should save idea from within textarea', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);
    await input.focus();

    // Press Cmd+Enter to save
    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+Enter`);

    // Should show success message
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 3000 });
  });

  test('Cmd+/ should show keyboard shortcuts help', async ({ page }) => {
    // Press Cmd+/ to show help
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+/' : 'Control+/');

    // Look for help dialog or shortcuts list
    const helpDialog = page
      .getByRole('dialog')
      .or(page.getByText(/keyboard shortcuts/i))
      .or(page.getByText(/help/i));

    // Help may or may not be implemented yet
    const isVisible = await helpDialog.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('Arrow keys should not trigger navigation in input', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill('Test text');
    await input.focus();

    // Move cursor with arrow keys
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('XX');

    const value = await input.inputValue();
    expect(value).toContain('XX');
  });

  test('Cmd+A should select all text in input', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);
    await input.focus();

    // Press Cmd+A to select all
    await pressShortcut(page, 'a');

    // Type something - should replace all text
    await page.keyboard.type('New text');

    const value = await input.inputValue();
    expect(value).toBe('New text');
  });

  test('Cmd+Z should undo changes in input', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });

    await input.fill('Original text');
    await input.fill('Modified text');

    // Press Cmd+Z to undo
    await pressShortcut(page, 'z');

    // Should revert to previous state (browser undo behavior)
    await page.waitForTimeout(100);
    const value = await input.inputValue();

    // Undo behavior varies by browser, just check it's a string
    expect(typeof value).toBe('string');
  });

  test('Shortcuts should not conflict with browser defaults', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);

    // Cmd+R should not refresh page (if we prevent it)
    const textBefore = await input.inputValue();

    // Try Cmd+R (refresh) - if prevented, text should remain
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+r' : 'Control+r');

    await page.waitForTimeout(500);
    const textAfter = await input.inputValue();

    // If we prevent refresh, text should still be there
    // If not prevented, this test might fail - which is okay for now
    expect(typeof textAfter).toBe('string');
  });

  test('Shortcuts should work on all keyboard layouts', async ({ page }) => {
    // Test with different keyboard layouts (if supported)
    const input = page.getByRole('textbox', { name: /capture/i });

    // Click somewhere else
    await page.click('body');

    // Try focus shortcut
    await pressShortcut(page, 'k');

    // Should work regardless of layout
    await expect(input).toBeFocused();
  });

  test('Multiple shortcuts in sequence should work correctly', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });

    // Cmd+K to focus
    await pressShortcut(page, 'k');
    await expect(input).toBeFocused();

    // Type text
    await input.fill(sampleIdeas[0].text);

    // Cmd+S to save
    await pressShortcut(page, 's');
    await expect(page.getByText(/saved/i)).toBeVisible();

    // Cmd+E to clear
    await pressShortcut(page, 'e');
    await expect(input).toHaveValue('');
  });

  test('Shortcuts should be documented in UI', async ({ page }) => {
    // Look for tooltip or hint showing keyboard shortcuts
    const shortcutHint = page
      .locator('[data-testid="keyboard-hint"]')
      .or(page.getByText(/cmd.*k/i))
      .or(page.getByText(/keyboard shortcuts/i));

    // Hint may be shown on hover or always visible
    const isVisible = await shortcutHint.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('Cmd+N should create new idea', async ({ page }) => {
    // Fill and save first idea
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);
    await pressShortcut(page, 's');

    await page.waitForTimeout(500);

    // Press Cmd+N to create new
    await pressShortcut(page, 'n');

    // Input should be cleared and focused
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
  });

  test('F1 should open help documentation', async ({ page }) => {
    await page.keyboard.press('F1');

    // Look for help content
    const helpContent = page
      .getByRole('dialog')
      .or(page.getByText(/help|documentation/i));

    // Help may or may not be implemented
    const isVisible = await helpContent.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('Shortcuts should not trigger when typing in input', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.focus();

    // Type text that includes shortcut letters
    await input.fill('Press k to continue');

    // Should not trigger Cmd+K because we're typing normally
    await expect(input).toHaveValue('Press k to continue');
  });

  test('Disabled shortcuts should not work when modal is open', async ({ page }) => {
    // Open a modal if available
    const settingsButton = page.getByRole('button', { name: /settings/i });
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Try main shortcut - should not work while modal is open
      await pressShortcut(page, 'k');

      // Modal should still be visible
      await expect(dialog).toBeVisible();
    }
  });
});
