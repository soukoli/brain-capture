"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Keyboard, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectSelector } from "./ProjectSelector";
import { RecentCaptures } from "./RecentCaptures";
import type { Capture, CaptureMode, Project } from "@/lib/types";

// Mock data - replace with actual API calls
const mockProjects: Project[] = [
  {
    id: "inbox",
    name: "Inbox",
    color: "#94a3b8",
    description: "Default inbox for quick captures",
    createdAt: new Date(),
  },
  {
    id: "work",
    name: "Work",
    color: "#3b82f6",
    description: "Work-related ideas",
    createdAt: new Date(),
  },
  {
    id: "personal",
    name: "Personal",
    color: "#10b981",
    description: "Personal projects and ideas",
    createdAt: new Date(),
  },
];

const mockCaptures: Capture[] = [
  {
    id: "1",
    content: "Build a new feature for the dashboard that shows analytics",
    projectId: "work",
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    type: "text",
  },
  {
    id: "2",
    content: "Remember to buy groceries and pick up laundry",
    projectId: "personal",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: "text",
  },
  {
    id: "3",
    content: "Research new technologies for the next project sprint",
    projectId: "work",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: "voice",
  },
];

export function CapturePage() {
  const [mode, setMode] = useState<CaptureMode>("text");
  const [content, setContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("inbox");
  const [captures, setCaptures] = useState<Capture[]>(mockCaptures);
  const [projects] = useState<Project[]>(mockProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (mode === "text" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  const handleSave = useCallback(async () => {
    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newCapture: Capture = {
        id: Date.now().toString(),
        content: content.trim(),
        projectId: selectedProjectId,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: mode,
      };

      // Optimistic update
      setCaptures((prev) => [newCapture, ...prev].slice(0, 10));
      setContent("");

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Idea captured!</span>
        </div>
      );
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to save. Please try again.</span>
        </div>
      );
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [content, selectedProjectId, mode]);

  const handleClear = useCallback(() => {
    setContent("");
    textareaRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "k") {
        e.preventDefault();
        textareaRef.current?.focus();
      } else if (modKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if (modKey && e.key === "e") {
        e.preventDefault();
        handleClear();
      } else if (modKey && e.key === "1") {
        e.preventDefault();
        setMode("text");
      } else if (modKey && e.key === "2") {
        e.preventDefault();
        setMode("voice");
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleClear]);

  const handleEdit = useCallback((capture: Capture) => {
    setContent(capture.content);
    setSelectedProjectId(capture.projectId);
    setMode(capture.type);
    textareaRef.current?.focus();
  }, []);

  const handleDelete = useCallback(async (captureId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCaptures((prev) => prev.filter((c) => c.id !== captureId));
      toast.success("Capture deleted");
    } catch (error) {
      toast.error("Failed to delete");
      console.error("Delete error:", error);
    }
  }, []);

  const handleProjectChange = useCallback((projectId: string) => {
    if (projectId === "__create_new__") {
      toast.info("Project creation coming soon!");
      return;
    }
    setSelectedProjectId(projectId);
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24 md:p-6">
      {/* Mode Tabs */}
      <Card className="p-1">
        <Tabs value={mode} onValueChange={(v) => setMode(v as CaptureMode)}>
          <TabsList className="w-full">
            <TabsTrigger value="text" className="flex-1">
              Text
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex-1">
              Voice
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Capture Input Area */}
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          {mode === "text" ? (
            <div>
              <label htmlFor="capture-input" className="sr-only">
                Capture your idea
              </label>
              <textarea
                ref={textareaRef}
                id="capture-input"
                placeholder="What's on your mind? Start typing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] w-full resize-none rounded-md border border-slate-200 bg-white p-4 text-base focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-600 dark:focus:ring-slate-600 md:min-h-[250px]"
                disabled={isSaving}
              />
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 md:min-h-[250px]">
              <div className="text-center text-slate-500">
                <p className="text-sm">Voice input component</p>
                <p className="mt-1 text-xs">Coming soon</p>
              </div>
            </div>
          )}

          {/* Character count for text mode */}
          {mode === "text" && content && (
            <div className="text-right text-xs text-slate-500">
              {content.length} characters
            </div>
          )}
        </div>
      </Card>

      {/* Project Selector */}
      <Card className="p-4 md:p-6">
        <ProjectSelector
          selectedProjectId={selectedProjectId}
          onProjectChange={handleProjectChange}
          projects={projects}
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isSaving || !content}
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="flex-1"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Idea"
          )}
        </Button>
      </div>

      {/* Recent Captures */}
      <RecentCaptures
        captures={captures}
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Keyboard Shortcuts Hint */}
      <Card className="p-4">
        <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Keyboard className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                ⌘K
              </kbd>{" "}
              Focus input
            </div>
            <div>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                ⌘S
              </kbd>{" "}
              Save idea
            </div>
            <div>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                ⌘E
              </kbd>{" "}
              Clear input
            </div>
            <div>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                Esc
              </kbd>{" "}
              Cancel
            </div>
            <div>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                ⌘1
              </kbd>{" "}
              Text mode
            </div>
            <div>
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                ⌘2
              </kbd>{" "}
              Voice mode
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
