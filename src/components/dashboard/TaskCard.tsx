"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

export interface TaskCardProps {
  task: {
    id: string;
    content: string;
    status: "captured" | "in-progress" | "completed" | "archived";
    priority?: Priority;
    projectId?: string;
    timeInProgress?: number;
    shouldWarn?: boolean;
  };
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { content, status, priority, timeInProgress, shouldWarn } = task;

  // Truncate content for preview
  const contentPreview = content.length > 50 ? `${content.slice(0, 50)}...` : content;

  // Format time in progress
  const formatTimeInProgress = (ms?: number) => {
    if (!ms) return null;
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "captured":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "archived":
        return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Priority colors
  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-slate-300 dark:bg-slate-600";
    }
  };

  const timeDisplay = formatTimeInProgress(timeInProgress);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        shouldWarn && "border-red-500 border-2"
      )}
      onClick={() => {
        setIsExpanded(!isExpanded);
        onClick?.();
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header: Status Badge + Priority Indicator */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Priority Indicator */}
              {priority && (
                <div
                  className={cn(
                    "h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-950",
                    getPriorityColor(priority)
                  )}
                  title={`Priority: ${priority}`}
                />
              )}

              {/* Status Badge */}
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  getStatusColor(status)
                )}
              >
                {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            {/* Warning Icon */}
            {shouldWarn && (
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
          </div>

          {/* Content Preview/Full */}
          <div className="space-y-2">
            <p className={cn(
              "text-sm text-slate-700 dark:text-slate-300",
              !isExpanded && "line-clamp-2"
            )}>
              {isExpanded ? content : contentPreview}
            </p>

            {/* Expand/Collapse Button */}
            {content.length > 50 && (
              <button
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Show more
                  </>
                )}
              </button>
            )}
          </div>

          {/* Time in Progress */}
          {timeDisplay && status === "in-progress" && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Active for {timeDisplay}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
