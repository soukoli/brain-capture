# VoiceInput Integration Guide

Quick guide to integrating the VoiceInput component into your Brain Capture app.

## Files Created

### Core Files
1. **`/src/hooks/useVoiceRecognition.ts`** - Custom hook for Web Speech API
2. **`/src/components/capture/VoiceInput.tsx`** - Voice input UI component
3. **`/src/types/speech-recognition.d.ts`** - TypeScript definitions for Web Speech API

### Documentation & Examples
4. **`/src/components/capture/README.md`** - Complete component documentation
5. **`/src/app/examples/voice-input/page.tsx`** - Working example page

### Index Files (updated)
6. **`/src/components/capture/index.ts`** - Added VoiceInput export
7. **`/src/hooks/index.ts`** - Added useVoiceRecognition export

## Quick Start

### 1. Basic Usage

```tsx
import { VoiceInput } from "@/components/capture";

export default function MyPage() {
  const handleTranscript = (text: string) => {
    console.log("Transcript:", text);
  };

  return <VoiceInput onTranscript={handleTranscript} />;
}
```

### 2. View the Example

Start the dev server and visit:
```
http://localhost:3000/examples/voice-input
```

### 3. Integrate into CaptureForm

Update your CaptureForm to include voice input:

```tsx
import { VoiceInput } from "@/components/capture";

// Inside your form:
<VoiceInput
  onTranscript={(text) => {
    // Append to existing content or replace
    setContent(prev => prev + ' ' + text);
  }}
  onError={(error) => {
    console.error('Voice error:', error);
  }}
/>
```

## Component Props

```typescript
interface VoiceInputProps {
  onTranscript?: (text: string) => void;  // Called when user clicks "Use This Text"
  onError?: (error: Error) => void;        // Called on errors
  language?: string;                       // Default: "en-US"
  className?: string;                      // Custom styling
  showTranscript?: boolean;                // Default: true
}
```

## Hook API

If you want more control, use the hook directly:

```tsx
import { useVoiceRecognition } from "@/hooks";

function MyComponent() {
  const {
    isSupported,    // Browser support check
    state,          // idle | listening | processing | error
    transcript,     // Final transcript text
    isListening,    // Currently recording?
    error,          // Error object if any
    start,          // Start recording
    stop,           // Stop recording
    reset,          // Clear transcript
  } = useVoiceRecognition({
    language: "en-US",
    continuous: true,
    interimResults: true,
  });

  // Use these to build your own UI
}
```

## Browser Requirements

**Supported:**
- Chrome/Edge 33+ (desktop & mobile)
- Safari 14.1+ (desktop & mobile)
- Opera 27+

**Not Supported:**
- Firefox (no Web Speech API)
- Older browsers

**Production Requirements:**
- HTTPS required (except localhost)
- Microphone permission required

## Testing Checklist

- [ ] Desktop Chrome - Full testing
- [ ] Desktop Safari - Permission flow
- [ ] Mobile Chrome (Android) - Touch targets
- [ ] Mobile Safari (iOS) - Real device test
- [ ] Firefox - Shows "not supported" message
- [ ] Test microphone permission denial
- [ ] Test with no microphone device
- [ ] Test in noisy environment
- [ ] Test multiple languages
- [ ] Test accessibility with screen reader

## Common Integration Patterns

### 1. Append to Textarea

```tsx
const [content, setContent] = useState("");

<textarea value={content} onChange={e => setContent(e.target.value)} />
<VoiceInput onTranscript={text => setContent(prev => prev + ' ' + text)} />
```

### 2. Replace Content

```tsx
<VoiceInput onTranscript={text => setContent(text)} />
```

### 3. Batch Processing

```tsx
const [items, setItems] = useState<string[]>([]);

<VoiceInput
  onTranscript={text => setItems(prev => [...prev, text])}
/>
```

### 4. With Loading State

```tsx
const { state } = useVoiceRecognition();
const isProcessing = state === "processing" || state === "listening";

<Button disabled={isProcessing}>Save</Button>
```

## Styling Customization

The component uses Tailwind and supports dark mode:

```tsx
<VoiceInput
  className="max-w-2xl mx-auto"
  // All child elements respect dark mode automatically
/>
```

## Accessibility

The component is fully accessible:
- ARIA live regions for screen readers
- Keyboard navigation support
- Clear focus indicators
- Descriptive labels
- Color contrast compliance
- Touch-friendly targets (80x80px button)

## Security Notes

- Requires HTTPS in production (browser requirement)
- Microphone permission must be granted
- Audio stays in browser (not sent to your server)
- Chrome/Safari use their cloud services for recognition
- No audio recording or storage by this component

## Performance

- Lazy initialization (recognition starts only when needed)
- Optimized re-renders (useCallback, useRef)
- Proper cleanup (no memory leaks)
- Small bundle size (no external deps except UI libs)

## Next Steps

1. **Test the example page**: `/examples/voice-input`
2. **Integrate into CaptureForm**: Add voice input option
3. **Customize styling**: Match your app's design
4. **Test on real devices**: Especially mobile
5. **Deploy to production**: Ensure HTTPS is configured

## Troubleshooting

### Component not appearing?
- Check import path: `@/components/capture/VoiceInput`
- Ensure it's a client component (has "use client")

### "Not supported" message?
- Test in Chrome/Safari (not Firefox)
- Check browser version is recent

### Microphone permission issues?
- Use HTTPS (required in production)
- Check browser site settings
- Try incognito mode to reset permissions

### No speech detected?
- Check microphone is working (system settings)
- Speak clearly and close to mic
- Check input level in system preferences

## Support

See the full documentation in `/src/components/capture/README.md` for more details.
