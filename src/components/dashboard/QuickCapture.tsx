"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { VoiceInput } from "@/components/capture/VoiceInput";
import { Plus, Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export interface QuickCaptureProps {
  projects?: Project[];
  onCapture?: (content: string, projectId?: string) => void;
  isSubmitting?: boolean;
}

export function QuickCapture({ projects = [], onCapture, isSubmitting = false }: QuickCaptureProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle focus
  const handleFocus = () => {
    setIsExpanded(true);
  };

  // Handle blur - only collapse if no content
  const handleBlur = () => {
    if (!content.trim() && !showVoiceInput) {
      setIsExpanded(false);
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    onCapture?.(content, selectedProjectId || undefined);
    setContent("");
    setSelectedProjectId("");
    setIsExpanded(false);
    setShowVoiceInput(false);
  };

  // Handle voice transcript
  const handleVoiceTranscript = (text: string) => {
    setContent(text);
    setShowVoiceInput(false);
    setIsExpanded(true);
    // Focus input after a brief delay to allow state updates
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handle cancel
  const handleCancel = () => {
    setContent("");
    setSelectedProjectId("");
    setIsExpanded(false);
    setShowVoiceInput(false);
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg transition-all dark:bg-slate-950 dark:border-slate-800",
        isExpanded ? "pb-6 pt-4" : "pb-4 pt-3"
      )}
    >
      <div className="container mx-auto max-w-4xl px-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Main Input Row */}
          <div className="flex items-center gap-2">
            {/* Input Field */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Quick capture..."
                className={cn(
                  "w-full rounded-lg border bg-white px-4 transition-all dark:bg-slate-900",
                  "text-sm text-slate-900 placeholder:text-slate-400 dark:text-slate-50 dark:placeholder:text-slate-500",
                  "border-slate-200 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900",
                  "dark:border-slate-800 dark:focus:border-slate-50 dark:focus:ring-slate-50",
                  isExpanded ? "h-12" : "h-11"
                )}
                disabled={isSubmitting}
              />
            </div>

            {/* Voice Button */}
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={cn(
                "flex-shrink-0 transition-all",
                isExpanded ? "h-12 w-12" : "h-11 w-11",
                showVoiceInput && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              )}
              onClick={() => {
                setShowVoiceInput(!showVoiceInput);
                setIsExpanded(true);
              }}
              disabled={isSubmitting}
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5" />
            </Button>

            {/* Submit Button */}
            <Button
              type="submit"
              size="icon"
              className={cn(
                "flex-shrink-0 transition-all",
                isExpanded ? "h-12 w-12" : "h-11 w-11"
              )}
              disabled={!content.trim() || isSubmitting}
              aria-label="Capture"
            >
              {isSubmitting ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Expanded Options */}
          {isExpanded && (
            <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
              {/* Project Selector */}
              {projects.length > 0 && (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className={cn(
                    "flex-1 rounded-md border bg-white px-3 py-2 text-sm",
                    "border-slate-200 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900",
                    "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-50 dark:focus:ring-slate-50"
                  )}
                  disabled={isSubmitting}
                >
                  <option value="">No project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Cancel Button */}
              {content && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-shrink-0"
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
          )}
        </form>

        {/* Voice Input Modal */}
        {showVoiceInput && (
          <div className="mt-4 animate-in slide-in-from-bottom-3 duration-200">
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              showTranscript={true}
              className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
