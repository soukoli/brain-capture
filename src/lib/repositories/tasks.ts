/**
 * Tasks Repository
 * Data access layer for ideas table with task-focused queries
 */

import { sql } from '../db';
import type { Idea } from '../db';

export interface TaskWithMetrics extends Idea {
  time_in_progress?: number;
  should_warn?: boolean;
}

/**
 * Get tasks with time metrics for dashboard
 */
export async function getTasksForDashboard(userId: string): Promise<TaskWithMetrics[]> {
  const result = await sql`
    SELECT
      id,
      content,
      polished,
      project_id,
      user_id,
      status,
      priority,
      capture_method,
      ai_processed,
      ai_metadata,
      started_at,
      completed_at,
      time_spent_seconds,
      focus_warning_threshold,
      created_at,
      updated_at,
      CASE
        WHEN status = 'in-progress' AND started_at IS NOT NULL
        THEN EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
        ELSE 0
      END as time_in_progress,
      CASE
        WHEN status = 'in-progress' AND started_at IS NOT NULL
        THEN EXTRACT(EPOCH FROM (NOW() - started_at)) > focus_warning_threshold
        ELSE false
      END as should_warn
    FROM ideas
    WHERE user_id = ${userId}
      AND status IN ('inbox', 'in-progress', 'completed')
    ORDER BY
      CASE
        WHEN status = 'in-progress' THEN 1
        WHEN status = 'inbox' THEN 2
        WHEN status = 'completed' THEN 3
      END,
      created_at DESC
  `;

  return result.rows as TaskWithMetrics[];
}

/**
 * Get task counts by project
 */
export async function getTaskCountsByProject(userId: string): Promise<Map<string, {
  inbox: number;
  inProgress: number;
  completed: number;
  total: number;
}>> {
  const result = await sql`
    SELECT
      project_id,
      COUNT(*) FILTER (WHERE status = 'inbox') as inbox,
      COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) as total
    FROM ideas
    WHERE user_id = ${userId}
      AND status IN ('inbox', 'in-progress', 'completed')
      AND project_id IS NOT NULL
    GROUP BY project_id
  `;

  const countsMap = new Map();

  for (const row of result.rows) {
    countsMap.set(row.project_id, {
      inbox: parseInt(row.inbox, 10),
      inProgress: parseInt(row.in_progress, 10),
      completed: parseInt(row.completed, 10),
      total: parseInt(row.total, 10),
    });
  }

  return countsMap;
}

/**
 * Get total time spent by project
 */
export async function getTimeSpentByProject(userId: string): Promise<Map<string, number>> {
  const result = await sql`
    SELECT
      project_id,
      SUM(time_spent_seconds) as total_seconds
    FROM ideas
    WHERE user_id = ${userId}
      AND project_id IS NOT NULL
      AND status IN ('in-progress', 'completed')
    GROUP BY project_id
  `;

  const timeMap = new Map();

  for (const row of result.rows) {
    // Convert seconds to milliseconds
    timeMap.set(row.project_id, parseInt(row.total_seconds || '0', 10) * 1000);
  }

  return timeMap;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(userId: string): Promise<{
  totalTasks: number;
  activeWarnings: number;
  inboxCount: number;
  inProgressCount: number;
  completedCount: number;
}> {
  const result = await sql`
    SELECT
      COUNT(*) as total_tasks,
      COUNT(*) FILTER (
        WHERE status = 'in-progress'
        AND started_at IS NOT NULL
        AND EXTRACT(EPOCH FROM (NOW() - started_at)) > focus_warning_threshold
      ) as active_warnings,
      COUNT(*) FILTER (WHERE status = 'inbox') as inbox_count,
      COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress_count,
      COUNT(*) FILTER (WHERE status = 'completed') as completed_count
    FROM ideas
    WHERE user_id = ${userId}
      AND status IN ('inbox', 'in-progress', 'completed')
  `;

  const row = result.rows[0];

  return {
    totalTasks: parseInt(row.total_tasks, 10),
    activeWarnings: parseInt(row.active_warnings, 10),
    inboxCount: parseInt(row.inbox_count, 10),
    inProgressCount: parseInt(row.in_progress_count, 10),
    completedCount: parseInt(row.completed_count, 10),
  };
}

/**
 * Helper: Calculate time in progress for a task
 */
export function getTimeInProgress(task: Idea): number {
  if (task.status !== 'in-progress' || !task.started_at) {
    return 0;
  }

  const now = new Date();
  const startedAt = new Date(task.started_at);
  return now.getTime() - startedAt.getTime();
}

/**
 * Helper: Check if task should show warning
 */
export function shouldShowWarning(task: Idea): boolean {
  if (task.status !== 'in-progress' || !task.started_at) {
    return false;
  }

  const timeInProgress = getTimeInProgress(task);
  const thresholdMs = (task.focus_warning_threshold || 7200) * 1000;

  return timeInProgress > thresholdMs;
}
