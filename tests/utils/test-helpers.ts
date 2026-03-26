/**
 * Test Helper Utilities
 * Common functions to streamline E2E testing
 */

import { Page, expect } from '@playwright/test';
import type { TestIdea, TestProject, MockVoiceTranscript } from '../fixtures/test-data';

/**
 * Wait for auto-save to complete
 */
export async function waitForAutoSave(page: Page, timeout = 1000) {
  await page.waitForTimeout(timeout);
  await page.waitForLoadState('networkidle');
}

/**
 * Create a test idea via UI
 */
export async function createTestIdea(page: Page, text: string, save = true) {
  const input = page.getByRole('textbox', { name: /capture your idea/i });
  await input.fill(text);

  if (save) {
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/saved/i)).toBeVisible();
  }

  return { text };
}

/**
 * Create a test project via UI
 */
export async function createTestProject(page: Page, project: Partial<TestProject>) {
  await page.getByRole('button', { name: /new project/i }).click();

  await page.getByLabel(/project name/i).fill(project.name || 'Test Project');

  if (project.description) {
    await page.getByLabel(/description/i).fill(project.description);
  }

  if (project.color) {
    await page.getByLabel(/color/i).fill(project.color);
  }

  await page.getByRole('button', { name: /create/i }).click();
  await expect(page.getByText(project.name || 'Test Project')).toBeVisible();

  return project;
}

/**
 * Mock the Web Speech API for voice testing
 */
export async function mockVoiceAPI(page: Page, transcript: string, shouldError = false) {
  await page.addInitScript(({ transcript, shouldError }) => {
    // @ts-ignore
    window.SpeechRecognition = class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = 'en-US';
      onresult: any = null;
      onerror: any = null;
      onend: any = null;

      start() {
        setTimeout(() => {
          if (shouldError) {
            if (this.onerror) {
              this.onerror({ error: 'not-allowed' });
            }
          } else {
            if (this.onresult) {
              this.onresult({
                results: [[{ transcript, confidence: 0.95 }]],
                resultIndex: 0,
              });
            }
          }
          if (this.onend) {
            this.onend();
          }
        }, 100);
      }

      stop() {}
      abort() {}
    };

    // @ts-ignore
    window.webkitSpeechRecognition = window.SpeechRecognition;
  }, { transcript, shouldError });
}

/**
 * Clear all test data
 */
export async function clearDatabase(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Navigate to capture page
 */
export async function goToCaptureB(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /brain capture/i })).toBeVisible();
}

/**
 * Login test user (if authentication is implemented)
 */
export async function loginTestUser(page: Page, email = 'test@braincapture.app', password = 'testpass123') {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('/');
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Get local storage data
 */
export async function getLocalStorage(page: Page, key: string): Promise<any> {
  return await page.evaluate((k) => {
    const value = localStorage.getItem(k);
    return value ? JSON.parse(value) : null;
  }, key);
}

/**
 * Set local storage data
 */
export async function setLocalStorage(page: Page, key: string, value: any) {
  await page.evaluate(({ k, v }) => {
    localStorage.setItem(k, JSON.stringify(v));
  }, { k: key, v: value });
}

/**
 * Wait for keyboard shortcut to be registered
 */
export async function pressShortcut(page: Page, shortcut: string) {
  const isMac = process.platform === 'darwin';
  const modifier = isMac ? 'Meta' : 'Control';

  const key = shortcut.replace(/cmd\+|ctrl\+/i, '');
  await page.keyboard.press(`${modifier}+${key}`);
}

/**
 * Check accessibility of current page
 */
export async function checkA11y(page: Page) {
  const violations = await page.evaluate(() => {
    // This is a simplified check - actual implementation would use axe-core
    const issues: string[] = [];

    // Check for images without alt text
    document.querySelectorAll('img:not([alt])').forEach((img) => {
      issues.push(`Image missing alt text: ${img.outerHTML.substring(0, 100)}`);
    });

    // Check for buttons without accessible names
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach((btn) => {
      if (!btn.textContent?.trim()) {
        issues.push(`Button missing accessible name: ${btn.outerHTML.substring(0, 100)}`);
      }
    });

    // Check for inputs without labels
    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach((input) => {
      const id = input.id;
      if (!id || !document.querySelector(`label[for="${id}"]`)) {
        issues.push(`Input missing label: ${input.outerHTML.substring(0, 100)}`);
      }
    });

    return issues;
  });

  return violations;
}

/**
 * Take a screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Check if text is visible on page
 */
export async function isTextVisible(page: Page, text: string): Promise<boolean> {
  try {
    await expect(page.getByText(text)).toBeVisible({ timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all ideas from the page
 */
export async function getAllIdeas(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const ideaElements = document.querySelectorAll('[data-testid="idea-item"]');
    return Array.from(ideaElements).map((el) => el.textContent?.trim() || '');
  });
}

/**
 * Simulate slow network conditions
 */
export async function simulateSlowNetwork(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 50 * 1024, // 50 KB/s
    uploadThroughput: 20 * 1024,   // 20 KB/s
    latency: 500,                   // 500ms latency
  });
}

/**
 * Reset network conditions
 */
export async function resetNetwork(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0,
  });
}

/**
 * Check if element has focus
 */
export async function hasFocus(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    return document.activeElement === element;
  }, selector);
}
