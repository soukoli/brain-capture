"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    color?: string;
    taskCounts: {
      total: number;
      inbox: number;
      inProgress: number;
      completed: number;
    };
    progress: number;
    totalTimeSpent?: number;
  };
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { name, color, taskCounts, progress, totalTimeSpent } = project;

  // Format time spent (milliseconds to hours/minutes)
  const formatTimeSpent = (ms?: number) => {
    if (!ms) return "0m";
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5",
        "border-l-4"
      )}
      style={{ borderLeftColor: color || "#64748b" }}
      onClick={onClick}
    >
      <CardHeader
        className="pb-3"
        style={{ backgroundColor: color ? `${color}10` : undefined }}
      >
        <CardTitle className="flex items-center gap-2 text-lg">
          <FolderKanban className="h-5 w-5" style={{ color: color || "#64748b" }} />
          <span className="truncate">{name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Task Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Circle className="h-3.5 w-3.5" />
            <span className="font-medium">{taskCounts.inbox}</span>
            <span className="text-xs">Inbox</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="font-medium">{taskCounts.inProgress}</span>
            <span className="text-xs">Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-medium">{taskCounts.completed}</span>
            <span className="text-xs">Done</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: color || "#64748b",
              }}
            />
          </div>
        </div>

        {/* Time Spent */}
        {totalTimeSpent !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTimeSpent(totalTimeSpent)} total</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
