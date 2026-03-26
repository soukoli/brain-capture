# VoiceInput Quick Reference

## Import

```tsx
import { VoiceInput } from "@/components/capture";
import { useVoiceRecognition } from "@/hooks";
```

## Basic Usage

```tsx
<VoiceInput
  onTranscript={(text) => handleText(text)}
  onError={(error) => console.error(error)}
/>
```

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `onTranscript` | `(text: string) => void` | - | No |
| `onError` | `(error: Error) => void` | - | No |
| `language` | `string` | `"en-US"` | No |
| `className` | `string` | - | No |
| `showTranscript` | `boolean` | `true` | No |

## Hook API

```tsx
const {
  isSupported,        // boolean
  state,              // "idle" | "listening" | "processing" | "error"
  transcript,         // string (final)
  interimTranscript,  // string (temporary)
  isListening,        // boolean
  error,              // VoiceRecognitionError | null
  start,              // () => Promise<void>
  stop,               // () => void
  reset,              // () => void
} = useVoiceRecognition(options);
```

## Languages

- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Spanish
- `fr-FR` - French
- `de-DE` - German
- `it-IT` - Italian
- `pt-BR` - Portuguese
- `ja-JP` - Japanese
- `zh-CN` - Chinese
- `ko-KR` - Korean

## Browser Support

✅ Chrome/Edge 33+, Safari 14.1+, Opera 27+
❌ Firefox (not supported)

## Requirements

- HTTPS in production (except localhost)
- Microphone permission
- Modern browser with Web Speech API

## Files

- Component: `/src/components/capture/VoiceInput.tsx`
- Hook: `/src/hooks/useVoiceRecognition.ts`
- Types: `/src/types/speech-recognition.d.ts`
- Example: `/src/app/examples/voice-input/page.tsx`
- Docs: `/src/components/capture/README.md`

## Demo

```bash
npm run dev
# Visit: http://localhost:3000/examples/voice-input
```

## Common Patterns

### Append to textarea
```tsx
<VoiceInput
  onTranscript={(text) => setContent(prev => prev + " " + text)}
/>
```

### Replace content
```tsx
<VoiceInput
  onTranscript={(text) => setContent(text)}
/>
```

### Custom language
```tsx
<VoiceInput language="es-ES" />
```

## Troubleshooting

- **Not supported?** Use Chrome/Safari (not Firefox)
- **Permission denied?** Check browser site settings
- **No speech detected?** Check microphone is working
- **HTTPS error?** Deploy with HTTPS in production
