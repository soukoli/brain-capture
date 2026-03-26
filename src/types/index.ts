/**
 * Core types for Brain Capture application
 */

export type Status = 'captured' | 'in-progress' | 'completed' | 'archived';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface CapturedIdea {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  status: Status;
  priority?: Priority;
  projectId?: string;
  tags?: string[];
  synced: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
  archived: boolean;
}

export interface SyncStatus {
  lastSync: number | null;
  pendingCount: number;
  syncing: boolean;
  error?: string;
}

export interface AutoSaveState {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
  lastSaved?: number;
}
