# Brain Capture - Prioritized Design Recommendations

**Last Updated**: March 25, 2026

This document provides actionable, prioritized recommendations with code examples, effort estimates, and expected impact.

---

## Priority Matrix

| Priority | Criteria |
|----------|----------|
| **P0 (Critical)** | Blocks core functionality, prevents app from working |
| **P1 (High)** | Accessibility violations, poor mobile UX, missing features |
| **P2 (Medium)** | UX improvements, polish, consistency |
| **P3 (Low)** | Nice-to-haves, future enhancements |

---

## P0 - Critical (Week 1)

### P0.1: Implement Text Capture UI

**Issue**: No capture functionality exists - app is unusable

**Impact**: CRITICAL - app cannot fulfill its primary purpose
**Effort**: 2 days
**Complexity**: Medium

**Implementation**:

```tsx
// src/app/capture/page.tsx
'use client';

import { useState } from 'react';
import { Brain, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CapturePage() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Idea captured!');
      setContent('');
    } catch (error) {
      toast.error('Failed to save idea');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 safe-area-inset">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold">Brain Capture</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          aria-label="Close capture"
        >
          <X className="w-5 h-5" />
        </Button>
      </header>

      {/* Capture Form */}
      <main id="main-content" className="max-w-2xl mx-auto">
        <Card className="p-4 sm:p-6">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            autoFocus
            className="min-h-[200px] text-base resize-none border-0 focus-visible:ring-0 p-0"
            aria-label="Idea content"
          />

          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <span className="text-sm text-slate-500">
              {content.length} characters
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setContent('')}
                disabled={!content || isSaving}
              >
                Clear
              </Button>
              <Button
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Idea
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Keyboard Shortcuts Hint */}
        <p className="text-sm text-slate-500 text-center mt-4">
          Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">⌘ + Enter</kbd> to save
        </p>
      </main>
    </div>
  );
}
```

**Additional Changes Required**:

```tsx
// src/app/page.tsx - Update landing page CTA
<Button
  variant="default"
  size="lg"
  onClick={() => router.push('/capture')}
  aria-label="Start capturing ideas"
>
  Get Started
</Button>
```

**Testing**:
- [ ] Text input auto-focuses on page load
- [ ] Character count updates in real-time
- [ ] Clear button empties textarea
- [ ] Save button shows loading state
- [ ] Success toast appears after save
- [ ] Keyboard shortcut (Cmd+Enter) saves
- [ ] Works on mobile Safari and Chrome

---

### P0.2: Create Input Component

**Issue**: No Input component exists for forms

**Impact**: CRITICAL - needed for all text inputs
**Effort**: 1 hour
**Complexity**: Low

**Implementation**:

```tsx
// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-3",
          "text-base text-slate-900",
          // Mobile optimization
          "min-h-[44px]",  // Touch target size
          "text-[16px]",   // Prevent iOS zoom
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          // Placeholder
          "placeholder:text-slate-500",
          // Dark mode
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          "dark:focus-visible:ring-blue-500",
          "dark:disabled:bg-slate-900",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

**Testing**:
- [ ] Input height is minimum 44px
- [ ] Focus ring is visible (3px blue)
- [ ] Font size is 16px (no iOS zoom)
- [ ] Disabled state is clearly visible
- [ ] Works in dark mode
- [ ] Placeholder text is readable

---

### P0.3: Create Textarea Component

**Issue**: No Textarea component exists

**Impact**: CRITICAL - needed for idea capture
**Effort**: 1 hour
**Complexity**: Low

**Implementation**:

```tsx
// src/components/ui/textarea.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3",
          "text-base text-slate-900",
          // Mobile optimization
          "text-[16px]",   // Prevent iOS zoom
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
          // Resize behavior
          "resize-none",   // Prevent resize on mobile
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          // Placeholder
          "placeholder:text-slate-500",
          // Dark mode
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          "dark:focus-visible:ring-blue-500",
          "dark:disabled:bg-slate-900",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
