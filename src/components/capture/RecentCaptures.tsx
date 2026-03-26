"use client";

import * as React from "react";
import { Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Capture, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RecentCapturesProps {
  captures: Capture[];
  projects: Project[];
  onEdit: (capture: Capture) => void;
  onDelete: (captureId: string) => void;
  isLoading?: boolean;
}

export function RecentCaptures({
  captures,
  projects,
  onEdit,
  onDelete,
  isLoading = false,
}: RecentCapturesProps) {
  const getProjectById = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Recent Captures
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (captures.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Recent Captures
        </h3>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
            <Clock className="h-8 w-8" />
            <p className="text-sm">No captures yet</p>
            <p className="text-xs text-slate-400">
              Your recent ideas will appear here
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Recent Captures ({captures.length})
      </h3>
      <div className="space-y-2">
        {captures.map((capture) => {
          const project = getProjectById(capture.projectId);
          return (
            <Card
              key={capture.id}
              className={cn(
                "group cursor-pointer p-3 transition-all hover:shadow-md",
                "border-l-4"
              )}
              style={{ borderLeftColor: project?.color || "#94a3b8" }}
              onClick={() => onEdit(capture)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {truncateContent(capture.content)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{formatTimestamp(capture.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: project?.color }}
                      />
                      {project?.name || "Unknown"}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{capture.type}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(capture.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
