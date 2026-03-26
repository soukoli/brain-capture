import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard - Brain Capture",
  description: "Manage your projects and tasks with real-time progress tracking",
};

interface DashboardPageProps {
  searchParams: Promise<{
    user_id?: string;
  }>;
}

// Define interfaces matching the API response
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
  priority?: "low" | "medium" | "high" | "urgent";
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

interface DashboardData {
  projects: ProjectData[];
  tasks: TaskData[];
  stats: StatsData;
}

async function fetchDashboardData(userId: string): Promise<DashboardData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/dashboard?user_id=${encodeURIComponent(userId)}`;

  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch dashboard data');
  }

  const result = await response.json();
  return result.data;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Get user_id from search params or use default for development
  const params = await searchParams;
  const userId = params.user_id || 'dev-user';

  try {
    const data = await fetchDashboardData(userId);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <DashboardClient
            initialProjects={data.projects}
            initialTasks={data.tasks}
            initialStats={data.stats}
            userId={userId}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Error Loading Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }
}