```

**Testing**:
- [ ] Minimum height is 120px
- [ ] Font size is 16px (no iOS zoom)
- [ ] Focus ring is visible
- [ ] Resize is disabled on mobile
- [ ] Works with autoFocus
- [ ] Scrolls properly when content exceeds height

---

### P0.4: Fix Button Touch Targets

**Issue**: All buttons are smaller than 44x44px minimum

**Impact**: CRITICAL - mobile users can't reliably tap buttons
**Effort**: 1 hour
**Complexity**: Low

**Implementation**:

```tsx
// src/components/ui/button.tsx
// Update the size variants

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // ... existing variants (unchanged)
      },
      size: {
        default: "h-11 px-6 py-3 min-h-[44px]",  // 44px minimum
        sm: "h-11 px-4 text-sm min-h-[44px]",    // 44px minimum
        lg: "h-14 px-8 text-lg min-h-[56px]",    // 56px recommended for primary actions
        icon: "h-11 w-11 min-w-[44px] min-h-[44px]",  // 44px square
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

**Before/After**:
```
Before: h-9 (36px) ❌ Too small
After:  h-11 with min-h-[44px] (44px) ✅ Accessible
```

**Testing**:
- [ ] All buttons are minimum 44px in height
- [ ] Icon buttons are 44x44px
- [ ] Buttons have adequate horizontal padding
- [ ] Touch targets don't overlap
- [ ] Test on iPhone SE (smallest screen)

---

### P0.5: Add Toast Notification System

**Issue**: No user feedback for actions

**Impact**: CRITICAL - users don't know if actions succeeded/failed
**Effort**: 30 minutes
**Complexity**: Low

**Implementation**:

```bash
npm install sonner
```

```tsx
// src/app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: 'rounded-lg shadow-lg border',
              title: 'text-base font-medium',
              description: 'text-sm text-slate-600',
              success: 'bg-green-50 border-green-200 text-green-900',
              error: 'bg-red-50 border-red-200 text-red-900',
              warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
```

**Usage Examples**:

```tsx
import { toast } from 'sonner';

// Success
toast.success('Idea captured!', {
  description: 'Saved to "Personal Project"',
  action: {
    label: 'Undo',
    onClick: () => handleUndo(),
  },
});

// Error
toast.error('Failed to save idea', {
  description: 'Please check your connection and try again',
  action: {
    label: 'Retry',
    onClick: () => handleRetry(),
  },
});

// Loading
const saveToast = toast.loading('Saving idea...');
// Later: toast.success('Idea saved!', { id: saveToast });

// Promise-based
toast.promise(saveIdea(), {
  loading: 'Saving...',
  success: 'Idea captured!',
  error: 'Failed to save',
});
```

**Testing**:
- [ ] Toasts appear at top-center
- [ ] Success toasts are green
- [ ] Error toasts are red
- [ ] Toasts auto-dismiss after 3 seconds
- [ ] Multiple toasts stack properly
- [ ] Toast actions (Undo/Retry) work

---

## P1 - High Priority (Week 2)

### P1.1: Implement Voice Recording UI

**Issue**: No voice capture capability

**Impact**: HIGH - core feature missing
**Effort**: 3 days
**Complexity**: High

**Implementation**:

```tsx
// src/components/voice-recorder.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  className?: string;
}

export function VoiceRecorder({ onTranscriptionComplete, className }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup audio analyzer for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Visualize audio levels
      const updateAudioLevel = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255); // Normalize to 0-1
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);

        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start duration counter
      const startTime = Date.now();
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Store interval ID for cleanup
      (mediaRecorder as any).intervalId = interval;

    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Microphone access denied', {
        description: 'Please enable microphone permissions in your browser',
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      const intervalId = (mediaRecorderRef.current as any).intervalId;
      if (intervalId) clearInterval(intervalId);

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  // Transcribe audio using Whisper API
  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // TODO: Replace with actual Whisper API call
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockTranscription = "This is a test transcription";

      onTranscriptionComplete?.(mockTranscription);
      toast.success('Voice recorded!', {
        description: 'Your idea has been transcribed',
      });
    } catch (error) {
      console.error('Transcription failed:', error);
      toast.error('Failed to transcribe audio', {
        description: 'Please try again or type your idea',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Record Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center",
          "transition-all duration-200 shadow-lg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isRecording
            ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600 animate-pulse"
            : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : isRecording ? (
          <Square className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>

      {/* Duration */}
      {isRecording && (
        <div className="text-sm font-mono text-slate-600 dark:text-slate-400">
          {formatDuration(duration)}
        </div>
      )}

      {/* Audio Visualizer */}
      {isRecording && (
        <div className="flex items-center gap-1 h-12">
          {[...Array(20)].map((_, i) => {
            const height = Math.max(4, audioLevel * 40 + Math.random() * 8);
            return (
              <div
                key={i}
                className="w-1 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-100"
                style={{
                  height: `${height}px`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Status Text */}
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        {isProcessing
          ? 'Transcribing...'
          : isRecording
          ? 'Tap to stop recording'
          : 'Tap to start recording'}
      </p>
    </div>
  );
}
```

**Integration Example**:

```tsx
// src/app/capture/page.tsx
import { VoiceRecorder } from '@/components/voice-recorder';

export default function CapturePage() {
  const [content, setContent] = useState('');

  return (
    <Card>
      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
          />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceRecorder
            onTranscriptionComplete={(text) => setContent(text)}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
```

**Testing**:
- [ ] Microphone permission request works
- [ ] Recording starts/stops correctly
- [ ] Audio visualizer animates
- [ ] Duration counter updates
- [ ] Transcription completes
- [ ] Error handling works (no mic, API failure)
- [ ] Works on iOS Safari (WebKit)
- [ ] Works on Android Chrome

---

### P1.2: Fix Color Contrast (WCAG AA)

**Issue**: Secondary text fails contrast requirements

**Impact**: HIGH - accessibility violation
**Effort**: 30 minutes
**Complexity**: Low

**Implementation**:

```tsx
// Find and replace throughout codebase

// BEFORE (fails WCAG AA)
text-slate-600  // 4.2:1 contrast ratio (needs 4.5:1)
text-slate-400  // Dark mode issue

// AFTER (passes WCAG AA)
text-slate-700 dark:text-slate-300  // 5.8:1 contrast ratio ✅

// Specific fixes:

// page.tsx line 22
<p className="text-xl text-slate-700 dark:text-slate-300">
  A simple and powerful way to organize your thoughts
</p>

// page.tsx line 33 (and similar)
<p className="text-sm text-slate-700 dark:text-slate-300">
  Instantly save your thoughts before they slip away
</p>

// card.tsx line 40
<div
  className={cn("text-sm text-slate-700 dark:text-slate-300", className)}
  {...props}
/>
```

**Color Reference**:
```
✅ PASS (WCAG AA)
slate-950 on white: 18.9:1
slate-900 on white: 14.4:1
slate-800 on white: 11.2:1
slate-700 on white: 7.9:1  ← Use this

❌ FAIL (WCAG AA)
slate-600 on white: 4.2:1  ← Don't use
slate-500 on white: 2.9:1
```

**Testing**:
- [ ] Check with contrast checker tool
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify readability on mobile
- [ ] Test with color blindness simulator

---

### P1.3: Implement Visible Focus Indicators

**Issue**: Focus states are too subtle

**Impact**: HIGH - keyboard users can't see focus
**Effort**: 1 hour
**Complexity**: Low

**Implementation**:

```css
/* src/app/globals.css - Add after existing styles */

/* Enhanced focus styles for all interactive elements */
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

/* Dark mode focus */
@media (prefers-color-scheme: dark) {
  :focus-visible {
    outline-color: #60a5fa;
  }
}

/* Button focus (override default) */
button:focus-visible,
a:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Input focus enhancement */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Skip link (keyboard navigation) */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 100;
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}
```

```tsx
// Update button.tsx focus styles
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-blue-500",
  // ... rest unchanged
);
```

```tsx
// Add skip link to layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
```

**Testing**:
- [ ] Tab through all interactive elements
- [ ] Focus ring is clearly visible (3px wide)
- [ ] Focus ring has adequate contrast
- [ ] Skip link appears on Tab press
- [ ] Focus ring doesn't overlap content
- [ ] Test in light and dark mode

---

### P1.4: Add ARIA Labels to Interactive Elements

**Issue**: Screen readers can't announce button/link purposes

**Impact**: HIGH - screen reader users can't navigate
**Effort**: 2 hours
**Complexity**: Low

**Implementation**:

```tsx
// page.tsx - Add ARIA labels

// Navigation
<nav aria-label="Main navigation" className="border-b...">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2" role="img" aria-label="Brain Capture logo">
      <Brain className="w-6 h-6 text-blue-600" aria-hidden="true" />
      <span className="font-semibold text-xl">Brain Capture</span>
    </div>
    <Button
      variant="outline"
      aria-label="Get started with Brain Capture - Create your first idea"
    >
      Get Started
    </Button>
  </div>
</nav>

// Main content
<main aria-label="Main content" className="container...">
  {/* Heading is self-describing */}
  <h1 className="text-5xl font-bold">Capture Your Ideas</h1>

  {/* Description has implicit label from heading */}
  <p className="text-xl..." aria-describedby="app-description">
    A simple and powerful way to organize your thoughts
  </p>

  {/* Feature cards */}
  <section aria-label="Features" className="grid...">
    <Card role="article" aria-labelledby="feature-1-title">
      <div className="w-12 h-12..." role="img" aria-label="Quick capture icon">
        <Brain className="w-6 h-6..." aria-hidden="true" />
      </div>
      <h3 id="feature-1-title" className="font-semibold text-lg">
        Quick Capture
      </h3>
      <p className="text-sm...">
        Instantly save your thoughts before they slip away
      </p>
    </Card>
    {/* Repeat for other cards */}
  </section>
</main>
```

```tsx
// button.tsx - Add aria-label prop to interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  "aria-label"?: string;  // Make explicit for TypeScript
}
```

```tsx
// Capture page ARIA labels
<Textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="What's on your mind?"
  autoFocus
  aria-label="Idea content"
  aria-describedby="character-count"
/>

<span id="character-count" className="text-sm text-slate-500">
  {content.length} characters
</span>

<Button
  onClick={handleSave}
  disabled={!content.trim() || isSaving}
  aria-label={isSaving ? "Saving idea..." : "Save idea"}
  aria-busy={isSaving}
>
  Save Idea
</Button>
```

**ARIA Best Practices**:
```tsx
// Icon-only buttons MUST have aria-label
<Button
  variant="ghost"
  size="icon"
  aria-label="Close"  // ✅ Required
>
  <X className="w-5 h-5" aria-hidden="true" />  // ✅ Hide from screen readers
</Button>

// Buttons with text don't need aria-label
<Button>
  Save Idea  // ✅ Screen reader will read this
</Button>

// Loading states
<Button aria-busy={isLoading} aria-label={isLoading ? "Saving..." : "Save"}>
  {isLoading ? "Saving..." : "Save"}
</Button>

// Error messages
<div role="alert" aria-live="assertive">
  Error: Failed to save idea
</div>

// Success messages
<div role="status" aria-live="polite">
  Idea saved successfully
</div>
```

**Testing with Screen Readers**:

macOS VoiceOver:
```bash
# Enable VoiceOver: Cmd+F5
# Navigate: VO+Right/Left (Control+Option+Arrow)
# Interact: VO+Space
```

Testing Checklist:
- [ ] All buttons announce their purpose
- [ ] Icon-only buttons have labels
- [ ] Images have alt text or aria-label
- [ ] Form inputs have associated labels
- [ ] Decorative icons have aria-hidden="true"
- [ ] Loading states announce correctly
- [ ] Error messages are announced
- [ ] Landmarks (nav, main, footer) are identified

---

## P2 - Medium Priority (Week 3-4)

### P2.1: Optimize Mobile Typography

**Issue**: H1 too large on mobile, body text too small

**Impact**: MEDIUM - readability on small screens
**Effort**: 1 hour
**Complexity**: Low

**Implementation**:

```tsx
// page.tsx - Make responsive

// BEFORE
<h1 className="text-5xl font-bold tracking-tight">
  Capture Your Ideas
</h1>

// AFTER
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
  Capture Your Ideas
</h1>
// Result: 30px mobile → 36px tablet → 48px desktop

// BEFORE
<p className="text-xl text-slate-700">
  A simple and powerful way...
</p>

// AFTER
<p className="text-lg sm:text-xl text-slate-700">
  A simple and powerful way...
</p>
// Result: 18px mobile → 20px desktop

// BEFORE
<h3 className="font-semibold text-lg">Quick Capture</h3>

// AFTER
<h3 className="font-semibold text-lg sm:text-xl">Quick Capture</h3>
// Result: 18px mobile → 20px desktop

// BEFORE
<p className="text-sm text-slate-700">
  Instantly save your thoughts...
</p>

// AFTER
<p className="text-base sm:text-sm text-slate-700">
  Instantly save your thoughts...
</p>
// Result: 16px mobile → 14px desktop
```

**Typography Scale Reference**:
```tsx
// Mobile-first responsive scale
text-xs:   12px → 0.75rem    (captions, avoid on mobile)
text-sm:   14px → 0.875rem   (secondary text on desktop only)
text-base: 16px → 1rem       (DEFAULT body text, always use on mobile)
text-lg:   18px → 1.125rem   (emphasized text)
text-xl:   20px → 1.25rem    (subheadings)
text-2xl:  24px → 1.5rem     (h3)
text-3xl:  30px → 1.875rem   (h2 mobile, h1 mobile)
text-4xl:  36px → 2.25rem    (h1 tablet)
text-5xl:  48px → 3rem       (h1 desktop)
```

**Testing**:
- [ ] Test on iPhone SE (375px width)
- [ ] Test on iPhone 15 Pro (393px width)
- [ ] Test on iPad (768px width)
- [ ] All text is readable without zoom
- [ ] No horizontal scroll on mobile
- [ ] Line length is comfortable (45-75 characters)

---

### P2.2: Implement Keyboard Shortcuts

**Issue**: No shortcuts for power users

**Impact**: MEDIUM - slower for frequent users
**Effort**: 2 hours
**Complexity**: Low

**Implementation**:

```bash
npm install react-hotkeys-hook
```

```tsx
// src/hooks/use-keyboard-shortcuts.tsx
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
  const router = useRouter();

  // Quick capture: Cmd+K (Mac) or Ctrl+K (Windows)
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    router.push('/capture');
    toast.info('Quick capture opened');
  }, { enableOnFormTags: false });

  // New idea: Cmd+N
  useHotkeys('mod+n', (e) => {
    e.preventDefault();
    router.push('/capture');
  }, { enableOnFormTags: false });

  // Save: Cmd+Enter (when in textarea)
  useHotkeys('mod+enter', (e) => {
    e.preventDefault();
    const form = document.querySelector('form');
    form?.requestSubmit();
  }, { enableOnFormTags: ['TEXTAREA'] });

  // Search: /
  useHotkeys('/', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('input[type="search"]');
    (searchInput as HTMLElement)?.focus();
  }, { enableOnFormTags: false });

  // Close modal: Escape
  useHotkeys('escape', () => {
    // Handled by Radix Dialog automatically
  });

  // Help: Cmd+/
  useHotkeys('mod+/', (e) => {
    e.preventDefault();
    // Show keyboard shortcuts modal
    showShortcutsModal();
  }, { enableOnFormTags: false });
}

function showShortcutsModal() {
  // TODO: Implement shortcuts help modal
  toast.info('Keyboard shortcuts', {
    description: '⌘K: Quick capture, ⌘N: New idea, ⌘Enter: Save',
  });
}
```

```tsx
// src/app/layout.tsx - Add keyboard shortcuts to root
'use client';

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

export default function RootLayout({ children }) {
  useKeyboardShortcuts();

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// src/components/keyboard-shortcuts-modal.tsx
export function KeyboardShortcutsModal() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Quick capture</span>
            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              ⌘K
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span>New idea</span>
            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              ⌘N
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span>Save idea</span>
            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              ⌘↵
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span>Search</span>
            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              /
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span>Close modal</span>
            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              Esc
            </kbd>
          </div>

          <div className="flex justify-between items-center">
            <span>Show shortcuts</span>
            <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
              ⌘/
            </kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Testing**:
- [ ] Cmd+K opens capture (Mac)
- [ ] Ctrl+K opens capture (Windows/Linux)
- [ ] Cmd+Enter saves from textarea
- [ ] / focuses search input
- [ ] Esc closes modals
- [ ] Shortcuts work across pages
- [ ] Shortcuts don't interfere with browser shortcuts
- [ ] Shortcuts are discoverable (show hint on hover)

---

### P2.3: Create Loading/Error/Empty States

**Issue**: No UI for various app states

**Impact**: MEDIUM - poor UX without feedback
**Effort**: 3 hours
**Complexity**: Low

**Implementation**:

```tsx
// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  );
}

