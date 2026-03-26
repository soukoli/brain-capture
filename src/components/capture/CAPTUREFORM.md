# CaptureForm Component Documentation

## Overview

The `CaptureForm` component is the core quick-capture interface for the Brain Capture application. It provides a seamless, offline-first experience for capturing thoughts and ideas with auto-save functionality.

## Features

- **Auto-expanding textarea** - Adjusts height based on content (120px - 400px)
- **Auto-save to IndexedDB** - Debounced 500ms, works offline
- **Character count display** - Shows 0/5000 with visual warnings
- **Keyboard shortcuts** - Cmd/Ctrl+K to focus textarea
- **Mobile-optimized** - Large touch targets (44px minimum)
- **Loading states** - Visual feedback for all operations
- **Success/error feedback** - Clear status indicators
- **TypeScript strict types** - Full type safety
- **Accessible** - ARIA labels and keyboard navigation
- **Dark mode support** - Fully styled for light/dark themes

## Installation

The component is already integrated into the project. No additional installation needed.

## Usage

### Basic Usage

```tsx
import { CaptureForm } from '@/components/capture';

export default function MyPage() {
  return (
    <div className="container mx-auto p-4">
      <CaptureForm />
    </div>
  );
}
```

### With Callbacks

```tsx
import { CaptureForm } from '@/components/capture';
import type { CapturedIdea } from '@/types';

export default function MyPage() {
  const handleSubmit = (idea: CapturedIdea) => {
    console.log('Captured:', idea);
    // Navigate to ideas list, show notification, etc.
  };

  const handleCancel = () => {
    console.log('Cancelled');
    // Close modal, navigate back, etc.
  };

  return (
    <CaptureForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
```

### With Initial Value

```tsx
import { CaptureForm } from '@/components/capture';

export default function EditPage() {
  return (
    <CaptureForm
      initialValue="Continue editing this thought..."
      onSubmit={(idea) => console.log('Updated:', idea)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(idea: CapturedIdea) => void` | `undefined` | Callback when form is submitted |
| `onCancel` | `() => void` | `undefined` | Callback when cancel is clicked (shows cancel button when provided) |
| `className` | `string` | `undefined` | Additional CSS classes for the container |
| `initialValue` | `string` | `''` | Pre-populate the textarea with initial content |

## Types

### CapturedIdea

```typescript
interface CapturedIdea {
  id: string;                    // Unique identifier
  content: string;               // The captured text
  createdAt: number;             // Unix timestamp
  updatedAt: number;             // Unix timestamp
  status: Status;                // 'captured' | 'in-progress' | 'completed' | 'archived'
  priority?: Priority;           // 'low' | 'medium' | 'high' | 'urgent'
  projectId?: string;            // Optional project association
  tags?: string[];               // Optional tags
  synced: boolean;               // Whether synced to server
}
```

## Storage Layer

The component uses IndexedDB for offline storage via `/src/lib/storage.ts`:

### Available Functions

```typescript
// Save or update an idea
await saveIdea(idea: CapturedIdea): Promise<CapturedIdea>

// Get all ideas (optionally filtered by status)
await getIdeas(status?: string): Promise<CapturedIdea[]>

// Get a single idea by ID
await getIdea(id: string): Promise<CapturedIdea | null>

// Delete an idea
await deleteIdea(id: string): Promise<void>

// Get unsynced ideas
await getUnsyncedIdeas(): Promise<CapturedIdea[]>

// Sync to server
await syncToServer(): Promise<SyncStatus>

// Create a new idea with defaults
createNewIdea(content: string): CapturedIdea

// Clear all data (use with caution)
await clearAllData(): Promise<void>
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux) | Focus textarea |

## Auto-save Behavior

1. User types in textarea
2. After 500ms of inactivity, auto-save triggers
3. Status indicator shows "Saving..." with pulsing dot
4. On success, shows "Saved ✓" with green dot (2 seconds)
5. On error, shows "Failed to save" with red dot

## Character Limits

- **Maximum**: 5,000 characters
- **Warning**: At 90% (4,500 characters) - yellow border
- **Error**: Over limit - red border, submit disabled

## Responsive Design

### Mobile (< 768px)
- Full-width buttons
- Stacked button layout
- Minimum 44px touch targets
- Larger text (16px to prevent zoom)

### Desktop (≥ 768px)
- Flexible button layout
- Side-by-side buttons
- Standard button heights
- Optimized padding

## Accessibility

- All form controls have ARIA labels
- Status updates use `aria-live="polite"`
- Character count has descriptive status
- Keyboard navigation fully supported
- Focus management on mount
- Clear error messages
- High contrast colors
- Screen reader friendly

## Dark Mode

The component automatically adapts to system/user dark mode preference:
- Dark background colors
- Adjusted border colors
- Appropriate text contrast
- Themed focus rings
- Status indicator colors

## Browser Support

- **Chrome/Edge**: 87+
- **Firefox**: 78+
- **Safari**: 14+
- **Mobile Safari**: 14+
- **Chrome Android**: 87+

Requires IndexedDB support (all modern browsers).

## Performance Considerations

- **Debounced auto-save**: Prevents excessive writes
- **Textarea height**: Cached calculations
- **Cleanup**: Timeouts cleared on unmount
- **IndexedDB transactions**: Properly closed
- **Indexed queries**: Fast retrieval by status/date

## Example Integration

See `/src/app/capture/page.tsx` for a complete working example with:
- Full page layout
- Navigation
- Feature descriptions
- Styled container

## Troubleshooting

### Auto-save not working
- Check browser console for IndexedDB errors
- Verify IndexedDB is not disabled
- Check for storage quota issues

### Character count incorrect
- Ensure content is trimmed properly
- Check for Unicode handling issues

### Keyboard shortcut not firing
- Check for conflicting shortcuts
- Verify event listener is attached
- Test focus state

## Future Enhancements

Potential additions (not yet implemented):
- Rich text editing
- Markdown support
- Image/file attachments
- Voice input integration
- Collaboration features
- Version history
- Export functionality

## Contributing

When modifying this component:
1. Run type checking: `npm run type-check`
2. Test accessibility: Use screen reader
3. Test mobile: Use device emulation
4. Test dark mode: Toggle system preference
5. Test offline: Disable network in DevTools
6. Format code: `npm run format`

## License

Part of the Brain Capture application.
