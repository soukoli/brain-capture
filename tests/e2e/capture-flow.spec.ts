/**
 * E2E Tests: Capture Flow
 * Tests the main text capture functionality
 */

import { test, expect } from '@playwright/test';
import { sampleIdeas, edgeCaseTexts, longText, TIMING } from '../fixtures/test-data';
import {
  createTestIdea,
  waitForAutoSave,
  clearDatabase,
  goToCaptureB
} from '../utils/test-helpers';

test.describe('Capture Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
    await goToCaptureB(page);
  });

  test('should visit capture page and display main interface', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /capture/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
  });

  test('should type text into capture form', async ({ page }) => {
    const testText = sampleIdeas[0].text;
    const input = page.getByRole('textbox', { name: /capture/i });

    await input.fill(testText);
    await expect(input).toHaveValue(testText);
  });

  test('should update character count as user types', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    const charCount = page.locator('[data-testid="char-count"]');

    await input.fill('Hello');
    await expect(charCount).toContainText('5');

    await input.fill('Hello World');
    await expect(charCount).toContainText('11');
  });

  test('should trigger auto-save after 500ms of inactivity', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });

    await input.fill(sampleIdeas[0].text);
    await waitForAutoSave(page, TIMING.AUTO_SAVE_DELAY + 200);

    // Check for auto-save indicator
    await expect(page.getByText(/auto.?saved/i)).toBeVisible();
  });

  test('should save idea manually when save button is clicked', async ({ page }) => {
    await createTestIdea(page, sampleIdeas[0].text);

    await expect(page.getByText(/saved successfully/i)).toBeVisible();
  });

  test('should display success message after saving', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    const saveButton = page.getByRole('button', { name: /save/i });

    await input.fill(sampleIdeas[0].text);
    await saveButton.click();

    // Wait for success toast/message
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show saved idea in recent captures list', async ({ page }) => {
    const testText = sampleIdeas[0].text;
    await createTestIdea(page, testText);

    // Navigate to or scroll to recent captures
    const recentCaptures = page.locator('[data-testid="recent-captures"]');
    await expect(recentCaptures).toBeVisible();

    // Check if the idea appears in the list
    await expect(page.getByText(testText)).toBeVisible();
  });

  test('should clear input when clear button is clicked', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    const clearButton = page.getByRole('button', { name: /clear/i });

    await input.fill(sampleIdeas[0].text);
    await expect(input).toHaveValue(sampleIdeas[0].text);

    await clearButton.click();
    await expect(input).toHaveValue('');
  });

  test('should persist data when navigating away and back', async ({ page }) => {
    const testText = sampleIdeas[0].text;
    await createTestIdea(page, testText);

    // Navigate away
    await page.goto('/about');
    await page.waitForTimeout(500);

    // Navigate back
    await page.goto('/');

    // Check if data persists
    await expect(page.getByText(testText)).toBeVisible();
  });

  test('should handle empty input submission gracefully', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /save/i });

    await saveButton.click();

    // Should show validation message or disable button
    const errorMessage = page.getByText(/enter.*text/i).or(page.getByText(/required/i));
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should handle special characters correctly', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });

    await input.fill(edgeCaseTexts.specialChars);
    await expect(input).toHaveValue(edgeCaseTexts.specialChars);

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(edgeCaseTexts.specialChars)).toBeVisible();
  });

  test('should handle unicode and emoji correctly', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });

    await input.fill(edgeCaseTexts.unicode);
    await expect(input).toHaveValue(edgeCaseTexts.unicode);
  });

  test('should handle long text input', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });

    await input.fill(longText);
    await expect(input).toHaveValue(longText);

    // Check if there's a warning about length
    const charCount = page.locator('[data-testid="char-count"]');
    await expect(charCount).toBeVisible();
  });

  test('should show loading state during save', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    const saveButton = page.getByRole('button', { name: /save/i });

    await input.fill(sampleIdeas[0].text);

    // Click save and immediately check for loading state
    await saveButton.click();
    await expect(saveButton).toBeDisabled();
  });

  test('should disable save button when input is empty', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    const saveButton = page.getByRole('button', { name: /save/i });

    // Initially empty
    await expect(saveButton).toBeDisabled();

    // Fill with text
    await input.fill('Some text');
    await expect(saveButton).toBeEnabled();

    // Clear again
    await input.clear();
    await expect(saveButton).toBeDisabled();
  });

  test('should maintain focus on input after clearing', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    const clearButton = page.getByRole('button', { name: /clear/i });

    await input.fill(sampleIdeas[0].text);
    await clearButton.click();

    // Input should still be focused
    await expect(input).toBeFocused();
  });

  test('should handle multiple rapid saves correctly', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /capture/i });
    const saveButton = page.getByRole('button', { name: /save/i });

    // Save multiple ideas in quick succession
    for (let i = 0; i < 3; i++) {
      await input.fill(sampleIdeas[i].text);
      await saveButton.click();
      await page.waitForTimeout(100);
    }

    // All ideas should be saved
    for (let i = 0; i < 3; i++) {
      await expect(page.getByText(sampleIdeas[i].text)).toBeVisible();
    }
  });

  test('should show timestamp for saved ideas', async ({ page }) => {
    await createTestIdea(page, sampleIdeas[0].text);

    const ideaCard = page.locator('[data-testid="idea-item"]').first();
    const timestamp = ideaCard.locator('[data-testid="timestamp"]');

    await expect(timestamp).toBeVisible();
  });

  test('should allow editing a saved idea', async ({ page }) => {
    await createTestIdea(page, sampleIdeas[0].text);

    const ideaCard = page.locator('[data-testid="idea-item"]').first();
    const editButton = ideaCard.getByRole('button', { name: /edit/i });

    await editButton.click();

    const input = page.getByRole('textbox', { name: /capture/i });
    await expect(input).toHaveValue(sampleIdeas[0].text);

    await input.fill('Updated idea text');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText('Updated idea text')).toBeVisible();
  });

  test('should allow deleting a saved idea', async ({ page }) => {
    await createTestIdea(page, sampleIdeas[0].text);

    const ideaCard = page.locator('[data-testid="idea-item"]').first();
    const deleteButton = ideaCard.getByRole('button', { name: /delete/i });

    await deleteButton.click();

    // Confirm deletion if there's a confirmation dialog
    const confirmButton = page.getByRole('button', { name: /confirm/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    await expect(page.getByText(sampleIdeas[0].text)).not.toBeVisible();
  });

  test('should show empty state when no ideas are captured', async ({ page }) => {
    const emptyState = page.getByText(/no ideas yet/i).or(page.getByText(/start capturing/i));
    await expect(emptyState).toBeVisible();
  });

  test('should maintain scroll position after adding new idea', async ({ page }) => {
    // Add multiple ideas
    for (let i = 0; i < 5; i++) {
      await createTestIdea(page, `Idea ${i + 1}`);
    }

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 300));
    const scrollY = await page.evaluate(() => window.scrollY);

    // Add another idea
    await createTestIdea(page, 'New idea after scroll');

    // Check scroll position is roughly maintained
    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(Math.abs(newScrollY - scrollY)).toBeLessThan(100);
  });
});