// Skeleton variants
export function IdeaCardSkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </Card>
  );
}

export function IdeasListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <IdeaCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

```tsx
// src/components/empty-state.tsx
import { Brain, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title = "No ideas yet",
  description = "Tap the button below to capture your first idea",
  actionLabel = "Create Your First Idea",
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
        <Brain className="w-8 h-8 text-slate-400" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        {description}
      </p>

      {onAction && (
        <Button size="lg" onClick={onAction}>
          <Plus className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
```

```tsx
// src/components/error-state.tsx
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load your ideas. Please try again.",
  onRetry,
  showAlert = false,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showAlert?: boolean;
}) {
  if (showAlert) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{description}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        {description}
      </p>

      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
```

```tsx
// Usage example in ideas list
export default function IdeasPage() {
  const { data: ideas, isLoading, error, refetch } = useIdeas();

  if (isLoading) {
    return <IdeasListSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load ideas"
        description={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!ideas || ideas.length === 0) {
    return (
      <EmptyState
        title="No ideas yet"
        description="Start capturing your thoughts and build your knowledge base"
        actionLabel="Capture Your First Idea"
        onAction={() => router.push('/capture')}
      />
    );
  }

  return (
    <div className="space-y-4">
      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
```

**Testing**:
- [ ] Skeleton shows while loading
- [ ] Empty state shows when no data
- [ ] Error state shows on API failure
- [ ] Retry button works
- [ ] States are accessible (screen reader friendly)
- [ ] Transitions are smooth

