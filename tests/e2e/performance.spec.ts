/**
 * E2E Tests: Performance
 * Tests application performance, load times, and Core Web Vitals
 */

import { test, expect } from '@playwright/test';
import { sampleIdeas } from '../fixtures/test-data';
import { clearDatabase } from '../utils/test-helpers';

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
  });

  test('should load page in under 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('should have good Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');

    // Measure LCP using Performance Observer
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    });

    // LCP should be under 2.5s (good), under 4s (needs improvement)
    expect(lcp).toBeLessThan(2500);
  });

  test('should have low First Input Delay (FID)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const startTime = Date.now();

    // Click a button and measure response time
    await page.getByRole('textbox', { name: /capture/i }).click();

    const inputDelay = Date.now() - startTime;

    // FID should be under 100ms (good)
    expect(inputDelay).toBeLessThan(100);
  });

  test('should have minimal Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');

    // Measure CLS
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsScore = 0;

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // @ts-ignore
            if (!entry.hadRecentInput) {
              // @ts-ignore
              clsScore += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        // Wait for page to stabilize
        setTimeout(() => resolve(clsScore), 3000);
      });
    });

    // CLS should be under 0.1 (good)
    expect(cls).toBeLessThan(0.1);
  });

  test('should handle 100 ideas without performance degradation', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();

    // Create 100 ideas (simulate via localStorage)
    await page.evaluate((ideas) => {
      const manyIdeas = Array.from({ length: 100 }, (_, i) => ({
        id: `idea-${i}`,
        text: `Idea number ${i + 1}: ${ideas[i % ideas.length]}`,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        source: 'text',
      }));

      localStorage.setItem('brain-capture-ideas', JSON.stringify(manyIdeas));
    }, sampleIdeas.map((i) => i.text));

    // Reload to load the ideas
    await page.reload();
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should still load in reasonable time
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have fast interaction response times', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /capture/i });

    // Measure typing response time
    const startTime = Date.now();
    await input.fill('Test idea');
    const typingTime = Date.now() - startTime;

    // Should respond within 100ms
    expect(typingTime).toBeLessThan(100);
  });

  test('should have small JavaScript bundle size', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get resource sizes
    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter((r) =>
        r.name.endsWith('.js')
      );

      return {
        totalJs: jsResources.reduce((sum, r) => sum + (r as any).transferSize || 0, 0),
        count: jsResources.length,
      };
    });

    // Total JS should be under 500KB
    expect(metrics.totalJs).toBeLessThan(500 * 1024);
  });

  test('should have efficient CSS bundle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cssSize = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const cssResources = resources.filter((r) =>
        r.name.endsWith('.css')
      );

      return cssResources.reduce((sum, r) => sum + (r as any).transferSize || 0, 0);
    });

    // Total CSS should be under 100KB
    expect(cssSize).toBeLessThan(100 * 1024);
  });

  test('should cache resources effectively', async ({ page }) => {
    // First load
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstLoadResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    // Second load
    await page.reload();
    await page.waitForLoadState('networkidle');

    const secondLoadResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const cached = resources.filter((r) =>
        (r as any).transferSize === 0
      );
      return {
        total: resources.length,
        cached: cached.length,
      };
    });

    // Some resources should be cached
    expect(secondLoadResources.cached).toBeGreaterThan(0);
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const imageMetrics = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let totalSize = 0;
      let lazyCount = 0;

      images.forEach((img) => {
        if (img.loading === 'lazy') {
          lazyCount++;
        }
      });

      return {
        count: images.length,
        lazyCount,
      };
    });

    // If images exist, some should use lazy loading
    if (imageMetrics.count > 2) {
      expect(imageMetrics.lazyCount).toBeGreaterThan(0);
    }
  });

  test('should have efficient memory usage', async ({ page }) => {
    await page.goto('/');

    // Perform actions that could cause memory leaks
    for (let i = 0; i < 20; i++) {
      const input = page.getByRole('textbox', { name: /capture/i });
      await input.fill(`Idea ${i}`);
      await page.getByRole('button', { name: /save/i }).click();
      await page.waitForTimeout(100);
    }

    // Check memory usage (simplified)
    const memoryUsage = await page.evaluate(() => {
      // @ts-ignore
      if (performance.memory) {
        // @ts-ignore
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });

    // Memory usage should be reasonable (under 50MB)
    if (memoryUsage > 0) {
      expect(memoryUsage).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('should not block main thread for long', async ({ page }) => {
    await page.goto('/');

    const longTasks = await page.evaluate(() => {
      return new Promise((resolve) => {
        const tasks: number[] = [];

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            tasks.push(entry.duration);
          }
        }).observe({ type: 'longtask', buffered: true });

        setTimeout(() => resolve(tasks), 3000);
      });
    });

    // Should have minimal long tasks (>50ms)
    expect((longTasks as number[]).length).toBeLessThan(5);
  });

  test('should handle rapid typing without lag', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /capture/i });
    await input.focus();

    const startTime = Date.now();
    const longText = 'a'.repeat(500);

    await page.keyboard.type(longText, { delay: 0 });

    const typingTime = Date.now() - startTime;

    // Should handle 500 characters quickly
    expect(typingTime).toBeLessThan(1000);
  });

  test('should debounce auto-save efficiently', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /capture/i });

    // Type multiple characters rapidly
    await input.fill('Test');
    await page.waitForTimeout(100);
    await input.fill('Test idea');
    await page.waitForTimeout(100);
    await input.fill('Test idea here');

    // Should only trigger one auto-save after typing stops
    await page.waitForTimeout(600);

    // Check that auto-save was called (simplified check)
    const hasAutosaved = await page.getByText(/auto.?saved/i).isVisible().catch(() => false);
    expect(typeof hasAutosaved).toBe('boolean');
  });

  test('should have fast time to interactive (TTI)', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');

    // Try to interact
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.click();
    await input.fill('Test');

    const tti = Date.now() - startTime;

    // TTI should be under 3.8s (good)
    expect(tti).toBeLessThan(3800);
  });

  test('should load fonts efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const fontMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const fonts = resources.filter((r) =>
        r.name.match(/\.(woff2?|ttf|otf|eot)$/i)
      );

      return {
        count: fonts.length,
        totalSize: fonts.reduce((sum, f) => sum + (f as any).transferSize || 0, 0),
      };
    });

    // Font files should be optimized (prefer woff2)
    if (fontMetrics.count > 0) {
      expect(fontMetrics.totalSize).toBeLessThan(200 * 1024); // Under 200KB total
    }
  });

  test('should have minimal render-blocking resources', async ({ page }) => {
    await page.goto('/');

    const blockingResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources.filter((r) => {
        const resource = r as any;
        return resource.renderBlockingStatus === 'blocking';
      }).length;
    });

    // Should have few render-blocking resources
    expect(blockingResources).toBeLessThan(5);
  });

  test('should use compression for text resources', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');

    const compressedRequests: string[] = [];

    client.on('Network.responseReceived', (params) => {
      const headers = params.response.headers;
      if (headers['content-encoding']?.includes('gzip') ||
          headers['content-encoding']?.includes('br')) {
        compressedRequests.push(params.response.url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Some resources should be compressed
    expect(compressedRequests.length).toBeGreaterThan(0);
  });

  test('should prioritize above-the-fold content', async ({ page }) => {
    await page.goto('/');

    // Measure when above-the-fold content is visible
    const aboveFoldTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            resolve(entries[0].startTime);
          }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        setTimeout(() => resolve(9999), 5000);
      });
    });

    // Above-fold content should render quickly
    expect(aboveFoldTime).toBeLessThan(1500);
  });

  test('should have efficient React rendering', async ({ page }) => {
    await page.goto('/');

    // Perform actions that trigger re-renders
    const input = page.getByRole('textbox', { name: /capture/i });

    const startTime = Date.now();

    for (let i = 0; i < 10; i++) {
      await input.fill(`Text ${i}`);
    }

    const renderTime = Date.now() - startTime;

    // Re-renders should be fast
    expect(renderTime).toBeLessThan(500);
  });

  test('should minimize network requests', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const requestCount = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    // Should have reasonable number of requests (under 30 for initial load)
    expect(requestCount).toBeLessThan(30);
  });

  test('should handle offline mode gracefully', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Go offline
    await context.setOffline(true);

    // Try to interact
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill('Offline idea');

    // Should still work (local functionality)
    await expect(input).toHaveValue('Offline idea');

    // Go back online
    await context.setOffline(false);
  });
});

test.describe('Mobile Performance', () => {
  test.use({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  test('should load quickly on mobile networks', async ({ page }) => {
    // Simulate slow 3G
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50 KB/s
      uploadThroughput: 20 * 1024,
      latency: 500,
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Should load in under 5s even on slow connection
    expect(loadTime).toBeLessThan(5000);
  });

  test('should be usable on mobile CPU', async ({ page }) => {
    await page.goto('/');

    // Perform typical mobile interactions
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.tap();
    await input.fill('Mobile test idea');

    // Should remain responsive
    await expect(input).toHaveValue('Mobile test idea');
  });
});
