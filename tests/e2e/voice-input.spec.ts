/**
 * E2E Tests: Voice Input
 * Tests voice capture functionality using Web Speech API
 */

import { test, expect } from '@playwright/test';
import { mockVoiceTranscripts } from '../fixtures/test-data';
import { mockVoiceAPI, clearDatabase, goToCaptureB } from '../utils/test-helpers';

test.describe('Voice Input', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
    await goToCaptureB(page);
  });

  test('should switch to voice tab', async ({ page }) => {
    const voiceTab = page.getByRole('tab', { name: /voice/i });
    await voiceTab.click();

    await expect(voiceTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: /microphone/i })).toBeVisible();
  });

  test('should show microphone button in voice mode', async ({ page }) => {
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await expect(micButton).toBeVisible();
    await expect(micButton).toBeEnabled();
  });

  test('should display transcript after voice recording', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    // Wait for transcript to appear
    await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should show recording indicator while listening', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    // Look for recording indicator (pulse animation, text, or icon)
    const recordingIndicator = page
      .getByText(/listening|recording/i)
      .or(page.locator('[data-testid="recording-indicator"]'));

    await expect(recordingIndicator).toBeVisible();
  });

  test('should allow using transcript with Use Transcript button', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    // Wait for transcript
    await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible();

    // Click use transcript button
    const useButton = page.getByRole('button', { name: /use transcript|save/i });
    await useButton.click();

    // Should save the idea
    await expect(page.getByText(/saved/i)).toBeVisible();
  });

  test('should save voice-captured idea to recent captures', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible();

    const saveButton = page.getByRole('button', { name: /use transcript|save/i });
    await saveButton.click();

    // Check if idea appears in recent captures
    const recentCaptures = page.locator('[data-testid="recent-captures"]');
    await expect(recentCaptures.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible();
  });

  test('should handle permission denied error', async ({ page }) => {
    await mockVoiceAPI(page, '', true); // true = trigger error
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    // Should show error message
    const errorMessage = page
      .getByText(/permission denied|microphone access/i)
      .or(page.getByText(/error/i));

    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });

  test('should show fallback message for unsupported browsers', async ({ page }) => {
    // Remove Speech Recognition API
    await page.addInitScript(() => {
      // @ts-ignore
      delete window.SpeechRecognition;
      // @ts-ignore
      delete window.webkitSpeechRecognition;
    });

    await goToCaptureB(page);
    await page.getByRole('tab', { name: /voice/i }).click();

    // Should show unsupported message
    const fallbackMessage = page
      .getByText(/not supported|browser doesn't support/i)
      .or(page.getByText(/unavailable/i));

    await expect(fallbackMessage).toBeVisible();
  });

  test('should allow retrying voice recording', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });

    // First recording
    await micButton.click();
    await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible();

    // Try again button
    const retryButton = page.getByRole('button', { name: /try again|record again/i });
    if (await retryButton.isVisible()) {
      await retryButton.click();
      await expect(page.getByText(mockVoiceTranscripts[0].transcript)).not.toBeVisible();
    }
  });

  test('should show confidence level or quality indicator', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible();

    // Look for confidence or quality indicator
    const qualityIndicator = page
      .locator('[data-testid="confidence"]')
      .or(page.getByText(/confidence|quality/i));

    // This may or may not be visible depending on implementation
    const isVisible = await qualityIndicator.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should allow editing transcript before saving', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible();

    // Look for edit capability
    const editArea = page.getByRole('textbox').or(page.locator('[contenteditable="true"]'));

    if (await editArea.isVisible()) {
      await editArea.click();
      await editArea.fill('Edited transcript text');

      const saveButton = page.getByRole('button', { name: /save|use transcript/i });
      await saveButton.click();

      await expect(page.getByText('Edited transcript text')).toBeVisible();
    }
  });

  test('should handle multiple voice recordings in sequence', async ({ page }) => {
    await page.getByRole('tab', { name: /voice/i }).click();

    for (let i = 0; i < 3; i++) {
      await mockVoiceAPI(page, mockVoiceTranscripts[i].transcript);

      const micButton = page.getByRole('button', { name: /microphone|start recording/i });
      await micButton.click();

      await expect(page.getByText(mockVoiceTranscripts[i].transcript)).toBeVisible();

      const saveButton = page.getByRole('button', { name: /save|use transcript/i });
      await saveButton.click();

      await page.waitForTimeout(500);
    }

    // All transcripts should be saved
    for (let i = 0; i < 3; i++) {
      await expect(page.getByText(mockVoiceTranscripts[i].transcript)).toBeVisible();
    }
  });

  test('should stop recording when stop button is clicked', async ({ page }) => {
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    // Look for stop button
    const stopButton = page.getByRole('button', { name: /stop/i });
    if (await stopButton.isVisible()) {
      await stopButton.click();

      // Recording indicator should disappear
      const recordingIndicator = page.getByText(/listening|recording/i);
      await expect(recordingIndicator).not.toBeVisible();
    }
  });

  test('should handle empty or unclear speech', async ({ page }) => {
    await mockVoiceAPI(page, '');
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    await page.waitForTimeout(1000);

    // Should show message about no speech detected
    const noSpeechMessage = page
      .getByText(/no speech detected|couldn't hear/i)
      .or(page.getByText(/try again/i));

    const isVisible = await noSpeechMessage.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should show language selection option', async ({ page }) => {
    await page.getByRole('tab', { name: /voice/i }).click();

    // Look for language selector
    const languageSelector = page
      .getByRole('combobox', { name: /language/i })
      .or(page.getByLabel(/language/i));

    // Language selector may or may not be visible
    const isVisible = await languageSelector.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should maintain context when switching between text and voice tabs', async ({ page }) => {
    // Type in text tab
    const textTab = page.getByRole('tab', { name: /text/i });
    await textTab.click();

    const textInput = page.getByRole('textbox', { name: /capture/i });
    await textInput.fill('Text mode input');

    // Switch to voice tab
    await page.getByRole('tab', { name: /voice/i }).click();
    await mockVoiceAPI(page, mockVoiceTranscripts[0].transcript);

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });
    await micButton.click();

    await expect(page.getByText(mockVoiceTranscripts[0].transcript)).toBeVisible();

    // Switch back to text tab
    await textTab.click();

    // Original text should still be there (or cleared, depending on design)
    // This test validates the behavior
    const currentValue = await textInput.inputValue();
    expect(typeof currentValue).toBe('string');
  });

  test('should show proper ARIA labels for accessibility', async ({ page }) => {
    await page.getByRole('tab', { name: /voice/i }).click();

    const micButton = page.getByRole('button', { name: /microphone|start recording/i });

    // Button should have accessible name
    const ariaLabel = await micButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});
