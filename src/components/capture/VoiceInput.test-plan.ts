/**
 * VoiceInput Component Test Plan
 *
 * Manual testing checklist for the VoiceInput component.
 * Run through these scenarios before considering the feature complete.
 */

export const VOICE_INPUT_TEST_PLAN = {

  // 1. Browser Compatibility Tests
  browserSupport: [
    {
      test: "Chrome Desktop",
      expected: "Full support, all features working",
      steps: [
        "Open in Chrome",
        "Verify microphone button appears",
        "Click to start recording",
        "Grant permission if prompted",
        "Speak and verify live transcription",
        "Stop recording",
        "Click 'Use This Text'",
        "Verify callback receives text"
      ]
    },
    {
      test: "Safari Desktop",
      expected: "Full support with Safari-specific permission flow",
      steps: [
        "Open in Safari",
        "Verify component loads",
        "Test permission flow",
        "Verify transcription works"
      ]
    },
    {
      test: "Firefox Desktop",
      expected: "Shows 'Not Supported' message",
      steps: [
        "Open in Firefox",
        "Verify 'Not Supported' message displays",
        "Verify no runtime errors in console"
      ]
    },
    {
      test: "Mobile Chrome (Android)",
      expected: "Full support, touch-optimized",
      steps: [
        "Open on Android device",
        "Test touch targets (80x80px button)",
        "Verify permission flow on mobile",
        "Test in portrait and landscape",
        "Verify keyboard doesn't overlap UI"
      ]
    },
    {
      test: "Mobile Safari (iOS)",
      expected: "Full support, iOS-specific behavior",
      steps: [
        "Open on real iOS device (not simulator)",
        "Test microphone permission",
        "Verify transcription works",
        "Test with background noise",
        "Test with screen rotation"
      ]
    }
  ],

  // 2. Permission Scenarios
  permissions: [
    {
      test: "First-time Permission Request",
      steps: [
        "Clear site permissions",
        "Click microphone button",
        "Verify permission dialog appears",
        "Grant permission",
        "Verify recording starts"
      ]
    },
    {
      test: "Permission Denied",
      steps: [
        "Deny microphone permission",
        "Verify error message shows",
        "Verify message explains how to fix",
        "Grant permission in browser settings",
        "Click 'Try Again'",
        "Verify it works after granting"
      ]
    },
    {
      test: "Permission Revoked Mid-Session",
      steps: [
        "Start recording successfully",
        "Revoke permission in browser settings",
        "Try to record again",
        "Verify appropriate error shows"
      ]
    }
  ],

  // 3. Functional Tests
  functionality: [
    {
      test: "Start/Stop Recording",
      steps: [
        "Click microphone button",
        "Verify button changes to red/pulsing",
        "Verify 'Listening...' text appears",
        "Verify red recording indicator shows",
        "Click button again",
        "Verify recording stops",
        "Verify button returns to normal"
      ]
    },
    {
      test: "Real-time Transcription",
      steps: [
        "Start recording",
        "Speak: 'Hello world'",
        "Verify text appears in real-time",
        "Pause speaking",
        "Verify interim results show",
        "Continue speaking",
        "Verify text continues updating"
      ]
    },
    {
      test: "Clear Transcript",
      steps: [
        "Record some text",
        "Click 'Clear' button",
        "Verify transcript is cleared",
        "Verify ready to record again"
      ]
    },
    {
      test: "Use This Text",
      steps: [
        "Record a transcript",
        "Click 'Use This Text'",
        "Verify onTranscript callback is called",
        "Verify transcript is cleared after use"
      ]
    },
    {
      test: "Language Selection",
      steps: [
        "Click language selector",
        "Change to 'Spanish'",
        "Start recording",
        "Speak Spanish",
        "Verify correct transcription",
        "Switch back to English",
        "Verify works with English"
      ]
    },
    {
      test: "Continuous Recording",
      steps: [
        "Start recording",
        "Speak a sentence",
        "Pause for 2 seconds",
        "Speak another sentence",
        "Verify both sentences captured",
        "Verify proper spacing between sentences"
      ]
    }
  ],

  // 4. Error Scenarios
  errors: [
    {
      test: "No Microphone Device",
      steps: [
        "Disconnect/disable all microphones",
        "Try to record",
        "Verify 'No microphone found' error",
        "Connect microphone",
        "Try again",
        "Verify works after connecting"
      ]
    },
    {
      test: "Microphone in Use",
      steps: [
        "Open another app using microphone",
        "Try to record in browser",
        "Verify appropriate error message"
      ]
    },
    {
      test: "No Speech Detected",
      steps: [
        "Start recording",
        "Don't speak for 10 seconds",
        "Verify 'No speech detected' error"
      ]
    },
    {
      test: "Network Error (if applicable)",
      steps: [
        "Disable internet connection",
        "Try to record",
        "Verify network error handling"
      ]
    }
  ],

  // 5. UI/UX Tests
  userExperience: [
    {
      test: "Visual Feedback",
      steps: [
        "Verify microphone icon is clear",
        "Verify recording animation is smooth",
        "Verify red pulsing indicator is visible",
        "Verify button hover states work",
        "Verify focus indicators are clear"
      ]
    },
    {
      test: "Loading States",
      steps: [
        "Click record button",
        "Verify spinner shows during initialization",
        "Verify state transitions smoothly",
        "Verify no flash of wrong state"
      ]
    },
    {
      test: "Dark Mode",
      steps: [
        "Switch to dark mode",
        "Verify all text is readable",
        "Verify contrast is good",
        "Verify buttons are visible",
        "Test all states in dark mode"
      ]
    },
    {
      test: "Responsive Design",
      steps: [
        "Test at 320px width (mobile)",
        "Test at 768px width (tablet)",
        "Test at 1920px width (desktop)",
        "Verify layout adapts correctly",
        "Verify no horizontal scroll",
        "Verify touch targets stay large enough"
      ]
    }
  ],

  // 6. Accessibility Tests
  accessibility: [
    {
      test: "Screen Reader",
      steps: [
        "Enable screen reader (VoiceOver/NVDA)",
        "Navigate to component",
        "Verify all elements are announced",
        "Start recording",
        "Verify 'Recording' status is announced",
        "Verify transcript updates are announced",
        "Verify all buttons have clear labels"
      ]
    },
    {
      test: "Keyboard Navigation",
      steps: [
        "Tab to microphone button",
        "Press Enter/Space to record",
        "Verify recording starts",
        "Tab to language selector",
        "Change language with keyboard",
        "Tab to Clear button",
        "Activate with keyboard",
        "Verify full keyboard accessibility"
      ]
    },
    {
      test: "Focus Management",
      steps: [
        "Verify focus is visible",
        "Verify focus order is logical",
        "Verify focus doesn't get trapped",
        "Verify focus indicators are clear"
      ]
    },
    {
      test: "Color Contrast",
      steps: [
        "Use browser color picker",
        "Check contrast ratios",
        "Verify at least WCAG AA (4.5:1 for text)",
        "Test in light and dark modes"
      ]
    }
  ],

  // 7. Performance Tests
  performance: [
    {
      test: "Component Mount Speed",
      steps: [
        "Open React DevTools",
        "Navigate to page with component",
        "Verify mount time < 100ms",
        "Check for unnecessary renders"
      ]
    },
    {
      test: "Memory Leaks",
      steps: [
        "Open Chrome DevTools Memory tab",
        "Take heap snapshot",
        "Start/stop recording 10 times",
        "Take another snapshot",
        "Compare snapshots",
        "Verify no significant memory growth"
      ]
    },
    {
      test: "Long Transcripts",
      steps: [
        "Record a very long transcript (5+ minutes)",
        "Verify UI remains responsive",
        "Verify transcript scrolls properly",
        "Verify no lag or stuttering"
      ]
    }
  ],

  // 8. Integration Tests
  integration: [
    {
      test: "Callback Integration",
      steps: [
        "Integrate with form",
        "Record transcript",
        "Use transcript",
        "Verify form receives correct data",
        "Verify data format is correct"
      ]
    },
    {
      test: "Error Callback",
      steps: [
        "Trigger an error",
        "Verify onError callback is called",
        "Verify error object has correct structure",
        "Verify parent component can handle error"
      ]
    },
    {
      test: "Multiple Instances",
      steps: [
        "Render two VoiceInput components",
        "Verify both work independently",
        "Verify no state conflicts",
        "Verify only one can record at a time (browser limitation)"
      ]
    }
  ],

  // 9. Edge Cases
  edgeCases: [
    {
      test: "Rapid Start/Stop",
      steps: [
        "Click record button rapidly",
        "Verify no race conditions",
        "Verify state stays consistent",
        "Verify no errors in console"
      ]
    },
    {
      test: "Page Visibility Changes",
      steps: [
        "Start recording",
        "Switch to another tab",
        "Wait 5 seconds",
        "Switch back",
        "Verify recording status",
        "Verify no errors"
      ]
    },
    {
      test: "Component Unmount During Recording",
      steps: [
        "Start recording",
        "Navigate away immediately",
        "Verify cleanup happens",
        "Verify no console errors",
        "Come back and try again"
      ]
    },
    {
      test: "Special Characters",
      steps: [
        "Speak words with punctuation",
        "Verify punctuation is captured",
        "Speak numbers",
        "Verify numbers are transcribed",
        "Speak mixed content"
      ]
    }
  ],

  // 10. Production Checklist
  production: [
    {
      check: "HTTPS Configuration",
      verify: "Site is served over HTTPS in production"
    },
    {
      check: "Error Boundaries",
      verify: "Component errors don't crash the app"
    },
    {
      check: "Analytics Events",
      verify: "Track: recording started, stopped, error, used"
    },
    {
      check: "Documentation",
      verify: "README and integration guide are complete"
    },
    {
      check: "TypeScript Types",
      verify: "All types are exported and documented"
    },
    {
      check: "Browser Detection",
      verify: "Users see appropriate fallback messages"
    },
    {
      check: "Mobile Testing",
      verify: "Tested on real devices (not just emulators)"
    },
    {
      check: "Performance Budget",
      verify: "Bundle size increase is acceptable"
    }
  ]
};

// Export test results interface
export interface TestResult {
  test: string;
  passed: boolean;
  notes: string;
  tester: string;
  date: string;
  browser: string;
  device: string;
}

// Helper to create test result
export function createTestResult(
  test: string,
  passed: boolean,
  notes = ""
): Partial<TestResult> {
  return {
    test,
    passed,
    notes,
    date: new Date().toISOString(),
  };
}