---

## P3 - Low Priority (Future)

### P3.1: Implement Internationalization (i18n)

**Effort**: 2-3 days
**Complexity**: Medium

See full i18n implementation in main design review document.

---

### P3.2: Add Swipe Gestures

**Effort**: 4 hours
**Complexity**: Medium

```bash
npm install framer-motion
```

```tsx
import { motion } from 'framer-motion';

<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 100 }}
  onDragEnd={(e, info) => {
    if (info.offset.x < -50) handleDelete();
    if (info.offset.x > 50) handleArchive();
  }}
>
  {ideaCard}
</motion.div>
```

---

### P3.3: Implement Dark Mode Toggle

**Effort**: 1 hour
**Complexity**: Low

```bash
npm install next-themes
```

```tsx
// src/components/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

---

## Implementation Timeline

### Week 1: Critical Fixes (P0)
- Day 1-2: Implement text capture UI (P0.1)
- Day 2: Create Input/Textarea components (P0.2, P0.3)
- Day 3: Fix button touch targets (P0.4)
- Day 3: Add toast system (P0.5)
- Day 4-5: Testing and bug fixes

### Week 2: High Priority (P1)
- Day 1-3: Implement voice recording (P1.1)
- Day 3: Fix color contrast (P1.2)
- Day 4: Add focus indicators (P1.3)
- Day 4-5: Add ARIA labels (P1.4)
- Day 5: Testing

### Week 3-4: Medium Priority (P2)
- Day 1: Optimize mobile typography (P2.1)
- Day 1-2: Add keyboard shortcuts (P2.2)
- Day 3-4: Create all state components (P2.3)
- Day 5: Testing and polish

### Week 5+: Low Priority (P3)
- Future sprints: i18n, gestures, dark mode toggle

---

## Success Metrics

Track these metrics after implementing recommendations:

**Performance**:
- Lighthouse Accessibility score: Target > 95 (currently ~62)
- Mobile usability score: Target 100 (currently failing)

**User Experience**:
- Time to first capture: < 10 seconds
- Capture success rate: > 95%
- Error rate: < 5%

**Accessibility**:
- WCAG 2.1 AA compliance: 100%
- Screen reader navigation: Fully functional
- Keyboard navigation: All features accessible

---

## Questions or Issues?

Contact: design-team@braincapture.app
Documentation: /docs/DESIGN_REVIEW.md
