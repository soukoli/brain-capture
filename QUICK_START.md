# Quick Start Guide - CaptureForm Component

## Installation Complete ✅

The CaptureForm component and all dependencies are ready to use!

## Files Created

```
src/
├── types/
│   └── index.ts                    # TypeScript type definitions
├── lib/
│   └── storage.ts                  # IndexedDB storage layer
├── components/
│   └── capture/
│       ├── CaptureForm.tsx        # Main component
│       ├── index.ts               # Barrel exports
│       └── CAPTUREFORM.md         # Full documentation
└── app/
    └── capture/
        └── page.tsx               # Demo page
```

## Usage

### 1. Basic Import & Usage

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

### 2. With Submit Handler

```tsx
import { CaptureForm } from '@/components/capture';
import type { CapturedIdea } from '@/types';

export default function MyPage() {
  const handleSubmit = (idea: CapturedIdea) => {
    console.log('New idea:', idea);
    // Do something with the captured idea:
    // - Show success notification
    // - Navigate to ideas list
    // - Sync to server
  };

  return <CaptureForm onSubmit={handleSubmit} />;
}
```

### 3. With All Options

```tsx
import { CaptureForm } from '@/components/capture';

export default function MyPage() {
  return (
    <CaptureForm
      initialValue="Start typing here..."
      onSubmit={(idea) => console.log('Captured:', idea)}
      onCancel={() => console.log('Cancelled')}
      className="max-w-2xl mx-auto"
    />
  );
}
```

## Storage API

```tsx
import {
  saveIdea,
  getIdeas,
  getIdea,
  deleteIdea,
  syncToServer,
  createNewIdea,
} from '@/lib/storage';

// Create a new idea
const idea = createNewIdea('My brilliant thought');

// Save to IndexedDB
await saveIdea(idea);

// Get all ideas
const allIdeas = await getIdeas();

// Get ideas by status
const captured = await getIdeas('captured');

// Get single idea
const single = await getIdea(idea.id);

// Delete idea
await deleteIdea(idea.id);

// Sync to server
const status = await syncToServer();
```

## Type Definitions

```tsx
import type {
  CapturedIdea,
  Status,
  Priority,
  Project,
  SyncStatus,
  AutoSaveState,
} from '@/types';

// Use in your components
const [idea, setIdea] = useState<CapturedIdea | null>(null);
const [status, setStatus] = useState<Status>('captured');
```

## Features Overview

✅ **Auto-save** - Saves automatically after 500ms of inactivity  
✅ **Offline-first** - Works without internet using IndexedDB  
✅ **Character count** - Shows count with warnings at 90%  
✅ **Keyboard shortcuts** - Cmd/Ctrl+K to focus  
✅ **Mobile optimized** - Large touch targets, responsive  
✅ **Accessible** - Full ARIA labels and screen reader support  
✅ **Dark mode** - Automatic theme support  
✅ **Loading states** - Visual feedback for all actions  

## Demo

Visit `/capture` in your browser to see the component in action.

## Next Steps

1. **View Demo**: Navigate to `http://localhost:3000/capture`
2. **Read Docs**: See `/src/components/capture/CAPTUREFORM.md`
3. **Check Types**: Browse `/src/types/index.ts`
4. **Review Storage**: Examine `/src/lib/storage.ts`
5. **Integrate**: Import into your pages/components

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` (Mac) | Focus textarea |
| `Ctrl+K` (Windows/Linux) | Focus textarea |

## Browser Console

Open DevTools and try:

```js
// Check IndexedDB
window.indexedDB.databases()

// Check storage
localStorage
```

## Need Help?

- Read full documentation: `/src/components/capture/CAPTUREFORM.md`
- Check build summary: `/CAPTUREFORM_BUILD_SUMMARY.md`
- Review example page: `/src/app/capture/page.tsx`

## TypeScript

All types are exported from `@/types`:

```tsx
import type { CapturedIdea, Status, Priority } from '@/types';
```

## Testing

```bash
# Type check
npm run type-check

# Format code
npm run format

# Lint
npm run lint

# Run all checks
npm run check
```

---

**Status**: Ready to use!  
**Version**: 1.0.0  
**Last Updated**: March 25, 2026
