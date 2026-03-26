"use client";

import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

export interface Task {
  id: string;
  content: string;
  status: "captured" | "in-progress" | "completed" | "archived";
  priority?: Priority;
  projectId?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  timeInProgress: number;
  shouldWarn: boolean;
}

export interface TaskBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskMove?: (taskId: string, newStatus: Task["status"]) => void;
}

type Column = "captured" | "in-progress" | "completed";

export function TaskBoard({ tasks, onTaskClick, onTaskMove }: TaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Group tasks by status
  const tasksByStatus = {
    captured: tasks.filter((t) => t.status === "captured"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  // Column configuration
  const columns: Array<{
    id: Column;
    title: string;
    tasks: Task[];
  }> = [
    { id: "captured", title: "Inbox", tasks: tasksByStatus.captured },
    { id: "in-progress", title: "In Progress", tasks: tasksByStatus["in-progress"] },
    { id: "completed", title: "Completed", tasks: tasksByStatus.completed },
  ];

  // Drag handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Column) => {
    e.preventDefault();
    if (draggedTaskId && onTaskMove) {
      onTaskMove(draggedTaskId, newStatus);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col space-y-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              {column.title}
            </h3>
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {column.tasks.length}
            </span>
          </div>

          {/* Column Content */}
          <div
            className={cn(
              "min-h-[200px] space-y-3 rounded-lg border-2 border-dashed p-4",
              "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50",
              draggedTaskId && "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
            )}
          >
            {column.tasks.length === 0 ? (
              <div className="flex h-full min-h-[150px] items-center justify-center">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  No tasks
                </p>
              </div>
            ) : (
              column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "transition-opacity",
                    draggedTaskId === task.id && "opacity-50"
                  )}
                >
                  <TaskCard task={task} onClick={() => onTaskClick?.(task)} />
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
