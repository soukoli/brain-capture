"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { TaskBoard } from "./TaskBoard";
import { QuickCapture } from "./QuickCapture";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

interface ProjectData {
  id: string;
  name: string;
  color: string;
  taskCounts: {
    inbox: number;
    inProgress: number;
    completed: number;
    total: number;
  };
  progress: number;
  totalTimeSpent: number;
}

interface TaskData {
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

interface StatsData {
  totalTasks: number;
  activeWarnings: number;
  inboxCount: number;
  inProgressCount: number;
  completedCount: number;
}

interface DashboardClientProps {
  initialProjects: ProjectData[];
  initialTasks: TaskData[];
  initialStats: StatsData;
  userId: string;
}

export function DashboardClient({
  initialProjects,
  initialTasks,
  initialStats,
  userId,
}: DashboardClientProps) {
  const [projects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [stats] = useState(initialStats);
  const [isCapturing, setIsCapturing] = useState(false);

  // Handle quick capture
  const handleCapture = async (content: string, projectId?: string) => {
    setIsCapturing(true);

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          project_id: projectId || null,
          user_id: userId,
          status: 'inbox',
          capture_method: 'quick',
          ai_processed: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture idea');
      }

      const result = await response.json();

      // Add new task to the list
      const newTask: TaskData = {
        id: result.data.id,
        content: result.data.content,
        status: 'captured',
        priority: result.data.priority,
        projectId: result.data.project_id,
        createdAt: result.data.created_at,
        timeInProgress: 0,
        shouldWarn: false,
      };

      setTasks([newTask, ...tasks]);

      // Refresh the page to update stats
      window.location.reload();
    } catch (error) {
      console.error('Capture error:', error);
      alert('Failed to capture idea. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle task status change
  const handleTaskMove = async (
    taskId: string,
    newStatus: "captured" | "in-progress" | "completed" | "archived"
  ) => {
    try {
      // Map component status to database status
      const dbStatus = mapComponentStatusToDatabaseStatus(newStatus);

      const response = await fetch(`/api/ideas/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: dbStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Refresh after a brief delay to update stats
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Task move error:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  // Handle task click (for future detail view)
  const handleTaskClick = (task: TaskData) => {
    console.log('Task clicked:', task);
    // TODO: Open task detail modal or navigate to detail page
  };

  // Handle project click
  const handleProjectClick = (project: ProjectData) => {
    console.log('Project clicked:', project);
    // TODO: Filter tasks by project or navigate to project page
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track your projects and tasks
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
              <TrendingUp className="h-4 w-4" />
              <span>Total Tasks</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {stats.totalTasks}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-400"></span>
              <span>Inbox</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {stats.inboxCount}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
              <span>In Progress</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {stats.inProgressCount}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              <span>Completed</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {stats.completedCount}
            </div>
          </div>

          <div
            className={cn(
              "bg-white dark:bg-slate-900 rounded-lg border p-4",
              stats.activeWarnings > 0
                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "border-slate-200 dark:border-slate-800"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 text-sm mb-1",
                stats.activeWarnings > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Warnings</span>
            </div>
            <div
              className={cn(
                "text-2xl font-bold",
                stats.activeWarnings > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-900 dark:text-slate-50"
              )}
            >
              {stats.activeWarnings}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Projects
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Task Board */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Tasks
        </h2>
        <TaskBoard
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskMove={handleTaskMove}
        />
      </div>

      {/* Quick Capture (Sticky at Bottom) */}
      <QuickCapture
        projects={projects}
        onCapture={handleCapture}
        isSubmitting={isCapturing}
      />
    </>
  );
}

/**
 * Map component status to database status
 */
function mapComponentStatusToDatabaseStatus(
  status: "captured" | "in-progress" | "completed" | "archived"
): "inbox" | "in-progress" | "completed" | "archived" {
  switch (status) {
    case "captured":
      return "inbox";
    case "in-progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "archived":
      return "archived";
    default:
      return "inbox";
  }
}
