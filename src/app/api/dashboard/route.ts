/**
 * API Route: /api/dashboard
 * GET - Fetch dashboard data with projects, tasks, and statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/repositories/projects';
import {
  getTasksForDashboard,
  getTaskCountsByProject,
  getTimeSpentByProject,
  getDashboardStats,
} from '@/lib/repositories/tasks';
import {
  getDashboardQuerySchema,
  safeValidateRequest,
} from '@/lib/validations';

/**
 * GET /api/dashboard?user_id=xxx
 * Returns dashboard data with projects, tasks, and stats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert search params to object
    const queryParams = {
      user_id: searchParams.get('user_id') || '',
    };

    // Validate query parameters
    const validation = safeValidateRequest(getDashboardQuerySchema, queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { user_id } = validation.data;

    // Fetch data in parallel
    const [projects, tasks, taskCounts, timeSpent, stats] = await Promise.all([
      getProjects({ user_id, status: 'active', include_stats: false }),
      getTasksForDashboard(user_id),
      getTaskCountsByProject(user_id),
      getTimeSpentByProject(user_id),
      getDashboardStats(user_id),
    ]);

    // Enhance projects with task counts and progress
    const enhancedProjects = projects.map((project) => {
      const counts = taskCounts.get(project.id) || {
        inbox: 0,
        inProgress: 0,
        completed: 0,
        total: 0,
      };

      // Calculate progress percentage
      const progress = counts.total > 0
        ? (counts.completed / counts.total) * 100
        : 0;

      const totalTime = timeSpent.get(project.id) || 0;

      return {
        id: project.id,
        name: project.name,
        color: project.color,
        taskCounts: {
          inbox: counts.inbox,
          inProgress: counts.inProgress,
          completed: counts.completed,
          total: counts.total,
        },
        progress,
        totalTimeSpent: totalTime,
      };
    });

    // Transform tasks to match component interface
    const transformedTasks = tasks.map((task) => ({
      id: task.id,
      content: task.content,
      status: mapDatabaseStatusToComponentStatus(task.status),
      priority: task.priority,
      projectId: task.project_id,
      createdAt: task.created_at.toISOString(),
      startedAt: task.started_at?.toISOString(),
      completedAt: task.completed_at?.toISOString(),
      timeInProgress: task.time_in_progress || 0,
      shouldWarn: task.should_warn || false,
    }));

    return NextResponse.json({
      success: true,
      data: {
        projects: enhancedProjects,
        tasks: transformedTasks,
        stats: {
          totalTasks: stats.totalTasks,
          activeWarnings: stats.activeWarnings,
          inboxCount: stats.inboxCount,
          inProgressCount: stats.inProgressCount,
          completedCount: stats.completedCount,
        },
      },
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch dashboard data',
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Map database status to component status
 * Database uses: inbox, in-progress, completed, archived, deleted
 * Components use: captured, in-progress, completed, archived
 */
function mapDatabaseStatusToComponentStatus(
  dbStatus: string
): 'captured' | 'in-progress' | 'completed' | 'archived' {
  switch (dbStatus) {
    case 'inbox':
      return 'captured';
    case 'in-progress':
      return 'in-progress';
    case 'completed':
      return 'completed';
    case 'archived':
      return 'archived';
    default:
      return 'captured';
  }
}

/**
 * OPTIONS /api/dashboard - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
