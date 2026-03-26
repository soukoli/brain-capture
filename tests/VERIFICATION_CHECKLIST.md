# Playwright Testing - Verification Checklist

## Pre-Test Setup

- [ ] Dependencies installed: `npm install`
- [ ] Playwright browsers installed: `npm run test:install`
- [ ] Dev server running: `npm run dev` (in separate terminal)

## Quick Smoke Tests

Run these commands to verify the testing setup works:

### 1. Basic Test Run
```bash
npm run test:e2e:chromium -- tests/e2e/capture-flow.spec.ts
```
**Expected**: Tests run and pass (or fail gracefully if features not implemented)

### 2. UI Mode Test
```bash
npm run test:e2e:ui
```
**Expected**: Playwright UI opens in browser

### 3. Single Test
```bash
npx playwright test -g "should visit capture page"
```
**Expected**: Single test runs successfully

### 4. Generate Report
```bash
npm run test:report
```
**Expected**: HTML report opens in browser

## Test File Verification

Confirm all test files exist:

- [ ] `playwright.config.ts`
- [ ] `tests/e2e/capture-flow.spec.ts` (25 tests)
- [ ] `tests/e2e/voice-input.spec.ts` (18 tests)
- [ ] `tests/e2e/keyboard-shortcuts.spec.ts` (24 tests)
- [ ] `tests/e2e/mobile.spec.ts` (20 tests)
- [ ] `tests/e2e/projects.spec.ts` (22 tests)
- [ ] `tests/e2e/accessibility.spec.ts` (29 tests)
- [ ] `tests/e2e/performance.spec.ts` (26 tests)
- [ ] `tests/visual/screenshots.spec.ts` (31 tests)
- [ ] `tests/fixtures/test-data.ts`
- [ ] `tests/utils/test-helpers.ts`

## NPM Scripts Verification

Run `npm run` to verify these scripts exist:

- [ ] `test:e2e`
- [ ] `test:e2e:ui`
- [ ] `test:e2e:debug`
- [ ] `test:e2e:headed`
- [ ] `test:e2e:mobile`
- [ ] `test:e2e:desktop`
- [ ] `test:capture`
- [ ] `test:voice`
- [ ] `test:keyboard`
- [ ] `test:projects`
- [ ] `test:a11y`
- [ ] `test:perf`
- [ ] `test:visual`
- [ ] `test:report`

## CI/CD Verification

- [ ] `.github/workflows/playwright.yml` exists
- [ ] Workflow has multiple jobs (test, test-visual, test-mobile, etc.)
- [ ] Workflow triggers on push and PR
- [ ] Artifacts upload configured

## Documentation Verification

- [ ] `tests/README.md` exists (comprehensive guide)
- [ ] `TESTING.md` exists (quick start)
- [ ] `tests/IMPLEMENTATION_SUMMARY.md` exists
- [ ] `.gitignore` updated with test artifacts

## Feature Coverage Checklist

### Capture Flow
- [ ] Text input testing
- [ ] Auto-save testing
- [ ] Manual save testing
- [ ] Character count testing
- [ ] Clear button testing
- [ ] Edge cases (empty, special chars, unicode)

### Voice Input
- [ ] Microphone button testing
- [ ] Transcript display testing
- [ ] Voice API mocking
- [ ] Error handling testing
- [ ] Browser compatibility testing

### Keyboard Shortcuts
- [ ] Cmd+K focus testing
- [ ] Cmd+S save testing
- [ ] Cmd+E clear testing
- [ ] Tab navigation testing
- [ ] Shortcut documentation testing

### Projects
- [ ] Create project testing
- [ ] Edit project testing
- [ ] Delete project testing
- [ ] Assign ideas testing
- [ ] Filter by project testing

### Mobile
- [ ] Touch interactions testing
- [ ] Multiple viewports testing
- [ ] Responsive layout testing
- [ ] Mobile keyboard testing
- [ ] Swipe gestures testing

### Accessibility
- [ ] Axe-core scanning
- [ ] Keyboard navigation
- [ ] ARIA labels testing
- [ ] Color contrast testing
- [ ] Screen reader support

### Performance
- [ ] Page load time testing
- [ ] Core Web Vitals testing
- [ ] Bundle size testing
- [ ] Memory usage testing
- [ ] Mobile performance testing

### Visual Regression
- [ ] Homepage screenshots
- [ ] Dark/light mode testing
- [ ] Multiple viewports testing
- [ ] Button states testing
- [ ] Cross-browser testing

## Running Complete Test Suite

### Local Testing
```bash
# Start dev server
npm run dev

# In another terminal, run tests
npm run test:e2e:ui  # Interactive
# or
npm run test:e2e     # Headless
```

### Browser-Specific Testing
```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

### Platform-Specific Testing
```bash
npm run test:e2e:desktop
npm run test:e2e:mobile
```

### Feature-Specific Testing
```bash
npm run test:capture
npm run test:voice
npm run test:keyboard
npm run test:projects
npm run test:a11y
npm run test:perf
npm run test:visual
```

## Expected Test Results

When tests run against a fully implemented app:

- ✅ Capture flow tests should pass
- ⚠️  Voice input tests may fail if Web Speech API not implemented
- ✅ Keyboard shortcuts tests should pass
- ⚠️  Projects tests may fail if projects feature not implemented
- ✅ Mobile tests should pass for basic functionality
- ✅ Accessibility tests should pass (or show violations to fix)
- ⚠️  Performance tests may fail if app not optimized
- ⚠️  Visual regression tests will fail on first run (need baseline screenshots)

## First-Time Visual Test Setup

Visual tests need baseline screenshots:

```bash
# Generate baseline screenshots
npm run test:update-snapshots

# Run visual tests
npm run test:visual
```

## Troubleshooting

### Tests fail to start
- Check Node.js version (18.x or 20.x)
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Reinstall browsers: `npm run test:install`

### Dev server not running
- Start server: `npm run dev`
- Check port 3000 is available
- Verify Next.js builds successfully

### Browser launch fails
- Run: `npx playwright install --force`
- Check system dependencies
- Try single browser: `npm run test:e2e:chromium`

### Tests are flaky
- Increase timeout in config
- Check for race conditions
- Run with `--repeat-each=3` to verify

### Visual tests fail
- First run: `npm run test:update-snapshots`
- Font rendering: Check fonts are loaded
- Screen DPI: May vary by system

## Success Indicators

✅ All test files created and accessible
✅ Playwright UI opens without errors
✅ At least one test runs successfully
✅ Test report generates and displays
✅ CI/CD workflow file is valid YAML
✅ All NPM scripts are defined
✅ Documentation is comprehensive

## Post-Setup Actions

1. **Run initial test suite**: `npm run test:e2e:ui`
2. **Generate baseline screenshots**: `npm run test:update-snapshots`
3. **Review test report**: `npm run test:report`
4. **Commit test files to repository**
5. **Push to trigger CI/CD pipeline**
6. **Monitor first CI run in GitHub Actions**

## Next Steps

After verification:

1. Review failing tests to understand missing features
2. Implement missing features based on test requirements
3. Run tests after each feature implementation
4. Update tests as requirements evolve
5. Add new tests for new features

## Need Help?

- Review `tests/README.md` for detailed documentation
- Check `TESTING.md` for quick reference
- Visit https://playwright.dev for Playwright docs
- Open GitHub issue for project-specific questions

---

**Testing Status**: Ready for verification
**Total Tests**: 169 test cases
**Coverage**: 8 feature categories
**Browsers**: 3 (Chromium, Firefox, WebKit)
**Viewports**: 9 (Desktop, Mobile, Tablet)
