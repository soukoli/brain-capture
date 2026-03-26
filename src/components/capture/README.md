# VoiceInput Component

A production-ready voice input component for React/Next.js applications using the Web Speech API.

## Features

- **Web Speech API Integration**: Full implementation of browser speech recognition
- **Real-time Transcription**: Live display of speech-to-text conversion
- **Multi-language Support**: 10+ languages including English, Spanish, French, German, Chinese, Japanese
- **Mobile Optimized**: Thumb-friendly touch targets and responsive design
- **Accessibility**: ARIA live regions, screen reader support, keyboard navigation
- **Error Handling**: Comprehensive error states with helpful user messages
- **Browser Compatibility**: Detection and fallback for unsupported browsers
- **Permission Management**: Clear UI for microphone permission requests
- **TypeScript**: Fully typed with strict mode

## Browser Support

The Web Speech API is supported in:
- Chrome/Edge 33+ (desktop and mobile)
- Safari 14.1+ (desktop and mobile)
- Opera 27+

**Not supported in Firefox** (as of March 2026)

## Installation

The component is already included in the project. No additional dependencies required.

## Usage

### Basic Example

```tsx
import { VoiceInput } from "@/components/capture/VoiceInput";

export default function MyPage() {
  const handleTranscript = (text: string) => {
    console.log("Transcript received:", text);
    // Do something with the transcribed text
  };

  const handleError = (error: Error) => {
    console.error("Voice input error:", error);
  };

  return (
    <VoiceInput
      onTranscript={handleTranscript}
      onError={handleError}
    />
  );
}
```

### Advanced Example with Custom Language

```tsx
import { VoiceInput } from "@/components/capture/VoiceInput";
import { useState } from "react";

export default function CapturePage() {
  const [capturedText, setCapturedText] = useState("");

  return (
    <div>
      <VoiceInput
        language="es-ES"
        onTranscript={(text) => setCapturedText(text)}
        onError={(error) => alert(error.message)}
        showTranscript={true}
      />

      {capturedText && (
        <div>
          <h3>Captured:</h3>
          <p>{capturedText}</p>
        </div>
      )}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onTranscript` | `(text: string) => void` | - | Callback when user clicks "Use This Text" |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |
| `language` | `string` | `"en-US"` | Language code for speech recognition |
| `className` | `string` | - | Custom className for container |
| `showTranscript` | `boolean` | `true` | Whether to show transcript preview |

## Supported Languages

- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Spanish
- `fr-FR` - French
- `de-DE` - German
- `it-IT` - Italian
- `pt-BR` - Portuguese (Brazil)
- `ja-JP` - Japanese
- `zh-CN` - Chinese (Simplified)
- `ko-KR` - Korean

## Component States

1. **Not Supported**: Shows fallback message for unsupported browsers
2. **Permission Denied**: Shows help message for microphone access
3. **Idle**: Ready to start recording (shows "Tap to speak" button)
4. **Processing**: Initializing speech recognition (shows spinner)
5. **Listening**: Actively recording (shows pulsing red indicator)
6. **Complete**: Shows transcript with action buttons
7. **Error**: Shows error message with retry option

## Custom Hook

The component uses a custom `useVoiceRecognition` hook that can be used independently:

```tsx
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

function MyComponent() {
  const {
    isSupported,
    state,
    transcript,
    interimTranscript,
    isListening,
    error,
    start,
    stop,
    reset,
  } = useVoiceRecognition({
    language: "en-US",
    continuous: true,
    interimResults: true,
    onError: (error) => console.error(error),
    onTranscript: (text, isFinal) => console.log(text, isFinal),
  });

  // Use the hook data and methods
}
```

## Hook API

### Options

```typescript
interface UseVoiceRecognitionOptions {
  language?: string;           // Language code (default: "en-US")
  continuous?: boolean;        // Continue after pause (default: false)
  interimResults?: boolean;    // Show interim results (default: true)
  maxAlternatives?: number;    // Max alternatives (default: 1)
  onError?: (error: VoiceRecognitionError) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
}
```

### Return Value

```typescript
interface UseVoiceRecognitionReturn {
  isSupported: boolean;        // Browser support
  state: RecognitionState;     // Current state
  transcript: string;          // Final transcript
  interimTranscript: string;   // Interim (temporary) transcript
  isListening: boolean;        // Is actively listening
  error: VoiceRecognitionError | null;
  start: () => Promise<void>;  // Start recognition
  stop: () => void;            // Stop recognition
  reset: () => void;           // Reset transcript
}
```

## Accessibility Features

- **ARIA live regions**: Screen readers announce recording status
- **Keyboard navigation**: Full keyboard support for all controls
- **Clear labels**: All buttons have descriptive aria-labels
- **Focus management**: Proper focus indicators and tab order
- **Color contrast**: WCAG AA compliant color combinations
- **Touch targets**: Minimum 48x48px touch areas for mobile

## Mobile Optimization

- Large 80x80px microphone button (thumb-friendly)
- Responsive text sizes and spacing
- Touch-optimized animations
- Mobile browser compatibility
- Works in iOS Safari and Chrome Android

## Error Handling

The component handles all common error scenarios:

- **Not Supported**: Browser doesn't support Web Speech API
- **Permission Denied**: User denied microphone permission
- **No Speech**: No speech detected in audio
- **Audio Capture**: Microphone hardware issues
- **Network**: Connection problems during recognition
- **Aborted**: Recognition manually stopped

Each error shows a user-friendly message with actionable steps.

## Styling

The component uses Tailwind CSS and supports dark mode out of the box. All colors, spacing, and animations are customizable through Tailwind classes.

## Security Considerations

- Requires HTTPS in production (browser requirement)
- Requests microphone permission explicitly
- No audio data is stored or transmitted by this component
- Speech recognition happens in the browser (not sent to your server)
- Google's speech recognition API is used by Chrome/Edge

## Performance

- Lazy initialization: Speech recognition only starts when needed
- Efficient re-renders: Optimized with useCallback and useRef
- No memory leaks: Proper cleanup in useEffect
- Small bundle size: No external dependencies beyond UI libraries

## Testing

To test the component:

1. **Desktop Chrome/Edge**: Full support, best testing experience
2. **Mobile Safari**: Test on real iOS device (simulator has limitations)
3. **Mobile Chrome**: Test on real Android device
4. **Firefox**: Will show "not supported" message (expected)

## Troubleshooting

### "Microphone permission denied"
- Check browser permissions (chrome://settings/content/microphone)
- Ensure HTTPS is used (required in production)
- Try in incognito/private window to reset permissions

### "Not supported" on Safari
- Update to Safari 14.1+
- Enable microphone in system settings
- Check if site has microphone permission

### No speech detected
- Ensure microphone is working (check system settings)
- Speak clearly and close to microphone
- Check microphone input level in system settings
- Try different microphone if using external device

### Recognition stops immediately
- Chrome has 60-second timeout for continuous recognition
- User must be actively speaking
- Page must be in focus (background tabs may pause)

## Future Enhancements

Potential improvements (not yet implemented):

- Voice commands (e.g., "stop", "clear", "send")
- Custom wake words
- Offline recognition (requires different approach)
- Audio waveform visualization
- Confidence scores display
- Multiple language detection
- Custom vocabulary/phrases

## License

Part of the Brain Capture project.
