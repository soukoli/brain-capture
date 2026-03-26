'use client';

/**
 * CaptureForm Component - Main quick capture interface for Brain Capture
 * Features:
 * - Auto-expanding textarea
 * - Auto-save to IndexedDB (debounced 500ms)
 * - Character count display
 * - Keyboard shortcuts (Cmd/Ctrl+K to focus)
 * - Mobile-optimized with large touch targets
 * - Loading states and success/error feedback
 * - Dark mode support
 * - Accessible with ARIA labels
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { saveIdea, createNewIdea } from '@/lib/storage';
import type { CapturedIdea, AutoSaveState } from '@/types';

const MAX_LENGTH = 5000;
const AUTO_SAVE_DELAY = 500; // ms
const MIN_TEXTAREA_HEIGHT = 120; // px
const MAX_TEXTAREA_HEIGHT = 400; // px

interface CaptureFormProps {
  onSubmit?: (idea: CapturedIdea) => void;
  onCancel?: () => void;
  className?: string;
  initialValue?: string;
}

export function CaptureForm({
  onSubmit,
  onCancel,
  className,
  initialValue = '',
}: CaptureFormProps) {
  const [content, setContent] = React.useState(initialValue);
  const [autoSaveState, setAutoSaveState] = React.useState<AutoSaveState>({
    status: 'idle',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentIdea, setCurrentIdea] = React.useState<CapturedIdea | null>(null);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Calculate character count
  const characterCount = content.length;
  const isNearLimit = characterCount > MAX_LENGTH * 0.9;
  const isOverLimit = characterCount > MAX_LENGTH;

  /**
   * Auto-resize textarea based on content
   */
  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to recalculate
    textarea.style.height = 'auto';

    // Calculate new height within bounds
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(
      Math.max(scrollHeight, MIN_TEXTAREA_HEIGHT),
      MAX_TEXTAREA_HEIGHT
    );

    textarea.style.height = `${newHeight}px`;
  }, []);

  /**
   * Auto-save to IndexedDB with debouncing
   */
  const autoSave = React.useCallback(
    async (value: string) => {
      // Clear previous timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Don't save empty content
      if (!value.trim()) {
        setAutoSaveState({ status: 'idle' });
        return;
      }

      // Set saving state
      setAutoSaveState({ status: 'saving' });

      // Debounce the save operation
      autoSaveTimeoutRef.current = setTimeout(async () => {
        try {
          // Create or update idea
          const idea = currentIdea
            ? { ...currentIdea, content: value }
            : createNewIdea(value);

          const savedIdea = await saveIdea(idea);
          setCurrentIdea(savedIdea);

          setAutoSaveState({
            status: 'saved',
            lastSaved: Date.now(),
            message: 'Saved',
          });

          // Reset to idle after 2 seconds
          setTimeout(() => {
            setAutoSaveState({ status: 'idle' });
          }, 2000);
        } catch (error) {
          console.error('Auto-save failed:', error);
          setAutoSaveState({
            status: 'error',
            message: 'Failed to save',
          });
        }
      }, AUTO_SAVE_DELAY);
    },
    [currentIdea]
  );

  /**
   * Handle content changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Enforce max length
    if (value.length <= MAX_LENGTH) {
      setContent(value);
      adjustTextareaHeight();
      autoSave(value);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isOverLimit || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Create or update final idea
      const idea = currentIdea
        ? { ...currentIdea, content, status: 'captured' as const }
        : createNewIdea(content);

      const savedIdea = await saveIdea(idea);

      // Call parent callback if provided
      onSubmit?.(savedIdea);

      // Clear form
      setContent('');
      setCurrentIdea(null);
      setAutoSaveState({ status: 'idle' });

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
      }

      // Show success briefly
      setAutoSaveState({
        status: 'saved',
        message: 'Captured!',
      });

      setTimeout(() => {
        setAutoSaveState({ status: 'idle' });
      }, 1500);
    } catch (error) {
      console.error('Submit failed:', error);
      setAutoSaveState({
        status: 'error',
        message: 'Failed to capture',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle clear button
   */
  const handleClear = () => {
    setContent('');
    setCurrentIdea(null);
    setAutoSaveState({ status: 'idle' });
    textareaRef.current?.focus();

    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
    }
  };

  /**
   * Handle cancel button
   */
  const handleCancel = () => {
    handleClear();
    onCancel?.();
  };

  /**
   * Setup keyboard shortcuts
   */
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus textarea
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Adjust textarea height on mount and content changes
   */
  React.useEffect(() => {
    adjustTextareaHeight();
  }, [content, adjustTextareaHeight]);

  /**
   * Focus textarea on mount
   */
  React.useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /**
   * Cleanup timeout on unmount
   */
  React.useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className={cn('w-full', className)}>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4 md:p-6">
          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              placeholder="Capture your thoughts..."
              aria-label="Capture your thoughts"
              aria-describedby="character-count auto-save-status"
              className={cn(
                'w-full resize-none rounded-lg border bg-transparent px-4 py-3',
                'text-base leading-relaxed',
                'focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent',
                'dark:focus:ring-slate-300',
                'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors',
                // Mobile optimization - larger touch target
                'min-h-[120px] md:min-h-[120px]',
                // Border colors
                'border-slate-200 dark:border-slate-800',
                // Character limit warning
                isNearLimit && !isOverLimit && 'border-yellow-500 focus:ring-yellow-500',
                isOverLimit && 'border-red-500 focus:ring-red-500'
              )}
              style={{
                height: `${MIN_TEXTAREA_HEIGHT}px`,
              }}
              disabled={isSubmitting}
            />

            {/* Auto-save indicator */}
            <div
              id="auto-save-status"
              className="absolute top-2 right-2 text-xs"
              role="status"
              aria-live="polite"
            >
              {autoSaveState.status === 'saving' && (
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                  Saving...
                </span>
              )}
              {autoSaveState.status === 'saved' && (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  {autoSaveState.message || 'Saved'}
                </span>
              )}
              {autoSaveState.status === 'error' && (
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                  {autoSaveState.message || 'Error'}
                </span>
              )}
            </div>
          </div>

          {/* Character count */}
          <div
            id="character-count"
            className={cn(
              'mt-2 text-xs text-right',
              'text-slate-500 dark:text-slate-400',
              isNearLimit && !isOverLimit && 'text-yellow-600 dark:text-yellow-400',
              isOverLimit && 'text-red-600 dark:text-red-400 font-medium'
            )}
            role="status"
            aria-live="polite"
          >
            {characterCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
            {isOverLimit && ' - Character limit exceeded'}
          </div>

          {/* Keyboard shortcut hint */}
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
              {typeof navigator !== 'undefined' &&
              navigator.platform.toLowerCase().includes('mac')
                ? 'Cmd'
                : 'Ctrl'}
              +K
            </kbd>{' '}
            to focus
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 p-4 md:p-6 pt-0">
          {/* Submit button */}
          <Button
            type="submit"
            disabled={!content.trim() || isOverLimit || isSubmitting}
            className="w-full sm:w-auto sm:flex-1 h-11 md:h-10"
            aria-label="Capture idea"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Capturing...
              </>
            ) : (
              'Capture'
            )}
          </Button>

          {/* Clear button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={!content || isSubmitting}
            className="w-full sm:w-auto h-11 md:h-10"
            aria-label="Clear form"
          >
            Clear
          </Button>

          {/* Cancel button (optional) */}
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 md:h-10"
              aria-label="Cancel"
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
