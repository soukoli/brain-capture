# Playwright Testing Suite

Comprehensive end-to-end testing for the Brain Capture application using Playwright.

## Overview

This testing suite provides complete coverage of the Brain Capture application, including:

- **Capture Flow**: Text input, auto-save, manual save, character counting
- **Voice Input**: Web Speech API integration, transcript handling
- **Keyboard Shortcuts**: All keyboard navigation and shortcuts
- **Projects**: Project creation, assignment, filtering
- **Mobile Testing**: Responsive design across devices
- **Accessibility**: WCAG 2.1 AA compliance testing
- **Performance**: Load times, Core Web Vitals, bundle size
- **Visual Regression**: Screenshot comparison across browsers

## Installation

```bash
# Install Playwright and browsers
npm install
npm run test:install

# Or manually
npx playwright install --with-deps
```

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

### Debug Mode
```bash
npm run test:e2e:debug
```

### Headed Mode (see browser)
```bash
npm run test:e2e:headed
```

## Test Categories

### By Feature
```bash
npm run test:capture      # Capture flow tests
npm run test:voice        # Voice input tests
npm run test:keyboard     # Keyboard shortcuts
npm run test:projects     # Projects management
npm run test:a11y         # Accessibility tests
npm run test:perf         # Performance tests
npm run test:visual       # Visual regression
```

### By Platform
```bash
npm run test:e2e:desktop  # Desktop browsers
npm run test:e2e:mobile   # Mobile devices
```

### By Browser
```bash
npm run test:e2e:chromium # Chromium only
npm run test:e2e:firefox  # Firefox only
npm run test:e2e:webkit   # WebKit only
```

## Test Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── capture-flow.spec.ts      # Main capture functionality
│   ├── voice-input.spec.ts       # Voice recording and transcription
│   ├── keyboard-shortcuts.spec.ts # Keyboard navigation
│   ├── mobile.spec.ts            # Mobile experience
│   ├── projects.spec.ts          # Project management
│   ├── accessibility.spec.ts     # A11y compliance
│   └── performance.spec.ts       # Performance metrics
├── visual/                       # Visual regression tests
│   └── screenshots.spec.ts       # Screenshot comparisons
├── fixtures/                     # Test data
│   └── test-data.ts             # Sample ideas, projects, etc.
└── utils/                        # Helper utilities
    └── test-helpers.ts          # Reusable test functions
```

## Configuration

Tests are configured in `playwright.config.ts`:

- **Browsers**: Chromium, Firefox, WebKit
- **Viewports**: Desktop (1920x1080, 1366x768), Mobile (iPhone, Android), Tablet (iPad)
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Enabled for faster execution
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { clearDatabase, goToCaptureB } from '../utils/test-helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
    await goToCaptureB(page);
  });

  test('should do something', async ({ page }) => {
    // Test code here
    await expect(page.getByRole('button')).toBeVisible();
  });
});
```

### Using Test Helpers

```typescript
import { createTestIdea, mockVoiceAPI, pressShortcut } from '../utils/test-helpers';

// Create a test idea
await createTestIdea(page, 'My test idea');

// Mock voice API
await mockVoiceAPI(page, 'Voice transcript');

// Press keyboard shortcut
await pressShortcut(page, 'k'); // Cmd+K or Ctrl+K
```

### Using Test Data

```typescript
import { sampleIdeas, sampleProjects } from '../fixtures/test-data';

// Use sample data
await input.fill(sampleIdeas[0].text);
await createTestProject(page, sampleProjects[0]);
```

## Visual Regression Testing

### Update Snapshots

When UI changes are intentional:

```bash
npm run test:update-snapshots
```

### Compare Snapshots

Visual tests automatically compare screenshots with baselines:

```typescript
await expect(page).toHaveScreenshot('homepage.png');
```

Snapshots are stored in `tests/visual/*.spec.ts-snapshots/`

## Accessibility Testing

Tests use axe-core for automated accessibility scanning:

```typescript
import AxeBuilder from '@axe-core/playwright';

const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
expect(accessibilityScanResults.violations).toEqual([]);
```

## Performance Testing

Performance tests measure:

- **Page Load Time**: < 2 seconds
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Bundle Size**: JS < 500KB, CSS < 100KB

## CI/CD Integration

Tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

GitHub Actions workflow includes:

- Multiple OS (Ubuntu, macOS)
- Multiple Node versions (18.x, 20.x)
- Parallel test execution
- Artifact upload (reports, screenshots, videos)
- PR comments with results

## Viewing Test Reports

### HTML Report

```bash
npm run test:report
```

Opens an interactive HTML report with:

- Test results
- Screenshots
- Videos
- Traces
- Performance metrics

### CI Reports

Reports are automatically uploaded as GitHub Actions artifacts:

- `playwright-report-*`: HTML reports
- `test-screenshots-*`: Failure screenshots
- `test-videos-*`: Failure videos

## Debugging Tests

### Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Headed Mode

```bash
npm run test:e2e:headed
```

Runs tests in visible browser windows.

### UI Mode

```bash
npm run test:e2e:ui
```

Interactive UI with time travel debugging.

### VSCode Debugging

1. Install Playwright VSCode extension
2. Open test file
3. Click green play button next to test

## Best Practices

### 1. Use Semantic Selectors

```typescript
// Good
page.getByRole('button', { name: /save/i })
page.getByLabel(/email/i)

// Avoid
page.locator('#save-btn')
page.locator('.button')
```

### 2. Wait for Elements

```typescript
// Good
await expect(element).toBeVisible()

// Avoid
await page.waitForTimeout(1000)
```

### 3. Clear State

```typescript
test.beforeEach(async ({ page }) => {
  await clearDatabase(page); // Reset state
});
```

### 4. Use Test Data

```typescript
// Good
import { sampleIdeas } from '../fixtures/test-data';
await input.fill(sampleIdeas[0].text);

// Avoid
await input.fill('test idea');
```

### 5. Isolate Tests

Each test should be independent and not rely on other tests.

## Troubleshooting

### Tests Fail Locally but Pass in CI

- Check Node.js version matches CI
- Clear browser cache: `npx playwright install --force`
- Check environment variables

### Flaky Tests

- Increase timeout: `test.setTimeout(30000)`
- Add explicit waits: `await expect(element).toBeVisible()`
- Check for race conditions

### Visual Test Failures

- Regenerate snapshots: `npm run test:update-snapshots`
- Check pixel differences in report
- Verify font rendering across environments

### Performance Test Failures

- Run on similar hardware as CI
- Check for background processes
- Review network conditions

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## Contributing

When adding new tests:

1. Follow existing test structure
2. Use test helpers when possible
3. Add appropriate assertions
4. Update this README if needed
5. Ensure tests pass locally before PR

## Support

For issues or questions:

- Check existing tests for examples
- Review Playwright documentation
- Open an issue in the repository
