# Playwright Testing - Quick Start

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (required first time)
npm run test:install
```

## Run Your First Test

```bash
# Run all tests
npm run test:e2e

# Run with UI (recommended for development)
npm run test:e2e:ui
```

## Common Commands

```bash
# Development
npm run test:e2e:ui          # Interactive UI mode
npm run test:e2e:headed      # See browser while testing
npm run test:e2e:debug       # Debug mode with inspector

# Run specific tests
npm run test:capture         # Capture flow
npm run test:voice          # Voice input
npm run test:a11y           # Accessibility
npm run test:perf           # Performance

# Browsers
npm run test:e2e:chromium   # Chromium only
npm run test:e2e:firefox    # Firefox only
npm run test:e2e:webkit     # WebKit only

# Platforms
npm run test:e2e:desktop    # Desktop browsers
npm run test:e2e:mobile     # Mobile devices

# View results
npm run test:report         # Open HTML report
```

## Test Coverage

✅ **Capture Flow** - Text input, auto-save, character counting
✅ **Voice Input** - Web Speech API, transcription
✅ **Keyboard Shortcuts** - Cmd+K, Cmd+S, Cmd+E, etc.
✅ **Projects** - Creation, assignment, filtering
✅ **Mobile** - iPhone, Android, responsive design
✅ **Accessibility** - WCAG 2.1 AA compliance
✅ **Performance** - Load times, Core Web Vitals
✅ **Visual Regression** - Screenshot comparison

## CI/CD

Tests run automatically on:
- Push to `main` or `develop`
- All pull requests

## Need Help?

- Full documentation: `tests/README.md`
- Playwright docs: https://playwright.dev
- Issues: Open a GitHub issue

## Tips

1. **Start with UI mode**: `npm run test:e2e:ui`
2. **Debug failing tests**: Click test → watch replay
3. **Update snapshots**: `npm run test:update-snapshots`
4. **Check reports**: `npm run test:report`

Happy Testing! 🎭
