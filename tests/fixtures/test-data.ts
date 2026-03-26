/**
 * Test Data Fixtures
 * Reusable test data for Brain Capture application
 */

export interface TestIdea {
  id: string;
  text: string;
  timestamp: string;
  projectId?: string;
  tags?: string[];
  source: 'text' | 'voice';
}

export interface TestProject {
  id: string;
  name: string;
  description: string;
  color: string;
  ideaCount: number;
}

export interface MockVoiceTranscript {
  transcript: string;
  confidence: number;
  language: string;
}

// Sample ideas for testing
export const sampleIdeas: TestIdea[] = [
  {
    id: '1',
    text: 'Build a habit tracking feature that sends daily reminders',
    timestamp: new Date('2026-03-25T09:00:00').toISOString(),
    source: 'text',
    tags: ['feature', 'mobile'],
  },
  {
    id: '2',
    text: 'Research competitor analysis tools for market positioning',
    timestamp: new Date('2026-03-25T10:30:00').toISOString(),
    projectId: 'project-1',
    source: 'text',
    tags: ['research', 'business'],
  },
  {
    id: '3',
    text: 'Create a meditation app with guided breathing exercises',
    timestamp: new Date('2026-03-25T14:15:00').toISOString(),
    source: 'voice',
    tags: ['wellness', 'mobile'],
  },
  {
    id: '4',
    text: 'Implement dark mode for better user experience at night',
    timestamp: new Date('2026-03-25T16:45:00').toISOString(),
    projectId: 'project-2',
    source: 'text',
    tags: ['ui', 'accessibility'],
  },
  {
    id: '5',
    text: 'Add export functionality to download all captured ideas as JSON',
    timestamp: new Date('2026-03-25T18:00:00').toISOString(),
    source: 'text',
    tags: ['feature', 'data'],
  },
];

// Sample projects for testing
export const sampleProjects: TestProject[] = [
  {
    id: 'project-1',
    name: 'Mobile App Development',
    description: 'Ideas related to building mobile applications',
    color: '#3B82F6',
    ideaCount: 12,
  },
  {
    id: 'project-2',
    name: 'UX Improvements',
    description: 'User experience enhancements and design ideas',
    color: '#8B5CF6',
    ideaCount: 8,
  },
  {
    id: 'project-3',
    name: 'Business Strategy',
    description: 'Strategic planning and business development',
    color: '#10B981',
    ideaCount: 15,
  },
  {
    id: 'project-4',
    name: 'Technical Research',
    description: 'Research on new technologies and tools',
    color: '#F59E0B',
    ideaCount: 6,
  },
];

// Mock voice transcripts for testing
export const mockVoiceTranscripts: MockVoiceTranscript[] = [
  {
    transcript: 'I need to remember to follow up with the design team about the new wireframes',
    confidence: 0.95,
    language: 'en-US',
  },
  {
    transcript: 'Create a feature that allows users to collaborate on shared idea boards',
    confidence: 0.92,
    language: 'en-US',
  },
  {
    transcript: 'Research best practices for implementing real-time sync across devices',
    confidence: 0.89,
    language: 'en-US',
  },
  {
    transcript: 'Add keyboard shortcuts to improve productivity for power users',
    confidence: 0.97,
    language: 'en-US',
  },
];

// Long text for testing character limits
export const longText = `
This is a very long idea that tests the character limit functionality of the Brain Capture application.
It contains multiple paragraphs and should trigger any validation or warning messages about content length.

The purpose of this test data is to ensure that the application handles large amounts of text gracefully,
displays appropriate feedback to users, and stores the data correctly without truncation or corruption.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
eu fugiat nulla pariatur.

This text should be long enough to test scrolling, text wrapping, and any character count displays.
`.trim();

// Edge case texts for testing
export const edgeCaseTexts = {
  empty: '',
  whitespace: '   ',
  singleChar: 'a',
  specialChars: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`',
  unicode: '你好世界 🌍 مرحبا بالعالم',
  html: '<script>alert("xss")</script>',
  markdown: '# Heading\n\n**Bold** and *italic* text with [links](https://example.com)',
  multiline: 'Line 1\nLine 2\nLine 3',
  longSingleWord: 'a'.repeat(1000),
};

// Test user data
export const testUser = {
  id: 'test-user-1',
  email: 'test@braincapture.app',
  name: 'Test User',
  preferences: {
    theme: 'light',
    autoSave: true,
    defaultProject: 'project-1',
  },
};

// API response mocks
export const mockApiResponses = {
  success: {
    status: 200,
    data: { success: true, message: 'Idea saved successfully' },
  },
  error: {
    status: 500,
    data: { success: false, error: 'Internal server error' },
  },
  validationError: {
    status: 400,
    data: { success: false, error: 'Validation failed', fields: ['text'] },
  },
};

// Timing constants for tests
export const TIMING = {
  AUTO_SAVE_DELAY: 500, // milliseconds
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
};
